// The sponsor's refusals, as the page reads them.

import assert from "node:assert/strict";
import { test } from "node:test";

import { reply, SponsorError } from "../sponsor.js";

test("a refusal has a code", async () => {
  const refusal = async (error) => {
    const res = await reply(async () => {
      throw error;
    });
    return { status: res.status, ...(await res.json()) };
  };
  assert.deepEqual(await refusal(new SponsorError("not hex")), { status: 400, error: "not hex", code: "invalid" });
  assert.deepEqual(await refusal(new SponsorError("busy", 503, "busy")), { status: 503, error: "busy", code: "busy" });
  assert.deepEqual(await refusal(Object.assign(new SponsorError("already", 409, "already"), { txId: "ab" })), {
    status: 409,
    error: "already",
    code: "already",
    txId: "ab",
  });
  assert.equal((await refusal(new SyntaxError("bad JSON"))).code, "invalid");
});
