// The survey site: the screens around the <tessera-respond> widget, from the
// welcome to the published response. `flow.js` says which screen comes next;
// this file shows it, in the respondent's language.

import { hexToBytes } from "@noble/hashes/utils.js";
import "cardano-tessera-respond";
import { decodeMetadata, decodePayload } from "cip-179";
// The survey this site is built for (`cip179/site.js`).
import built from "built-survey";

import { fromDetailedJson } from "../cip179/metadatum.js";
import { epochAt, epochEnd, transactionUrl } from "../cip179/network.js";
import { respondent, turnstileChallenge } from "../cip179/respondent.js";
import { next, start } from "./flow.js";
import { googleCalendarUrl, icsFile, mailtoUrl, reminderTime } from "./reminder.js";
import de from "./texts/de.js";
import en from "./texts/en.js";
import es from "./texts/es.js";
import fr from "./texts/fr.js";
import it from "./texts/it.js";
import ja from "./texts/ja.js";
import pt from "./texts/pt.js";
import vi from "./texts/vi.js";
import zh from "./texts/zh.js";

const TEXTS = { en, fr, es, pt, it, de, ja, vi, zh };

const $ = (selector) => document.querySelector(selector);
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const [definition] = decodeMetadata(new Map([[17n, fromDetailedJson(built.definition)]])).definitions;
const [txId, index] = built.survey.split("#");
const endEpoch = Number(definition.endEpoch);
const close = epochEnd(built.network, endEpoch);
// Each survey has its own respondent: key, answers and language.
const me = respondent(`survey.${built.survey}.`);
const challenge = turnstileChallenge("#challenge", built.turnstileSiteKey);

// The languages the page and the survey both have.
const { defaultLanguage, translations } = built.translations;
const languages = Object.keys(TEXTS).filter((tag) => tag === defaultLanguage || Object.hasOwn(translations, tag));
// A link can set the language: `?lang=es`.
const linked = new URLSearchParams(location.search).get("lang");
let language =
  [linked, me.get("language"), ...navigator.languages.map((tag) => tag.split("-")[0])].find((tag) => languages.includes(tag)) ??
  defaultLanguage;

let state = start({ epoch: epochAt(built.network), endEpoch, submitted: me.submitted() });
// The widget, made when the questions are first shown, and its last response.
let widget, payload;

$("#language").append(...languages.map((tag) => new Option(`${TEXTS[tag].flag} ${TEXTS[tag].language}`, tag)));
$("#language").hidden = languages.length < 2;
$("#language").addEventListener("change", () => {
  language = $("#language").value;
  me.set("language", language);
  history.replaceState(history.state, "", link(language));
  show();
});
$("#start").addEventListener("click", () => dispatch({ type: "start" }));
$("#restart").addEventListener("click", () => {
  me.forgetAnswers();
  dispatch({ type: "start" });
});
$("#calendar").addEventListener("click", () => {
  const file = new Blob([icsFile({ ...reminder(), uid: `${crypto.randomUUID()}@${location.host}`, stamp: Date.now() })], {
    type: "text/calendar",
  });
  URL.revokeObjectURL($("#calendar").href);
  $("#calendar").href = URL.createObjectURL(file);
});
$("#share").addEventListener("click", share);
$("#return").addEventListener("click", () => dispatch({ type: "return" }));
$("#back").addEventListener("click", () => dispatch({ type: "back" }));
$("#publish").addEventListener("click", publish);
show();
$("#loading").remove();
// The countdown to the close, and the close itself, while the page is open.
const ticking = setInterval(() => {
  if (Date.now() < close) return showClosing();
  clearInterval(ticking);
  dispatch({ type: "ended" });
}, MINUTE);

// ----------------------------------------------------------------------------

function dispatch(event) {
  const previous = state.screen;
  state = next(state, event);
  show();
  if (state.screen !== previous) {
    scrollTo(0, 0);
    $(`#${state.screen}`).focus({ preventScroll: true });
  }
}

