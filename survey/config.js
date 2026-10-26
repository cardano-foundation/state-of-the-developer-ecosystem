// What is deployed: the survey and its network. `yarn site` builds the page
// for them (`cip179/site.js`) and the sponsor works for them
// (`cip179/sponsor.js`), so the two can't disagree. See the README's
// deployment steps.
//
// The secrets are in the Vercel project's env, and locally in the gitignored
// `.env`: SPONSOR_MNEMONIC, the sponsor's seed phrase, TURSO_DATABASE_URL and
// TURSO_DATABASE_TURSO_AUTH_TOKEN, its database, and KOIOS_URL and
// KOIOS_TOKEN, the Koios of production (`cip179/koios.js`).

export default {
  // preview, preprod or mainnet.
  network: "preprod",
  // The network's public Koios, unless KOIOS_URL replaces it.
  koios: "https://preprod.koios.rest/api/v1",
  // The survey's "<tx id>#<index>".
  survey: "e10037bc105bc36481156b3fc34ef9a037eaee45f72212b42ab68afcfe87bd4d#0",
  // The most the sponsor spends in 24 hours, in lovelace, or null.
  dailyCap: null,
};
