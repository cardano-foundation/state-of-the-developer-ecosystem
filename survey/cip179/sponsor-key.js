#!/usr/bin/env node
// Generates the sponsor wallet: a 24-word seed phrase, written to the
// gitignored `.dev.vars` as SPONSOR_MNEMONIC for `wrangler pages dev`, and
// importable in any Cardano wallet to fund it. Prints its first address.
//
//   node cip179/sponsor-key.js [--network preview|preprod|mainnet]
//
// The phrase isn't printed: read it from `.dev.vars`. For a deployment, set
// it as a secret instead (`wrangler pages secret put SPONSOR_MNEMONIC`).

import * as PrivateKey from "@evolution-sdk/evolution/PrivateKey";
import * as Address from "@evolution-sdk/evolution/Address";
import { addressFromSeed } from "@evolution-sdk/evolution/sdk/wallet/Derivation";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({ options: { network: { type: "string", default: "preview" } } });
const networkId = { preview: 0, preprod: 0, mainnet: 1 }[args.network];
if (networkId === undefined) throw new Error(`unknown network ${args.network}`);

const VARS = ".dev.vars";
const vars = existsSync(VARS) ? readFileSync(VARS, "utf8") : "";
if (/^SPONSOR_MNEMONIC=/m.test(vars)) {
  console.error(`${VARS} already has a SPONSOR_MNEMONIC; remove it first to make a new one.`);
  process.exit(1);
}

const mnemonic = PrivateKey.generateMnemonic(256);
writeFileSync(VARS, `${vars}${vars && !vars.endsWith("\n") ? "\n" : ""}SPONSOR_MNEMONIC="${mnemonic}"\n`, { mode: 0o600 });

const { address } = addressFromSeed(mnemonic, { networkId });
console.log(`sponsor seed phrase written to ${VARS}`);
console.log(`${args.network} address: ${Address.toBech32(address)}`);
