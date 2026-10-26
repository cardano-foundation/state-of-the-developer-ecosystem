-- The sponsor pays up to 0.5 ada for a response (MAX_FEE in cip179/sponsor.js).
-- SQLite can't change a CHECK in place, so the table is copied.
CREATE TABLE sponsorships_new (
  key          TEXT PRIMARY KEY CHECK (length(key) = 56),
  coin         TEXT NOT NULL UNIQUE,
  tx           TEXT NOT NULL UNIQUE CHECK (length(tx) = 64),
  fee          INTEGER NOT NULL CHECK (fee > 0 AND fee <= 500000),
  valid_until  INTEGER NOT NULL,
  submitted_at INTEGER CHECK (submitted_at <= valid_until)
);
INSERT INTO sponsorships_new SELECT * FROM sponsorships;
DROP TABLE sponsorships;
ALTER TABLE sponsorships_new RENAME TO sponsorships;
CREATE INDEX sponsorships_submitted ON sponsorships (submitted_at);
