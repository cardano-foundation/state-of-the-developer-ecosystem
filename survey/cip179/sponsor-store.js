// The transaction sponsor's state, in a libSQL database (`migrations/`):
// every SQL statement of `sponsor.js`, behind small functions. Times are in
// ms, passed in as `now`; coins and transactions in hex, "<tx id>#<index>"
// for a coin.
//
// The sponsor tracks its coins itself: a sponsored transaction spends one
// coin and has one output, its change, which replaces the coin when the
// transaction is submitted. Koios only confirms the coins now and then
// (`checked`).
//
// Deployed, the database is Turso's; on our machine, a file. Each batch of
// statements is one transaction.

import { readdir, readFile } from "node:fs/promises";

// The nodes behind Koios all know a transaction this long after one of them
// accepted it: 10 s wasn't always enough on Preview. A coin is spent no
// sooner after the transaction that makes it, or after the end of a lease
// whose transaction may have been accepted at the last moment.
export const PROPAGATION_MS = 30 * 1000;
// Koios lists what a transaction on chain spends and makes at most this late.
export const INDEXING_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// The database on our machine, which `yarn dev` uses unless `.env` names
// another.
export const LOCAL_DATABASE = "file:.local/sponsor.db";
const MIGRATIONS = new URL("../migrations/", import.meta.url);

// One client per database and instance.
const clients = new Map();

/**
 * The database of TURSO_DATABASE_URL, with its
 * TURSO_DATABASE_TURSO_AUTH_TOKEN: Turso's, over HTTP, or a file. Only a file
 * needs libSQL's native module, which Vercel's functions may lack.
 */
export function database({ TURSO_DATABASE_URL: url, TURSO_DATABASE_TURSO_AUTH_TOKEN: authToken }) {
  if (!url) return Promise.reject(new Error("no TURSO_DATABASE_URL"));
  if (!clients.has(url)) {
    const client = url.startsWith("file:") ? import("@libsql/client/sqlite3") : import("@libsql/client/http");
    clients.set(url, client.then(({ createClient }) => createClient({ url, authToken })));
  }
  return clients.get(url);
}

/**
 * Applies the files of `migrations/` not applied yet, in order, each in one
 * transaction, and returns their names. The applied ones are recorded in the
 * table `migrations`.
 */
export async function migrate(db) {
  await db.execute("CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY, applied_at INTEGER NOT NULL)");
  const applied = new Set((await db.execute("SELECT name FROM migrations")).rows.map((r) => r.name));
  const names = (await readdir(MIGRATIONS)).filter((name) => name.endsWith(".sql") && !applied.has(name)).sort();
  for (const name of names) {
    const sql = await readFile(new URL(name, MIGRATIONS), "utf8");
    const statements = sql.split(/;\s*$/m).filter((s) => s.replace(/--.*$/gm, "").trim());
    await db.batch([...statements, ["INSERT INTO migrations (name, applied_at) VALUES (?, ?)", [name, Date.now()]]], "write");
  }
  return names;
}

/** What the sponsor read from the chain, or null before the first request. */
export async function chainView(db) {
  const [row] = (await db.execute("SELECT * FROM chain_view WHERE id = 1")).rows;
  if (!row) return null;
  return {
    survey: row.survey,
    sponsor: row.sponsor,
    surveyTx: row.survey_tx,
    surveySlot: row.survey_slot,
    checkedAt: row.checked_at,
    params: { epoch: row.params_epoch, value: parseJson(row.params) },
    cancellation:
      row.cancelled_by === null
        ? { state: "open", scannedTo: row.scan_slot, caughtUpAt: row.scan_at }
        : { state: "cancelled", by: row.cancelled_by },
  };
}

/**
 * Starts the view for a survey and a sponsor wallet. The coins of another
 * wallet are forgotten; the sponsorships are kept, their claims and fees with
 * them. The coins are checked on the next request.
 */
export async function startView(db, { survey, sponsor, surveyTx, surveySlot, params }) {
  await db.batch(
    [
      ["DELETE FROM coins WHERE EXISTS (SELECT 1 FROM chain_view WHERE sponsor != ?)", [sponsor]],
      [
        `INSERT OR REPLACE INTO chain_view
           (id, survey, sponsor, survey_tx, survey_slot, checked_at, params_epoch, params, scan_slot, scan_at)
         VALUES (1, ?, ?, ?, ?, 0, ?, ?, ?, 0)`,
        [survey, sponsor, surveyTx, surveySlot, params.epoch, toJson(params.value), surveySlot - 1],
      ],
    ],
    "write",
  );
}

