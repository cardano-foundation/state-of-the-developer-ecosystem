#!/usr/bin/env node
// Splits the sponsor wallet into coins of equal value. Each sponsored
// transaction spends one coin, and two transactions spending the same coin
// can't both land, so more coins let more respondents submit at once. Change
// returns to the same address, so the count stays the same.
//
// Best run before the survey opens: the sponsor learns of the new coins at
// its next check from Koios (`sponsor.js`), after refusing the spent ones.
//
//   node cip179/sponsor-split.js [--coins <n>] [--submit]
//
// Spends every ada-only coin of the wallet in `.dev.vars`, on the network and
// through the Koios of `wrangler.jsonc`. Without `--submit`, only shows the
// transaction.

import * as Address from "@evolution-sdk/evolution/Address";
import * as Assets from "@evolution-sdk/evolution/Assets";
import * as TransactionHash from "@evolution-sdk/evolution/TransactionHash";
import { mainnet, preprod, preview } from "@evolution-sdk/evolution/sdk/client/Chain";
import * as Client from "@evolution-sdk/evolution/sdk/client/Client";
import { addressFromSeed } from "@evolution-sdk/evolution/sdk/wallet/Derivation";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { getPlatformProxy } from "wrangler";

const { values: args } = parseArgs({
  options: {
    coins: { type: "string", default: "10" },
    submit: { type: "boolean", default: false },
  },
});

const proxy = await getPlatformProxy({ configPath: join(dirname(fileURLToPath(import.meta.url)), "..", "wrangler.jsonc") });
const { env } = proxy;
await proxy.dispose();
const chain = { preview, preprod, mainnet }[env.SPONSOR_NETWORK];
if (!chain) throw new Error(`unknown SPONSOR_NETWORK ${env.SPONSOR_NETWORK}`);
const count = Number(args.coins);
if (!Number.isInteger(count) || count < 2) throw new Error("--coins must be at least 2");

const client = Client.make(chain).withKoios({ baseUrl: env.SPONSOR_KOIOS }).withSeed({ mnemonic: env.SPONSOR_MNEMONIC });
const { address } = addressFromSeed(env.SPONSOR_MNEMONIC, { networkId: chain.id });
const coins = (await client.getWalletUtxos()).filter((u) => !u.assets.multiAsset);
const total = coins.reduce((sum, u) => sum + u.assets.lovelace, 0n);
// Rounded down to 0.1 ada; the last coin is the change, after the fee.
const share = (total / BigInt(count) / 100_000n) * 100_000n;
console.log(`${Address.toBech32(address)} on ${env.SPONSOR_NETWORK}`);
console.log(`${coins.length} coins, ${ada(total)} ada → ${count} coins of about ${ada(share)} ada`);

let tx = client.newTx().collectFrom({ inputs: coins });
for (let i = 1; i < count; i++) tx = tx.payToAddress({ address, assets: Assets.fromLovelace(share) });
const built = await tx.build({ availableUtxos: coins });
const { body } = await built.toTransaction();
console.log(`outputs: ${body.outputs.map((o) => ada(o.assets.lovelace)).join(", ")} ada; fee ${ada(body.fee)} ada`);

if (args.submit) console.log(`submitted: ${TransactionHash.toHex(await built.signAndSubmit())}`);
else console.log("not submitted (--submit to submit)");

function ada(lovelace) {
  return (Number(lovelace) / 1e6).toFixed(6);
}