/** The sponsor publishes the widget's response, which takes a few seconds. */
async function publish() {
  if (state.step === "sending") return;
  dispatch({ type: "publish" });
  // A survey built before it is published (`site.js --unpublished`) is only tried.
  if (built.unpublished) return dispatch({ type: "refused", code: "unpublished" });
  try {
    const published = await me.submit(payload, { challenge, onAttempt: (attempt) => dispatch({ type: "attempt", attempt }) });
    dispatch({ type: "published", txId: published });
  } catch (error) {
    console.error(error);
    dispatch({ type: "refused", code: error.code, txId: error.txId });
  }
}

/** The site's link in this language: `?lang=es`. */
function link(tag) {
  const url = new URL(location.pathname, location.origin);
  url.searchParams.set("lang", tag);
  return url.href;
}

/**
 * When the survey closes, and in the last week, how soon: in days, then in
 * the last day in hours, and in the last hour in minutes.
 */
function closing() {
  const left = close - Date.now();
  const at = (options) => new Intl.DateTimeFormat(language, options).format(close);
  const relative = new Intl.RelativeTimeFormat(language);
  if (left > 7 * DAY) return { when: at({ dateStyle: "long", timeStyle: "short" }) };
  if (left >= DAY) return { in: relative.format(Math.round(left / DAY), "day"), when: at({ dateStyle: "long", timeStyle: "short" }) };
  if (left >= HOUR) return { in: relative.format(Math.round(left / HOUR), "hour"), when: at({ timeStyle: "short" }) };
  return { in: relative.format(Math.max(1, Math.ceil(left / MINUTE)), "minute") };
}

/** The close, on the welcome, and in its last day on the submit screen. */
function showClosing() {
  const { welcome, submit } = TEXTS[language];
  const soon = closing();
  const lastDay = close - Date.now() < DAY;
  $("#until").textContent = soon.in ? welcome.closes(soon.in, soon.when) : welcome.until(soon.when);
  $("#until").classList.toggle("soon", Boolean(soon.in));
  $("#closing").hidden = !lastDay;
  $("#closing").textContent = lastDay ? submit.soon(soon.in) : "";
}

/** The reminder to answer later, in the current language. */
function reminder() {
  const date = new Intl.DateTimeFormat(language, { dateStyle: "long", timeStyle: "short" }).format(close);
  const { welcome } = TEXTS[language];
  const url = link(language);
  return {
    ...reminderTime(Date.now(), close),
    title: translations[language]?.title ?? definition.title,
    details: `${welcome.minutes} ${welcome.until(date)}\n\n${url}`,
    url,
  };
}

/** The site's link, in the device's share sheet, or else copied. */
async function share() {
  const url = location.origin + location.pathname;
  try {
    if (navigator.share) return await navigator.share({ title: document.title, url });
    await navigator.clipboard.writeText(url);
    $("#share").textContent = TEXTS[language].screened.copied;
  } catch (error) {
    // Closing the share sheet rejects too.
    if (error.name !== "AbortError") console.error(error);
  }
}

