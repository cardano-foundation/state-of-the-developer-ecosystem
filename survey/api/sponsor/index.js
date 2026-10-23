// Step 1 of a sponsored response (see `cip179/sponsor.js`): after Vercel
// BotID's check, the transaction the sponsor built and signed for the
// response.
//
//   POST { payload: <label-17 CBOR hex> } → { tx, txId }
//
// The page asks `GET` first, on the submit screen: BotID runs its challenge
// in the browser before letting a request here go, so the answer says the
// challenge is done.

import { checkBotId } from "botid/server";

import { reply, sponsor, SponsorError } from "../../cip179/sponsor.js";

export const GET = () => new Response(null, { status: 204 });

export const POST = (request) =>
  reply(async () => {
    // Off Vercel, on our machine, the page runs no challenge: nothing to check.
    if (process.env.VERCEL && (await checkBotId({ developmentOptions: { isDevelopment: false } })).isBot) {
      throw new SponsorError("the bot check failed", 403, "bot");
    }
    const { payload } = await request.json();
    return sponsor(process.env, payload);
  });
