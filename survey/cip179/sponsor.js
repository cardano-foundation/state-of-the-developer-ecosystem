// The transaction sponsor: puts survey responses on chain with the sponsor
// wallet paying the fee, so respondents need neither a wallet nor ada. Used by
// the Vercel Functions in `api/sponsor/`.
//
// Two steps:
//
// 1. `sponsor(env, payloadHex)` checks that the label-17 payload is one valid
//    response to our survey, from a key credential. It leases one sponsor
//    coin, builds a transaction spending it, with the payload, the credential
//    as required signer and a short validity window, and signs it.
// 2. `submit(env, txHex, witness)` adds the respondent's signature and submits
//    the transaction. Only transactions the sponsor signed are relayed: that
//    signature covers the whole body, so they are exactly as built in step 1.
//
// Safeguards: the sponsor pays at most MAX_FEE per response, and only once
// per respondent key; a respondent pays their own fee to change their answer.
// It stops once the survey is cancelled, checking the chain every few minutes.
//
// The sponsor's state is in its database (`sponsor-store.js`): its coins, the
// sponsorships, and what it read from the chain. It tracks its coins itself,
// each submission replacing a coin by its change, so a response costs no
// Koios read but its submission: Koios confirms the coins every half hour, or
// after a refusal. The transactions are built offline, with the protocol
// parameters read once per epoch. `sponsor-split.js` splits the wallet into
// coins, so that several respondents can submit at once.
//
// Config: the network, its Koios, the survey and the daily cap of
// `config.js`, and from `env`, the secrets: SPONSOR_MNEMONIC, and
// TURSO_DATABASE_URL and TURSO_DATABASE_TURSO_AUTH_TOKEN for the database.

import { ed25519 } from "@noble/curves/ed25519.js";
import { blake2b } from "@noble/hashes/blake2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import * as Address from "@evolution-sdk/evolution/Address";
import * as Assets from "@evolution-sdk/evolution/Assets";
import * as Ed25519Signature from "@evolution-sdk/evolution/Ed25519Signature";
import * as KeyHash from "@evolution-sdk/evolution/KeyHash";
import * as Transaction from "@evolution-sdk/evolution/Transaction";
import * as TransactionHash from "@evolution-sdk/evolution/TransactionHash";
import * as TransactionWitnessSet from "@evolution-sdk/evolution/TransactionWitnessSet";
import * as UTxO from "@evolution-sdk/evolution/UTxO";
import * as VKey from "@evolution-sdk/evolution/VKey";
import { mainnet, preprod, preview } from "@evolution-sdk/evolution/sdk/client/Chain";
import * as Client from "@evolution-sdk/evolution/sdk/client/Client";
import { addressFromSeed } from "@evolution-sdk/evolution/sdk/wallet/Derivation";
import { decodeMetadata, decodePayload, describeProblems, validateResponse } from "cip-179";
import { inSurveyWindow, mechanismAProven } from "cip-179/domain";
import { cborToMetadatum, evolutionCodec, toTxMetadatum } from "cip-179/evolution";
import { decodeTxProof } from "cip-179/txproof";

import deployed from "../config.js";
import { epochAt, epochEnd, slotTime } from "./network.js";
import * as store from "./sponsor-store.js";

// The most the sponsor pays for a response, in lovelace: about 7.8 KB of
// transaction.
const MAX_FEE = 500_000n;
// The fee is 155381 lovelace plus 44 per byte, so a larger payload alone
// costs more than MAX_FEE.
const MAX_PAYLOAD_BYTES = Number((MAX_FEE - 155_381n) / 44n);
// The respondent signs right away, so a few minutes is enough. Until then,
// the coin is leased.
const VALIDITY_MS = 5 * 60 * 1000;
// Coins worth less can't pay for the largest response and the change's
// minimum (about 0.97 ada).
const MIN_COIN = 1_500_000n;
// Attempts at leasing a coin that another request may claim first.
const LEASE_ATTEMPTS = 3;
// How often Koios confirms the coins.
const COINS_CHECK_MS = 30 * 60 * 1000;
// How often the sponsor reads the new label-17 transactions to find a
// cancellation of the survey, and how many at most per request.
const CANCELLATION_CHECK_MS = 10 * 60 * 1000;
const SCAN_TXS = 200;
// Koios refuses larger requests.
const KOIOS_BATCH = 50;

