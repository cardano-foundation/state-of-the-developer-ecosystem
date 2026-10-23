// Turns the SurveyJS survey (`survey.json`) into what the CIP-179 survey
// needs:
//
// - `definition`: the CIP-179 survey definition, with the English text;
// - `conditions`, `translations` and `noneLabels`: the documents
//   `<tessera-respond>` takes beside the definition, for conditional display,
//   the other languages and the words of each multi-select's None box;
// - `exits`: the answers that end the survey without recording anything
//   (SurveyJS "complete" triggers), in each language. They are left out of the
//   definition, and the site offers them before the questions;
// - `mapping`: for each CIP-179 question, the SurveyJS question (and value of
//   each option) it comes from, so responses can be turned back into the
//   SurveyJS answers format the report reads.
//
// Along the way it collects `problems`: anything that can't be expressed in
// CIP-179 or in the widget, to fix in `survey.json` before publishing.

import { blake2b } from "@noble/hashes/blake2.js";
import { MAX_CHUNK_BYTES, Role, SPEC_VERSION, describeProblem, utf8ByteLength, validateDefinition } from "cip-179";
import { readFileSync } from "node:fs";

const DEFAULT_LANGUAGE = "en";
/** The edition: its report will be in the repository's `<year>/` folder. */
export const SURVEY_YEAR = 2026;
const SURVEY_FILE = new URL(`./${SURVEY_YEAR}/survey.json`, import.meta.url);
const SCHEMA_FILE = new URL("./free-text.schema.json", import.meta.url);
// The site serves the schema at this path (`site.js`), on its permanent
// domain. Definitions on chain name it, with its hash: it stays there, as it
// is, for good. A changed schema gets a new name.
export const SCHEMA_PATH = "cip179/free-text.schema.json";
const SCHEMA_URI = `https://devsurvey.cardano.org/${SCHEMA_PATH}`;

// The SurveyJS features the survey uses. Any other is reported rather than
// silently lost.
const KEYS = new Set([
  "type",
  "name",
  "title",
  "description",
  "isRequired",
  "visibleIf",
  "choices",
  "showOtherItem",
  "showNoneItem",
  "noneText",
  "maxSelectedChoices",
  "rows",
  "columns",
]);

// Texts SurveyJS provides itself, for the locales we use.
const BUILT_IN_TEXTS = {
  other: { default: "Other", de: "Andere", es: "Otro", fr: "Autre", it: "Altro", ja: "その他", pt: "Outro", vi: "Khác", zh: "其他" },
  none: { default: "None", de: "Keine", es: "Ninguno", fr: "Aucun", it: "Nessuno", ja: "なし", pt: "Nenhum", vi: "Không có", zh: "无" },
  otherComment: {
    default: "Other (please specify)",
    de: "Andere (bitte angeben)",
    es: "Otro (especifique)",
    fr: "Autre (précisez)",
    it: "Altro (specificare)",
    ja: "その他（具体的に記入してください）",
    pt: "Outro (especifique)",
    vi: "Khác (vui lòng ghi rõ)",
    zh: "其他（请说明）",
  },
};

/** `survey.json`, built for an owner and an end epoch, with the free-text answers' byte limit. */
export function readSurvey({ owner, endEpoch }) {
  const schema = readFileSync(SCHEMA_FILE);
  const survey = JSON.parse(readFileSync(SURVEY_FILE, "utf8"));
  const freeTextSchema = { uri: SCHEMA_URI, hash: blake2b(schema, { dkLen: 32 }) };
  return { ...buildSurvey(survey, { owner, endEpoch, freeTextSchema }), maxTextBytes: JSON.parse(schema).maxUtf8Bytes };
}

/**
 * @param {object} survey the SurveyJS survey JSON
 * @param {object} options
 * @param {import("cip-179").Credential} options.owner
 * @param {number} options.endEpoch
 * @param {{ uri: string, hash: Uint8Array }} options.freeTextSchema anchor of the free-text answer schema
 */
