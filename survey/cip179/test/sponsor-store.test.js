// The sponsor's state on a libSQL database in memory, with the project's
// migrations: leases, submissions, refusals and the checks from Koios.

import { createClient } from "@libsql/client";
import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";

import * as store from "../sponsor-store.js";

let db;
beforeEach(async () => {
  db = createClient({ url: ":memory:" });
  await store.migrate(db);
  await store.startView(db, view());
});
afterEach(() => db.close());

const T = 1_800_000_000_000;
const ADA = 1_000_000;
const MIN_COIN = 1_500_000n;
const key = (n) => String(n).padStart(56, "k");
const tx = (n) => String(n).padStart(64, "0");
const coin = (n, index = 1) => `${tx(n)}#${index}`;
const change = (n) => `${tx(n)}#0`;
const view = (changes = {}) => ({
  survey: `${"a".repeat(64)}#0`,
  sponsor: "addr_test1sponsor",
  surveyTx: "84a0",
  surveySlot: 1000,
  params: { epoch: 10, value: { minFeeA: 44, keyDeposit: 2000000n } },
  ...changes,
});
const listed = (refs) => refs.map((ref) => ({ ref, lovelace: 9 * ADA }));
const lease = (n, coinRef, now = T, changes = {}) =>
  store.lease(db, { key: key(n), coin: coinRef, tx: tx(n), fee: 200_000n, validUntil: now + 5 * 60_000, ...changes }, now, changes);
const submitted = (n, coinRef, at, validUntil = at + 60_000) =>
  store.submitted(db, { key: key(n), coin: coinRef, tx: tx(n), fee: 200_000n, validUntil, change: { ref: change(n), lovelace: 8.8 * ADA } }, at);
const coins = async () => (await db.execute("SELECT ref, lovelace, usable_from FROM coins ORDER BY ref")).rows;
const refs = async (now = T) => (await store.candidates(db, now, MIN_COIN)).map((c) => c.ref);

test("the chain view round trips, bigints included", async () => {
  const v = await store.chainView(db);
  assert.equal(v.surveySlot, 1000);
  assert.equal(v.checkedAt, 0);
  assert.deepEqual(v.params, { epoch: 10, value: { minFeeA: 44, keyDeposit: 2000000n } });
  assert.deepEqual(v.cancellation, { state: "open", scannedTo: 999, caughtUpAt: 0 });

  await store.setParams(db, { epoch: 11, value: { minFeeA: 45 } });
  await store.scanned(db, { slot: 2000, caughtUpAt: T });
  await store.scanned(db, { slot: 1500, caughtUpAt: T + 1 }); // an older concurrent scan
  assert.deepEqual((await store.chainView(db)).cancellation, { state: "open", scannedTo: 2000, caughtUpAt: T });
  assert.equal((await store.chainView(db)).params.epoch, 11);

  await store.cancelled(db, tx(9));
  assert.deepEqual((await store.chainView(db)).cancellation, { state: "cancelled", by: tx(9) });
  await store.scanned(db, { slot: 3000, caughtUpAt: T });
  assert.deepEqual((await store.chainView(db)).cancellation, { state: "cancelled", by: tx(9) });
});

test("the schema refuses impossible rows", async () => {
  const insert = (sql, ...args) => db.execute(sql, args);
  await assert.rejects(insert("INSERT INTO coins VALUES ('nohash', 1, 0)"));
  await assert.rejects(insert("INSERT INTO coins VALUES (?, 0, 0)", coin(1)));
  const s = "INSERT INTO sponsorships VALUES (?, ?, ?, ?, ?, ?)";
  await assert.rejects(insert(s, key(1), coin(1), tx(1), 600_000, T, null), /CHECK/); // over MAX_FEE
  await assert.rejects(insert(s, key(1), coin(1), tx(1), 200_000, T, T + 1), /CHECK/); // submitted too late
  await assert.rejects(insert(s, "short", coin(1), tx(1), 200_000, T, null), /CHECK/);
  await assert.rejects(insert("UPDATE chain_view SET scan_slot = NULL"), /CHECK/); // neither open nor cancelled
  await assert.rejects(insert("UPDATE chain_view SET cancelled_by = ?", tx(1)), /CHECK/); // both
  await assert.rejects(insert("INSERT INTO chain_view SELECT 2, survey, sponsor, survey_tx, survey_slot, checked_at, params_epoch, params, scan_slot, scan_at, cancelled_by FROM chain_view"), /CHECK/);
});