/** Shows the state's screen, in the current language. */
function show() {
  const texts = TEXTS[language];
  const survey = translations[language] ?? {};
  document.documentElement.lang = language;
  document.title = survey.title ?? definition.title;
  $("#language").value = language;
  for (const element of document.querySelectorAll("[data-text]")) {
    element.textContent = element.dataset.text.split(".").reduce((group, key) => group[key], texts);
  }
  for (const section of document.querySelectorAll("main > section")) section.hidden = section.id !== state.screen;

  switch (state.screen) {
    case "welcome": {
      const unsent = me.stash.get() !== undefined;
      $("#welcome .survey-title").textContent = survey.title ?? definition.title;
      $("#welcome .survey-description").textContent = survey.description ?? definition.description;
      showClosing();
      $("#start").textContent = unsent ? texts.welcome.continue : texts.welcome.start;
      $("#restart").hidden = !unsent;
      // The calendar file is made when clicked.
      $("#google").href = googleCalendarUrl(reminder());
      $("#email").href = mailtoUrl(reminder());
      // The answers that end the survey: nothing is recorded for them.
      $("#exits").replaceChildren(
        ...built.exits.map((label) => {
          const button = Object.assign(document.createElement("button"), { type: "button", textContent: label[language] ?? label[defaultLanguage] });
          button.addEventListener("click", () => dispatch({ type: "leave" }));
          return button;
        }),
      );
      break;
    }
    case "questions":
      widget ??= makeWidget();
      widget.locale = language;
      widget.messages = texts.widget;
      break;
    case "submit": {
      const sending = state.step === "sending";
      challenge.load();
      $("#answered").textContent = texts.submit.answered(state.answered);
      showClosing();
      $("#problem").hidden = state.step !== "failed";
      $("#problem").textContent = state.step === "failed" ? texts.submit.problems[state.problem] : "";
      $("#publish").textContent = state.step === "failed" ? texts.submit.retry : texts.submit.publish;
      $("#publish").disabled = $("#back").disabled = sending;
      $("#progress").textContent = !sending ? "" : state.attempt === 1 ? texts.submit.sending : texts.submit.retrying(state.attempt);
      break;
    }
    case "thanks":
      // The published answers are no longer the widget's to change.
      widget?.remove();
      widget = undefined;
      $("#published").textContent = state.repeated ? texts.thanks.repeated : texts.thanks.body;
      $("#transaction").href = transactionUrl(built.network, state.txId);
      showResults("#thanks");
      break;
    case "closed":
      $("#closed-body").textContent = state.cancelled ? texts.closed.cancelled : texts.closed.body;
      // A cancelled survey has no report to come.
      showResults("#closed", { report: !state.cancelled });
      break;
  }
}

/**
 * The reports the site serves (`site.js`), on a screen: the survey's own, or
 * until it is out the latest, and all of them.
 */
function showResults(screen, { report = true } = {}) {
  const { results } = TEXTS[language];
  const [latest] = built.reports;
  const out = built.reports.includes(built.year);
  const [before, text, after] = out ? results.out(built.year) : results.coming(built.year, latest);
  $(`${screen} .report`).hidden = !report || latest === undefined;
  $(`${screen} .report`).replaceChildren(before, reportLink(out ? built.year : latest, text), after);
  $(`${screen} .reports`).hidden = latest === undefined;
  $(`${screen} .reports`).replaceChildren(
    `${results.all} `,
    ...built.reports.flatMap((year, i) => [...(i > 0 ? [" · "] : []), reportLink(year, String(year))]),
  );
}

function reportLink(year, text) {
  return Object.assign(document.createElement("a"), { href: `/${year}/`, textContent: text });
}

/**
 * The widget, with one question per screen. The respondent is the browser's
 * key, a Keyholder; the survey's description stays on the welcome screen.
 */
function makeWidget() {
  const element = Object.assign(document.createElement("tessera-respond"), {
    definition: { ...definition, description: "" },
    surveyRef: { txId: hexToBytes(txId), index: Number(index) },
    responder: { 4: { type: "key", keyHash: me.keyHash } },
    showRole: false,
    tipEpoch: epochAt(built.network),
    conditions: built.conditions,
    noneLabels: built.noneLabels,
    translations: {
      defaultLanguage,
      translations: Object.fromEntries(Object.entries(translations).map(([tag, { description, ...texts }]) => [tag, texts])),
    },
    maxTextBytes: built.maxTextBytes,
    // Text answers have one schema, which respondents needn't see.
    hiddenSchemas: definition.questions.flatMap((question) => (question.type === "custom" ? [question.methodSchema.uri] : [])),
    stash: me.stash,
  });
  element.addEventListener("tessera:response", (event) => {
    payload = event.detail.payload;
    const [response] = decodePayload(payload).responses;
    dispatch({ type: "finish", answered: response.answers.answers.length });
  });
  $("#questions").append(element);
  return element;
}
