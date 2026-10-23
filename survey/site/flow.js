// The survey site's screens, and what moves a respondent from one to the
// next. No DOM here: `main.js` shows the state it is given.
//
//   welcome ─ start ─→ questions ─ finish ─→ submit ─ published ─→ thanks
//      │                    ↑                 │ │
//    leave                  └───── back ──────┘ └─ refused ─→ thanks, closed,
//      ↓                                                      or a problem
//   screened
//
// The survey's end, while the page is open, closes any screen but the thanks;
// while sending, the sponsor's reply decides.
//
// The submit screen has three steps: "review" before publishing, "sending",
// and "failed" with the problem to tell. While sending, it may first be
// `checking`: waiting for the bot check, before the first attempt.

// What the respondent is told for each of the sponsor's refusals
// (`sponsor.js`) and of the page's own (`respondent.js`, and `unpublished` for
// a build of a survey not published yet). After its retries, a refused or
// expired transaction is a busy sponsor to them.
const PROBLEMS = {
  busy: "busy",
  refused: "busy",
  expired: "busy",
  budget: "budget",
  "too-long": "tooLong",
  offline: "offline",
  bot: "check",
  unpublished: "unpublished",
};

// The screens each event applies to; elsewhere it changes nothing.
const FROM = {
  start: ["welcome"],
  leave: ["welcome"],
  return: ["screened"],
  finish: ["questions"],
  back: ["submit"],
  publish: ["submit"],
  checking: ["submit"],
  attempt: ["submit"],
  published: ["submit"],
  refused: ["submit"],
  ended: ["welcome", "screened", "questions", "submit"],
};

/**
 * The state a visit starts in. `submitted` is the transaction of the response
 * this browser already published, or null.
 */
export function start({ epoch, endEpoch, submitted }) {
  if (submitted !== null) return { screen: "thanks", txId: submitted };
  if (epoch > endEpoch) return { screen: "closed" };
  return { screen: "welcome" };
}

/** The state after an event. */
export function next(state, event) {
  if (!FROM[event.type]?.includes(state.screen)) return state;
  const sending = state.step === "sending";
  switch (event.type) {
    case "start":
      return { screen: "questions" };
    case "leave":
      return { screen: "screened" };
    case "return":
      return { screen: "welcome" };
    case "finish":
      return { screen: "submit", step: "review", answered: event.answered };
    case "back":
      return sending ? state : { screen: "questions" };
    case "publish":
      return sending ? state : { screen: "submit", step: "sending", attempt: 1, answered: state.answered };
    case "checking":
      return sending ? { ...state, checking: true } : state;
    case "attempt":
      return sending ? { screen: "submit", step: "sending", attempt: event.attempt, answered: state.answered } : state;
    case "published":
      return sending ? { screen: "thanks", txId: event.txId } : state;
    case "ended":
      return sending ? state : { screen: "closed" };
    case "refused":
      if (!sending) return state;
      // This browser's key already had a response published: these answers
      // weren't, and can't be.
      if (event.code === "already") return { screen: "thanks", txId: event.txId, repeated: true };
      if (event.code === "ended") return { screen: "closed" };
      if (event.code === "cancelled") return { screen: "closed", cancelled: true };
      return {
        screen: "submit",
        step: "failed",
        problem: Object.hasOwn(PROBLEMS, event.code ?? "") ? PROBLEMS[event.code] : "failed",
        answered: state.answered,
      };
  }
}