export async function setParams(db, { epoch, value }) {
  await db.execute("UPDATE chain_view SET params_epoch = ?, params = ? WHERE id = 1", [epoch, toJson(value)]);
}

/**
 * The cancellation scan read up to `slot`; `caughtUp` once it reached the
 * chain's tip. A concurrent scan that went further is kept.
 */
export async function scanned(db, { slot, caughtUpAt }) {
  await db.execute("UPDATE chain_view SET scan_slot = ?, scan_at = ? WHERE id = 1 AND cancelled_by IS NULL AND scan_slot <= ?", [
    slot,
    caughtUpAt,
    slot,
  ]);
}

export async function cancelled(db, txId) {
  await db.execute("UPDATE chain_view SET cancelled_by = ?, scan_slot = NULL, scan_at = NULL WHERE id = 1", [txId]);
}

/** A respondent key's sponsorship, or null. */
export async function sponsorshipOf(db, key) {
  const [row] = (await db.execute("SELECT * FROM sponsorships WHERE key = ?", [key])).rows;
  return row ? sponsorshipFrom(row) : null;
}

/**
 * The free coins usable now worth at least `minCoin`, the largest first. A
 * submitted transaction claims its coin for good, a lease until
 * PROPAGATION_MS after its validity.
 */
export async function candidates(db, now, minCoin) {
  const { rows } = await db.execute(
    `SELECT ref, lovelace FROM coins c
     WHERE usable_from <= ?1 AND lovelace >= ?2 AND NOT EXISTS (
       SELECT 1 FROM sponsorships s
       WHERE s.coin = c.ref AND (s.submitted_at IS NOT NULL OR s.valid_until >= ?1 - ?3))
     ORDER BY lovelace DESC`,
    [now, Number(minCoin), PROPAGATION_MS],
  );
  return rows;
}

/**
 * A coin among the candidates, at random within `window` of the largest:
 * spending the largest keeps the coins level, the randomness spreads
 * simultaneous requests.
 */
export function pick(coins, window, random = Math.random) {
  const close = coins.filter((c) => c.lovelace >= coins[0].lovelace - Number(window));
  return close[Math.floor(random() * close.length)];
}

/**
 * Claims a coin for a respondent key's transaction, replacing the key's
 * previous lease. Returns "leased", or what prevented it: "key" (the key had
 * a response sponsored), "coin" (claimed meanwhile) or "cap" (the fees of the
 * last 24 hours and of the leases would go over `dailyCap`).
 */
export async function lease(db, { key, coin, tx, fee, validUntil }, now, { dailyCap = null } = {}) {
  try {
    const [, insert] = await db.batch(
      [
        ["DELETE FROM sponsorships WHERE submitted_at IS NULL AND (valid_until < ? OR key = ?)", [now - PROPAGATION_MS, key]],
        [
          `INSERT INTO sponsorships (key, coin, tx, fee, valid_until)
           SELECT ?1, ?2, ?3, ?4, ?5
           WHERE ?6 IS NULL OR ?4 + (
             SELECT coalesce(sum(fee), 0) FROM sponsorships WHERE submitted_at IS NULL OR submitted_at > ?7) <= ?6`,
          [key, coin, tx, Number(fee), validUntil, dailyCap === null ? null : Number(dailyCap), now - DAY_MS],
        ],
      ],
      "write",
    );
    return insert.rowsAffected === 1 ? "leased" : "cap";
  } catch (error) {
    if (/UNIQUE constraint failed: sponsorships\.key/.test(error.message)) return "key";
    if (/UNIQUE constraint failed: sponsorships\.coin/.test(error.message)) return "coin";
    throw error;
  }
}

/**
 * The node accepted a transaction: its sponsorship is submitted, even if its
 * lease was lost meanwhile, and its change replaces its coin. A lease of
 * another key on that coin is dropped. If the key already had another
 * transaction submitted, only the coins change.
 */
