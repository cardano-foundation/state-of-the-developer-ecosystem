// The page's texts in English, and the widget's texts that the page changes.
// The survey's own texts (title, description, questions) come with the survey.

export default {
  language: "English",
  flag: "🇬🇧",
  brand: "State of the Cardano Developer Ecosystem",
  loading: "Loading…",
  terms: "Terms and conditions",
  source: "Source code",
  results: "The results will be in the 2026 report. Until then, here is",
  previous: "the 2025 report",
  period: ".",

  welcome: {
    until: (date) => `Open until ${date}.`,
    // In the last week; `rel` is "in 3 days", "in 5 hours"…
    closes: (rel, when) => (when ? `Closes ${rel}: ${when}.` : `Closes ${rel}.`),
    noWallet: "You don't need a wallet or ada: your answers will be published.",
    kept: "Your answers stay in this browser until you publish them, so you can stop and come back.",
    publicTitle: "Your answers will be public",
    public:
      "They are published on the Cardano blockchain, where anyone can read them and nothing can be changed or removed. They are signed with a random key made in this browser, which isn't linked to you. Don't write anything personal in the text answers.",
    consent: "By publishing your answers, you acknowledge that they will be processed as described in the",
    start: "Start",
    continue: "Continue",
    restart: "Start over",
    remind: "No time right now? Add a reminder:",
    calendar: "Calendar app",
    google: "Google Calendar",
    email: "Email",
    // In the reminder, before the closing date.
    minutes: "About 15 minutes.",
  },

  screened: {
    title: "Thank you",
    body: "This survey is for people who write or deploy software, so there is nothing more to answer.",
    invite: "If you know Cardano developers, please share it with them: each answer helps.",
    share: "Share the survey",
    copied: "Link copied",
    back: "Back",
  },

  submit: {
    title: "Publish your answers",
    answered: (count) => (count === 1 ? "You answered 1 question." : `You answered ${count} questions.`),
    notice: "Once published, your answers are public on the Cardano blockchain and can't be changed or removed.",
    // In the last day.
    soon: (rel) => `The survey closes ${rel}: publish your answers before then.`,
    publish: "Publish my answers",
    back: "Back to my answers",
    sending: "Publishing…",
    retrying: (attempt) => `Still publishing… (attempt ${attempt})`,
    retry: "Try again",
    problems: {
      busy: "Your answers couldn't be published just now. They are kept in this browser: try again in a minute.",
      budget: "Today's budget for transaction fees is spent. Your answers are kept in this browser: please come back tomorrow.",
      tooLong: "Your text answers are too long to publish. Go back to your answers, shorten them and try again.",
      offline: "The server can't be reached. Check your connection and try again.",
      check: "The check that you aren't a robot didn't pass. Try again.",
      failed: "Something went wrong, and your answers weren't published. They are kept in this browser: try again later.",
      unpublished: "This survey isn't published yet: this page only lets you try it, and can't publish answers.",
    },
  },

  thanks: {
    title: "Thank you!",
    body: "Your answers are published. They show on the Cardano blockchain within a minute.",
    repeated: "This browser had already published a response, so the answers you just reviewed weren't published.",
    transaction: "See your response on chain",
  },

  closed: {
    title: "The survey is closed",
    body: "Thank you to everyone who answered.",
    cancelled: "This survey was cancelled and takes no more responses.",
  },

  widget: {
    respond: {
      signAndSubmit: "Finish",
      typeCustom: "Text",
    },
  },
};
