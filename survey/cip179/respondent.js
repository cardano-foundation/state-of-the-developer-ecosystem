// The respondent's side of a sponsored response, in the browser (see
// `sponsor.js`): their key, their unsent answers, and the submission through
// the sponsor functions.
//
// The key is random, made on the first visit and kept in localStorage with
// the rest, under a prefix. When localStorage doesn't persist (private
// browsing), a later visit makes a new respondent.

import { ed25519 } from "@noble/curves/ed25519.js";
import { blake2b } from "@noble/hashes/blake2.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

import { toCbor } from "./metadatum.js";

// Refusals after which a new attempt likely works: the sponsor is busy, its
// coin was refused or the transaction expired. Up to RETRIES more attempts,
// RETRY_MS apart.
const RETRIABLE = ["busy", "refused", "expired"];
const RETRIES = 2;
const RETRY_MS = 5000;

/**
 * The respondent on this device. `prefix` names what is kept in `storage`: a
 * survey with its own prefix has its own respondent.
 */
export function respondent(prefix, { storage = deviceStorage(), retryMs = RETRY_MS } = {}) {
  const kept = {
    get: (name) => attempt(() => storage.getItem(prefix + name)) ?? null,
    set: (name, value) => void attempt(() => storage.setItem(prefix + name, value)),
    remove: (name) => void attempt(() => storage.removeItem(prefix + name)),
  };

  let secret = attempt(() => hexToBytes(kept.get("key")));
  if (secret?.length !== 32) {
    secret = ed25519.utils.randomSecretKey();
    kept.set("key", bytesToHex(secret));
  }
  const publicKey = ed25519.getPublicKey(secret);

  const forgetAnswers = () => kept.remove("answers");

  return {
    publicKey,
    /** The credential of the responses: the hash of the public key. */
    keyHash: blake2b(publicKey, { dkLen: 28 }),

    /** What else the page keeps, such as the language. */
    get: kept.get,
    set: kept.set,

    /** The unsent answers, as the widget's `stash`, which has one form: the respondent's survey. */
    stash: {
      get: () => attempt(() => JSON.parse(kept.get("answers"))) ?? undefined,
      set: (_, form) => kept.set("answers", JSON.stringify(form)),
      delete: forgetAnswers,
    },
    forgetAnswers,

    /** The transaction of the sponsored response, or null before it. */
    submitted: () => kept.get("sponsored"),

    /**
     * Has the sponsor put a response (a label-17 payload) on chain: the
     * sponsor builds and signs the transaction, we sign it, it submits it.
     * `onAttempt` is told the attempts' number, from 1. Once the node accepts
     * the transaction, the response is as good as on chain: the unsent
     * answers are forgotten.
     *
     * Returns the transaction id. A refusal is thrown with the sponsor's
     * `code`; "already" comes with the `txId` of the response this key had
     * sponsored, which is remembered as submitted.
     */
    async submit(payload, { onAttempt = () => {} } = {}) {
      for (let n = 1; ; n++) {
        onAttempt(n);
        try {
          const { tx, txId } = await post("/api/sponsor", { payload: bytesToHex(toCbor(payload)) });
          const signature = ed25519.sign(hexToBytes(txId), secret);
          await post("/api/sponsor/submit", { tx, vkey: bytesToHex(publicKey), signature: bytesToHex(signature) });
          kept.set("sponsored", txId);
          forgetAnswers();
          return txId;
        } catch (error) {
          if (error.code === "already") kept.set("sponsored", error.txId);
          if (n > RETRIES || !RETRIABLE.includes(error.code)) throw error;
          await new Promise((resolve) => setTimeout(resolve, retryMs));
        }
      }
    },
  };
}

/** A refusal is thrown with its `status`, and the sponsor's `code` and `txId`. */
async function post(path, body) {
  let res;
  try {
    res = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw Object.assign(new Error("the sponsor can't be reached"), { code: "offline" });
  }
  const json = await res.json().catch(() => ({ error: `${res.status} ${res.statusText}` }));
  if (!res.ok) throw Object.assign(new Error(json.error), { status: res.status, code: json.code ?? "failed", txId: json.txId });
  return json;
}

// Reaching localStorage throws where the browser blocks it.
function deviceStorage() {
  return attempt(() => localStorage);
}

function attempt(work) {
  try {
    return work();
  } catch {
    return undefined;
  }
}
