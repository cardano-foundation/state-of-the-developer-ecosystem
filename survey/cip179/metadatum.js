// Conversions of a CIP-179 `Metadatum` tree (bigint, string, Uint8Array,
// array, Map) to the formats we store or measure it in:
//
// - the cardano-cli "detailed" metadata JSON schema, which can be published
//   with `cardano-cli ... --json-metadata-detailed-schema` or imported in
//   Tessera's Create page;
// - CBOR, to send a payload to the sponsor and know the exact size it adds
//   to a transaction.

import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

/**
 * Metadatum → detailed JSON schema value. Integers beyond 2^53 stay exact as
 * raw JSON digits (cardano-cli and Tessera reject them as strings).
 */
export function toDetailedJson(m) {
  if (typeof m === "bigint") return { int: Number.isSafeInteger(Number(m)) ? Number(m) : JSON.rawJSON(m.toString()) };
  if (typeof m === "string") return { string: m };
  if (m instanceof Uint8Array) return { bytes: bytesToHex(m) };
  if (Array.isArray(m)) return { list: m.map(toDetailedJson) };
  if (m instanceof Map) return { map: [...m].map(([k, v]) => ({ k: toDetailedJson(k), v: toDetailedJson(v) })) };
  throw new TypeError(`not a metadatum: ${m}`);
}

/** Detailed JSON schema value → Metadatum. */
export function fromDetailedJson(j) {
  if ("int" in j) return BigInt(j.int);
  if ("string" in j) return j.string;
  if ("bytes" in j) return hexToBytes(j.bytes);
  if ("list" in j) return j.list.map(fromDetailedJson);
  if ("map" in j) return new Map(j.map.map(({ k, v }) => [fromDetailedJson(k), fromDetailedJson(v)]));
  throw new TypeError(`not a detailed metadata JSON value: ${JSON.stringify(j)}`);
}

/** Metadatum → CBOR bytes, keeping map entries in their given order. */
export function toCbor(m) {
  const out = [];
  const head = (major, n) => {
    n = BigInt(n);
    const m5 = major << 5;
    if (n < 24n) out.push(m5 | Number(n));
    else if (n < 0x100n) out.push(m5 | 24, Number(n));
    else if (n < 0x10000n) out.push(m5 | 25, ...beBytes(n, 2));
    else if (n < 0x100000000n) out.push(m5 | 26, ...beBytes(n, 4));
    else out.push(m5 | 27, ...beBytes(n, 8));
  };
  const write = (m) => {
    if (typeof m === "bigint") return m >= 0n ? head(0, m) : head(1, -1n - m);
    if (typeof m === "string") {
      const bytes = new TextEncoder().encode(m);
      head(3, bytes.length);
      return out.push(...bytes);
    }
    if (m instanceof Uint8Array) {
      head(2, m.length);
      return out.push(...m);
    }
    if (Array.isArray(m)) {
      head(4, m.length);
      return m.forEach(write);
    }
    if (m instanceof Map) {
      head(5, m.size);
      return m.forEach((v, k) => (write(k), write(v)));
    }
    throw new TypeError(`not a metadatum: ${m}`);
  };
  write(m);
  return new Uint8Array(out);
}

function beBytes(n, size) {
  const bytes = [];
  for (let i = size - 1; i >= 0; i--) bytes.push(Number((n >> BigInt(8 * i)) & 0xffn));
  return bytes;
}
