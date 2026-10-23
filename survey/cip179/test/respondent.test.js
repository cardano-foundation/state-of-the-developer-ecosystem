// The respondent's side of a sponsored response, with a stand-in for
// localStorage and for the sponsor functions.

import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { ed25519 } from "@noble/curves/ed25519.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

import { toCbor } from "../metadatum.js";
import { respondent } from "../respondent.js";

const PAYLOAD = new Map([[1n, "a response"]]);
const TX_ID = "5a".repeat(32);

function memory(entries = {}) {
  const map = new Map(Object.entries(entries));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, String(value)),
    removeItem: (key) => void map.delete(key),
    map,
  };
}

/** Answers the sponsor's two functions from `replies`, in order, and records the requests. */
function sponsor(...replies) {
  const requests = [];
  globalThis.fetch = async (path, { body }) => {
    requests.push({ path, body: JSON.parse(body) });
    const { status = 200, ...json } = replies.shift();
    return Response.json(json, { status });
  };
  return requests;
}

const realFetch = globalThis.fetch;
afterEach(() => (globalThis.fetch = realFetch));

test("the key is kept, one per prefix", () => {
  const storage = memory();
  const first = respondent("a.", { storage });
  assert.equal(first.keyHash.length, 28);
  assert.deepEqual(respondent("a.", { storage }).keyHash, first.keyHash);
  assert.notDeepEqual(respondent("b.", { storage }).keyHash, first.keyHash);
});

test("forgetting the answers keeps the key, the page's settings and the other prefixes", () => {
  const storage = memory({ "b.answers": "{}", "a.language": "fr" });
  const me = respondent("a.", { storage });
  me.stash.set("s", { q: 1 });
  assert.deepEqual(me.stash.get("s"), { q: 1 });
  assert.equal(me.get("language"), "fr");

  me.forgetAnswers();
  assert.deepEqual([...storage.map.keys()].sort(), ["a.key", "a.language", "b.answers"]);
  assert.equal(me.stash.get("s"), undefined);
});

test("without storage, a respondent for the visit", () => {
  const me = respondent("a.", { storage: null });
  assert.equal(me.keyHash.length, 28);
  me.stash.set("s", { q: 1 });
  assert.equal(me.stash.get("s"), undefined);
  assert.equal(me.submitted(), null);
});

test("a sponsored response: signed, recorded, its answers forgotten", async () => {
  const storage = memory();
  const me = respondent("a.", { storage });
  me.stash.set("s", { q: 1 });
  const requests = sponsor({ tx: "84a0", txId: TX_ID }, { txId: TX_ID });
  const attempts = [];

  const txId = await me.submit(PAYLOAD, { onAttempt: (n) => attempts.push(n) });

  assert.equal(txId, TX_ID);
  assert.deepEqual(attempts, [1]);
  assert.deepEqual(requests[0], { path: "/api/sponsor", body: { payload: bytesToHex(toCbor(PAYLOAD)) } });
  const { tx, vkey, signature } = requests[1].body;
  assert.equal(requests[1].path, "/api/sponsor/submit");
  assert.equal(tx, "84a0");
  assert.equal(vkey, bytesToHex(me.publicKey));
  assert.ok(ed25519.verify(hexToBytes(signature), hexToBytes(TX_ID), me.publicKey));
  assert.equal(me.submitted(), TX_ID);
  assert.equal(me.stash.get("s"), undefined);
  assert.equal(respondent("a.", { storage }).submitted(), TX_ID);
});

test("a busy sponsor is tried again", async () => {
  const me = respondent("a.", { storage: memory(), retryMs: 0 });
  const requests = sponsor(
    { status: 503, code: "busy", error: "busy" },
    { tx: "84a0", txId: TX_ID },
    { status: 502, code: "refused", error: "refused" },
    { tx: "84a0", txId: TX_ID },
    { txId: TX_ID },
  );
  const attempts = [];

  await me.submit(PAYLOAD, { onAttempt: (n) => attempts.push(n) });

  assert.deepEqual(attempts, [1, 2, 3]);
  assert.deepEqual(requests.map((r) => r.path), ["/api/sponsor", "/api/sponsor", "/api/sponsor/submit", "/api/sponsor", "/api/sponsor/submit"]);
});

test("three attempts at most, and none after another refusal", async () => {
  const me = respondent("a.", { storage: memory(), retryMs: 0 });
  me.stash.set("s", { q: 1 });
  const busy = { status: 503, code: "busy", error: "busy" };
  let requests = sponsor(busy, busy, busy, busy);
  await assert.rejects(me.submit(PAYLOAD), { code: "busy", status: 503 });
  assert.equal(requests.length, 3);

  requests = sponsor({ status: 503, code: "budget", error: "today's budget is spent" }, busy);
  await assert.rejects(me.submit(PAYLOAD), { code: "budget", message: "today's budget is spent" });
  assert.equal(requests.length, 1);
  assert.equal(me.submitted(), null);
  assert.deepEqual(me.stash.get("s"), { q: 1 });
});

test("a key that already had a response sponsored remembers it", async () => {
  const me = respondent("a.", { storage: memory() });
  sponsor({ status: 409, code: "already", error: "already", txId: TX_ID });
  await assert.rejects(me.submit(PAYLOAD), { code: "already", txId: TX_ID });
  assert.equal(me.submitted(), TX_ID);
});

test("an unreachable sponsor", async () => {
  const me = respondent("a.", { storage: memory() });
  globalThis.fetch = async () => {
    throw new TypeError("fetch failed");
  };
  await assert.rejects(me.submit(PAYLOAD), { code: "offline" });
});