export function buildSurvey(survey, { owner, endEpoch, freeTextSchema }) {
  const problems = [];
  const report = (question, message) => problems.push(question ? `${question}: ${message}` : message);

  const elements = survey.pages.flatMap((page) => page.elements);
  const screening = readTriggers(survey.triggers ?? [], report);

  // One entry per CIP-179 question, in order.
  const entries = [];
  const mainEntry = new Map();
  for (const element of elements) {
    const built = questionEntries(element, screening.get(element.name), freeTextSchema, report);
    if (built.length > 0) mainEntry.set(element.name, entries.length);
    entries.push(...built);
  }

  // Display conditions, once every question has its position.
  const conditions = {};
  entries.forEach((entry, index) => {
    const rule = entry.condition && resolveCondition(entry.condition, index, entries, mainEntry);
    if (typeof rule === "string") report(entry.name, `visibleIf: ${rule}`);
    else if (rule) conditions[index] = rule;
    // A hidden question has no answer, which a required one must have.
    if (entry.required && entry.condition) report(entry.name, "a required question can't have a display condition");
    if (entry.required) entry.question = { ...entry.question, required: true };
  });

  entries.forEach((entry) => {
    [...(entry.labels ?? []), ...(entry.levels ?? [])].forEach((label) => {
      const text = defaultText(label);
      if (utf8ByteLength(text) > MAX_CHUNK_BYTES) report(entry.name, `option label is over ${MAX_CHUNK_BYTES} bytes: "${text}"`);
    });
    // A None label is bounded in every language: the widget drops a
    // translation whose None label is longer.
    for (const text of Object.values(byLanguage(entry.noneLabel ?? ""))) {
      if (utf8ByteLength(text) > MAX_CHUNK_BYTES) report(entry.name, `None label is over ${MAX_CHUNK_BYTES} bytes: "${text}"`);
    }
  });

  const exits = [...screening].flatMap(([name, values]) => {
    const choices = (elements.find((element) => element.name === name)?.choices ?? []).map(item);
    return [...values].map((value) => {
      const choice = choices.find((c) => c.value === value);
      if (!choice) report(name, `a trigger ends the survey on "${value}", which isn't one of its choices`);
      return byLanguage(choice?.text ?? String(value));
    });
  });

  const definition = {
    specVersion: SPEC_VERSION,
    owner,
    title: defaultText(survey.title),
    description: defaultText(survey.description ?? ""),
    eligibleRoles: [Role.Keyholder],
    endEpoch,
    submissionMode: { type: "public" },
    questions: entries.map((e) => e.question),
  };
  for (const p of validateDefinition(definition)) {
    // Long labels are already reported above, with their text.
    if (p.code !== "question.labelTooLong") report(undefined, describeProblem(p));
  }

  return {
    definition,
    conditions,
    translations: buildTranslations(survey, entries),
    noneLabels: Object.fromEntries(entries.flatMap((e, i) => (e.noneLabel ? [[i, defaultText(e.noneLabel)]] : []))),
    exits,
    mapping: entries.map((e) => e.mapping),
    problems,
  };
}

// ----------------------------------------------------------------------------
// Questions

