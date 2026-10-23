// Step 1 of a sponsored response (see `cip179/sponsor.js`): the transaction
// the sponsor built and signed for the response.
//
//   POST { payload: <label-17 CBOR hex> } → { tx, txId }

import { reply, sponsor } from "../../cip179/sponsor.js";

export const POST = (request) =>
  reply(async () => {
    const { payload } = await request.json();
    return sponsor(process.env, payload);
  });