const CHAINS = { preview, preprod, mainnet };

/**
 * A request we refuse. The survey site words the refusal from its code, in
 * the respondent's language; the message is for the other clients.
 */
export class SponsorError extends Error {
  constructor(message, status = 400, code = "invalid") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/**
 * The JSON response for what `work` returns, or `{ error, code }`, with the
 * `txId` of the response a key already had sponsored.
 */
export async function reply(work) {
  try {
    return Response.json(await work());
  } catch (error) {
    if (error instanceof SponsorError) {
      return Response.json({ error: error.message, code: error.code, txId: error.txId }, { status: error.status });
    }
    if (error instanceof SyntaxError) return Response.json({ error: "malformed request", code: "invalid" }, { status: 400 });
    console.error("sponsor:", error);
    return Response.json({ error: "the sponsor failed, please try again later", code: "failed" }, { status: 500 });
  }
}

/** Step 1: a signed transaction for a response payload (CBOR hex). */
export async function sponsor(env, payloadHex) {
  const config = await configOf(env);
  const { db } = config;
  const now = Date.now();
  const payloadBytes = fromHex(payloadHex, "payload");
  if (payloadBytes.length > MAX_PAYLOAD_BYTES) {
    throw new SponsorError(`the response is ${payloadBytes.length} bytes, over the ${MAX_PAYLOAD_BYTES} we sponsor`, 400, "too-long");
  }
  const { payload, response } = checkedResponse(payloadBytes, config);
  const key = bytesToHex(response.credential.keyHash);

  const [view, previous] = await Promise.all([chainView(config, now), store.sponsorshipOf(db, key)]);
  if (previous?.state === "submitted") throw alreadySponsored(previous.tx);
  const survey = surveyOf(view);
  const problems = describeProblems(validateResponse(survey.definition, response));
  if (problems.length > 0) throw new SponsorError(`invalid response: ${problems.join("; ")}`);
  await checkNotCancelled(config, view, survey, now);

  // The survey takes responses until the end of its end epoch; a transaction
  // can't land later than that.
  const validity = Math.min(now + VALIDITY_MS, epochEnd(config.network, Number(survey.definition.endEpoch)));
  if (validity <= now) throw new SponsorError("the survey has ended", 400, "ended");

  if (now - view.checkedAt >= COINS_CHECK_MS) await checkCoins(config, now);
  for (let attempt = 0; attempt < LEASE_ATTEMPTS; attempt++) {
    const candidates = await store.candidates(db, now, MIN_COIN);
    if (candidates.length === 0) break;
    const coin = store.pick(candidates, MAX_FEE);
    const built = await walletOf(config)
      .client.newTx()
      .attachMetadata({ label: 17n, metadata: toTxMetadatum(payload) })
      .addSigner({ keyHash: KeyHash.fromBytes(response.credential.keyHash) })
      .setValidity({ to: BigInt(validity) })
      .build({ availableUtxos: [utxoOf(config, coin)], fullProtocolParameters: view.params.value });
    const unsigned = await built.toTransaction();
    const { fee } = unsigned.body;
    if (fee > MAX_FEE) {
      throw new SponsorError(`the response costs ${ada(fee)} ada, over the ${ada(MAX_FEE)} we sponsor`, 400, "too-long");
    }
    const tx = Transaction.addVKeyWitnessesHex(
      Transaction.toCBORHex(unsigned),
      TransactionWitnessSet.toCBORHex(await built.partialSign()),
    );
    const txId = bytesToHex(txIdOf(fromHex(tx, "transaction")));
    const validUntil = slotTime(config.network, Number(unsigned.body.ttl));
    const leased = await store.lease(db, { key, coin: coin.ref, tx: txId, fee, validUntil }, now, config);
    if (leased === "leased") return { tx, txId };
    if (leased === "key") throw alreadySponsored((await store.sponsorshipOf(db, key)).tx);
    if (leased === "cap") throw new SponsorError("the sponsor spent today's budget, please try again tomorrow", 503, "budget");
  }
  throw new SponsorError("the sponsor is busy, please try again in a few seconds", 503, "busy");
}

/**
 * Step 2: submits a transaction from step 1 with the respondent's signature,
 * `{ vkey, signature }` in hex. Returns the transaction id.
 */
export async function submit(env, txHex, { vkey, signature }) {
  const config = await configOf(env);
  const { db } = config;
  const now = Date.now();
  const txBytes = fromHex(txHex, "transaction");
  const txId = txIdOf(txBytes);
  const tx = Transaction.fromCBORBytes(txBytes);

  const signedBySponsor = (tx.witnessSet.vkeyWitnesses ?? []).some((w) => {
    const key = VKey.toBytes(w.vkey);
    return equal(keyHashOf(key), walletOf(config).keyHash) && ed25519.verify(Ed25519Signature.toBytes(w.signature), txId, key);
  });
  if (!signedBySponsor) throw new SponsorError("not a transaction from the sponsor");

  const respondentKey = fromHex(vkey, "vkey");
  const respondentSignature = fromHex(signature, "signature");
  const required = (tx.body.requiredSigners ?? []).map((k) => KeyHash.toBytes(k));
  if (!required.some((k) => equal(k, keyHashOf(respondentKey)))) throw new SponsorError("not the respondent's key");
  if (!ed25519.verify(respondentSignature, txId, respondentKey)) throw new SponsorError("invalid signature");

  // As the sponsor built it: one coin in, its change out.
  const sponsorship = {
    key: bytesToHex(keyHashOf(respondentKey)),
    coin: `${TransactionHash.toHex(tx.body.inputs[0].transactionId)}#${tx.body.inputs[0].index}`,
    tx: bytesToHex(txId),
    fee: tx.body.fee,
    validUntil: slotTime(config.network, Number(tx.body.ttl)),
    change: { ref: `${bytesToHex(txId)}#0`, lovelace: tx.body.outputs[0].assets.lovelace },
  };
  // A transaction for the same key may have been submitted meanwhile, or
  // this one twice.
  const previous = await store.sponsorshipOf(db, sponsorship.key);
  if (previous?.state === "submitted") {
    if (previous.tx === sponsorship.tx) return sponsorship.tx;
    throw alreadySponsored(previous.tx);
  }
  if (sponsorship.validUntil <= now) throw new SponsorError("the transaction expired, please try again", 410, "expired");

  const respondent = new TransactionWitnessSet.TransactionWitnessSet({
    vkeyWitnesses: [
      new TransactionWitnessSet.VKeyWitness({
        vkey: VKey.fromBytes(respondentKey),
        signature: Ed25519Signature.fromBytes(respondentSignature),
      }),
    ],
  });
  const signed = Transaction.addVKeyWitnessesHex(txHex, TransactionWitnessSet.toCBORHex(respondent));
  const res = await fetch(`${config.koios}/submittx`, {
    method: "POST",
    headers: { "content-type": "application/cbor" },
    body: fromHex(signed, "transaction"),
  });
  if (!res.ok) {
    // Most likely its coin was spent by a transaction we don't know of: the
    // coin waits, the next request asks Koios what the wallet has, and the
    // respondent can try again.
    console.error(`sponsor: ${sponsorship.tx} refused: ${await res.text()}`);
    await store.refused(db, sponsorship, now);
    throw new SponsorError("the transaction was refused, please try again", 502, "refused");
  }
  await store.submitted(db, sponsorship, now);
  return sponsorship.tx;
}

// ----------------------------------------------------------------------------

async function configOf(env) {
  const { network, koios, survey, dailyCap } = deployed;
  const chain = CHAINS[network];
  if (!chain) throw new Error(`unknown network ${network}`);
  if (!env.SPONSOR_MNEMONIC) throw new Error("no SPONSOR_MNEMONIC");
  const [, txId, index] = /^([0-9a-f]{64})#(\d+)$/.exec(survey ?? "") ?? [];
  if (!txId) throw new Error(`the survey isn't "<tx id>#<index>": ${survey}`);
  if (dailyCap !== null && !Number.isSafeInteger(dailyCap)) throw new Error("the daily cap isn't lovelace");
  return {
    network,
    chain,
    koios: koios.replace(/\/$/, ""),
    mnemonic: env.SPONSOR_MNEMONIC,
    survey: { txId, index: Number(index) },
    db: await store.database(env),
    dailyCap: dailyCap === null ? null : BigInt(dailyCap),
  };
}

// The wallet, derived once per instance: its client builds and signs offline,
// given the coins and the protocol parameters.
const wallets = new Map();

function walletOf(config) {
  const id = `${config.network} ${config.mnemonic}`;
  if (!wallets.has(id)) {
    const { address } = addressFromSeed(config.mnemonic, { networkId: config.chain.id });
    wallets.set(id, {
      client: Client.make(config.chain).withKoios({ baseUrl: config.koios }).withSeed({ mnemonic: config.mnemonic }),
      address,
      bech32: Address.toBech32(address),
      keyHash: address.paymentCredential.hash,
    });
  }
  return wallets.get(id);
}

function utxoOf(config, { ref, lovelace }) {
  const [txId, index] = ref.split("#");
  return new UTxO.UTxO({
    transactionId: TransactionHash.fromHex(txId),
    index: BigInt(index),
    address: walletOf(config).address,
    assets: Assets.fromLovelace(BigInt(lovelace)),
  });
}

/**
 * What the sponsor read from the chain, read from Koios the first time for
 * our survey and wallet, with the protocol parameters of the current epoch.
 */
async function chainView(config, now) {
  const { db } = config;
  const survey = `${config.survey.txId}#${config.survey.index}`;
  const { bech32 } = walletOf(config);
  const epoch = epochAt(config.network, now);
  const view = await store.chainView(db);
  if (view?.survey !== survey || view.sponsor !== bech32) {
    const [[row], params] = await Promise.all([
      koios(config, "tx_cbor", { _tx_hashes: [config.survey.txId] }),
      walletOf(config).client.getProtocolParameters(),
    ]);
    if (!row) throw new Error(`the survey transaction ${config.survey.txId} isn't on ${config.network}`);
    await store.startView(db, { survey, sponsor: bech32, surveyTx: row.cbor, surveySlot: row.absolute_slot, params: { epoch, value: params } });
    return store.chainView(db);
  }
  if (view.params.epoch !== epoch) {
    try {
      view.params = { epoch, value: await walletOf(config).client.getProtocolParameters() };
      await store.setParams(db, view.params);
    } catch (error) {
      console.error(`sponsor: keeping the protocol parameters of epoch ${view.params.epoch}:`, error);
    }
  }
  return view;
}

// Each instance decodes the survey definition once.
const surveys = new Map();

function surveyOf(view) {
  if (!surveys.has(view.survey)) {
    const index = Number(view.survey.split("#")[1]);
    const metadatum = Transaction.fromCBORHex(view.surveyTx).auxiliaryData?.metadata?.get(17n);
    const definition = metadatum && decodeMetadata(new Map([[17n, metadatum]])).definitions?.[index];
    if (!definition) throw new Error(`no survey definition at ${view.survey}`);
    surveys.set(view.survey, { definition, slot: view.surveySlot });
  }
  return surveys.get(view.survey);
}

/** The single response in a payload, if it is to our survey from a key. */
function checkedResponse(payloadBytes, config) {
  let payload, decoded;
  try {
    payload = cborToMetadatum(payloadBytes);
    decoded = decodePayload(payload);
  } catch (error) {
    throw new SponsorError(`not a CIP-179 payload: ${error.message}`);
  }
  if (decoded.type !== "responses" || decoded.responses.length !== 1) {
    throw new SponsorError("the payload must hold exactly one response");
  }
  const [response] = decoded.responses;
  if (bytesToHex(response.surveyRef.txId) !== config.survey.txId || response.surveyRef.index !== config.survey.index) {
    throw new SponsorError("the response isn't to our survey");
  }
  if (response.credential.type !== "key") throw new SponsorError("the response must be from a key credential");
  return { payload, response };
}

/** With the transaction of the sponsored response. */
function alreadySponsored(txId) {
  const message = "this key already had a response sponsored; to change it, submit it with your own wallet";
  return Object.assign(new SponsorError(message, 409, "already"), { txId });
}

/**
 * Koios confirms the coins: those the wallet has, and so which of our
 * transactions never made it on chain.
 */
async function checkCoins(config, now) {
  const [info] = await koios(config, "address_info", { _addresses: [walletOf(config).bech32] });
  const listed = (info?.utxo_set ?? [])
    .filter((u) => (u.asset_list ?? []).length === 0)
    .map((u) => ({ ref: `${u.tx_hash}#${u.tx_index}`, lovelace: Number(u.value) }));
  const dropped = await store.checked(config.db, listed, now);
  if (dropped.length > 0) console.error(`sponsor: submitted but never on chain: ${dropped.join(", ")}`);
}

/**
 * Throws once the survey is cancelled. The label-17 transactions are read
 * every CANCELLATION_CHECK_MS, SCAN_TXS at most per request until caught up.
 */
async function checkNotCancelled(config, view, survey, now) {
  const scan = view.cancellation;
  if (scan.state === "open" && now - scan.caughtUpAt > CANCELLATION_CHECK_MS) {
    const rows = await koios(
      config,
      `tx_by_metalabel?_label=17&absolute_slot=gt.${scan.scannedTo}&select=tx_hash,absolute_slot,epoch_no&order=absolute_slot.asc&limit=${SCAN_TXS}`,
    );
    const caughtUp = rows.length < SCAN_TXS;
    // A full page may cut the transactions of its last slot in two: that slot
    // is read again next time.
    const lastSlot = rows.at(-1)?.absolute_slot;
    const read = caughtUp || rows[0].absolute_slot === lastSlot ? rows : rows.filter((r) => r.absolute_slot < lastSlot);
    const by = await cancellationIn(config, survey, read);
    if (by) {
      await store.cancelled(config.db, by);
      view.cancellation = { state: "cancelled", by };
    } else {
      view.cancellation = { state: "open", scannedTo: read.at(-1)?.absolute_slot ?? scan.scannedTo, caughtUpAt: caughtUp ? now : scan.caughtUpAt };
      await store.scanned(config.db, { slot: view.cancellation.scannedTo, caughtUpAt: view.cancellation.caughtUpAt });
    }
  }
  if (view.cancellation.state === "cancelled") throw new SponsorError("the survey was cancelled", 400, "cancelled");
}

/** The transaction among these that cancels the survey, signed by its owner. */
async function cancellationIn(config, survey, rows) {
  const { txId, index } = config.survey;
  // Koios gives the metadata as JSON, with bytes as "0x…" strings: enough to
  // spot cancellations, which are then read from the transaction itself.
  const metadata = await batched(rows, (b) => koios(config, "tx_metadata", { _tx_hashes: b.map((r) => r.tx_hash) }));
  const candidates = metadata
    .filter(({ metadata }) => {
      const payload = metadata?.["17"];
      return payload?.[0] === 2 && Array.isArray(payload[1]) && payload[1].some((r) => r?.[0] === `0x${txId}` && r?.[1] === index);
    })
    .map((m) => m.tx_hash);
  if (candidates.length === 0) return null;

  for (const { tx_hash, cbor } of await koios(config, "tx_cbor", { _tx_hashes: candidates })) {
    const { absolute_slot, epoch_no } = rows.find((r) => r.tx_hash === tx_hash);
    if (!inSurveyWindow(survey, { slot: absolute_slot, epochNo: epoch_no })) continue;
    let payload;
    try {
      payload = decodeMetadata(new Map([[17n, Transaction.fromCBORHex(cbor).auxiliaryData?.metadata?.get(17n)]]));
    } catch {
      continue;
    }
    const ours = payload.type === "cancellations" && payload.cancellations.some((r) => bytesToHex(r.txId) === txId && r.index === index);
    if (ours && mechanismAProven(survey.definition.owner, decodeTxProof(evolutionCodec, cbor))) return tx_hash;
  }
  return null;
}

async function koios(config, endpoint, body) {
  const res = await fetch(
    `${config.koios}/${endpoint}`,
    body
      ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }
      : { headers: { accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`Koios ${endpoint}: ${res.status} ${await res.text()}`);
  return res.json();
}

/** The results of `request` on batches of KOIOS_BATCH items, concatenated. */
async function batched(items, request) {
  const batches = [];
  for (let i = 0; i < items.length; i += KOIOS_BATCH) batches.push(items.slice(i, i + KOIOS_BATCH));
  return (await Promise.all(batches.map(request))).flat();
}

/** The transaction id: the hash of the body exactly as encoded. */
const txIdOf = (txBytes) => blake2b(Transaction.extractBodyBytes(txBytes), { dkLen: 32 });
const keyHashOf = (vkey) => blake2b(vkey, { dkLen: 28 });

const ada = (lovelace) => (Number(lovelace) / 1e6).toFixed(2);
const equal = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

function fromHex(text, what) {
  try {
    return hexToBytes(text);
  } catch {
    throw new SponsorError(`${what} isn't hex`);
  }
}
