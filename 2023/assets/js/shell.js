fetch("/state-of-the-developer-ecosystem/2023/data/answers.json").then(res => res.json()).then(data => {
  const repository = "https://github.com/cardano-foundation/state-of-the-developer-ecosystem/blob/main"
  const node = document.createElement("div");
  document.querySelector('body').appendChild(node);
  Elm.Main.init({
    node,
    flags: {
      title: "State of the Cardano Developer Ecosystem - 2023",
      introduction: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      questions: {
        question1: question(
          "How many years of experience do you have writing/deploying software?",
          { options:
            [ "Less than 1 year"
            , "Between 1 and 3 years"
            , "Between 3 and 10 years"
            , "Over 10 years"
            ]
          , sortDesc: false
          },
          "",
        ),
        question2: question(
          "How many years of experience do you have writing software using a functional programming stack?",
          { options:
            [ "I have never used functional programming"
            , "Less than 1 year"
            , "Between 1 and 3 years"
            , "Between 3 and 10 years"
            , "Over 10 years"
            ]
          , sortDesc: false
          },
          "",
        ),
        question3: question(
          "How would you rate your sentiment towards functional programming?",
          { minimum: "Dreaded", maximum: "Loved" },
          "",
        ),
        question4: question(
          "Do you work on Cardano as a hobby or professionally?",
          { options:
            [ "Hobby"
            , "Profession"
            , "Both"
            ]
          , sortDesc: false
          },
          "",
        ),
        question5: question(
          "Which language(s) are you fluent in?",
          { options:
            [ "Arabic"
            , "Dutch"
            , "English"
            , "French"
            , "German"
            , "Greek"
            , "Hindi"
            , "Indonesian"
            , "Italian"
            , "Japanese"
            , "Polish"
            , "Portuguese"
            , "Russian"
            , "Spanish"
            , "Ukrainian"
            , "Vietnamese"
            ]
          , sortDesc: true
          },
          "",
        ),
        question6: question(
          "Which best describes your current profession?",
          { options:
            [ "Academic researcher"
            , "Artist"
            , "Data scientist"
            , "Database administrator"
            , "Designer"
            , "Educator"
            , "Financial analyst"
            , "Founder/executive officer"
            , "Marketing/sales professional"
            , "Product manager"
            , "Project manager"
            , "R&D engineer"
            , "Site reliability engineer"
            , "Software engineer"
            , "Student/apprentice"
            , "System administrator"
            , "System architect"
            , "Trader"
            , "Web developer"
            ]
          , sortDesc: true
          },
          "",
        ),
        question7: question(
          "What is your main development environment?",
          { options:
            [ "Atom"
            , "Emacs"
            , "IntelliJ"
            , "JetBrains"
            , "Notepad++"
            , "Sublime Text"
            , "Vim/NeoVim"
            , "Visual Studio"
            , "Visual Studio Code"
            , "XCode"
            ]
          , sortDesc: true
          },
          "",
        ),
        question8: question(
          "Which programming language(s) are you proficient in?",
          { options:
            [ "Aiken"
            , "Bash"
            , "C"
            , "C#"
            , "C++"
            , "Elixir"
            , "Elm"
            , "Go"
            , "Haskell"
            , "Helios"
            , "Java"
            , "JavaScript"
            , "Kotlin"
            , "Nix"
            , "PHP"
            , "Python"
            , "Ruby"
            , "Rust"
            , "Scala"
            , "Solidity"
            , "Swift"
            , "TypeScript"
            ]
          , sortDesc: true
          },
          "",
        ),
        question9: question(
          "How would you rate your technical understanding of Cardano?",
          { minimum: "Rookie", maximum: "Expert" },
          "",
        ),
        question10: question(
          "Are you a certified Plutus Pioneer?",
          {},
          "",
        ),
        question11: question(
          "What do you use (or plan to use) for writing Plutus script validators / smart contracts?",
          { options:
            [ "Aiken"
            , "Haskell/Plutus-tx"
            , "Helios"
            , "Marlowe"
            , "OpShin"
            , "Plutarch"
            , "Pluto"
            , "Plu-ts"
            , "Scalus"
            , "Solidity (with Milkomeda)"
            , "N/A"
            ]
          , sortDesc: true
          },
          "",
        ),
        question12: question(
          "What language(s) do you use (or plan to use) for writing off-chain code?",
          { options:
            [ "C#"
            , "C++"
            , "Go"
            , "Haskell"
            , "Java"
            , "JavaScript"
            , "Kotlin"
            , "Python"
            , "Rust"
            , "TypeScript"
            , "PureScript"
            ]
          , sortDesc: true
          },
          "",
        ),
        question13: question(
          "How satisfied are you with the current state of the smart contract ecosystem?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "",
        ),
        question14: question(
          "What is your most awaited feature when it comes to Cardano’s smart contracts?",
          { options:
            [ [ "PlutusV3 / BLS / Zero-Knowledge primitives", 16, null ]
            , [ "Maturity of emerging solutions (e.g. Aiken, Helios, ...)", 14, null ]
            , [ "More/better educational resources & easier on-boarding", 10, null ]
            , [ "Better off-chain interoperability & composability", 7, null ]
            , [ "Better tooling, usability & accessibility", 7, null ]
            , [ "Input endorsers & increased scalability", 7, null ]
            , [ "Increased execution limits and/or smaller execution costs", 7, null ]
            , [ "Better abstractions to work with the EUTxO model", 5, null ]
            , [ "Hydra", 5, "https://hydra.family" ]
            ]
          , link: `${repository}/2023/data/open-questions/what-is-your-most-awaited-feature-when-it-comes-to-cardano-s-smart-contracts.md`
          },
          "",
        ),
        question15: question(
          "Which libraries do you use in your projects?",
          { options:
            [ "blockfrost-sdk (blockfrost)"
            , "cardano-api (input-output-hk)"
            , "cardano-js-sdk (input-output-hk)"
            , "cardano-client-lib (bloxbean)"
            , "cardano-multiplatform-library (dcSpark)"
            , "cardano-python (emesik)"
            , "cardano-serialization-lib (emurgo)"
            , "cardano-transaction-lib (plutonomicon)"
            , "cardano-wallet-connector (dynamicstrategies)"
            , "cardanocli-js (shareslake)"
            , "cardanosharp-wallet (CardanoSharp)"
            , "Gouroboros (BlinkLabs)"
            , "Helios (Hyperion-BT)"
            , "Koios' client (cardano-community)"
            , "Lucid (BerryPool)"
            , "Mesh.js (MartifyLabs)"
            , "Ogmios' client (CardanoSolutions)"
            , "Ouroboros-network-js (StricaHQ)"
            , "Pallas (txpipe)"
            , "PyCardano (cffls)"
            , "toolkit-for-cardano (SundaeSwap-finance)"
            , "TyphonJS (StricaHQ)"
            ]
          , sortDesc: true
          },
          "",
        ),
        question16: question(
          "How satisfied are you with the current state of the Cardano libraries listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "",
        ),
        question17: question(
          "Which services do you use in your projects?",
          { options:
            [ "Atlas (GeniusYield)"
            , "cardano-db-sync (input-output-hk)"
            , "cardano-graphql (cardano-foundation)"
            , "cardano-metadata-oracle (5Binaries)"
            , "cardano-rosetta (cardano-foundation)"
            , "cardano-transaction-lib (Plutonomicon)"
            , "cardano-wallet (cardano-foundation)"
            , "DAB (cardano-foundation)"
            , "Kupo (CardanoSolutions)"
            , "Hydra (input-output-hk)"
            , "Mithril (input-output-hk)"
            , "Offchain-metadata-tools (input-output-hk)"
            , "Ogmios (CardanoSolutions)"
            , "Oura (TxPipe)"
            , "Scrolls (TxPipe)"
            , "SMASH (input-output-hk)"
            , "None directly"
            ]
          , sortDesc: true
          },
          "",
        ),
        question18: question(
          "How satisfied are you with the current state of the Cardano services listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "",
        ),
        question19: question(
          "Which hosted service(s)/platform(s) do you use in your projects?",
          { options:
            [ "Blockfrost (5Binaries)"
            , "CardanoScan (StricaHQ)"
            , "CExplorer (Cardanians)"
            , "Dandelion (Gimbalabs)"
            , "Demeter.run (TxPipe)"
            , "Freeloaderz (FreeLoaderz)"
            , "Handle (AdaHandle)"
            , "Koios (Koios)"
            , "Maestro (GoMaestro)"
            , "NMKR (NMKR)"
            , "Token registry (cardano-foundation)"
            , "N/A"
            ]
          , sortDesc: true
          },
          "",
        ),
        question20: question(
          "How satisfied are you with the current state of the Cardano hosted services/platforms listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "",
        ),
        question21: question(
          "Which command-line tool(s) do you use in your projects?",
          { options:
            [ "aiken (aiken-lang)"
            , "bech32 (input-output-hk)"
            , "cardano-addresses (input-output-hk)"
            , "cardano-cli (input-output-hk)"
            , "cncli (cardano-community)"
            , "helios (Hyperion-BT)"
            , "jamb (iburzynski)"
            , "offchain-metadata-tools (input-output-hk)"
            , "yaci (bloxbean)"
            , "N/A"
            ]
          , sortDesc: true
          },
          "",
        ),
        question22: question(
          "How satisfied are you with the current state of the Cardano command-line tools listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "",
        ),
        question23: question(
          "How do you manage deployment to your infrastructure?",
          { options:
            [ "Ansible"
            , "AWS"
            , "Bash scripts"
            , "Demeter.run"
            , "Docker"
            , "Kubernetes"
            , "Nix/NixOS"
            , "Terraform"
            , "Vercel"
            , "N/A"
            ]
          , sortDesc: true
          },
          "",
        ),
        question24: question(
          "How would you rather consume software?",
          { options:
            [ "Docker"
            , "Downloadable static executable (amd)"
            , "Downloadable static executable (arm)"
            , "Language package manager (e.g. yarn, pip, cargo, cabal, etc.)"
            , "Nix"
            , "OS package manager (e.g. apt, rpm, homebrew, chocolatey, etc.)"
            , "Source code + build instructions"
            ]
          , sortDesc: true
          },
          "",
        ),
        question25: question(
          "What do you think is the greatest asset of Cardano’s developer ecosystem?",
          { options:
            [ [ "Its community", 32, null ]
            , [ "Its diverse and furnished open source ecosystem", 19, null ]
            , [ "Aiken", 17, "https://aiken-lang.org/"  ]
            , [ "Few key players (TxPipe, Gimbalabs, DCSpark...)", 16, null ]
            , [ "Its methodology, strong foundations and overall evidence-based approach", 10, null ]
            , [ "Its reliance on functional programming / the EUTxO model", 8, null ]
            , [ "Lucid", 5, "https://lucid.spacebudz.io/" ]
            , [ "Helios", 4, "https://www.hyperion-bt.org/helios-book/" ]
            , [ "Jambhala / Emurgo Academy", 4, "https://github.com/iburzynski/jambhala#readme" ]
            , [ "Blockfrost", 4,  "https://blockfrost.io/" ]
            ]
          , link: `${repository}/2023/data/open-questions/what-do-you-think-is-the-greatest-asset-of-cardano-s-developer-ecosystem.md`,
          },
          "",
        ),
        question26: question(
          "What do you think is the most painful point of Cardano's developer ecosystem?",
          { options:
            [ [ "The hard to find / scattered documentation", 26, null ]
            , [ "Haskell", 22, null ]
            , [ "The tough on-boarding, it's hard to get started", 15, null ]
            , [ "The inconsistencies between development libraries & APIs", 14, null ]
            , [ "Off-chain transaction building & on-chain/off-chain interoperability", 10, null ]
            , [ "Finding funding & financial support", 10, null ]
            , [ "The delays and disappointments from genesis entities", 9, null ]
            , [ "The adoption and the general lack of users/developers/liquidity", 9, null ]
            , [ "Nix", 6, null ]
            , [ "Smart contracts debugging / testing / benchmarking", 6, null ]
            , [ "Infrastructure costs & complexity", 6, null ]
            , [ "Understanding EUTxO & how to build in this model", 5, null ]
            , [ "The speed/throughput of the network", 3, null ]
            ]
          , link: `${repository}/2023/data/open-questions/what-do-you-think-is-the-most-painful-point-of-cardano-s-developer-ecosystem.md`
          },
          "",
        ),
        question27: question(
          "Select any statement that applies to you․",
          { options:
            [ "I have never heard of the Cardano Improvement Proposals (CIPs)"
            , "I have read and used a CIP"
            , "I have participated in conversations or reviews related to a CIP"
            , "I have written or co-written a CIP"
            ]
          , sortDesc: false
          },
          "",
        ),
        question28: question(
          "Where do you usually seek help on technical issues?",
          { options:
            [ "Cardano forum"
            , "Cardano StackExchange"
            , "Discord servers"
            , "Friends/colleagues/community members"
            , "GitHub discussions/issues"
            , "Reddit(r/Cardano, r/CardanoDevelopers)"
            , "Telegram groups"
            , "Twitter/X"
            ]
          , sortDesc: true
          },
          "",
        ),
        question29: question(
          "Where/how do you look for technical details on Cardano?",
          { options:
            [ "Blog or website articles & guides"
            , "Cardano forum"
            , "Cardano's developer portal (https://developers.cardano.org/)"
            , "Cardano docs (https://docs.cardano.org/)"
            , "Discord servers"
            , "Friends/colleagues/community members"
            , "(Online) courses (e.g. Plutus Pioneer Program, EMURGO Academy, etc.)"
            , "Reddit (r/Cardano, r/CardanoDevelopers)"
            , "Scientific papers/specifications"
            , "Source code"
            , "Telegram groups"
            , "Twitter/X"
            , "YouTube"
            ]
          , sortDesc: true
          },
          "",
        ),
        question30: question(
          "On average, how satisfied are you with the technical answers/details you find in documentation and within the community?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "",
        ),
      }
    }
  });

  /* Some questions have only one answer, some have more. So to make the data easier to process
   * down the line, this function normalizes answers to the most generic format (array) unless
   * they already are.
   */
  function toArray (x) {
    if (Array.isArray(x)) {
      return x.filter(e => e != null);
    }

    return x == null ? [] : [x];
  }

  /* Normalize answers to either a single type or null, which is our strawman option type in JavaScript.
   */
  function homogenize (options = []) {
    return (x, ix) => {
      if (x == null) {
        return x;
      }

      if (["boolean", "number"].includes(typeof x)) {
        return Array.isArray(options) ? x : options[x] || x;
      }

      if (typeof x === "string") {
        if (x === "Not Answered" || x === "Not applicable") {
          return null;
        }

        return Array.isArray(options) ? x : (options[x] || x);
      }

      return x.map(homogenize(options));
    }
  }

  /* Create a question object, and remove non applicable answers from the data.
   * The raw dataset contains mainly two types of 'non applicable' answers which
   * corresponds to either someone who did not answer the question because they
   * closed the questionnaire early (a.k.a 'Not Answered') and those who weren't
   * asked the question because the question wasn't relevant to them (a.k.a 'Not
   * Applicable'). Somehow, there are also few answers that are simply 'null'.
   */
  function question (title, args = {}, comment = "", titleAlt = title) {
    return {
      ...args,
      options: Object.values(args.options || {}),
      title: titleAlt,
      comment: comment,
      selectedFilter: 0,
      answers: data[title].map(homogenize(args.options)).map(toArray),
    };
  };

  // Quick-n-dirty hack to get anchors working without the hassle of handling
  // the Browser.Navigation in-app ¯\_(ツ)_/¯.
  //
  // Please don't judge me too harshly.
  const anchor = location.hash;
  if (anchor != undefined && anchor !== '') {
    requestAnimationFrame(function step () {
      const el = document.querySelector(anchor);
      if (el == null) { return requestAnimationFrame(step); }
      el.scrollIntoView();
    });
  }

  // Synchronize the menu scroll with the content scroll on compatible browsers.
  const html = document.querySelector('html');
  if (html.scrollTopMax) {
    requestAnimationFrame(function step() {
      const nav = document.querySelector('nav');
      if (nav == null) { return requestAnimationFrame(step); }
      nav.addEventListener('scroll', e => {
        html.scrollTop = Math.floor(nav.scrollTop * html.scrollTopMax / nav.scrollTopMax);
      });
    });
  }
});
