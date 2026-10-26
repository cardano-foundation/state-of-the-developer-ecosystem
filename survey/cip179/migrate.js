#!/usr/bin/env node
// Applies the sponsor database's migrations (`migrations/`) not applied yet.
//
//   node cip179/migrate.js
//
// Vercel runs it at each build, on the database of the deployment's
// TURSO_DATABASE_URL: a preview without one has nothing to migrate. On our
// machine, it migrates the database `yarn dev` uses, which `yarn dev` also
// does at its start.

import { existsSync, mkdirSync } from "node:fs";

import { LOCAL_DATABASE, database, migrate } from "./sponsor-store.js";

if (existsSync(".env")) process.loadEnvFile(".env");
if (!process.env.TURSO_DATABASE_URL) {
  if (process.env.VERCEL) {
    console.log("no TURSO_DATABASE_URL: no database to migrate");
    process.exit(0);
  }
  mkdirSync(".local", { recursive: true });
  process.env.TURSO_DATABASE_URL = LOCAL_DATABASE;
}
const applied = await migrate(await database(process.env));
console.log(applied.length > 0 ? `migrated: ${applied.join(", ")}` : "the database is up to date");