test("candidates: free, usable, large enough, largest first; picked within the window", async () => {
  await store.checked(db, [
    { ref: coin(1), lovelace: 9 * ADA },
    { ref: coin(2), lovelace: 9.2 * ADA },
    { ref: coin(3), lovelace: 8.5 * ADA },
    { ref: coin(4), lovelace: 1 * ADA },
  ], T);
  assert.deepEqual(await refs(), [coin(2), coin(1), coin(3)]);
  const candidates = await store.candidates(db, T, MIN_COIN);
  const picked = new Set(Array.from({ length: 50 }, (_, i) => store.pick(candidates, 500_000n, () => i / 50).ref));
  assert.deepEqual([...picked].sort(), [coin(1), coin(2)]);

  assert.equal(await lease(1, coin(2)), "leased");
  assert.deepEqual(await refs(), [coin(1), coin(3)]);
});

test("one claim per coin and per key; a new lease replaces the key's previous one", async () => {
  await store.checked(db, listed([coin(1), coin(2), coin(3)]), T);
  assert.equal(await lease(1, coin(1)), "leased");
  assert.equal(await lease(2, coin(1), T, { tx: tx(22) }), "coin");
  assert.equal(await lease(1, coin(2), T, { tx: tx(11) }), "leased");
  assert.deepEqual(await store.sponsorshipOf(db, key(1)), {
    state: "leased", key: key(1), coin: coin(2), tx: tx(11), fee: 200_000n, validUntil: T + 5 * 60_000,
  });
  assert.deepEqual(await refs(), [coin(1), coin(3)]);

  await submitted(1, coin(3), T + 1000);
  assert.equal(await lease(1, coin(1), T + 2000, { tx: tx(12) }), "key");
  assert.equal((await store.sponsorshipOf(db, key(1))).state, "submitted");
});

test("an expired lease frees its coin once its transaction would be known everywhere", async () => {
  await store.checked(db, listed([coin(1)]), T);
  assert.equal(await lease(1, coin(1)), "leased");
  const end = T + 5 * 60_000;
  assert.deepEqual(await refs(end + store.PROPAGATION_MS), []);
  assert.deepEqual(await refs(end + store.PROPAGATION_MS + 1), [coin(1)]);
  assert.equal(await lease(2, coin(1), end + store.PROPAGATION_MS + 1), "leased");
  assert.equal(await store.sponsorshipOf(db, key(1)), null);
});

test("a submission replaces the coin by its change, usable once its transaction is known everywhere", async () => {
  await store.checked(db, listed([coin(1)]), T);
  await lease(1, coin(1));
  await submitted(1, coin(1), T + 1000, T + 5 * 60_000);
  assert.deepEqual(await coins(), [{ ref: change(1), lovelace: 8.8 * ADA, usable_from: T + 1000 + store.PROPAGATION_MS }]);
  assert.deepEqual(await refs(T + 1000), []);
  assert.deepEqual(await refs(T + 1000 + store.PROPAGATION_MS), [change(1)]);
  assert.equal((await store.sponsorshipOf(db, key(1))).at, T + 1000);
});

test("a submission whose lease was lost still counts, and drops another key's lease on its coin", async () => {
  await store.checked(db, listed([coin(1)]), T);
  const end = T + 5 * 60_000;
  await lease(1, coin(1));
  await lease(2, coin(1), end + store.PROPAGATION_MS + 1, { tx: tx(2) }); // key 1's lease expired
  await submitted(1, coin(1), end, end);
  assert.equal((await store.sponsorshipOf(db, key(1))).state, "submitted");
  assert.equal(await store.sponsorshipOf(db, key(2)), null);
});

test("a second submission for a key moves the coins but keeps the first sponsorship", async () => {
  await store.checked(db, listed([coin(1), coin(2)]), T);
  await submitted(1, coin(1), T);
  await store.submitted(db, { key: key(1), coin: coin(2), tx: tx(2), fee: 200_000n, validUntil: T + 60_000, change: { ref: change(2), lovelace: 8 * ADA } }, T);
  assert.equal((await store.sponsorshipOf(db, key(1))).tx, tx(1));
  assert.deepEqual((await coins()).map((c) => c.ref), [change(1), change(2)]);
});

