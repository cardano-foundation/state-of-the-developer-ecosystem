#!/usr/bin/env node
// Checks `survey.json` against CIP-179 and the widget, and writes the
// definition to publish.
//
//   node cip179/build.js                                        # check only
//   node cip179/build.js --owner <key hash> --end-epoch <epoch>  # write definition.metadata.json
//
// The owner (a key hash) can cancel the survey; responses count until the end
// of the end epoch. Exits with status 1 when there are problems.

import { hexToBytes } from "@noble/hashes/utils.js";
import { encodeMetadata } from "cip-179";
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

import { readSurvey } from "./definition.js";
import { toCbor, toDetailedJson } from "./metadatum.js";

const OUT = "definition.metadata.json";

const { values: args } = parseArgs({ options: { owner: { type: "string" }, "end-epoch": { type: "string" } } });
if (Boolean(args.owner) !== Boolean(args["end-epoch"])) fail("--owner and --end-epoch go together");
if (args.owner && !/^[0-9a-f]{56}$/i.test(args.owner)) fail(`the owner is a 28-byte key hash in hex, not ${args.owner}`);

const { definition, conditions, translations, problems, maxTextBytes } = readSurvey({
  owner: { type: "key", keyHash: args.owner ? hexToBytes(args.owner) : new Uint8Array(28) },
  endEpoch: Number(args["end-epoch"] ?? 0),
});
if (problems.length > 0) fail(problems.join("\n"));

const metadata = encodeMetadata({ type: "definitions", definitions: [definition] });
const types = Object.entries(Object.groupBy(definition.questions, (q) => q.type)).map(([type, qs]) => `${qs.length} ${type}`);
console.log(`${definition.questions.length} questions (${types.join(", ")}), ${Object.keys(conditions).length} conditional
languages: en (on chain), ${Object.keys(translations.translations).join(", ")}
definition metadata: ${toCbor(metadata).length} bytes (a transaction is at most 16384)
longest possible response metadata: ${toCbor(longestResponse(definition, maxTextBytes)).length} bytes, with free text up to ${maxTextBytes} bytes`);

if (args.owner) {
  writeFileSync(OUT, JSON.stringify({ 17: toDetailedJson(metadata.get(17n)) }, null, 2) + "\n");
  console.log(`written to ${OUT}`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

/** Label-17 metadata of a response answering everything, as long as allowed. */
function longestResponse(definition, maxTextBytes) {
  const answers = definition.questions.map((q, questionIndex) => {
    const count = q.options?.labels.length;
    const highest = (n) => Array.from({ length: n }, (_, i) => count - 1 - i);
    switch (q.type) {
      case "singleChoice":
        return { type: "singleChoice", questionIndex, optionIndex: count - 1 };
      case "multiSelect":
        return { type: "multiSelect", questionIndex, optionIndices: highest(q.maxSelections) };
      case "rating":
        return {
          type: "rating",
          questionIndex,
          ratings: highest(count).map((optionIndex) => ({ optionIndex, rating: BigInt(q.scale.labels.length - 1) })),
        };
      case "custom":
        // 64-byte chunks of 3-byte characters waste one byte each.
        return { type: "custom", questionIndex, value: Array(Math.ceil(maxTextBytes / 63)).fill("あ".repeat(21)) };
    }
  });
  return encodeMetadata({
    type: "responses",
    responses: [
      {
        specVersion: definition.specVersion,
        surveyRef: { txId: new Uint8Array(32), index: 0 },
        role: 4,
        credential: { type: "key", keyHash: new Uint8Array(28) },
        answers: { type: "public", answers },
      },
    ],
  });
}
