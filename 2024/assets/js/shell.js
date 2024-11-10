fetch("/state-of-the-developer-ecosystem/2024/data/answers.json").then(res => res.json()).then(data => {
  const repository = "https://github.com/cardano-foundation/state-of-the-developer-ecosystem/blob/main"
  const node = document.createElement("div");
  document.querySelector('body').appendChild(node);
  Elm.Main.init({
    node,
    flags: {
      title: "State of the Cardano Developer Ecosystem - 2024",
      introduction: "TODO: Introduction",
      questions: {
        question1: question(
          "How many years of experience do you have writing/deploying software?",
          { options:
            [ "Less than 1 year"
            , "Between 1 and 2 years"
            , "Between 2 and 7 years"
            , "Over 7 years"
            ]
          , sortDesc: false
	  , singleChoice: true
          },
	  ``,
        ),
        question2: question(
          "How many years of experience do you have writing software using a functional programming stack?",
          { options:
            [ "I have never used functional programming"
            , "Less than 1 year"
            , "Between 1 and 2 years"
            , "Between 2 and 7 years"
            , "Over 7 years"
            ]
          , sortDesc: false
	  , singleChoice: true
          },
	  ``,
        ),
        question3: question(
  	  "How many years of experience do you have writing/deploying software in the blockchain industry?",
          { options:
            [ "I never wrote or deployed blockchain-related software"
            , "Less than 1 year"
            , "Between 1 and 2 years"
            , "Between 2 and 7 years"
            , "Over 7 years"
            ]
          , sortDesc: false
	  , singleChoice: true
          },
	  ``,
        ),
        question4: question(
          "Do you work on Cardano as a hobby or professionally?",
          { options:
            [ "Hobby"
            , "Profession"
            , "Both"
            ]
          , sortDesc: false
	  , singleChoice: true
          },
	  ``,
        ),
        question5: question(
          "Did you ever contribute, write, or deploy software in other blockchain ecosystems?",
          { options:
            [ "I have only ever worked in the Cardano ecosystem"
	    , "I have worked in other blockchain ecosystems before but moved to Cardano"
	    , "Besides Cardano I also work in parallel with other blockchain ecosystems"
            ]
          , sortDesc: false
	  , singleChoice: true
          },
	  ``,
        ),
        question6: question(
          "Which other blockchain ecosystem(s) are you the most familiar with?",
          { options:
            [ "Algorand"
            , "Aptos"
            , "Avalanche"
            , "Base"
            , "Bitcoin (incl. Lightning)"
            , "BNB"
            , "Cosmos"
            , "Ergo"
            , "Ethereum"
	    , "Ethereum L2s (Starknet; Arbitrum; Scroll; Aztec; etc)"
            , "ICP"
            , "Mina"
            , "NEAR"
            , "Polkadot"
            , "Polygon"
            , "Radix"
            , "Solana"
            , "Stellar"
            , "Sui"
            , "TON"
            , "Tezos"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question7: question(
          "Which best describes your current profession?",
          { options:
            [ "Academic researcher"
            , "Artist"
            , "Data scientist"
            , "Database administrator"
            , "Designer"
            , "Educator"
            , "Financial analyst"
            , "Founder/C-Suite"
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
	  , singleChoice: true
          },
	  ``,
        ),
        question8: question(
          "What is your main development environment?",
          { options:
            [ "Atom"
	    , "Cursor"
            , "Emacs"
            , "IntelliJ"
            , "JetBrains"
            , "Notepad++"
            , "Sublime Text"
            , "Vim/NeoVim"
            , "Visual Studio"
            , "Visual Studio Code"
            , "XCode"
	    , "Zed"
            ]
          , sortDesc: true
	  , singleChoice: true
          },
	  ``,
        ),
        question9: question(
          "Which programming language(s) are you proficient in?",
          { options:
            [ "Aiken"
            , "Bash"
            , "C"
            , "C#"
            , "C++"
	    , "Dart"
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
	    , "PureScript"
            , "Python"
            , "Ruby"
            , "Rust"
            , "Scala"
            , "Solidity"
            , "Swift"
            , "TypeScript"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``
        ),
        question10: question(
          "How would you rate your technical understanding of Cardano?",
          { minimum: "Rookie", maximum: "Expert" },
	  ``,
        ),
        question11: question(
          "What is the biggest priority on the Cardano technical roadmap?",
          { options:
	    [ "Nodes diversity via e.g. Amaru"
	    , "Accessibility & use cases enabling"
	    , "Higher throughput via e.g. Ouroboros Leios"
	    , "Lower finality via e.g. Peras"
	    , "Cross-chain bridges & interoperability with other ecosystems"
	    , "Governance"
	    , "Smart contracts testing & verification"
	    , "Zero-knowledge solutions (either natively or via L2s)"
            ]
          , sortDesc: true
          },
	  ``
        ),
        question12: question(
          "What do you use (or plan to use) for writing Plutus script validators / smart contracts?",
          { options:
            [ "Aiken"
            , "Haskell/Plutus-Tx"
            , "Helios"
            , "Marlowe"
            , "OpShin"
            , "Plutarch"
            , "Pluto"
            , "Plu-ts"
	    , "Purus"
            , "Scalus"
            , "Solidity (with Milkomeda)"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question13: question(
          "What language(s) do you use (or plan to use) for writing off-chain code?",
          { options:
            [ "Bash"
	    , "C#"
            , "C++"
	    , "Elixir"
	    , "Elm"
            , "Go"
            , "Haskell"
            , "Java"
            , "JavaScript"
            , "Kotlin"
	    , "PureScript"
            , "Python"
            , "Rust"
	    , "Scala"
            , "TypeScript"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question14: question(
          "How satisfied are you with the current state of the smart contract ecosystem?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
	  ``,
        ),
        question15: question(
  	  "Which category of Cardano decentralized applications (DApps) are you currently working on or most interested in?",
          { options:
            [ "Decentralized Finance (DeFi)"
            , "NFT Marketplaces"
            , "Governance"
            , "Identity and Authentication"
            , "Gaming and Metaverse"
            , "Real-World Asset Tokenization"
            , "Social dApps"
            , "Supply Chain Management"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question16: question(
	  "Which libraries do you use in your projects?",
          { options:
            [ "Apollo (Go)"
            , "Blaze (TypeScript)"
            , "Blockfrost SDK (Any language)"
            , "Cardano API (Haskell)"
            , "Cardano-client-lib (Java)"
            , "Cardano-js-sdk (TypeScript)"
            , "Cardano-multiplatform-library (JavaScript/Rust)"
            , "Cardano-python (Python)"
            , "Cardano-serialization-lib (JavaScript/Rust)"
            , "Cardano-transaction-lib (PureScript)"
            , "Cardano-wallet-connector (JavaScript)"
            , "Cardanosharp-wallet (C#)"
            , "Gouroboros (Go)"
            , "Helios (JavaScript)"
            , "Koios' client (Any language)"
            , "Kuber (Haskell)"
            , "LibCardano (C++)"
            , "Lucid (TypeScript)"
            , "Lucid-evolution (TypeScript)"
            , "Mesh (JavaScript)"
            , "Ogmios' clients (Any language)"
            , "Pallas (Rust)"
            , "Plu-ts (TypeScript)"
            , "Plutip (Haskell)"
            , "PyCardano (Python)"
            , "Strica's libraries (JavaScript)"
            , "Yaci (Java)"
            , "None directly"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question17: question(
          "It would be nice if a library in … implemented … ?",
          { options:
	    [ [ "**C / Elixir / Elm / Go / Java / JavaScript / Kotlin / Rust / TypeScript** implemented more capable transaction builders, with streamlined supports for smart contracts interaction (Plutus blueprints, UPLC evaluation, transaction chaining, fee balancing...).", 14, null ]
	    , [ "**JavaScript / TypeScript** offered more interoperability and compatibility across the board, avoiding duplication of efforts between similar libraries.", 3, null ]
	    , [ "**JavaScript / Java / Kotlin** implemented more crypto primitives such as VRF, Diffie-Hellman for extended Ed25519 keys or CIP-0022 specific crypto.", 2, null ]
	    , [ "**Python / Scala** implemented better interoperability with Aiken for off-chain smart contract handling.", 2, null ]
	    , [ "**Aiken / Rust / TypeScript** implemented more zero-knowledge primitives / SDKs.", 2, null ]
	    , [ "**C++ / TypeScript** implemented a streamline interface with the node (e.g. Ouroboros mini-protocols).", 2, null ]
	    , [ "**C / TypeScript** implemented a client node.", 2, null ]
            , [ "**Rust / TypeScript** implemented Hydra SDKs.", 2, null ]
	    ]
          , link: `${repository}/2024/data/open-questions/it-would-be-nice-if-a-library-in-implemented.md`
          },
	  ``,
        ),
        question18: question(
	  "Which services do you use in your projects?",
          { options:
            [ "Adder"
            , "Atlas"
            , "Cardano-db-sync"
            , "Cardano-graphql"
            , "Cardano-metadata-oracle"
            , "Cardano-rosetta"
            , "Cardano-transaction-lib"
            , "Cardano-wallet"
            , "Carp"
            , "Dolos"
            , "Hydra"
            , "Kupo"
            , "Ledger-sync"
            , "Mithril"
            , "Ogmios"
            , "Oura"
            , "Scrolls"
            , "Yaci Store"
            , "None directly"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question19: question(
          "It would be nice if a service provided … ?",
          { options:
	    [ [ "...additional analytics & content delivery API (assets metadata, raw transactions, stake distribution snapshots, handle resolution, CDNs...).", 13, null ]
	    , [ "...more transaction handling and construction specific features (e.g. dry submission, better rejection feedback, UTxO management, higher-level abstractions).", 12, null ]
	    , [ "...nothing extra, they're good as they are.", 12, null ]
	    , [ "...better documentation and up-to-date examples of usage and deployment of those services.", 12, null ]
	    , [ "...easier deployment setup and overall lower barrier to entry.", 9, null ]
	    , [ "...trustless & decentralized data-availability solutions (e.g. through zero-knowledge state proofs).", 7, null ]
	    , [ "...event streaming solutions.", 6, null ]
	    , [ "...smaller hardware requirements or better performances overall (in particular cardano-db-sync).", 4, null ]
	    , [ "...custom testing capabilities (private testnets, rollback simulators, ...).", 2, null ]
	    , [ "...Hydra integrations.", 2, null ]
	    , [ "...more discoverability of the existing offering.", 2, null ]
	    ]
          , link: `${repository}/2024/data/open-questions/it-would-be-nice-if-a-service-provided.md`
          },
	  ``,
        ),
        question20: question(
          "Which hosted service(s)/platform(s) do you use in your projects?",
          { options:
            [ "Blockfrost"
            , "CardanoScan"
            , "CExplorer"
            , "Dandelion"
            , "Demeter.run"
            , "Freeloaderz"
            , "Handle"
            , "Koios"
            , "Maestro"
            , "NMKR"
            , "CF’s Token registry"
            , "None directly"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question21: question(
          "How do you prefer interacting with a local or remote service?",
          { options:
            [ "GraphQL"
            , "JSON over HTTP"
            , "JSON over WebSocket"
            , "gRPC / Protocol Buffers"
            , "MQTT"
            , "Thrift"
            , "Bespoke protocols"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question22: question(
          "Which command-line tool(s) do you use in your projects?",
          { options:
            [ "aiken"
            , "bech32"
            , "cardano-addresses"
            , "cardano-cli"
	    , "cardano-up"
            , "cncli"
	    , "gastronomy"
            , "helios"
            , "jamb"
	    , "nview"
            , "offchain-metadata-tools"
	    , "plutip"
	    , "txtop"
            , "yaci"
            , "yaci’s devkit"
            , "None directly"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question23: question(
          "It would be nice if there were a CLI for … ?",
          { options:
	    [ [ "...probably something, but no idea come to mind.", 31, null ]
	    , [ "...nothing extra, the CLI offering is great as it is.", 13, null ]
	    , [ "...scaffolding and operating private node (test) clusters.", 10, null ]
	    , [ "...manipulating and inspecting CBOR.", 9, null ]
	    , [ "...easier wallet management (including multisig)", 5, null ]
	    , [ "...transaction building, possibly bespoke to popular dApps.", 5, null ]
	    , [ "...easier blockchain data access without requiring heavy tools / services.", 5, null ]
	    , [ "...non-unix users, possibly even just TUI or full-blown GUI.", 3, null ]
	    , [ "...visualizing transactions.", 2, null ]
	    ]
          , link: `${repository}/2024/data/open-questions/it-would-be-nice-if-there-were-a-cli-for.md`
          },
	  ``,
        ),
        question24: question(
          "Which type of infrastructure do you currently use or prefer for deploying DApps/blockchain applications?",
          { options:
            [ "Private Cloud"
            , "Public Cloud Service Provider"
            , "Hybrid Cloud (a combination of private and public cloud)"
            , "Decentralized Cloud"
            , "Third-Party Services"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question25: question(
          "How would you prefer to consume software?",
          { options:
            [ "Docker"
            , "Downloadable static executable (amd)"
            , "Downloadable static executable (arm)"
            , "Language package manager"
            , "Nix"
            , "OS package manager"
            , "Source code + build instructions"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question26: question(
          "What do you think is the greatest asset of Cardano’s developer ecosystem?",
          { options:
	    [ [ "Aiken.", 22, null ]
	    , [ "A high concentration of talented developers.", 19, null ]
	    , [ "Its rigorous foundation and focus on correctness.", 15, null ]
	    , [ "Specific tools/libraries other than Aiken (e.g. Plu-ts, Lucid-Evolution, Blaze, Mesh, db-sync, Ogmios, Kupo...).", 15, null ]
	    , [ "Its tooling diversity and open source collaboration.", 11, null ]
	    , [ "Its people & resilient community.", 10, null ]
	    , [ "Good education materials such as Gimbalabs PBL or CF's Academy.", 6, null ]
	    , [ "Project Catalyst", 2, null ]
	    ]
          , link: `${repository}/2024/data/open-questions/what-do-you-think-is-the-greatest-asset-of-cardano-s-developer-ecosystem.md`,
          },
	  ``,
        ),
        question27: question(
	  "What do you think is the biggest pain point of Cardano's developer ecosystem?",
          { options: []
          , link: `${repository}/2024/data/open-questions/what-do-you-think-is-the-biggest-pain-point-of-cardano-s-developer-ecosystem.md`
          },
	  ``,
        ),
        question28: question(
          "Select any statement(s) that applies to you․",
          { options:
            [ "I have never heard of the Cardano Improvement Proposals (CIPs)"
            , "I have read and used a CIP"
            , "I have participated in conversations or reviews related to a CIP"
            , "I have written or co-written a CIP"
            , "No statements apply"
            ]
          , sortDesc: false
	  , singleChoice: false
          },
	  ``,
        ),
        question29: question(
          "Where do you usually seek help on technical issues?",
          { options:
            [ "Cardano forum"
            , "Cardano StackExchange"
            , "Discord servers"
            , "Friends/colleagues/community members"
            , "GitHub discussions/issues"
            , "Reddit (r/Cardano; r/CardanoDevelopers)"
            , "Telegram groups"
            , "Twitter/X"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question30: question(
          "Where/how do you look for technical details on Cardano?",
          { options:
            [ "Blog or website articles & guides"
            , "Cardano forum"
            , "Cardano's developer portal (https://developers.cardano.org/)"
            , "Cardano docs (https://docs.cardano.org/)"
            , "Discord servers"
            , "Friends/colleagues/community members"
            , "(Online) courses"
            , "Reddit (r/Cardano; r/CardanoDevelopers)"
            , "Scientific papers/specifications"
            , "Source code"
            , "Telegram groups"
            , "Twitter/X"
            , "YouTube"
            ]
          , sortDesc: true
	  , singleChoice: false
          },
	  ``,
        ),
        question31: question(
          "On average, how satisfied are you with the technical answers/details you find in documentation and within the community?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
	  ``,
        ),
        question32: question(
  	  "Which language(s) do you prefer to consume documentation and educational content in?",
          { options:
            [ "Arabic"
	    , "Croatian"
            , "Dutch"
            , "English"
	    , "Filipino/Tagalog"
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
	  , singleChoice: false
          },
	  ``,
        ),
        question33: question(
	  "Did you attend the Cardano Buidler Fest in April 2024?",
          {},
	  ``,
        ),
        question34: question(
          "How satisfied were you with the Cardano Buidler Fest?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
	  ``,
        ),
        question35: question(
          "Do you have any ideas on how to improve the next potential Cardano Buidler Fest?",
          { options: []
          , link: `${repository}/2024/data/open-questions/what-do-you-think-is-the-most-painful-point-of-cardano-s-developer-ecosystem.md`
          },
	  ``,
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
        if (x === "Not Answered" || x === "N/A") {
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
    if (!data[title]) { throw new Error(`Unknown question: ${title}`); }
    const answers = data[title].map(homogenize(args.options)).map(toArray).filter(xs => xs.length > 0);
    const options = Object.values(args.options || {});
    return {
      ...args,
      options,
      title: titleAlt,
      comment: comment,
      selectedFilter: 0,
      answers,
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
