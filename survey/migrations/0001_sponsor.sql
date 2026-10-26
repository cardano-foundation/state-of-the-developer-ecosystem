-- The transaction sponsor's state (cip179/sponsor-store.js).

-- The sponsor wallet's coins, as far as the sponsor knows: read from Koios,
-- or the change of a transaction it submitted. A coin is free when no
-- sponsorship claims it, and usable from `usable_from` (ms): a change coin
-- once the other nodes know its transaction, a refused coin after a pause.
CREATE TABLE coins (
  ref         TEXT PRIMARY KEY CHECK (ref GLOB '*#*'),
  lovelace    INTEGER NOT NULL CHECK (lovelace > 0),
  usable_from INTEGER NOT NULL
);

-- One per respondent key, and the only claim on a coin: leased while
-- `submitted_at` is NULL, until `valid_until` (ms), then submitted for good.
CREATE TABLE sponsorships (
  key          TEXT PRIMARY KEY CHECK (length(key) = 56),
  coin         TEXT NOT NULL UNIQUE,
  tx           TEXT NOT NULL UNIQUE CHECK (length(tx) = 64),
  fee          INTEGER NOT NULL CHECK (fee > 0 AND fee <= 300000),
  valid_until  INTEGER NOT NULL,
  submitted_at INTEGER CHECK (submitted_at <= valid_until)
);
CREATE INDEX sponsorships_submitted ON sponsorships (submitted_at);

-- What the sponsor read from the chain, for the survey and the wallet it
-- works for: the survey transaction (read once), when Koios last confirmed
-- the coins, the protocol parameters of an epoch, and the cancellation scan:
-- label-17 transactions read up to `scan_slot`, caught up at `scan_at`, or
-- the cancellation found.
CREATE TABLE chain_view (
  id           INTEGER PRIMARY KEY CHECK (id = 1),
  survey       TEXT NOT NULL CHECK (survey GLOB '*#*'),
  sponsor      TEXT NOT NULL,
  survey_tx    TEXT NOT NULL,
  survey_slot  INTEGER NOT NULL,
  checked_at   INTEGER NOT NULL,
  params_epoch INTEGER NOT NULL,
  params       TEXT NOT NULL,
  scan_slot    INTEGER,
  scan_at      INTEGER,
  cancelled_by TEXT CHECK (length(cancelled_by) = 64),
  CHECK ((scan_slot IS NULL) = (scan_at IS NULL)),
  CHECK ((cancelled_by IS NULL) = (scan_slot IS NOT NULL))
);
