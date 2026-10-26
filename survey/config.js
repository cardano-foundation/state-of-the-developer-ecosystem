// What is deployed, on each network: the survey, and the sponsor's daily cap.
// `yarn site` builds the page for them (`cip179/site.js`) and the sponsor
// works for them (`cip179/sponsor.js`), so the two can't disagree. See the
// README's deployment steps.
//
// Production, the deployment of `main`, runs Mainnet; the previews and our
// machine run Preprod. NETWORK, if set, chooses another.
//
// The secrets are in the Vercel project's env, one value for Production and
// one for Preview, and locally in the gitignored `.env`: SPONSOR_MNEMONIC, the
// sponsor's seed phrase, TURSO_DATABASE_URL and
// TURSO_DATABASE_TURSO_AUTH_TOKEN, its database, and KOIOS_URL and
// KOIOS_TOKEN, the Koios of production (`cip179/koios.js`).

const networks = {
  preprod: {
    // The network's public Koios, unless KOIOS_URL replaces it.
    koios: "https://preprod.koios.rest/api/v1",
    // The survey's "<tx id>#<index>", or null before it is published.
    survey: "e10037bc105bc36481156b3fc34ef9a037eaee45f72212b42ab68afcfe87bd4d#0",
    // The most the sponsor spends in 24 hours, in lovelace, or null.
    dailyCap: null,
  },
  mainnet: {
    koios: "https://api.koios.rest/api/v1",
    survey: null,
    dailyCap: null,
  },
};

/** What is deployed for `env`: `{ network, koios, survey, dailyCap }`. */
export function deployedOf(env) {
  const network = env.NETWORK || (env.VERCEL_ENV === "production" ? "mainnet" : "preprod");
  if (!Object.hasOwn(networks, network)) throw new Error(`unknown network ${network}`);
  return { network, ...networks[network] };
}

/**
 * Our machine's secrets for a network: Mainnet's apart, so that `yarn dev`
 * and the testnet tools never have its wallet.
 */
export const secretsFile = (network) => (network === "mainnet" ? ".env.mainnet" : ".env");