function questionEntries(element, excluded, freeTextSchema, report) {
  const { name } = element;
  for (const key of Object.keys(element)) if (!KEYS.has(key)) report(name, `"${key}" isn't supported`);
  const condition = element.visibleIf ? parseCondition(element.visibleIf) : undefined;
  if (typeof condition === "string") report(name, `visibleIf "${element.visibleIf}": ${condition}`);
  const prompt = joinTexts(element.title ?? name, element.description);

  const entry = (question, mapping, fields) => ({
    name: mapping.name,
    question,
    mapping,
    prompt,
    condition: typeof condition === "object" ? condition : undefined,
    required: element.isRequired === true,
    ...fields,
  });
  const freeText = (textName, textPrompt, fields) =>
    entry({ type: "custom", prompt: defaultText(textPrompt), methodSchema: freeTextSchema }, { name: textName }, { prompt: textPrompt, ...fields });

  switch (element.type) {
    case "radiogroup":
    case "checkbox": {
      // A multi-select's None is no option selected, in the widget's None
      // box, rather than an option.
      const noneBox = element.type === "checkbox" && element.showNoneItem === true;
      const choices = choiceList(element, excluded, !noneBox);
      const labels = choices.map((c) => c.text);
      const options = { type: "options", labels: labels.map(defaultText) };
      const question =
        element.type === "radiogroup"
          ? { type: "singleChoice", prompt: defaultText(prompt), options }
          : {
              type: "multiSelect",
              prompt: defaultText(prompt),
              options,
              minSelections: noneBox ? 0 : 1,
              maxSelections: element.maxSelectedChoices || labels.length,
            };
      const mapping = { name, values: choices.map((c) => c.value), ...(noneBox && { none: NONE }) };
      const noneLabel = noneBox ? (element.noneText ?? BUILT_IN_TEXTS.none) : undefined;
      const result = [entry(question, mapping, { labels, noneLabel })];
      if (element.showOtherItem) {
        // SurveyJS keeps the "Other" text in `<name>-Comment`.
        const other = { name, any: true, values: ["other"] };
        result.push(freeText(`${name}-Comment`, BUILT_IN_TEXTS.otherComment, { condition: other, required: false }));
      }
      return result;
    }

    case "matrix": {
      // Several items rated on the same scale: a CIP-179 rating question,
      // which rates at least 2 items.
      const rows = (element.rows ?? []).map(item);
      const columns = (element.columns ?? []).map(item);
      if (rows.length < 2) {
        report(name, "a matrix needs at least 2 rows on chain");
        return [];
      }
      const labels = rows.map((r) => r.text);
      const levels = columns.map((c) => c.text);
      const question = {
        type: "rating",
        prompt: defaultText(prompt),
        options: { type: "options", labels: labels.map(defaultText) },
        scale: { type: "labels", labels: levels.map(defaultText) },
        requireAll: false,
      };
      const mapping = { name, values: rows.map((r) => r.value), levels: columns.map((c) => c.value) };
      return [entry(question, mapping, { labels, levels })];
    }

    case "text":
    case "comment":
      return [freeText(name, prompt)];

    default:
      report(name, `question type "${element.type}" isn't supported`);
      return [];
  }
}

// The value SurveyJS gives the None item, and the widget's name for its None box.
const NONE = "none";

/** A SurveyJS choice, row or column, as `{ value, text }`. */
const item = (c) =>
  typeof c === "object" && c !== null ? { value: c.value, text: c.text ?? String(c.value) } : { value: c, text: String(c) };

/** The options of a choice question, in their on-chain order, with None unless `withNone` is false. */
function choiceList(element, excluded = new Set(), withNone) {
  const choices = (element.choices ?? []).map(item).filter((c) => !excluded.has(c.value));
  if (element.showOtherItem) choices.push({ value: "other", text: BUILT_IN_TEXTS.other });
  if (withNone && element.showNoneItem) choices.push({ value: NONE, text: element.noneText ?? BUILT_IN_TEXTS.none });
  return choices;
}

// ----------------------------------------------------------------------------
// Conditions and triggers

/**
 * A SurveyJS expression testing one question's value, as
 * `{ name, any, values }`: shown when any of `values` is selected (`any`), or
 * when none of them is. Anything else is unsupported (returns a reason).
 */
function parseCondition(expression) {
  const match = /^\s*\{([\w-]+)\}\s*(=|==|<>|!=|contains|notcontains|anyof|noneof)\s*(.+?)\s*$/i.exec(expression);
  if (!match) return "only tests of one question's value are supported";
  const [, name, operator, operand] = match;
  const values = parseValues(operand);
  if (!values) return `can't read the value ${operand}`;
  const any = ["=", "==", "contains", "anyof"].includes(operator.toLowerCase());
  return { name, any, values };
}

