// The clock the page and the sponsor share: epochs and slots from the time,
// without reading the chain's tip.

import assert from "node:assert/strict";
import { test } from "node:test";

import { mainnet, preprod, preview } from "@evolution-sdk/evolution/sdk/client/Chain";

import { epochAt, epochEnd, slotTime } from "../network.js";

test("epochs from the time", () => {
  const start = Date.UTC(2022, 9, 25); // preview slot 0
  assert.equal(epochAt("preview", start), 0);
  assert.equal(epochAt("preview", start + 1100 * 86_400_000 - 1), 1099);
  assert.equal(epochAt("preview", start + 1100 * 86_400_000), 1100);

  const shelley = 1_596_059_091_000; // mainnet slot 4492800, epoch 208
  assert.equal(epochAt("mainnet", shelley), 208);
  assert.equal(epochAt("mainnet", shelley + 432_000_000 - 1), 208);
  assert.equal(epochAt("mainnet", shelley + 292 * 432_000_000), 500);

  const preprodStart = Date.UTC(2022, 5, 21); // slot 86400, epoch 4
  assert.equal(epochAt("preprod", preprodStart), 4);
  assert.equal(epochAt("preprod", preprodStart + 432_000_000 - 1), 4);
  assert.equal(epochAt("preprod", preprodStart + 246 * 432_000_000), 250);
});

test("an epoch ends where the next one starts", () => {
  for (const [network, epoch] of [["preview", 1530], ["preprod", 250], ["mainnet", 590]]) {
    const end = epochEnd(network, epoch);
    assert.equal(epochAt(network, end - 1), epoch);
    assert.equal(epochAt(network, end), epoch + 1);
  }
});

// The SDK turns a transaction's validity into a slot, which the sponsor reads back.
test("slots as the SDK times them", () => {
  for (const [network, chain] of Object.entries({ preview, preprod, mainnet })) {
    const { zeroTime, zeroSlot, slotLength } = chain.slotConfig;
    for (const slot of [Number(zeroSlot), 120_000_000]) {
      assert.equal(slotTime(network, slot), Number(zeroTime) + (slot - Number(zeroSlot)) * slotLength, network);
    }
  }
});
