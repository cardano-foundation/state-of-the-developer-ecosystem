// The survey site's screens: where a visit starts, and where each event leads.

import assert from "node:assert/strict";
import { test } from "node:test";

import { next, start } from "../../site/flow.js";

const TX = "5a".repeat(32);
/** The state after a series of events, from the welcome. */
const after = (...events) => events.reduce(next, { screen: "welcome" });
const finish = { type: "finish", answered: 12 };
const publish = { type: "publish" };

test("a visit starts on the welcome, the thank-you or the closed screen", () => {
  assert.deepEqual(start({ epoch: 1530, endEpoch: 1530, submitted: null }), { screen: "welcome" });
  assert.deepEqual(start({ epoch: 1531, endEpoch: 1530, submitted: null }), { screen: "closed" });
  assert.deepEqual(start({ epoch: 1500, endEpoch: 1530, submitted: TX }), { screen: "thanks", txId: TX });
  // Also after the end.
  assert.deepEqual(start({ epoch: 1531, endEpoch: 1530, submitted: TX }), { screen: "thanks", txId: TX });
});

test("from the welcome to the published response", () => {
  assert.deepEqual(after({ type: "start" }), { screen: "questions" });
  assert.deepEqual(after({ type: "start" }, finish), { screen: "submit", step: "review", answered: 12 });
  assert.deepEqual(after({ type: "start" }, finish, publish), { screen: "submit", step: "sending", attempt: 1, answered: 12 });
  assert.deepEqual(after({ type: "start" }, finish, publish, { type: "attempt", attempt: 2 }).attempt, 2);
  assert.deepEqual(after({ type: "start" }, finish, publish, { type: "published", txId: TX }), { screen: "thanks", txId: TX });
});

test("leaving before the questions, and coming back", () => {
  assert.deepEqual(after({ type: "leave" }), { screen: "screened" });
  assert.deepEqual(after({ type: "leave" }, { type: "return" }), { screen: "welcome" });
});

test("back to the answers, before publishing or after a failure", () => {
  assert.deepEqual(after({ type: "start" }, finish, { type: "back" }), { screen: "questions" });
  const failed = after({ type: "start" }, finish, publish, { type: "refused", code: "busy" });
  assert.deepEqual(failed, { screen: "submit", step: "failed", problem: "busy", answered: 12 });
  assert.deepEqual(next(failed, { type: "back" }), { screen: "questions" });
  assert.deepEqual(next(failed, publish), { screen: "submit", step: "sending", attempt: 1, answered: 12 });
});

test("each refusal has its problem, or its screen", () => {
  const refused = (code, more) => after({ type: "start" }, finish, publish, { type: "refused", code, ...more });
  for (const [code, problem] of [
    ["busy", "busy"],
    ["refused", "busy"],
    ["expired", "busy"],
    ["budget", "budget"],
    ["too-long", "tooLong"],
    ["offline", "offline"],
    ["turnstile", "check"],
    ["unpublished", "unpublished"],
    ["invalid", "failed"],
    ["failed", "failed"],
    [undefined, "failed"],
    // Not a problem's name, though objects have one.
    ["constructor", "failed"],
  ]) {
    assert.equal(refused(code).problem, problem, String(code));
  }
  assert.deepEqual(refused("already", { txId: TX }), { screen: "thanks", txId: TX, repeated: true });
  assert.deepEqual(refused("ended"), { screen: "closed" });
  assert.deepEqual(refused("cancelled"), { screen: "closed", cancelled: true });
});

test("an event out of place changes nothing", () => {
  const welcome = { screen: "welcome" };
  for (const type of ["return", "finish", "back", "publish", "attempt", "published", "refused", "unknown"]) {
    assert.equal(next(welcome, { type }), welcome, type);
  }
  // While sending, the buttons do nothing; before it, the sponsor's replies don't.
  const sending = after({ type: "start" }, finish, publish);
  assert.equal(next(sending, publish), sending);
  assert.equal(next(sending, { type: "back" }), sending);
  const review = after({ type: "start" }, finish);
  assert.equal(next(review, { type: "published", txId: TX }), review);
  assert.equal(next(review, { type: "refused", code: "busy" }), review);
  assert.equal(next(review, { type: "attempt", attempt: 2 }), review);
  const thanks = { screen: "thanks", txId: TX };
  assert.equal(next(thanks, { type: "start" }), thanks);
});

test("the survey's end closes the page, but not while sending", () => {
  const ended = { type: "ended" };
  for (const state of [after(), after({ type: "leave" }), after({ type: "start" }), after({ type: "start" }, finish)]) {
    assert.deepEqual(next(state, ended), { screen: "closed" }, state.screen);
  }
  const sending = after({ type: "start" }, finish, publish);
  assert.equal(next(sending, ended), sending);
  const thanks = { screen: "thanks", txId: TX };
  assert.equal(next(thanks, ended), thanks);
});