function parseValues(operand) {
  const one = (s) => {
    const quoted = /^(['"])(.*)\1$/.exec(s.trim());
    if (quoted) return quoted[2];
    const n = Number(s);
    return s.trim() !== "" && Number.isFinite(n) ? n : undefined;
  };
  const list = /^\[(.*)\]$/.exec(operand.trim());
  const values = list ? list[1].split(",").map(one) : [one(operand)];
  return values.every((v) => v !== undefined) ? values : undefined;
}

function resolveCondition(condition, index, entries, mainEntry) {
  const source = mainEntry.get(condition.name);
  if (source === undefined) return `${condition.name} isn't a question`;
  if (source >= index) return `${condition.name} doesn't come before this question`;
  const { question, mapping } = entries[source];
  if (question.type !== "singleChoice" && question.type !== "multiSelect") {
    return `${condition.name} isn't a single- or multiple-choice question`;
  }
  const options = [];
  for (const value of condition.values) {
    if (value === mapping.none) {
      options.push(NONE);
      continue;
    }
    const option = mapping.values.indexOf(value);
    if (option < 0) return `${condition.name} has no option "${value}"`;
    options.push(option);
  }
  return condition.any ? { question: source, anyOf: options } : { question: source, noneOf: options };
}

/** "complete" triggers, as the excluded values of each question. */
function readTriggers(triggers, report) {
  const screening = new Map();
  for (const trigger of triggers) {
    const condition = trigger.type === "complete" ? parseCondition(trigger.expression ?? "") : undefined;
    if (!condition || typeof condition === "string" || !condition.any) {
      report(undefined, `trigger ${JSON.stringify(trigger)} isn't supported`);
      continue;
    }
    const excluded = screening.get(condition.name) ?? new Set();
    condition.values.forEach((v) => excluded.add(v));
    screening.set(condition.name, excluded);
  }
  return screening;
}

// ----------------------------------------------------------------------------
// Texts and translations

/** A SurveyJS text: a string, or an object of strings keyed by locale. */
function defaultText(text) {
  if (typeof text === "string") return text;
  return text?.default ?? text?.[DEFAULT_LANGUAGE] ?? "";
}

function localText(text, locale) {
  return typeof text === "object" && text !== null ? text[locale] : undefined;
}

function locales(text) {
  return typeof text === "object" && text !== null ? Object.keys(text) : [];
}

/** A text as `{ en, fr, … }`. */
function byLanguage(text) {
  const texts = { [DEFAULT_LANGUAGE]: defaultText(text) };
  for (const locale of locales(text)) if (locale !== "default") texts[locale] = localText(text, locale);
  return texts;
}

/** `a` then `b`, after a space, per locale, falling back to each one's default. */
function joinTexts(a, b) {
  if (!b) return a;
  const joined = { default: `${defaultText(a)} ${defaultText(b)}` };
  for (const locale of new Set([...locales(a), ...locales(b)])) {
    if (locale === "default") continue;
    joined[locale] = `${localText(a, locale) ?? defaultText(a)} ${localText(b, locale) ?? defaultText(b)}`;
  }
  return joined;
}

function buildTranslations(survey, entries) {
  // The survey's languages are those of its own texts: SurveyJS's built-in
  // texts come in more languages, and only fill in the survey's.
  const builtIn = new Set(Object.values(BUILT_IN_TEXTS));
  const all = new Set();
  const collect = (text) => builtIn.has(text) || locales(text).forEach((l) => all.add(l));
  collect(survey.title);
  collect(survey.description);
  for (const entry of entries) {
    collect(entry.prompt);
    (entry.labels ?? []).forEach(collect);
    (entry.levels ?? []).forEach(collect);
    collect(entry.noneLabel);
  }
  all.delete("default");
  all.delete(DEFAULT_LANGUAGE);

  const translations = {};
  for (const locale of [...all].sort()) {
    const questions = entries.map((entry) => {
      const translation = {};
      const prompt = localText(entry.prompt, locale);
      if (prompt !== undefined) translation.prompt = prompt;
      // Labels are all or nothing: untranslated ones keep their default text.
      const translated = (labels = []) =>
        labels.some((label) => localText(label, locale) !== undefined)
          ? labels.map((label) => localText(label, locale) ?? defaultText(label))
          : undefined;
      const options = translated(entry.labels);
      if (options) translation.options = options;
      const ratingLabels = translated(entry.levels);
      if (ratingLabels) translation.ratingLabels = ratingLabels;
      // Untranslated, the None box shows its label in the default language.
      const noneLabel = localText(entry.noneLabel, locale);
      if (noneLabel !== undefined) translation.noneLabel = noneLabel;
      return translation;
    });
    translations[locale] = {
      ...(localText(survey.title, locale) && { title: localText(survey.title, locale) }),
      ...(localText(survey.description, locale) && { description: localText(survey.description, locale) }),
      questions,
    };
  }
  return { defaultLanguage: DEFAULT_LANGUAGE, translations };
}
