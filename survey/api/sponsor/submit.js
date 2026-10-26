// Step 2 of a sponsored response (see `cip179/sponsor.js`): submits the
// transaction from step 1 with the respondent's signature.
//
//   POST { tx, vkey, signature } → { txId }

import { reply, submit } from "../../cip179/sponsor.js";

export const POST = (request) =>
  reply(async () => {
    const { tx, vkey, signature } = await request.json();
    return { txId: await submit(process.env, tx, { vkey, signature }) };
  });
