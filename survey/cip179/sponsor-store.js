// The transaction sponsor's state, in D1 (`migrations/0001_sponsor.sql`):
// every SQL statement of `sponsor.js`, behind small functions. Times are in
// ms, passed in as `now`; coins and transactions in hex, "<tx id>#<index>"
// for a coin.
//
// The sponsor tracks its coins itself: a sponsored transaction spends one
// coin and has one output, its change, which replaces the coin when the
// transaction is submitted. Koios only confirms the coins now and then
// (`checked`).

// The nodes behind Koios all know a transaction this long after one of them
// accepted it: 10 s wasn't always enough on Preview. A coin is spent no
// sooner after the transaction that makes it, or after the end of a lease
// whose transaction may have been accepted at the last moment.
export const PROPAGATION_MS = 30 * 1000;
// Koios lists what a transaction on chain spends and makes at most this late.
export const INDEXING_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** What the sponsor read from the chain, or null before the first request. */
export async function chainView(db) {
  const row = await db.prepare("SELECT * FROM chain_view WHERE id = 1").first();
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
  await db.batch([
    db.prepare("DELETE FROM coins WHERE EXISTS (SELECT 1 FROM chain_view WHERE sponsor != ?)").bind(sponsor),
    db
      .prepare(
        `INSERT OR REPLACE INTO chain_view
           (id, survey, sponsor, survey_tx, survey_slot, checked_at, params_epoch, params, scan_slot, scan_at)
         VALUES (1, ?, ?, ?, ?, 0, ?, ?, ?, 0)`,
      )
      .bind(survey, sponsor, surveyTx, surveySlot, params.epoch, toJson(params.value), surveySlot - 1),
  ]);
}

export async function setParams(db, { epoch, value }) {
  await db.prepare("UPDATE chain_view SET params_epoch = ?, params = ? WHERE id = 1").bind(epoch, toJson(value)).run();
}

/**
 * The cancellation scan read up to `slot`; `caughtUp` once it reached the
 * chain's tip. A concurrent scan that went further is kept.
 */
export async function scanned(db, { slot, caughtUpAt }) {
  await db
    .prepare("UPDATE chain_view SET scan_slot = ?, scan_at = ? WHERE id = 1 AND cancelled_by IS NULL AND scan_slot <= ?")
    .bind(slot, caughtUpAt, slot)
    .run();
}

export async function cancelled(db, txId) {
  await db.prepare("UPDATE chain_view SET cancelled_by = ?, scan_slot = NULL, scan_at = NULL WHERE id = 1").bind(txId).run();
}

/** A respondent key's sponsorship, or null. */
export async function sponsorshipOf(db, key) {
  const row = await db.prepare("SELECT * FROM sponsorships WHERE key = ?").bind(key).first();
  return row && sponsorshipFrom(row);
}

/**
 * The free coins usable now worth at least `minCoin`, the largest first. A
 * submitted transaction claims its coin for good, a lease until
 * PROPAGATION_MS after its validity.
 */
export async function candidates(db, now, minCoin) {
  const { results } = await db
    .prepare(
      `SELECT ref, lovelace FROM coins c
       WHERE usable_from <= ?1 AND lovelace >= ?2 AND NOT EXISTS (
         SELECT 1 FROM sponsorships s
         WHERE s.coin = c.ref AND (s.submitted_at IS NOT NULL OR s.valid_until >= ?1 - ?3))
       ORDER BY lovelace DESC`,
    )
    .bind(now, Number(minCoin), PROPAGATION_MS)
    .all();
  return results;
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
    const [, insert] = await db.batch([
      db
        .prepare("DELETE FROM sponsorships WHERE submitted_at IS NULL AND (valid_until < ? OR key = ?)")
        .bind(now - PROPAGATION_MS, key),
      db
        .prepare(
          `INSERT INTO sponsorships (key, coin, tx, fee, valid_until)
           SELECT ?1, ?2, ?3, ?4, ?5
           WHERE ?6 IS NULL OR ?4 + (
             SELECT coalesce(sum(fee), 0) FROM sponsorships WHERE submitted_at IS NULL OR submitted_at > ?7) <= ?6`,
        )
        .bind(key, coin, tx, Number(fee), validUntil, dailyCap === null ? null : Number(dailyCap), now - DAY_MS),
    ]);
    return insert.meta.changes === 1 ? "leased" : "cap";
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
  await db.batch([
    db.prepare("DELETE FROM sponsorships WHERE coin = ? AND key != ? AND submitted_at IS NULL").bind(coin, key),
    db
      .prepare(
        `INSERT INTO sponsorships (key, coin, tx, fee, valid_until, submitted_at) VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT (key) DO UPDATE SET
           coin = excluded.coin, tx = excluded.tx, fee = excluded.fee,
           valid_until = excluded.valid_until, submitted_at = excluded.submitted_at
         WHERE sponsorships.submitted_at IS NULL`,
      )
      .bind(key, coin, tx, Number(fee), validUntil, Math.min(now, validUntil)),
    db.prepare("DELETE FROM coins WHERE ref = ?").bind(coin),
    db
      .prepare("INSERT INTO coins (ref, lovelace, usable_from) VALUES (?, ?, ?) ON CONFLICT DO NOTHING")
      .bind(change.ref, Number(change.lovelace), now + PROPAGATION_MS),
  ]);
}

/**
 * The node refused a transaction: its lease is dropped. Its coin waits
 * PROPAGATION_MS, in case it is a change that node didn't know yet, and the
 * next request checks the coins: the coin was most likely spent by a
 * transaction we don't know of.
 */
export async function refused(db, { tx, coin }, now) {
  await db.batch([
    db.prepare("DELETE FROM sponsorships WHERE tx = ? AND submitted_at IS NULL").bind(tx),
    db.prepare("UPDATE coins SET usable_from = max(usable_from, ?) WHERE ref = ?").bind(now + PROPAGATION_MS, coin),
    db.prepare("UPDATE chain_view SET checked_at = 0 WHERE id = 1"),
  ]);
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
  const [{ results: dropped }] = await db.batch([
    db
      .prepare(
        `WITH RECURSIVE dropped (tx) AS (
           SELECT tx FROM sponsorships WHERE submitted_at IS NOT NULL AND valid_until < ?2 AND coin IN (${listedRefs})
           UNION SELECT s.tx FROM sponsorships s JOIN dropped d ON s.coin = d.tx || '#0')
         DELETE FROM sponsorships WHERE tx IN (SELECT tx FROM dropped) RETURNING tx`,
      )
      .bind(coins, now - INDEXING_MS),
    db
      .prepare(
        `INSERT OR IGNORE INTO coins (ref, lovelace, usable_from)
         SELECT json_extract(value, '$.ref'), json_extract(value, '$.lovelace'), ?2 FROM json_each(?1)`,
      )
      .bind(coins, now),
    db
      .prepare(
        `DELETE FROM coins
         WHERE ref NOT IN (${listedRefs}) AND ref NOT IN (SELECT tx || '#0' FROM sponsorships WHERE submitted_at > ?2)`,
      )
      .bind(coins, now - INDEXING_MS),
    db.prepare("UPDATE chain_view SET checked_at = ? WHERE id = 1").bind(now),
  ]);
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
