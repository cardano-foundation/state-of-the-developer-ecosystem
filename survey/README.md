# State of The Developer Ecosystem Survey

Since 2026, the survey's responses are published on the Cardano chain, as a [CIP-179](https://github.com/mpizenberg/Tessera/blob/main/frontend/cip-179.md) survey. Respondents don't need a wallet: a sponsor, run on Vercel, pays their transactions. The 2025 site is in the git history; its questions and answers are in [2025/data/](../2025/data).

Run everything from `survey/`, after `yarn`. To review a translation, see [TRANSLATIONS.md](TRANSLATIONS.md).

- [Try it locally](#try-it-locally)
- [Edit the survey](#edit-the-survey)
- [Deploy](#deploy)
- [How it works](#how-it-works)

## Try it locally

**The site**, as respondents will see it, without publishing answers:

```
yarn site --unpublished
yarn dev
```

Open http://localhost:8788/. After editing `cip179/2026/survey.json` or `site/`, run `yarn site --unpublished` again and reload. `yarn dev` restarts by itself when the sponsor's code changes. It needs no Vercel account.

**Publishing answers** from your machine needs a published survey and a funded sponsor: do [Deploy](#deploy) steps 1 and 2, then:

```
yarn site
yarn dev
```

The sponsor's database is then the file `.local/sponsor.db`, which `yarn dev` migrates at its start. There is no bot check on your machine: BotID runs only on Vercel. A browser publishes once: use another browser, or clear the site's data in yours, to publish again. Your machine and the deployed site share the sponsor wallet: avoid testing locally while the survey is open.

## Edit the survey

1. Edit `cip179/2026/survey.json`, in SurveyJS's format. It is the only source: the definition published on chain (its English texts), the translations, the display conditions and the export's mapping are all built from it.
2. `yarn cip179` lists what doesn't fit CIP-179 or the widget, such as labels over 64 bytes, or SurveyJS features the builder doesn't read.
3. Try it: [Try it locally](#try-it-locally).
4. `yarn test` runs the tests of the builder, the site and the sponsor.

## Deploy

The survey runs on one network at a time: Preview to develop it, Preprod for the final test, then Mainnet. The steps are the same, with each network's values:

| | Preview | Preprod | Mainnet |
| --- | --- | --- | --- |
| `network` | `preview` | `preprod` | `mainnet` |
| `koios` | `https://preview.koios.rest/api/v1` | `https://preprod.koios.rest/api/v1` | `https://api.koios.rest/api/v1` |
| An epoch lasts | 1 day | 5 days | 5 days |
| Ada | from the [faucet](https://docs.cardano.org/cardano-testnets/tools/faucet) | from the faucet | real ada |

Start by setting `network` and `koios` in `config.js`: the public Koios, for our machine. On Mainnet, go through [Before Mainnet](#before-mainnet) first.

You need:

- a Cardano wallet on the network, the survey's owner: it publishes the survey, and can cancel it;
- the foundation's Vercel project, [set up once](#3-set-up-vercel) by its infrastructure team.

### Before Mainnet

- **The free-text schema.** The definition names it by its address on the site's [custom domain](#custom-domain), and by its hash. Every build of the site serves it, on any network: before publishing, check that the domain serves the same file:

  ```
  curl -sf https://devsurvey.cardano.org/cip179/free-text.schema.json | diff - cip179/free-text.schema.json && echo same
  ```

- **The owner's wallet**: the one that publishes the survey, and alone can cancel it.
- **The sponsor's own wallet**, apart from the owner's and from the testnets' one: move `.env` away before [step 2](#2-fund-the-sponsor), and give the new seed phrase in [Vercel's step 3](#3-set-up-vercel). Its ada is real: keep a copy of the seed phrase somewhere safe.
- **Its budget**: the expected responses times about 0.2 ada, plus a margin. During the survey, ada sent to its address becomes a new coin within 30 minutes.
- **Its coins**: one per respondent publishing at the same time, each worth at least 1.5 ada. An announcement brings many respondents at once: split into more coins than on the testnets.
- **The daily cap**, `dailyCap` in `config.js` (see [Later](#later)): it bounds the spending if something goes wrong.
- **BotID's Deep Analysis**, in the Vercel project ([step 6](#3-set-up-vercel)). Basic only stops simple bots.
- **The browser test**, on a preview deployment: publish from Chrome, Safari, Brave with its shields up, Firefox in strict mode, through a VPN and through Tor. BotID shows no challenge to pass: a respondent it takes for a robot can't publish. Optionally, a rate limit on `/api/sponsor` in the project's firewall.
- **A [custom domain](#custom-domain)**, for the site's address.
- **Who watches** the sponsor's logs ([step 5](#5-check)) and its balance, during the survey.

### 1. Publish the survey

1. Pick the end epoch: the current epoch, from `curl -s <koios>/tip` (`epoch_no`), plus the number of epochs to stay open. Responses count until the end of the end epoch.
2. Write the definition, with your wallet's key hash as owner:

   ```
   yarn cip179 --owner <key hash> --end-epoch <epoch>
   ```

3. Publish the `definition.metadata.json` it wrote with your wallet: import it in Tessera's Create page, and publish. With cardano-cli: `--metadata-json-file definition.metadata.json --json-metadata-detailed-schema --required-signer-hash <key hash>`.
4. In `config.js`, set `survey` to `<tx id>#0`.

### 2. Fund the sponsor

1. Make its wallet:

   ```
   node cip179/sponsor-key.js --network <network>
   ```

   It writes the seed phrase to `.env` and prints the address. If `.env` already has one, it stops: that wallet is the sponsor. Preview and Preprod share addresses, so one wallet serves both.
2. Send ada to the address. A response costs about 0.2 ada, and at most 0.5 ada.
3. Split the wallet into coins, one per respondent publishing at the same time:

   ```
   node cip179/sponsor-split.js --coins 10 --submit
   ```

### 3. Set up Vercel

Once, by the foundation's infrastructure team. Step 3 again when the sponsor's wallet changes.

1. A project on this repository, production branch `main`, root directory `survey`, with "Include files outside the root directory in the Build Step" on: the build copies the reports of the repository's `<year>/` folders. `vercel.json` sets the rest.
2. A Turso database from the Marketplace (Storage), connected to the Production environment: it sets `TURSO_DATABASE_URL` and `TURSO_DATABASE_TURSO_AUTH_TOKEN`. The build creates its tables. For previews that publish, another one, connected to Preview.
3. The sponsor's seed phrase, `SPONSOR_MNEMONIC` in `.env`, as a sensitive environment variable of Production, and of Preview while testing on a testnet. Without it, a deployment shows the site and can't publish.
4. `KOIOS_URL`, the Koios for the network of `config.js`, and `KOIOS_TOKEN`, its token, as environment variables of Production, the token sensitive. Every Koios request sends it, the build's too, and Production doesn't run without it. Previews without them use the public Koios of `config.js`.
5. OIDC federation left on, as by default (Settings, Security): BotID's check needs it.
6. Before Mainnet, BotID's Deep Analysis (Firewall, Rules), on Pro or Enterprise plans: $1 per 1,000 checks, one per response.

### 4. Deploy

Commit `config.js` and `survey.json`, and merge into `main`: Vercel builds and deploys. The repository says what is deployed.

The build runs `yarn site`, which reads the survey published as `survey` in `config.js`, and stops unless `survey.json` makes that same definition: the deployment then fails, and the site stays as it was. `yarn site` also copies the reports, served at `/<year>/`, and the free-text schema. Then `yarn db:migrate` applies the new `migrations/` to the deployment's database.

A pull request gets a preview deployment, at its own address.

### 5. Check

Answer the survey on the site and publish: the last screen links to the transaction. The sponsor's logs are in the Vercel project, under Logs.

### Custom domain

Once, on the project that runs Mainnet. The domain, `devsurvey.cardano.org`, is permanent: the home page has the current survey, `/<year>/` the reports, and the definitions on chain name the free-text schema there. In the project (Settings, Domains), add the domain, then the DNS record Vercel shows, at the DNS provider of `cardano.org`.

### Update the deployed site

Step 4. The deployment fails if the definition changed: the English texts, the questions and their options, their order and limits. The page, its texts, the translations and the display conditions can change at any time.

A new report shows once merged into `main`, on GitHub Pages and on the custom domain: the merge deploys the site, which then links the report from the thank-you and closed screens.

A new definition is a new survey:

1. Step 1: pick the end epoch, write the definition, publish, and set `survey`.
2. Step 4.
3. Cancel the previous survey with the owner's wallet, in Tessera, so that other CIP-179 tools show it closed.

The sponsor needs nothing else: it keeps its coins, and the sponsorships, whose fees count toward the daily cap. Browsers start afresh, since they keep the respondent's key and answers per survey. Responses to the previous survey stay on chain and don't count for the new one, so on Mainnet, don't replace a survey that already has responses.

A display condition changed while the survey is open also changes the export: it drops the answers to questions the new conditions hide.

### Later

- **`migrations/` changed**: the next deployment applies them, before it is live, so keep them working with the code deployed. `yarn dev` applies them to your machine's copy.
- **Cap the spending**: set `dailyCap` in `config.js`, in lovelace per 24 hours, then step 4.
- **Close early**: cancel the survey with the owner's wallet, in Tessera. The sponsor stops within 10 minutes.

## How it works

**Files.**

- `site/`: the page respondents use, built into `dist/` by `yarn site`, with the survey baked in, beside the reports and the free-text schema. `404.html` answers the paths with nothing.
- `cip179/`: the survey builder (`build.js`), the site's build (`site.js`), the sponsor (`sponsor*.js`), the local server (`dev.js`) and the tests.
- `cip179/2026/survey.json`: the 2026 survey.
- `api/sponsor/`: the sponsor's endpoints, as Vercel Functions.
- `migrations/`: the sponsor's database, a SQLite one: Turso when deployed.
- `config.js`: the network and the survey, for the page and the sponsor alike, and the daily cap. Secrets are in the Vercel project's environment, and locally in the gitignored `.env`.
- `cip179/koios.js`: every Koios request, of the build, the sponsor and the wallet split: at `KOIOS_URL`, or the `koios` of `config.js`, with `KOIOS_TOKEN` if set.
- `vercel.json`: the build, the functions' time limit, and the headers that let other sites read the schema.

**The site** (`site/flow.js`):

1. A welcome screen, saying that answers are public and permanent. It also has the answers that end the survey there (SurveyJS "complete" triggers): nothing is recorded for them. And a reminder to answer later (`site/reminder.js`): a calendar file, a Google Calendar link, or an email to oneself.
2. The questions, one per screen.
3. A submit screen: BotID's check, which starts as the screen shows, then the sponsor. A refusal is told there, and the answers are kept.
4. A thank-you, with a link to the transaction.

A survey past its end epoch, or cancelled, shows as closed. The thank-you and closed screens link to the survey's report, or until it is out to the latest, and to all the reports. In its last week, the welcome says how soon it closes, and in its last day the submit screen too; an open page closes when the survey does. The page has its texts in nine languages (`site/texts/`, one file each, with the widget's texts for the languages the widget doesn't ship), and offers those the survey also has. A link can choose one: `?lang=es`. The browser keeps the respondent's key, unsent answers and language, for each survey. It requests nothing from other sites before the submit screen.

**The sponsor.** The browser makes a key, and the response's credential is that key.

1. `POST /api/sponsor` checks BotID, and that the payload is one valid response to the survey. It builds a transaction from one of its coins, with the response key as required signer, signs it and returns it.
2. The browser signs it too, and `POST /api/sponsor/submit` submits it through Koios.

It pays at most 0.5 ada per response, once per respondent key: a respondent changes their answer with their own wallet. It stops once the survey is cancelled. It tracks its coins in the database, and checks them with Koios every 30 minutes, or after a refusal. A transaction spends one coin, whose change it spends 30 seconds later, so the wallet needs as many coins as respondents publishing at the same time.

**CIP-179.** A multi-select's None item isn't an option on chain: the question takes 0 options, and the widget shows its None box. A condition names it `"none"`, and the export writes it back as `["none"]`. On a single choice, None stays an option.
