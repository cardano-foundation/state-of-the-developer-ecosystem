// Koios, the chain's API, for all that reads or submits to the chain: the
// build, the sponsor and the wallet split. Its address is KOIOS_URL, or else
// the public Koios of `config.js`. KOIOS_TOKEN, if set, goes with every
// request as a bearer token, the library's included. Production needs it, the
// build too; on our machine, the public Koios needs none.

import deployed from "../config.js";

// Koios refuses larger requests.
const BATCH = 50;
// A respondent waits for some of these.
const TIMEOUT_MS = 20_000;

/** Koios answered, but with a failure. */
export class KoiosError extends Error {
  constructor(url, status, text) {
    super(`Koios ${url}: ${status} ${text}`);
    this.status = status;
  }
}

/**
 * The Koios of `env`, `{ baseUrl, token }`: what the endpoints below take, and
 * the library's `withKoios` too.
 */
export function koiosOf(env) {
  const token = env.KOIOS_TOKEN || undefined;
  if (!token && env.VERCEL_ENV === "production") throw new Error("no KOIOS_TOKEN: production calls Koios with its token");
  return { baseUrl: (env.KOIOS_URL || deployed.koios).replace(/\/$/, ""), token };
}

export const txCbor = (koios, txHashes) => batched(txHashes, (b) => post(koios, "tx_cbor", { _tx_hashes: b }));

export const txMetadata = (koios, txHashes) => batched(txHashes, (b) => post(koios, "tx_metadata", { _tx_hashes: b }));

export const addressInfo = (koios, addresses) => post(koios, "address_info", { _addresses: addresses });

/** The transactions with metadata under `label`, filtered by `query`: Koios' own query string. */
export const txByMetalabel = async (koios, label, query) =>
  (await request(koios, `tx_by_metalabel?_label=${label}&${query}`)).json();

/** Submits a transaction (CBOR bytes). Koios refusing it is a KoiosError. */
export async function submitTx(koios, txBytes) {
  await request(koios, "submittx", { body: txBytes, type: "application/cbor" });
}

const post = async (koios, endpoint, body) =>
  (await request(koios, endpoint, { body: JSON.stringify(body), type: "application/json" })).json();

async function request(koios, endpoint, { body, type } = {}) {
  const url = `${koios.baseUrl}/${endpoint}`;
  const headers = { accept: "application/json" };
  if (koios.token) headers.authorization = `Bearer ${koios.token}`;
  if (body !== undefined) headers["content-type"] = type;
  let res;
  try {
    const method = body === undefined ? "GET" : "POST";
    res = await fetch(url, { method, headers, body, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    throw new Error(`Koios can't be reached at ${url} (${error.cause?.message ?? error.message})`);
  }
  if (!res.ok) throw new KoiosError(url, res.status, await res.text());
  return res;
}

/** The results of `request` on batches of BATCH items, concatenated. */
async function batched(items, request) {
  const batches = [];
  for (let i = 0; i < items.length; i += BATCH) batches.push(items.slice(i, i + BATCH));
  return (await Promise.all(batches.map(request))).flat();
}
