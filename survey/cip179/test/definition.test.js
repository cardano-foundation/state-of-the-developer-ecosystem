// The survey builder, and the export's reading of the responses: how SurveyJS
// questions map to CIP-179, and CIP-179 answers back to `answers.json` rows.

import assert from "node:assert/strict";
import { test } from "node:test";

import { decodeMetadata, describeProblems, encodeChunkedText, encodeMetadata, validateResponse } from "cip-179";

import { answersToRow, withoutHiddenAnswers } from "../answers.js";
import { buildSurvey, readSurvey } from "../definition.js";

const build = (elements, triggers) =>
  buildSurvey(
    { title: "Test", pages: [{ name: "p", elements }], triggers },
    {
      owner: { type: "key", keyHash: new Uint8Array(28) },
      endEpoch: 600,
      freeTextSchema: { uri: "https://example.org/free-text.schema.json", hash: new Uint8Array(32) },
    },
  );

const chains = {
  type: "checkbox",
  name: "chains",
  title: "Which other chains have you built on?",
  isRequired: true,
  showNoneItem: true,
  noneText: { default: "None, only Cardano", fr: "Aucune, seulement Cardano" },
  choices: ["Ethereum", "Solana"],
};
const matrix = {
  type: "matrix",
  name: "tools",
  title: "How satisfied are you with these tools?",
  rows: [
    { value: "docs", text: { default: "Documentation", ja: "ドキュメント" } },
    { value: "libs", text: "Libraries" },
  ],
  columns: [
    { value: "bad", text: { default: "Bad", ja: "悪い" } },
    { value: "ok", text: { default: "OK", ja: "普通" } },
    { value: "good", text: { default: "Good", ja: "良い" } },
  ],
};
const text = (name, visibleIf) => ({ type: "comment", name, title: name, visibleIf });

test("the 2026 survey builds", () => {
  assert.deepEqual(readSurvey({ owner: { type: "key", keyHash: new Uint8Array(28) }, endEpoch: 600 }).problems, []);
});

test("a multi-select's None is its None box, with no option", () => {
  const { definition, mapping, noneLabels, translations, problems } = build([chains]);
  assert.deepEqual(problems, []);
  assert.deepEqual(definition.questions, [
    {
      type: "multiSelect",
      prompt: "Which other chains have you built on?",
      options: { type: "options", labels: ["Ethereum", "Solana"] },
      minSelections: 0,
      maxSelections: 2,
      required: true,
    },
  ]);
  assert.deepEqual(mapping, [{ name: "chains", values: ["Ethereum", "Solana"], none: "none" }]);
  assert.deepEqual(noneLabels, { 0: "None, only Cardano" });
  assert.deepEqual(translations.translations, { fr: { questions: [{ noneLabel: "Aucune, seulement Cardano" }] } });
});

test("without its own text, the box reads as SurveyJS's None", () => {
  const title = { default: chains.title, fr: "Sur quelles autres chaînes avez-vous développé ?" };
  const { noneLabels, translations } = build([{ ...chains, title, noneText: undefined }]);
  assert.deepEqual(noneLabels, { 0: "None" });
  assert.equal(translations.translations.fr.questions[0].noneLabel, "Aucun");
});

test("SurveyJS's own texts don't add a language to the survey", () => {
  const { translations } = build([{ ...chains, noneText: undefined, showOtherItem: true }]);
  assert.deepEqual(translations.translations, {});
});

test("a single choice keeps None as an option", () => {
  const { definition, mapping, noneLabels } = build([{ ...chains, type: "radiogroup" }]);
  assert.deepEqual(definition.questions[0].options.labels, ["Ethereum", "Solana", "None, only Cardano"]);
  assert.deepEqual(mapping[0], { name: "chains", values: ["Ethereum", "Solana", "none"] });
  assert.deepEqual(noneLabels, {});
});

test("conditions name the None box \"none\"", () => {
  const { conditions, problems } = build([
    chains,
    text("only", "{chains} contains 'none'"),
    text("others", "{chains} notcontains 'none'"),
    text("either", "{chains} anyof ['Solana', 'none']"),
  ]);
  assert.deepEqual(problems, []);
  assert.deepEqual(conditions, {
    1: { question: 0, anyOf: ["none"] },
    2: { question: 0, noneOf: ["none"] },
    3: { question: 0, anyOf: [1, "none"] },
  });
});