export async function submitted(db, { key, coin, tx, fee, validUntil, change }, now) {
  await db.batch(
    [
      ["DELETE FROM sponsorships WHERE coin = ? AND key != ? AND submitted_at IS NULL", [coin, key]],
      [
        `INSERT INTO sponsorships (key, coin, tx, fee, valid_until, submitted_at) VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT (key) DO UPDATE SET
           coin = excluded.coin, tx = excluded.tx, fee = excluded.fee,
           valid_until = excluded.valid_until, submitted_at = excluded.submitted_at
         WHERE sponsorships.submitted_at IS NULL`,
        [key, coin, tx, Number(fee), validUntil, Math.min(now, validUntil)],
      ],
      ["DELETE FROM coins WHERE ref = ?", [coin]],
      [
        "INSERT INTO coins (ref, lovelace, usable_from) VALUES (?, ?, ?) ON CONFLICT DO NOTHING",
        [change.ref, Number(change.lovelace), now + PROPAGATION_MS],
      ],
    ],
    "write",
  );
}

/**
 * The node refused a transaction: its lease is dropped. Its coin waits
 * PROPAGATION_MS, in case it is a change that node didn't know yet, and the
 * next request checks the coins: the coin was most likely spent by a
 * transaction we don't know of.
 */
export async function refused(db, { tx, coin }, now) {
  await db.batch(
    [
      ["DELETE FROM sponsorships WHERE tx = ? AND submitted_at IS NULL", [tx]],
      ["UPDATE coins SET usable_from = max(usable_from, ?) WHERE ref = ?", [now + PROPAGATION_MS, coin]],
      ["UPDATE chain_view SET checked_at = 0 WHERE id = 1"],
    ],
    "write",
  );
}

/**
 * The coins Koios lists (`{ ref, lovelace }`). A submitted transaction whose
 * coin Koios still lists INDEXING_MS after its validity never made it on
 * chain, nor did those spending its change: their sponsorships are dropped,
 * and their keys may ask again. Listed coins are added; coins Koios doesn't
 * list are removed, unless they are the change of a recent transaction.
 * Returns the transactions dropped.
 */
export async function checked(db, listed, now) {
  const coins = JSON.stringify(listed.map((c) => ({ ref: c.ref, lovelace: Number(c.lovelace) })));
  const listedRefs = "SELECT json_extract(value, '$.ref') FROM json_each(?1)";
  const [{ rows: dropped }] = await db.batch(
    [
      [
        `WITH RECURSIVE dropped (tx) AS (
           SELECT tx FROM sponsorships WHERE submitted_at IS NOT NULL AND valid_until < ?2 AND coin IN (${listedRefs})
           UNION SELECT s.tx FROM sponsorships s JOIN dropped d ON s.coin = d.tx || '#0')
         DELETE FROM sponsorships WHERE tx IN (SELECT tx FROM dropped) RETURNING tx`,
        [coins, now - INDEXING_MS],
      ],
      [
        `INSERT OR IGNORE INTO coins (ref, lovelace, usable_from)
         SELECT json_extract(value, '$.ref'), json_extract(value, '$.lovelace'), ?2 FROM json_each(?1)`,
        [coins, now],
      ],
      [
        `DELETE FROM coins
         WHERE ref NOT IN (${listedRefs}) AND ref NOT IN (SELECT tx || '#0' FROM sponsorships WHERE submitted_at > ?2)`,
        [coins, now - INDEXING_MS],
      ],
      ["UPDATE chain_view SET checked_at = ? WHERE id = 1", [now]],
    ],
    "write",
  );
  return dropped.map((r) => r.tx);
}

// ----------------------------------------------------------------------------

function sponsorshipFrom(row) {
  const { key, coin, tx, fee, valid_until: validUntil, submitted_at: at } = row;
  return at === null
    ? { state: "leased", key, coin, tx, fee: BigInt(fee), validUntil }
    : { state: "submitted", key, coin, tx, fee: BigInt(fee), validUntil, at };
}

// Protocol parameters hold bigints, kept as { "$bigint": "<digits>" }.
const toJson = (value) => JSON.stringify(value, (_, v) => (typeof v === "bigint" ? { $bigint: String(v) } : v));
const parseJson = (text) => JSON.parse(text, (_, v) => (v?.$bigint !== undefined ? BigInt(v.$bigint) : v));
