# Reviewing the translations

The 2026 survey is in nine languages: English, French, Spanish, Portuguese (Brazil), Italian, German, Japanese, Vietnamese and Chinese (simplified). The first translations need a native speaker's eye: thank you for reviewing one!

You need a GitHub account, and nothing else: you suggest changes from your browser, and we check and publish them.

- [Read the survey](#read-the-survey)
- [What to look for](#what-to-look-for)
- [Suggest a change](#suggest-a-change)

## Read the survey

**On the site**, to see the texts as respondents will: https://state-of-cardano-developer-survey-2026.pages.dev/. Pick your language in the menu at the top.

The site only shows the questions that apply to your answers. **The file** has them all, in order: [`cip179/2026/survey.json`](cip179/2026/survey.json). Each text is in all nine languages, one per line, under its two-letter code: `default` is English, then `fr`, `es`, `pt`, `it`, `de`, `ja`, `vi` and `zh`.

```json
"title": {
  "default": "How long have you been writing or deploying software?",
  "fr": "Depuis combien de temps écrivez-vous ou déployez-vous des logiciels ?",
  "es": "¿Cuánto tiempo llevas escribiendo o desplegando software?",
  ...
}
```

The texts around the questions (the welcome, the buttons, the last screens) are in [`site/texts/`](site/texts), one file per language, such as [`site/texts/es.js`](site/texts/es.js).

## What to look for

- **Natural.** It reads as if written in your language, not translated from English.
- **Faithful.** It says what the English says, no more and no less.
- **Consistent.** One word for one thing, throughout the survey and the site.
- **The right tone.** Friendly and professional, the way developer tools address developers in your language.
- **Technical terms as your community uses them.** Most stay in English (smart contract, dApp, stake pool, on-chain, UTxO…). Names never change (Aiken, Plutus, Hydra…).
- **Short answers.** Answers show as buttons: keep them about as short as the English.

Not everything needs changing: if a text is correct and natural, leave it, even if you would have worded it differently.

## Suggest a change

1. Open the file: [`cip179/2026/survey.json`](cip179/2026/survey.json) for the questions, or your language's file in [`site/texts/`](site/texts).
2. Click the pencil, "Edit this file". GitHub makes your own copy of the project: accept.
3. Find the text with the editor's search (Ctrl+F, or ⌘F on a Mac).
4. Change the text on your language's line. Make all your changes to the file before going on.
5. Click "Commit changes…", give a short title such as "Spanish: role question", and click "Propose changes".
6. On the next page, click "Create pull request". Say why, if it isn't obvious: this helps us, and other reviewers of your language.

When editing, change only the words between the quotes:

- Leave the `default` line alone. The English texts are published on the Cardano blockchain: changing them means a new survey. The other languages aren't: they can be fixed at any time, even while the survey is open. Suggestions for the English go to [Proof-reading](../CONTRIBUTING.md#proof-reading).
- Don't use `"` inside a text. Use your language's quotation marks: « », „ “, “ ”, 「 」…
- Keep the quotes and the comma at the end of the line.
- Keep what is in braces as is: `{n}`, `{total}`, `${date}`… They become a number or a date.

Not sure about a change, or want to discuss it first? Open a [Proof-reading discussion](https://github.com/cardano-foundation/state-of-the-developer-ecosystem/discussions/new?category=proof-reading-rewording), with your language in the title.