test("a matrix is a rating question with a labelled scale", () => {
  const { definition, mapping, translations, problems } = build([matrix]);
  assert.deepEqual(problems, []);
  assert.deepEqual(definition.questions, [
    {
      type: "rating",
      prompt: "How satisfied are you with these tools?",
      options: { type: "options", labels: ["Documentation", "Libraries"] },
      scale: { type: "labels", labels: ["Bad", "OK", "Good"] },
      requireAll: false,
    },
  ]);
  assert.deepEqual(mapping, [{ name: "tools", values: ["docs", "libs"], levels: ["bad", "ok", "good"] }]);
  assert.deepEqual(translations.translations.ja.questions, [
    { options: ["ドキュメント", "Libraries"], ratingLabels: ["悪い", "普通", "良い"] },
  ]);
});

test("an answer that ends the survey is an exit, not an option", () => {
  const role = { type: "radiogroup", name: "role", title: "Role", choices: ["dev", "ops", { value: "none", text: { default: "Not a developer", fr: "Pas développeur" } }] };
  const { definition, exits, problems } = build([role], [{ type: "complete", expression: "{role} = 'none'" }]);
  assert.deepEqual(problems, []);
  assert.deepEqual(definition.questions[0].options.labels, ["dev", "ops"]);
  assert.deepEqual(exits, [{ en: "Not a developer", fr: "Pas développeur" }]);
});

test("responses become answers.json rows", () => {
  const { definition, mapping } = build([{ ...chains, showOtherItem: true }, matrix]);
  const rows = [
    [[{ type: "multiSelect", questionIndex: 0, optionIndices: [] }], { chains: ["none"] }],
    [
      [
        { type: "multiSelect", questionIndex: 0, optionIndices: [1, 2] },
        { type: "custom", questionIndex: 1, value: encodeChunkedText("Cosmos") },
        { type: "rating", questionIndex: 2, ratings: [{ optionIndex: 1, rating: 2n }, { optionIndex: 0, rating: 0n }] },
      ],
      { chains: ["Solana", "other"], "chains-Comment": "Cosmos", tools: { libs: "good", docs: "bad" } },
    ],
  ];
  for (const [answers, row] of rows) {
    const response = {
      specVersion: definition.specVersion,
      surveyRef: { txId: new Uint8Array(32), index: 0 },
      role: 4,
      credential: { type: "key", keyHash: new Uint8Array(28) },
      answers: { type: "public", answers },
    };
    assert.deepEqual(describeProblems(validateResponse(definition, response)), []);
    const [decoded] = decodeMetadata(encodeMetadata({ type: "responses", responses: [response] })).responses;
    assert.deepEqual(answersToRow(decoded.answers.answers, mapping), { row, problems: [] });
  }
});

test("a None answer shows the questions that ask for it, a skip doesn't", () => {
  const { definition, conditions } = build([
    { ...chains, isRequired: false },
    text("only", "{chains} contains 'none'"),
    text("others", "{chains} notcontains 'none'"),
  ]);
  const texts = [1, 2].map((questionIndex) => ({ type: "custom", questionIndex, value: ["text"] }));
  const hidden = (chainsAnswer) =>
    withoutHiddenAnswers(definition, conditions, [...(chainsAnswer ? [{ type: "multiSelect", questionIndex: 0, ...chainsAnswer }] : []), ...texts])
      .hidden;
  assert.deepEqual(hidden({ optionIndices: [] }), [2]);
  assert.deepEqual(hidden({ optionIndices: [1] }), [1]);
  assert.deepEqual(hidden(undefined), [1]);
});

test("what doesn't fit is reported", () => {
  const long = "None of these, as I only ever built on Cardano and nothing else at all";
  const { problems } = build([
    { ...chains, minSelectedChoices: 2, noneText: { default: "None", fr: long } },
    { ...text("why", "{chains} = 'Solana'"), isRequired: true },
    { ...matrix, rows: matrix.rows.slice(0, 1) },
    { type: "ranking", name: "favourites", choices: ["a", "b"] },
  ]);
  assert.deepEqual(problems, [
    `chains: "minSelectedChoices" isn't supported`,
    "tools: a matrix needs at least 2 rows on chain",
    `favourites: question type "ranking" isn't supported`,
    "why: a required question can't have a display condition",
    `chains: None label is over 64 bytes: "${long}"`,
  ]);
});
