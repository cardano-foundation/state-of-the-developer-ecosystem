#!/usr/bin/env node
// The site on our machine, served as Vercel does: `dist/`, built by
// `yarn site`, and the sponsor's functions of `api/`. Needs no Vercel
// account.
//
//   node cip179/dev.js [--port 8788]
//
// The sponsor's secrets are in the gitignored `.env`. Its database is the
// file `.local/sponsor.db`, unless `.env` names another with
// TURSO_DATABASE_URL; it is migrated at the start.

import { existsSync, mkdirSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { parseArgs } from "node:util";

import * as sponsor from "../api/sponsor/index.js";
import * as submit from "../api/sponsor/submit.js";
import { LOCAL_DATABASE, database, migrate } from "./sponsor-store.js";

const OUT = resolve("dist");
const FUNCTIONS = { "/api/sponsor": sponsor, "/api/sponsor/submit": submit };
const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const { values: args } = parseArgs({ options: { port: { type: "string", default: "8788" } } });
if (existsSync(".env")) process.loadEnvFile(".env");
if (!process.env.TURSO_DATABASE_URL) {
  mkdirSync(".local", { recursive: true });
  process.env.TURSO_DATABASE_URL = LOCAL_DATABASE;
}
for (const name of await migrate(await database(process.env))) console.log(`migrated: ${name}`);
if (!existsSync(OUT)) console.warn("no dist/ yet: run yarn site first");

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = FUNCTIONS[url.pathname];
    const response = route ? await call(route, req, url) : await serve(url);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    res.writeHead(500).end();
  }
}).listen(Number(args.port), () => console.log(`http://localhost:${args.port}/`));

/** A function's response, from its export named after the method. */
async function call(route, req, url) {
  const handler = route[req.method];
  if (!handler) return new Response(null, { status: 405 });
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(await Array.fromAsync(req));
  const headers = Object.entries(req.headers).flatMap(([name, value]) => [value].flat().map((v) => [name, v]));
  return handler(new Request(url, { method: req.method, headers, body }));
}

/**
 * A file of `dist/`, a folder's `index.html`, or `404.html`. A folder's
 * address without its final slash redirects to it, for its relative links.
 */
async function serve(url) {
  const path = join(OUT, decodeURIComponent(url.pathname));
  if (path !== OUT && !path.startsWith(OUT + sep)) return new Response(null, { status: 400 });
  const found = await stat(path).catch(() => null);
  if (found?.isDirectory() && !url.pathname.endsWith("/")) {
    return new Response(null, { status: 308, headers: { location: `${url.pathname}/${url.search}` } });
  }
  const file = found?.isDirectory() ? join(path, "index.html") : path;
  const content = await readFile(file).catch(() => null);
  if (content) return new Response(content, { headers: { "content-type": TYPES[extname(file)] ?? "application/octet-stream" } });
  return new Response(await readFile(join(OUT, "404.html")), { status: 404, headers: { "content-type": TYPES[".html"] } });
}
