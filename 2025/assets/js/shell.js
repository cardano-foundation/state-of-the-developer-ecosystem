const root = document.location.pathname.endsWith("/")
  ? document.location.pathname.slice(0, -1)
  : document.location.pathname;

fetch(`${root}/data/answers.json`).then(res => res.json()).then(rawData =>
fetch(`${root}/data/survey.json`).then(res => res.json()).then(rawSurvey => {
  const repository = "https://github.com/cardano-foundation/state-of-the-developer-ecosystem/blob/main"
  const node = document.createElement("div");
  document.querySelector('body').appendChild(node);

  const survey = rawSurvey.pages
    .flatMap(page => page.elements)
    .filter(question => question.type !== "html");

  // Create a map from question to choices id
  const choicesByQuestion = survey.reduce((all, question) => {
    all[question.name] = {
      type: question.type,
      title: question.title?.default ?? question.title,
      choices: question.choices?.reduce((inner, choice) => {
        inner[choice.value] = choice.text.default ?? choice.text;
        return inner;
      }, {}),
    };

    return all;
  }, {});

  const others = {};

  // Group the answers by questions; making sure that answers align (nth item
  // of each question corresponds to the same nth respondent).
  const data = rawData.reduce((acc, answer, j) => {
    for (let i = 1; i <= Object.keys(choicesByQuestion).length; i += 1) {
      const key = `question${i}`;
      const question = choicesByQuestion[key];

      if (acc[key] === undefined) {
        acc[key] = [];
      }

      function getChoice(label) {
        const choice = question.choices[label];

        if (choice === undefined) {
          if (label === "none") {
            return ["None"];
          }

          if (label === "other") {
            if (others[question.title] === undefined) {
              others[question.title] = [];
            }
            const customAnswer = answer[`${key}-Comment`];

            if (customAnswer == undefined) {
              throw new Error(`empty custom answer at index ${j} for ${key}`);
            }

            others[question.title].push(customAnswer);
            return [customAnswer];
          }

          return [];
        }

        return [choice];
      }

      switch (question.type) {
        case "multipletext": {
          const value = answer[key];
          acc[key].push(value === undefined ? [] : [Object.values(value).join(": ")]);
        }
        break;

        case "text":
        case "comment":
        case "rating": {
          const value = answer[key];
          acc[key].push(value === undefined ? [] : [value]);
        }
        break;

        case "radiogroup":
        case "dropdown":
        case "tagbox":
        case "checkbox":
        case "ranking": {
          if (Array.isArray(answer[key])) {
            acc[key].push(answer[key].flatMap(getChoice));
          } else {
            acc[key].push(getChoice(answer[key]));
          }
        }
        break;
      }
    }

    return acc;
  }, {});

  const questions = survey
    .reduce((acc, question, ix) => {
      if (!data[question.name]) { throw new Error(`Unknown question: ${question.name} - ${title}`); }

      let model = {
        title: question.title.default ?? question.title,
        answers: data[question.name],
        selectedFilter: 0,
        comment: "",
        sortDesc: true,
      };

      switch (question.type) {
        case "multipletext":
        case "text":
        case "comment":
          // [ [ String, Int, null ] ],
          model.options = [];
          model.link = "";
        break;

        case "ranking":
        case "radiogroup":
        case "dropdown":
        case "tagbox":
        case "checkbox":
          model.options = question.choices.map(choice => choice.text.default ?? choice.text);
        break;

        case "rating":
          if (question.rateType === "smileys") {
            model.minimum = "Unsatisfied";
            model.maximum = "Pleased";
          } else {
            // TODO: minimumBy(question.rateValues, rate => rate.value),
            const minimum = question.rateValues.find(() => true);
            model.minimum = minimum.text.default ?? minimum.text;

            // TODO: maximumBy(question.rateValues, rate => rate.value),
            const maximum = question.rateValues.findLast(() => true);
            model.maximum = maximum.text.default ?? maximum.text;
          }
        break;
      }

      acc[`question${ix + 1}`] = model;

      return acc;
    }, {});

  const openQuestions = `${root}/data/open-questions`;

  questions.question1.comment = `The 2025 results show that Cardano continues to attract a highly experienced developer base: over 60% of respondents report more than seven years of software engineering experience, with another 25% in the 2–7 year range. Early-career developers remain a minority at roughly 15%, consistent with 2024.\n\nCompared with broader industry benchmarks such as the Stack Overflow Developer Survey, the Cardano ecosystem remains significantly more senior than average, reinforcing its profile as a platform appealing to seasoned engineers rather than newcomers.`;

  questions.question2.comment = `The respondent pool is overwhelmingly technical, with Software engineers representing just over 50% of all participants and another ~15% coming from senior technical leadership roles (Founders/C-Suite, System Architects).\n\nNon-engineering roles remain marginal. No major surprise here since it is a survey aimed at people developing on Cardano. Besides, student or early-career respondents are virtually absent.`;

  questions.question3.comment = `The 2025 results show a strongly polyglot Cardano developer base, with TypeScript (63.3%), JavaScript (55.0%), and Python (43.1%) remaining the dominant languages—consistent with industry-wide trends and last year’s survey. \n\nNotably, Aiken (34.8%) now rivals established mainstream languages in adoption, reaching the 2nd position for junior developers: a testimony of its ease of learning.\n\nHaskell (29.3%) and Rust (25.6%) -- way above usual numbers for those languages -- continue to anchor the ecosystem’s more advanced technical work. The distribution indicates a healthy blend of web-native developers and low-level systems engineers, supporting Cardano’s increasingly diverse tooling landscape.`;

  questions.question4.comment = `Functional programming (FP) experience among respondents shows a balanced but clearly maturing profile. While 37.6% report 2–7 years of FP experience and 17.4% exceed seven years, a significant minority (30.2%) remain early in their FP journey or entirely new to it. Compared with 2024, this indicates gradual growth of intermediate and senior FP practitioners, reflecting Cardano’s continued influence in promoting FP concepts beyond its traditional Haskell user base. The presence of many newcomers also suggests that languages/frameworks like Aiken and Scalus are effectively lowering the entry barrier.`;

  questions.question5.comment = `Most respondents report 2–7 years of blockchain development experience (55.9%), reflecting an ecosystem composed largely of mid-career practitioners who entered the industry between 2017 and 2022. Early-stage contributors (≤2 years) account for ~28%, indicating continued onboarding of new developers, while only 7 respondents report more than seven years of blockchain involvement—typical given how young the industry is.\n\nCompared with 2024, the distribution remains stable, suggesting steady retention and gradual maturation rather than dramatic shifts in experience levels.`;

  questions.question6.comment = `The 2025 results show that a majority of respondents engage with Cardano professionally (47.7%), while a substantial portion (27.5%) blend both professional and hobby activity. Pure hobbyists represent 24.7%, indicating that while Cardano continues to attract independent builders, the ecosystem is increasingly shaped by full-time contributors.\n\nCompared with 2024, this reflects a stable but gradually professionalizing developer community with an increase of 5% in professionals, consistent with the rising prevalence of experienced engineers and maturing infrastructure projects.`;

  questions.question7.comment = `Among professionals, the largest revenue sources come from genesis-entity employment (30.7%) and non-genesis companies (28.8%), indicating a balanced mix of ecosystem-funded and broader industry-funded work.\n\nIndependent builders form a meaningful segment, with own product or service sales accounting for 17.3% of professional income. Smaller groups rely on Catalyst (9.6%), consulting (7.6%), or niche activities such as DeFi or token launches (each 1.9%).`;

  questions.question8.comment = `A majority of respondents (55.9%) report having worked exclusively within the Cardano ecosystem, indicating a strong core of committed, ecosystem-native developers. The remaining respondents split evenly between those who migrated from other blockchain platforms (22.0%) and those who work in multiple ecosystems concurrently (22.0%).\n\nCompared with 2024, Cardano continues to retain a substantial multi-chain and former-EVM/BTC talent pool while still cultivating a large base of Cardano-first contributors, reflecting both ecosystem loyalty and ongoing cross-pollination from the broader blockchain industry.`;

  questions.question9.comment = `Among respondents familiar with other blockchain ecosystems, Ethereum leads decisively (60.4%), followed by Bitcoin/Lightning (31.2%) and Ethereum L2s (27.0%), confirming that Cardano developers primarily draw cross-ecosystem experience from the industry’s largest and most mature platforms. Familiarity with Solana (14.5%), Midnight (12.5%), and several mid-tier ecosystems (BNB, Ergo, Sui at 8.3% each) reflects a diverse but thinner long-tail of exposure.\n\nThese patterns are broadly consistent with 2024 and align with global industry trends, where EVM environments remain the dominant prior skill base for developers entering alternative chains.`;

  questions.question10.comment = `The 2025 results show Visual Studio Code as the overwhelmingly dominant development environment, used by 56.9% of respondents—mirroring both 2024 and broader industry norms. Vim/Neovim (13.8%) remains the preferred choice among highly experienced developers, while IntelliJ, JetBrains IDEs, and Cursor each account for 6.4%, reflecting a modest but diverse secondary tier.\n\nNiche environments like Emacs, Zed, and Notepad++ collectively represent under 6% of usage. The distribution suggests a stable tooling landscape with a strong tilt toward modern, extensible, and TypeScript-friendly editors.`;

  questions.question13.comment = `Aiken continues its decisive lead as the preferred language for writing Plutus validators, selected by approximately 76% of respondents (83 out of an estimated 109 developers, though the raw selection count is 153 due to multi-select). This mirrors—and even strengthens—the strong upward trend observed in 2024. Secondary options remain far behind: Plu-ts and Scalus (≈9% each), Plinth/Plutus-Tx (≈8%), and OpShin (≈7%), reflecting a fragmented but steadily innovating alternative ecosystem.\n\nNotably, Helios (≈6%) preserves a small but dedicated user base. Meanwhile, ~16% of respondents indicate that they do not currently use any smart contract language, suggesting a meaningful segment focused on infrastructure, off-chain development, or non-contract workloads. Overall, the results reaffirm Aiken’s role as the de facto standard for Plutus development.`;

  questions.question14.comment = `The off-chain language distribution reinforces Cardano’s continued shift toward mainstream developer workflows: TypeScript’s dominance suggests that ecosystem tooling is converging around web-native patterns rather than Cardano-specific stacks. Notably, the steady presence of Rust, Python, and Haskell signals that infrastructure and research-oriented teams continue to diversify the technical base.\n\nCompared with 2024, the rise of languages like Go and the appearance of Tx3 hint at growing experimentation with performance-oriented or service-oriented architectures, reflecting a maturing ecosystem with increasingly specialized off-chain needs.`;

  questions.question17.comment = `This year’s library usage shows a clear consolidation around modern TypeScript tooling, but with an important shift: Mesh and Lucid-evolution now anchor the ecosystem, signalling a move toward higher-level abstractions and opinionated developer experiences rather than the “DIY” transaction-building approach prevalent in earlier years. The continued rise of Rust- and Go-based libraries (Pallas, Gouroboros, Apollo) also suggests that infrastructure teams are increasingly standardizing on performance-oriented stacks.\n\nCompared with 2024’s landscape—which was more fragmented and still heavily reliant on CSL—2025 reflects a tooling ecosystem that is both diversifying and stabilizing, with new contenders gaining meaningful traction rather than briefly flashing and disappearing.`

  questions.question18.link = `${openQuestions}/it-would-be-nice-if-a-library-written-in-implemented.md`;
  questions.question18.comment = `The open responses reveal a consistent theme across languages: developers want higher-level, ergonomic abstractions—especially around transaction building, chaining, and interpreting ledger rules. This mirrors last year’s pain points and suggests that, despite meaningful progress in SDKs, the ecosystem still lacks a unified, cross-language story for constructing and understanding complex eUTxO transactions.\n\nThe interest in visualization, declarative specifications, live documentation, and playgrounds also points to a desire for tooling that reduces cognitive overhead, not merely exposes APIs. Notably, languages on the periphery of the ecosystem (Go, Python, C, Gleam) express needs for foundational utilities, suggesting that multi-language support is uneven and still maturing.`;
  questions.question18.options =
    [ [ "JavaScript / TypeScript"
      , [ "...support for blueprints."
        , "...declarative contract specifications."
        , "...visualization of eUTxO transaction traces."
        , "...a Transaction builder."
        , "...transaction chaining."
        , "...cardano ledger rules."
        , "...a transaction diagram generator."
        ]
      ]

    , [ "Python"
      , [ "...CIP-0093."
        , "...wallet trade history as hydra L2."
        , "...a transaction parser."
        , "...support for Byron addresses."
        ]
      ]

    , [ "Go"
      , [ "...utxo selection."
        , "...fee calculation."
        , "...live documentation."
        , "...consensus"
        ]
      ]

    , [ "Scala / Java"
      , [ "...a transaction builder."
        , "...transaction submission with automatic re-submission."
        ]
      ]

    , [ "Haskell"
      , [ "...a web-based playground."
        , "...general chain interactions."
        , "...a transaction builder."
        ]
      ]

    , [ "Rust"
      , [ "...a transaction builder."
        , "...everything!"
        ]
      ]

    , [ "C"
      , [ "...block producing node configuration sanity checks."
        , "...performance benchmarks."
        , "...performance optimizations at the operating system level."
        ]
      ]

    , [ "Gleam"
      , [ "...an Ogmios client."
        ]
      ]

    , [ "C#"
      , [ "...a transaction builder."
        ]
      ]

    , [ "Aiken"
      , [ "...events."
        ]
      ]
    ];

  questions.question19.comment = `The distribution of self-hosted services this year suggests a significant broadening of the Cardano infrastructure landscape: developers are no longer converging around a single “default” stack but assembling purpose-specific combinations. The strong uptake of Blockfrost backend-ryo alongside Ogmios, Kupo, and db-sync points to a hybrid model emerging—lightweight, streaming-friendly components paired with more traditional relational indexing when needed.\n\nThe rise of Hydra, Mithril, Yaci Store, and Dolos highlights growing experimentation with L2s, lightweight proofs, and alternative indexers, a shift that was far less pronounced in 2024.\n\nOverall, the ecosystem appears to be moving from monolithic to composable infrastructure patterns, giving developers more freedom but also increasing the need for clear guidance on best-practice architectures.`

  questions.question20.link = `${openQuestions}/it-would-be-nice-if-a-self-hosted-local-service-could.md`;
  questions.question20.comment = `The open responses point to a clear desire for end-to-end, developer-friendly infrastructure rather than isolated components. Developers increasingly expect self-hosted services to behave more like cohesive platforms: easy to deploy, capable of spinning up private networks, and offering integrated transaction tooling—including dry runs, diagnostics, and safety guarantees. At the same time, requests for fast, lightweight indexers and verifiable data delivery suggest that performance and trustlessness remain core concerns.\n\nCompared with 2024, the emphasis has shifted away from raw functionality toward operational smoothness, reliability, and sustainability, reflecting a maturing ecosystem where frictionless workflows matter as much as protocol correctness.`;
  questions.question20.options =
    [ [ "Ease of Use & Developer Experience"
      , [ "...be easy to install, configure, and operate."
        , "...provide a complete end-to-end developer experience."
        , "...work seamlessly with custom networks, local devnets, and private test networks."
        , "...allow spinning up private networks easily."
        ]
      ]

    , [ "Performance, Stability & Reliability"
      , [ "...sync quickly and remain stable."
        , "...serve as a fast and lightweight indexer."
        , "...automatically detect and alert about lost slot battles, including diagnostics to improve block-producer performance."
        ]
      ]

    , [ "Verifiability & Transaction Safety"
      , [ "...provide proofs for all data it serves, ensuring verifiability."
        , "...support dry-running transactions for validation without submission."
        ]
      ]

    , [ "Node, Indexer & Deployment Capabilities"
      , [ "...offer a deployable Cardano node and indexer (e.g., on Coolify)."
        , "...include a lightweight or Mithril-backed node with a power-user wallet"
        ]
      ]

    , [ "DeFi integrations"
      , [ "transaction cart, and integration with Fallen-Icarus’ P2P-DeFi kernel."
        ]
      ]

    , [ "Tooling Sustainability"
      , [ "...continue to be actively maintained and improved."
        , "...ensure tools like Kuber IDE remain free and flexible."
        ]
      ]
    ];

  questions.question21.comment = `Hosted-service usage this year reinforces a trend toward composability rather than dependence on a single provider. While Blockfrost remains the dominant entry point, the strong presence of Demeter.run, Koios, Maestro, TapTools, and multiple explorers indicates that developers are increasingly stitching together a mix of specialized hosted capabilities rather than relying on a monolithic backend.\n\nCompared with 2024, adoption appears broader and more diversified, suggesting that the ecosystem is maturing toward a marketplace of interoperable service providers—an encouraging sign for resilience and vendor neutrality, but one that also raises expectations for consistent standards and documentation across platforms.`;

  questions.question24.link = `${openQuestions}/it-would-be-nice-if-there-were-a-cli-for.md`;
  questions.question24.options =
    [ [ "End-to-End dApp & Development Tooling"
      , [ "...full end-to-end dApp development, integrating the Python ecosystem with Aiken and Hydra-based workflows."
        , "...smart-contract debugging tools for Aiken, including CBOR-level introspection."
        , "...transaction-building capabilities with state management (a modern replacement for tools like tx3 or the unmaintained Cardaminal)."
        , "...AI-assisted transaction construction and analysis (natural-language intent → suggested transaction structure, fee estimation, warnings, optimization suggestions)."
        , "...in-depth transaction inspection and review."
        , "...interacting with the token registry."
        ]
      ]

    , [ "Data & Encoding Utilities"
      , [ "...conversion utilities for bech32 ed25519_sk1 keys into cardano-cli's json format — ideally available directly within cardano-address."
        , "...CBOR inspection, manipulation, and pretty-printing — a “jq for CBOR”."
        ]
      ]

    , [ "Governance"
      , [ "...serving as simple voting interface for DReps."
        ]
      ]

    , [ "Stake pool operations"
      , [ "...slot-battle diagnostics for block producers."
        ]
      ]

    , [ "Cross-Chain & Multi-Chain Operations"
      , [ "...cross-chain operations, including wrapped-asset handling, bridge interactions, and automated swaps — ideally scriptable without relying on third-party web interfaces."
        ]
      ]
    ];

  questions.question27.link = `${openQuestions}/what-do-you-think-is-the-greatest-asset-of-cardano-s-developer-ecosystem.md`;
  questions.question27.options =
    [ [ "Community, Collaboration & Culture"
      , [ "A strong, collaborative, and supportive developer community."
        , "People who consistently help each other and share knowledge."
        , "Dedicated builders committed to improving the ecosystem over time."
        , "A collective sense of passion, resilience, and perseverance."
        , "Open discourse and a culture of technical rigor."
        , "Plurality of sub-communities and complementary efforts across the stack."
        , "A treasury-funded ecosystem that empowers contributors."
        , "Catalyst enabling grassroots innovation."
        , "The Cardano Foundation providing resources for newcomers."
        , "Enthusiastic individuals who uplift the ecosystem."
        ]
      ]

    , [ "Core Technical Strengths"
      , [ "Security, scalability, and reliability of the platform."
        , "Transaction determinism provided by the eUTxO model."
        , "The eUTxO model itself, enabling predictable and secure smart-contract behavior."
        , "Functional programming foundations and strong type systems."
        , "Cardano Native Assets as first-class citizens."
        , "A decentralized and stable protocol architecture."
        , "The robustness of the staking system and chain operations."
        ]
      ]

    , [ "Open Source, Tooling & Infrastructure"
      , [ "Strong open-source principles and contributions from many independent teams."
        , "High-quality infrastructure such as Ogmios, TxPipe tools, Anastasia, MeshJS, etc."
        , "Backend and infrastructure that are reliable and well-engineered."
        , "A growing diversity of programming languages and libraries for interacting with the chain."
        , "Demeter, Andamio, and other learning/onboarding platforms that ease the developer journey."
        ]
      ]

    , [ "Aiken & Developer Ergonomics"
      , [ "Aiken as a well-documented, easy-to-learn smart-contract language."
        , "Aiken resources like the eUTxO Design Patterns book and the UTXO crash course."
        , "Emerging improvements to eUTxO programmability and patterns."
        , "A desire for easier testing workflows and tooling that streamlines building fixtures or fluent builders."
        ]
      ]

    , [ "Talent & Expertise"
      , [ "The abundance of skilled, highly intelligent, and passionate developers."
        , "Competent engineers across many teams in the ecosystem."
        , "IOG’s technical leadership and contributions."
        ]
      ]

    , [ "Evolution & Vision"
      , [ "A patient, steady approach to progress — taking small, reliable steps."
        , "A sense of continual evolution and improvement."
        , "Alignment around decentralization and long-term values."
        ]
      ]
    ];

  questions.question28.link = `${openQuestions}/what-do-you-think-is-the-biggest-pain-point-of-cardano-s-developer-ecosystem.md`;
  questions.question28.options =
    [ [ "Tooling Maturity, Integration & Libraries"
      , [ "Immature, fragmented, or incomplete libraries across languages."
        , "Lack of plug-and-play libraries compatible with prototyping workflows and LLM coding."
        , "Poor off-chain/on-chain integration; fractured tooling ecosystems."
        , "Need well-supported transaction-building libraries across multiple languages."
        , "Indexing databases and chain-data access remain difficult to manage."
        , "No canonical CBOR encoding and unstable/ inconsistent CBOR libraries."
        , "Smart contract debugging, testing, and verification tools are underdeveloped."
        , "Lack of simple reference implementations (e.g., single sign-on, transaction signing)."
        , "Immature eUTxO abstractions and limited higher-level frameworks."
        , "Duplicated efforts and unawareness of existing work across teams."
        , "Off-chain web libraries are fragmented, poorly documented, and often incomplete."
        ]
      ]

    , [ "Documentation, Learning Curve & Onboarding"
      , [ "The steep learning curve of eUTxO, Plutus, and Cardano’s architecture."
        , "Lack of clear, up-to-date, unified documentation and reference examples."
        , "Fragmented documentation scattered across sources with no single 'blessed path'."
        , "Few tutorials, books, workshops, or cohesive learning materials for newcomers."
        , "Onboarding tools are insufficient; new developers struggle to know what to use."
        , "Not everyone knows Haskell, and the FP requirements add friction."
        , "Need good design-pattern books and clearer guidance for global state in eUTxO."
        , "Difficulty finding up-to-date information without relying on Twitter."
        ]
      ]


    , [ "Developer Experience & UX"
      , [ "Overall poor DX compared to other ecosystems (especially EVM)."
        , "No cohesive, well-integrated development environment."
        , "Complexity of writing dApps and dealing with UTXO architecture every time."
        , "Lack of friendly abstractions for common use cases."
        , "Poor user experience of many ecosystem websites and resources."
        , "Breaking changes that propagate friction."
        , "Difficulty going from zero to a working dApp in any environment."
        ]
      ]

    , [ "Ecosystem Coordination, Vision & Governance"
      , [ "Lack of integration and ecosystem cohesion."
        , "Reinvention of the wheel due to insufficient coordination."
        , "Need for clearer vision on layered DeFi architecture and P2P primitives."
        , "Fear/hesitance from VCs and limited funding pathways beyond Catalyst."
        , "Uncertainty around Cardano’s positioning and market direction."
        , "General chaos."
        ]
      ]

    , [ "Learning Tools, Infrastructure & Local Dev"
      , [ "Poor support for Apple Silicon in legacy tooling (e.g., GHC versions, cardano-transactions)."
        , "Infrastructure for local development and debugging is less mature than other chains."
        , "Slow or complex workflows due to Haskell toolchains (cabal, nix)."
        , "Challenges understanding underlying system architecture."
        ]
      ]

    , [ "Protocol, Model & Conceptual Complexity"
      , [ "eUTxO is harder to grasp than account-based models."
        , "Necessity to think about UTXOs for every interaction."
        , "Batchers, composability limits, and global-state patterns create complexity."
        , "Lack of simplicity."
        ]
      ]

    , [ "Resource Scarcity & Community Limitations"
      , [ "Not enough developers; limited crossover from other ecosystems."
        , "Few people to answer niche questions due to small ecosystem size."
        , "Insufficient incentives for OSS maintainers to keep libraries up-to-date."
        ]
      ]

    , [ "Cross-Chain, Industry Alignment & External Expectations"
      , [ "Poor integration with other blockchains and limited stablecoin liquidity."
        , "Throughput perception issues relative to competing chains."
        ]
      ]

    , [ "Ellitism"
      , [ "Elitism within parts of the ecosystem."
        , "‘Nerds.’"
        ]
      ]
    ];

  questions.question36.link = `${openQuestions}/do-you-have-any-ideas-on-how-to-improve-the-next-potential-cardano-buidler-fest.md`;
  questions.question36.options =
    [ [ "Program Structure & Format"
      , [ "Add a third day dedicated exclusively to hacking with no talks."
        , "Extend the event to three days overall to allow more time for collaboration."
        , "Include longer breaks or unstructured time for organic discussions and idea sharing."
        , "Decide clearly whether to fully commit to open-space sessions or remove them from the agenda."
        ]
      ]

    , [ "Content Focus"
      , [ "Increase emphasis on core infrastructure debates, discussions, and showcases rather than product demos."
        , "Focus more on Cardano’s major pain points and how to address them."
        , "Improve the quality and depth of workshops."
        ]
      ]

    , [ "Event Identity & Continuity"
      , [ "Continue holding the event annually with a cap of roughly 100 participants."
        , "Maintain the code-challenge requirement for entry."
        ]
      ]

    , [ "Community & Networking"
      , [ "Provide an attendee overview with short descriptions or CV-style profiles to help identify shared interests."
        ]
      ]

    , [ "No change"
      , [ "The event is already very good as it is."
        ]
      ]
    ];

  Elm.Main.init({
    node,
    flags: {
      title: "State of the Cardano Developer Ecosystem - 2025",
      introduction: "Following the <a href='https://cardano-foundation.github.io/state-of-the-developer-ecosystem/2022/'>2022</a>, <a href='https://cardano-foundation.github.io/state-of-the-developer-ecosystem/2023/'>2023</a> and <a href='https://cardano-foundation.github.io/state-of-the-developer-ecosystem/2024/'>2024</a> editions, the 4th Cardano Developer Ecosystem Survey builds on the Cardano Foundation’s annual analysis. With responses from 109 developers on up to 36 questions, the 2025 survey offers valuable insights into the needs and experiences of those building on Cardano.<br/><br/>This year’s survey enhancements enable a more comprehensive exploration of trends and patterns through interactive stacked bar charts, heatmaps, and other visualizations. By better showcasing key trends, these representations reinforce the Foundation’s commitment to community empowerment through transparent, open-source initiatives.<br/><br/>Further emphasizing these efforts, the complete report and the source code used to generate it remain <a href='https://github.com/cardano-foundation/state-of-the-developer-ecosystem'>openly accessible <svg class='icon' style='top: 2px; position: relative;'><use xlink:href='#icon-github'/></svg></a>. We actively encourage community contributions that enable further analysis of results and suggestions for next year’s questions on <a href='https://github.com/cardano-foundation/state-of-the-developer-ecosystem/discussions/'>the collaborative GitHub discussion board</a>. The Foundation thanks all those who participated in the 2024 survey and hopes to generate even more interest for next year’s fourth edition.",
      questions,
    }
  });

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
}));
