// Step 1 of a sponsored response (see `cip179/sponsor.js`): after the
// Turnstile check, the transaction the sponsor built and signed for the
// response.
//
//   POST { challenge, payload: <label-17 CBOR hex> } → { tx, txId }

import { reply, sponsor, SponsorError } from "../../../cip179/sponsor.js";

export const onRequestPost = ({ request, env }) =>
  reply(async () => {
    const { challenge, payload } = await request.json();
    const ip = request.headers.get("CF-Connecting-IP") ?? "";
    if (!env.TURNSTILE_SECRET) throw new Error("no TURNSTILE_SECRET");
    if (!(await validateTurnstile(env.TURNSTILE_SECRET, challenge, ip))) {
      throw new SponsorError("invalid turnstile verification", 400, "turnstile");
    }
    return sponsor(env, payload);
  });

async function validateTurnstile(secret, challenge, remoteip) {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", challenge ?? "");
  if (remoteip) body.append("remoteip", remoteip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const { success } = await res.json();
  return success;
}
