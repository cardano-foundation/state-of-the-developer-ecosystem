# State of The Developer Ecosystem Survey

Since 2026, the survey's responses are published on the Cardano chain, as a [CIP-179](https://github.com/mpizenberg/Tessera/blob/main/frontend/cip-179.md) survey. Respondents don't need a wallet: a sponsor, run by Cloudflare Pages, pays their transactions. The 2025 site is in the git history; its questions and answers are in [2025/data/](../2025/data).

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

Open http://localhost:8788/. After editing `cip179/2026/survey.json` or `site/`, run `yarn site --unpublished` again and reload.

**Publishing answers** from your machine needs a published survey and a funded sponsor: do [Deploy](#deploy) steps 1 and 2, then:

```
echo 'TURNSTILE_SECRET="1x0000000000000000000000000000000AA"' >> .dev.vars
yarn db:migrate
yarn site
yarn dev
```

That secret is Turnstile's test secret, which always passes (`2x0000000000000000000000000000000AA` always fails). A browser publishes once: use another browser, or clear the site's data in yours, to publish again. Your machine and the deployed site share the sponsor wallet: avoid testing locally while the survey is open.

## Edit the survey

1. Edit `cip179/2026/survey.json`, in SurveyJS's format. It is the only source: the definition published on chain (its English texts), the translations, the display conditions and the export's mapping are all built from it.
2. `yarn cip179` lists what doesn't fit CIP-179 or the widget, such as labels over 64 bytes, or SurveyJS features the builder doesn't read.
3. Try it: [Try it locally](#try-it-locally).
4. `yarn test` runs the tests of the builder, the site and the sponsor.

## Deploy

The survey runs on one network at a time: Preview to develop it, Preprod for the final test, then Mainnet. The steps are the same, with each network's values:

| | Preview | Preprod | Mainnet |
| --- | --- | --- | --- |
| `SPONSOR_NETWORK` | `preview` | `preprod` | `mainnet` |
| `SPONSOR_KOIOS` | `https://preview.koios.rest/api/v1` | `https://preprod.koios.rest/api/v1` | `https://api.koios.rest/api/v1` |
| The sponsor's database | `cip179-sponsor-preview` | `cip179-sponsor-preprod` | `cip179-sponsor-mainnet` |
| An epoch lasts | 1 day | 5 days | 5 days |
| Ada | from the [faucet](https://docs.cardano.org/cardano-testnets/tools/faucet) | from the faucet | real ada |

Start by setting `SPONSOR_NETWORK` and `SPONSOR_KOIOS` in `wrangler.jsonc`. On Mainnet, go through [Before Mainnet](#before-mainnet) first.

You need:

- a Cardano wallet on the network, the survey's owner: it publishes the survey, and can cancel it;
- a Cloudflare account.

### Before Mainnet

- **The free-text schema.** The definition names it by its address on the site's [custom domain](#custom-domain), and by its hash. Every build of the site serves it, on any network: before publishing, check that the domain serves the same file:

  ```
  curl -sf https://devsurvey.cardano.org/cip179/free-text.schema.json | diff - cip179/free-text.schema.json && echo same
  ```

- **The owner's wallet**: the one that publishes the survey, and alone can cancel it.
- **The sponsor's own wallet**, apart from the owner's and from the testnets' one: move `.dev.vars` away before [step 2](#2-fund-the-sponsor), and give the new seed phrase in [Cloudflare's step 5](#3-set-up-cloudflare). Its ada is real: keep a copy of the seed phrase somewhere safe.
- **Its budget**: the expected responses times about 0.2 ada, plus a margin. During the survey, ada sent to its address becomes a new coin within 30 minutes.
- **Its coins**: one per respondent publishing at the same time, each worth at least 1.5 ada. An announcement brings many respondents at once: split into more coins than on the testnets.
- **The daily cap**, `SPONSOR_DAILY_CAP` (see [Later](#later)): it bounds the spending if something goes wrong.
- **A [custom domain](#custom-domain)**, for the site's address.
- **Who watches** the sponsor's logs ([step 5](#5-check)) and its balance, during the survey.

### 1. Publish the survey

1. Pick the end epoch: the current epoch, from `curl -s <SPONSOR_KOIOS>/tip` (`epoch_no`), plus the number of epochs to stay open. Responses count until the end of the end epoch.
2. Write the definition, with your wallet's key hash as owner:

   ```
   yarn cip179 --owner <key hash> --end-epoch <epoch>
   ```

3. Publish the `definition.metadata.json` it wrote with your wallet: import it in Tessera's Create page, and publish. With cardano-cli: `--metadata-json-file definition.metadata.json --json-metadata-detailed-schema --required-signer-hash <key hash>`.
4. In `wrangler.jsonc`, set `SPONSOR_SURVEY` to `<tx id>#0`.

### 2. Fund the sponsor

1. Make its wallet:

   ```
   node cip179/sponsor-key.js --network <network>
   ```

   It writes the seed phrase to `.dev.vars` and prints the address. If `.dev.vars` already has one, it stops: that wallet is the sponsor. Preview and Preprod share addresses, so one wallet serves both.
2. Send ada to the address. A response costs about 0.2 ada, and at most 0.5 ada.
3. Split the wallet into coins, one per respondent publishing at the same time:

   ```
   node cip179/sponsor-split.js --coins 10 --submit
   ```

### 3. Set up Cloudflare

Once per account. For another network, step 3, and step 5 if the sponsor's wallet changes.

1. Log in:

   ```
   yarn wrangler login
   ```

2. Create the Pages project, named as `name` in `wrangler.jsonc`:

   ```
   yarn wrangler pages project create state-of-cardano-developer-survey-2026 --production-branch main
   ```

3. Create the sponsor's database, named for the network:

   ```
   yarn wrangler d1 create cip179-sponsor-<network> --no-update-config
   ```

   Put its name and `database_id` in the `db` entry of `wrangler.jsonc`, then:

   ```
   yarn db:migrate --remote
   ```

4. Create a Turnstile widget, in the Cloudflare dashboard (Turnstile, Add widget), for the project's hostname, `<name>.pages.dev` (step 2 prints it), and later the [custom domain](#custom-domain). Put its site key as `TURNSTILE_SITE_KEY` in `wrangler.jsonc`, and give its secret key:

   ```
   yarn wrangler pages secret put TURNSTILE_SECRET
   ```

5. Give the sponsor's seed phrase:

   ```
   sed -n 's/^SPONSOR_MNEMONIC="\(.*\)"$/\1/p' .dev.vars | yarn wrangler pages secret put SPONSOR_MNEMONIC
   ```

### 4. Build and deploy

```
yarn site
yarn wrangler pages deploy --branch main
```

`yarn site` reads the survey published as `SPONSOR_SURVEY`, and stops unless `survey.json` makes that same definition. It also copies the reports of the repository's `<year>/` folders, served at `/<year>/`, and the free-text schema. The site is at the project's address, `https://<name>.pages.dev/`, and at its custom domain once set up.

Commit `survey.json` and `wrangler.jsonc`: the repository says what is deployed.

### 5. Check

Answer the survey on the site and publish: the last screen links to the transaction. The sponsor's logs:

```
yarn wrangler pages deployment tail --project-name state-of-cardano-developer-survey-2026
```

### Custom domain

Once, on the account that runs Mainnet. The domain, `devsurvey.cardano.org`, is permanent: the home page has the current survey, `/<year>/` the reports, and the definitions on chain name the free-text schema there. For a domain whose DNS isn't on Cloudflare, such as `cardano.org`:

1. In the Cloudflare dashboard (Workers & Pages, the project, Custom domains), set up a domain with the hostname, `devsurvey.cardano.org`.
2. At the DNS provider, add a CNAME record from that hostname to the project's `<name>.pages.dev`. Only after step 1: before it, the domain answers with error 522.
3. Add the hostname to the Turnstile widget (Turnstile, the widget, Hostname management).

Cloudflare then issues the certificate, and the dashboard shows the domain as active. A domain with CAA records must allow Cloudflare's certificate authorities.

### Update the deployed site

Step 4. It stops if the definition changed: the English texts, the questions and their options, their order and limits. The page, its texts, the translations and the display conditions can change at any time.

A new report shows on GitHub Pages once merged into `main`, and on the custom domain at the next deploy, which also links it from the thank-you and closed screens.

A new definition is a new survey:

1. Step 1: pick the end epoch, write the definition, publish, and set `SPONSOR_SURVEY`.
2. Step 4.
3. Cancel the previous survey with the owner's wallet, in Tessera, so that other CIP-179 tools show it closed.

The sponsor needs nothing else: it keeps its coins, and the sponsorships, whose fees count toward the daily cap. Browsers start afresh, since they keep the respondent's key and answers per survey. Responses to the previous survey stay on chain and don't count for the new one, so on Mainnet, don't replace a survey that already has responses.

A display condition changed while the survey is open also changes the export: it drops the answers to questions the new conditions hide.

### Later

- **`migrations/` changed**: `yarn db:migrate --remote`, and `yarn db:migrate` for your machine's copy. Your machine keeps one copy per `db` entry of `wrangler.jsonc`: after changing it, `yarn db:migrate` too.
- **Cap the spending**: set `SPONSOR_DAILY_CAP`, in lovelace per 24 hours, in the `vars` of `wrangler.jsonc`, then redeploy.
- **Close early**: cancel the survey with the owner's wallet, in Tessera. The sponsor stops within 10 minutes.

## How it works

**Files.**

- `site/`: the page respondents use, built into `dist/` by `yarn site`, with the survey baked in, beside the reports and the free-text schema. `_headers` lets other sites read the schema, and `404.html` answers the paths with nothing.
- `cip179/`: the survey builder (`build.js`), the site's build (`site.js`), the sponsor (`sponsor*.js`) and the tests.
- `cip179/2026/survey.json`: the 2026 survey.
- `functions/api/sponsor/`: the sponsor's endpoints.
- `migrations/`: the sponsor's database.
- `wrangler.jsonc`: the Pages project, its database and vars. `yarn site` takes the network, the survey and the Turnstile site key from there too, so the page and the sponsor agree. Secrets are Pages secrets, and locally in the gitignored `.dev.vars`.

**The site** (`site/flow.js`):

1. A welcome screen, saying that answers are public and permanent. It also has the answers that end the survey there (SurveyJS "complete" triggers): nothing is recorded for them. And a reminder to answer later (`site/reminder.js`): a calendar file, a Google Calendar link, or an email to oneself.
2. The questions, one per screen.
3. A submit screen: Turnstile, then the sponsor. A refusal is told there, and the answers are kept.
4. A thank-you, with a link to the transaction.

A survey past its end epoch, or cancelled, shows as closed. The thank-you and closed screens link to the survey's report, or until it is out to the latest, and to all the reports. In its last week, the welcome says how soon it closes, and in its last day the submit screen too; an open page closes when the survey does. The page has its texts in nine languages (`site/texts/`, one file each, with the widget's texts for the languages the widget doesn't ship), and offers those the survey also has. A link can choose one: `?lang=es`. The browser keeps the respondent's key, unsent answers and language, for each survey. It requests nothing from other sites before the submit screen.

**The sponsor.** The browser makes a key, and the response's credential is that key.

1. `POST /api/sponsor` checks Turnstile, and that the payload is one valid response to the survey. It builds a transaction from one of its coins, with the response key as required signer, signs it and returns it.
2. The browser signs it too, and `POST /api/sponsor/submit` submits it through Koios.

It pays at most 0.5 ada per response, once per respondent key: a respondent changes their answer with their own wallet. It stops once the survey is cancelled. It tracks its coins in the database, and checks them with Koios every 30 minutes, or after a refusal. A transaction spends one coin, whose change it spends 30 seconds later, so the wallet needs as many coins as respondents publishing at the same time.

**CIP-179.** A multi-select's None item isn't an option on chain: the question takes 0 options, and the widget shows its None box. A condition names it `"none"`, and the export writes it back as `["none"]`. On a single choice, None stays an option.
