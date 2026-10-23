#!/usr/bin/env node
// Builds the survey site into `dist/`: the page in `site/`, with the survey
// baked in, the reports of the repository's `<year>/` folders, as GitHub Pages
// serves them, and the free-text schema the definition names.
//
//   node cip179/site.js [--unpublished]
//
// The network and the survey's reference are the sponsor's, from `config.js`:
// the page and the sponsor can't disagree. The questions are built from
// `survey.json`, with the owner and end epoch of the survey published at that
// reference, read from Koios, and must make that same definition: a page
// showing other questions would record answers to the wrong ones. Only the
// English texts are on chain: the translations and display conditions can
// change.
//
// With `--unpublished`, there is no published survey: the page shows the
// survey open until the end of the next epoch, and can't publish answers.
//
// Built by Vercel, the page runs BotID's check before publishing; built on our
// machine, it doesn't, as the sponsor there doesn't check.

import * as Transaction from "@evolution-sdk/evolution/Transaction";
import { decodeMetadata, encodeMetadata } from "cip-179";
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { cpSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual, parseArgs } from "node:util";
import { gzipSync } from "node:zlib";

import deployed from "../config.js";
import { SCHEMA_PATH, SURVEY_YEAR, readSurvey } from "./definition.js";
import { toDetailedJson } from "./metadatum.js";
import { epochAt } from "./network.js";

const OUT = "dist";
const { values: args } = parseArgs({ options: { unpublished: { type: "boolean", default: false } } });

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "site");
const repository = join(root, "..");
// The reports, newest first.
const reports = readdirSync(repository)
  .filter((name) => /^\d{4}$/.test(name) && statSync(join(repository, name, "index.html"), { throwIfNoEntry: false })?.isFile())
  .map(Number)
  .sort((a, b) => b - a);
const { network, koios, survey } = deployed;
const [, txId, index] = /^([0-9a-f]{64})#(\d+)$/.exec(survey ?? "") ?? [];
if (!txId) fail(`the survey of config.js isn't "<tx id>#<index>": ${survey}`);

const published = args.unpublished ? undefined : await publishedDefinition();
const built = readSurvey(
  published
    ? { owner: published.owner, endEpoch: published.endEpoch }
    : { owner: { type: "key", keyHash: new Uint8Array(28) }, endEpoch: epochAt(network) + 1 },
);
if (built.problems.length > 0) fail(`survey.json has problems:\n${built.problems.join("\n")}`);
const metadatum = encodeMetadata({ type: "definitions", definitions: [built.definition] }).get(17n);
const [definition] = decodeMetadata(new Map([[17n, metadatum]])).definitions;
if (published && !isDeepStrictEqual(definition, published)) {
  const keys = Object.keys(published).filter((key) => !isDeepStrictEqual(definition[key], published[key]));
  const questions = published.questions.flatMap((q, i) => (isDeepStrictEqual(q, definition.questions[i]) ? [] : [built.mapping[i]?.name ?? i]));
  fail(
    `survey.json no longer makes the survey published as ${survey}: ${keys.join(", ")} differ${questions.length > 0 ? ` (${questions.join(", ")})` : ""}.
Its English texts, questions and options are on chain: changing them makes a new survey.`,
  );
}

const { conditions, noneLabels, translations, maxTextBytes, exits } = built;
const baked = {
  network,
  // A survey not published yet has no reference: one made from its definition
  // keeps the browser's respondent key and answers for it apart.
  survey: args.unpublished ? `${createHash("sha256").update(JSON.stringify(toDetailedJson(metadatum))).digest("hex")}#0` : survey,
  unpublished: args.unpublished,
  botCheck: Boolean(process.env.VERCEL),
  definition: toDetailedJson(metadatum),
  conditions,
  noneLabels,
  translations,
  maxTextBytes,
  exits,
  year: SURVEY_YEAR,
  reports,
};

rmSync(OUT, { recursive: true, force: true });
// Everything but the scripts is served as it is.
cpSync(site, OUT, { recursive: true, filter: (file) => !file.endsWith(".js") && basename(file) !== "texts" });
for (const year of reports) {
  cpSync(join(repository, String(year)), join(OUT, String(year)), { recursive: true, filter: (file) => basename(file) !== "elm-stuff" });
}
cpSync(join(root, "cip179", "free-text.schema.json"), join(OUT, SCHEMA_PATH));
await build({
  entryPoints: [join(site, "main.js")],
  outdir: OUT,
  bundle: true,
  format: "esm",
  // The widget's code for sealed surveys stays in chunks the page never loads.
  splitting: true,
  chunkNames: "chunks/[name]-[hash]",
  minify: true,
  target: "es2022",
  legalComments: "none",
  logLevel: "warning",
  plugins: [
    {
      name: "built-survey",
      setup({ onResolve, onLoad }) {
        onResolve({ filter: /^built-survey$/ }, () => ({ path: "built-survey", namespace: "built" }));
        onLoad({ filter: /.*/, namespace: "built" }, () => ({ contents: JSON.stringify(baked), loader: "json" }));
      },
    },
  ],
});

const open = Number(definition.endEpoch) - epochAt(network) + 1;
console.log(`${definition.title}: ${definition.questions.length} questions, ${args.unpublished ? "not published" : survey} on ${network}`);
if (args.unpublished) console.log("answers can't be published from this build: it is to try the survey");
console.log(open > 0 ? `open for ${open} more epoch${open > 1 ? "s" : ""}, to the end of epoch ${definition.endEpoch}` : `closed since epoch ${definition.endEpoch}`);
console.log(`languages: ${[translations.defaultLanguage, ...Object.keys(translations.translations)].join(", ")}`);
console.log(`reports: ${reports.join(", ")}`);
console.log(`written to ${OUT}:`);
for (const file of files(OUT).filter((file) => !reports.includes(Number(relative(OUT, file).split(sep)[0])))) {
  const bytes = readFileSync(file);
  const text = /\.(js|css|html|svg|json)$/.test(file);
  console.log(`  ${relative(OUT, file).padEnd(40)} ${kb(bytes.length)}${text ? `, ${kb(gzipSync(bytes).length)} gzipped` : ""}`);
}

// ----------------------------------------------------------------------------

/** The definition published as the survey of `config.js`. */
async function publishedDefinition() {
  const res = await fetch(`${koios.replace(/\/$/, "")}/tx_cbor`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ _tx_hashes: [txId] }),
  }).catch((error) => fail(`Koios can't be reached (${error.cause?.message ?? error.message})`));
  if (!res.ok) fail(`Koios tx_cbor: ${res.status} ${await res.text()}`);
  const [row] = await res.json();
  if (!row) fail(`the survey transaction ${txId} isn't on ${network}`);
  const onChain = Transaction.fromCBORHex(row.cbor).auxiliaryData?.metadata?.get(17n);
  const definition = onChain && decodeMetadata(new Map([[17n, onChain]])).definitions?.[Number(index)];
  if (!definition) fail(`no survey definition at ${survey}`);
  return definition;
}

function files(dir) {
  return readdirSync(dir)
    .sort()
    .flatMap((name) => (statSync(join(dir, name)).isDirectory() ? files(join(dir, name)) : [join(dir, name)]));
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