test("a refusal drops the lease, pauses the coin and asks for a check", async () => {
  await store.checked(db, listed([coin(1)]), T);
  await lease(1, coin(1));
  await store.refused(db, { tx: tx(1), coin: coin(1) }, T + 1000);
  assert.equal(await store.sponsorshipOf(db, key(1)), null);
  assert.deepEqual(await refs(T + 1000), []);
  assert.deepEqual(await refs(T + 1000 + store.PROPAGATION_MS), [coin(1)]);
  assert.equal((await store.chainView(db)).checkedAt, 0);
});

test("the daily cap counts the last 24 hours and the leases", async () => {
  await store.checked(db, listed([coin(1), coin(2), coin(3), coin(4)]), T);
  const cap = { dailyCap: 600_000n };
  await submitted(1, coin(1), T - 24 * 3600_000 + 1000, T);
  assert.equal(await lease(2, coin(2), T, cap), "leased");
  assert.equal(await lease(3, coin(3), T, { ...cap, tx: tx(3) }), "leased");
  assert.equal(await lease(4, coin(4), T, { ...cap, tx: tx(4) }), "cap");
  assert.equal(await lease(4, coin(4), T + 1000, { ...cap, tx: tx(4) }), "leased"); // the first is a day old
});

test("a check adds and removes coins, and drops the transactions never on chain", async () => {
  await store.checked(db, listed([coin(1), coin(2), coin(3)]), T);
  await store.refused(db, { tx: tx(9), coin: coin(3) }, T);
  await submitted(1, coin(1), T); // old: should be on chain by now
  await submitted(2, change(1), T + 40_000); // spends tx 1's change
  await submitted(3, coin(2), T + 20 * 60_000); // recent: Koios may not know of it yet
  const now = T + 21 * 60_000;

  // Koios still lists coin 1: tx 1 never made it, nor tx 2. It still lists
  // coin 2, spent by tx 3, and coin 3; and a new coin 4.
  const dropped = await store.checked(db, listed([coin(1), coin(2), coin(3), coin(4)]), now);
  assert.deepEqual(dropped.sort(), [tx(1), tx(2)]);
  assert.equal(await store.sponsorshipOf(db, key(1)), null);
  assert.equal(await store.sponsorshipOf(db, key(2)), null);
  assert.equal((await store.sponsorshipOf(db, key(3))).state, "submitted");
  assert.deepEqual(
    (await coins()).map((c) => [c.ref, c.usable_from]),
    [
      [coin(1), now], // free again
      [coin(2), now], // claimed by tx 3
      [change(3), T + 20 * 60_000 + store.PROPAGATION_MS], // not listed yet, but recent
      [coin(3), T + store.PROPAGATION_MS], // kept as it was
      [coin(4), now],
    ],
  );
  assert.deepEqual((await refs(now)).sort(), [coin(1), change(3), coin(3), coin(4)]);
  assert.equal((await store.chainView(db)).checkedAt, now);

  // Ten minutes later, tx 3 is on chain: Koios lists its change, and no
  // longer coin 2.
  assert.deepEqual(await store.checked(db, listed([coin(1), coin(3), coin(4), change(3)]), now + 10 * 60_000), []);
  assert.deepEqual((await coins()).map((c) => c.ref), [coin(1), change(3), coin(3), coin(4)]);
});

test("another survey keeps the sponsorships; another wallet forgets the coins", async () => {
  await store.checked(db, listed([coin(1), coin(2)]), T);
  await lease(1, coin(1));
  await store.startView(db, view({ survey: `${"b".repeat(64)}#0` }));
  assert.ok(await store.sponsorshipOf(db, key(1)));
  assert.deepEqual(await refs(), [coin(2)]);
  assert.equal((await store.chainView(db)).checkedAt, 0);

  await store.startView(db, view({ survey: `${"b".repeat(64)}#0`, sponsor: "addr_test1other" }));
  assert.equal((await coins()).length, 0);
  assert.ok(await store.sponsorshipOf(db, key(1)));
});
