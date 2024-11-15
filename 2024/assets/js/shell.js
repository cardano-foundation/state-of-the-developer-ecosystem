fetch("/state-of-the-developer-ecosystem/2024/data/answers.json").then(res => res.json()).then(data => {
  const repository = "https://github.com/cardano-foundation/state-of-the-developer-ecosystem/blob/main"
  const node = document.createElement("div");
  document.querySelector('body').appendChild(node);
  Elm.Main.init({
    node,
    flags: {
      title: "State of the Cardano Developer Ecosystem - 2024",
      introduction: "Following the <a href='https://cardano-foundation.github.io/state-of-the-developer-ecosystem/2022/'>2022</a> and <a href='https://cardano-foundation.github.io/state-of-the-developer-ecosystem/2023/'>2023</a> editions, the third Cardano Developer Ecosystem Survey builds on the Cardano Foundation’s annual analysis. With responses from approximately 196 developers on up to 35 questions, the 2024 survey offers valuable insights into the needs and experiences of those building on Cardano.<br/><br/>This year’s survey enhancements enable a more comprehensive exploration of trends and patterns through interactive stacked bar charts, heatmaps, and other visualizations. By better showcasing key trends, these representations reinforce the Foundation’s commitment to community empowerment through transparent, open-source initiatives.<br/><br/>Further emphasizing these efforts, the complete report and the source code used to generate it remain <a href='https://github.com/cardano-foundation/state-of-the-developer-ecosystem'>openly accessible <svg class='icon' style='top: 2px; position: relative;'><use xlink:href='#icon-github'/></svg></a>. We actively encourage community contributions that enable further analysis of results and suggestions for next year’s questions on <a href='https://github.com/cardano-foundation/state-of-the-developer-ecosystem/discussions/'>the collaborative GitHub discussion board</a>. The Foundation thanks all those who participated in the 2024 survey and hopes to generate even more interest for next year’s fourth edition.",
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
          },
	  `The responses from this year highlight a strong presence of seasoned developers, with over half (51%) reporting more than seven years of experience and 31.6% falling into the mid-career range of two to seven years. This reflects a mature and experienced community within the Cardano ecosystem. Notably, the proportion of newcomers (those with less than one year of experience) has doubled compared to last year, now reaching 9.6%. This growth in rookies may signal both increased accessibility and broader appeal of the Cardano ecosystem to those just starting their development journey.`,
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
          },
	  `This year’s survey reveals a strong adoption of functional programming (FP) within the community, with 85.3% of respondents reporting at least some experience in FP. Notably, 46.3% have over two years of experience, underscoring the ecosystem's alignment with functional programming paradigms. Compared to broader developer ecosystems, such as those surveyed in the StackOverflow yearly reports, this represents a significantly higher proportion of FP practitioners. Furthermore, these figures appear relatively stable compared to previous years, reflecting a consistent affinity for FP within the Cardano developer community.`,
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
          },
	  `The results show a diverse range of experience in blockchain development, with 87.8% of respondents having at least some exposure to writing or deploying blockchain-related software. While only a small fraction (6.1%) are industry veterans with over seven years of experience—unsurprising given the relative youth of the blockchain space—a significant 40.8% have between two and seven years of experience. This middle range suggests a resilient core of developers who have remained engaged with Cardano and the broader blockchain industry over time. At the same time, the 12.2% with no blockchain experience highlights ongoing opportunities to onboard newcomers into this rapidly evolving field.`,
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
	  `The responses indicate a notable shift toward professional involvement within the Cardano ecosystem. While the proportion of hobbyists remains stable at around 28%, professionals have increased by 9% compared to last year, now representing 42.8% of respondents. This growth appears to align with a corresponding 9% decrease in those identifying as both hobbyists and professionals, suggesting that several part-time contributors have transitioned to full-time roles. This trend highlights the ecosystem's maturation and its potential to offer sustainable career opportunities.`
        ),
        question5: question(
          "Did you ever contribute, write, or deploy software in other blockchain ecosystems?",
          { options:
            [ "I have only ever worked in the Cardano ecosystem"
	    , "I have worked in other blockchain ecosystems before but moved to Cardano"
	    , "Besides Cardano I also work in parallel with other blockchain ecosystems"
            ]
          , sortDesc: false
          },
	  `The survey results show that 59.6% of respondents have exclusively worked within the Cardano ecosystem, demonstrating a significant concentration of "Cardano-first" developers. Meanwhile, 19.3% transitioned from other blockchain ecosystems, and 20.9% actively work in parallel with other ecosystems. This developer distribution suggests strong loyalty among Cardano contributors but also highlights a minority who bring or maintain cross-ecosystem expertise.

In comparison, broader blockchain ecosystems, such as Ethereum, Polygon, and Solana, tend to see higher levels of multi-platform participation due to their widespread tooling compatibility and cross-chain bridging capabilities. For instance, Ethereum's large developer base often explores layer 2 solutions like Arbitrum and Optimism or alternative chains like Polygon, leveraging their shared Ethereum Virtual Machine (EVM) infrastructure. This level of multi-ecosystem involvement is less pronounced in Cardano, potentially leading to more focused innovation but also the risk of "echo chamber" effects where external ideas and practices might be underrepresented`,
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
          },
	  `The responses reveal that Ethereum and Bitcoin dominate as the most familiar blockchain ecosystems among participants, with 64.9% and 28.5% of respondents, respectively, reporting familiarity. Ethereum's prominence is unsurprising given its status as a foundational blockchain for smart contracts and decentralized applications. However, ecosystems often viewed as technologically or ideologically aligned with Cardano, such as Ergo (7.7%), Tezos (6.4%), Mina (6.4%), and Radix (3.8%), show relatively low familiarity.

This suggests either a lack of crossover interest or awareness within these communities or perhaps a stronger focus within the Cardano ecosystem on unique, self-contained development. The underrepresentation of these "adjacent" ecosystems may indicate an opportunity for stronger collaboration or knowledge exchange to leverage shared principles and technologies.`,
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
          },
	  `The profession distribution reflects the developer-centric focus of this survey, with software engineers making up the majority at 41.3%. Other roles include founders or C-suite executives (9.3%), educators (5.3%), and system architects (5.3%), indicating a mix of technical, leadership, and educational expertise. Smaller groups, such as data scientists (4.0%) and academic researchers (2.6%), highlight the broader range of skills contributing to the ecosystem. This distribution aligns with expectations for a developer-oriented survey.`,
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
          },
	  `Visual Studio Code continues to dominate as the most popular development environment, accounting for nearly half of respondents' preferences, a trend consistent with last year's results. While Vim/NeoVim retains its position as the second choice, JetBrains has emerged as a noteworthy contender, rising in popularity compared to previous years. This growth suggests an increasing appreciation for its suite of tools among developers. Meanwhile, other environments like Notepad++ and IntelliJ maintain a steady presence, reflecting the diverse ecosystem of tools used within the community.`,
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
          },
	  `The proficiency distribution among respondents highlights a strong alignment with global programming trends, with JavaScript (60.4%), TypeScript (52.1%), and Python (45.6%) leading the list. This mirrors findings from the [2024 Stack Overflow Developer Survey](https://stackoverflow.blog/2024/07/24/developers-want-more-more-more-the-2024-results-from-stack-overflow-s-annual-developer-survey/), where JavaScript (62%) and Python (51%) were the most commonly used languages.

Notably, 30.2% of respondents are proficient in Haskell, reflecting the functional programming paradigm's prominence within the Cardano ecosystem. Additionally, Aiken's proficiency has surged to 39.5%, a significant 18.7% increase from the previous year, suggesting its growing adoption and the community's adaptability in embracing new languages.`
        ),
        question10: question(
          "How would you rate your technical understanding of Cardano?",
          { minimum: "Rookie", maximum: "Expert" },
	  `The community's technical understanding of Cardano scores remarkably high, with a median rating of 8 and an interquartile range from 6 to 9. This confidence remains consistent across subsets of respondents, regardless of experience level, highlighting a broadly shared sense of competence within the ecosystem. However, this high self-assessment contrasts with feedback identifying documentation access and quality as a primary pain point, suggesting that the community's expertise is driven more by direct engagement and experience than by the available learning resources.`,
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
	  `The prioritization of accessibility and enabling use cases as the top item on Cardano's technical roadmap reflects a common theme in the blockchain industry, where the search for practical applications remains central. However, when focusing on specific subgroups, priorities shift significantly. Experienced developers (7+ years) rank higher throughput as their primary concern, likely emphasizing the importance of scaling for real-world applications. Among professionals, cross-chain bridges and interoperability with other ecosystems take precedence, highlighting the growing demand for integration and collaboration between platforms. Meanwhile, zero-knowledge solutions see a noticeable drop in interest among rookies (<1 year of experience), suggesting these concepts are either intimidating or less understood by newcomers. These variations underscore the diverse needs and focus areas within the ecosystem.`
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
          },
	  `Aiken emerges as the dominant choice for writing Plutus script validators and smart contracts, with 79.3% of respondents adopting it, far outpacing alternatives. This trend persists even among developers familiar with Haskell, where Aiken still commands a significant 76.3% share compared to Haskell/Plutus-Tx at 23.6%. Among newcomers (<1 year of experience), Aiken's popularity surges even further to 88.8%, while Haskell drops to just 5.5%, and Plutarch sees no adoption. Interestingly, OpShin also gains traction among this group, rising to 27.7%. These results suggest that Aiken's and OpShin's accessibility and usability resonate across experience levels, positioning them as tools of choice for both seasoned developers and new joiners in the ecosystem.`,
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
          },
	  `The distribution of languages used for off-chain code development aligns closely with the general programming language proficiencies reported by respondents. TypeScript dominates, with 59.6% of respondents selecting it, followed by JavaScript at 37.0%, and Rust at 29.1%. Python (25.1%) and Haskell (15.2%) also feature prominently. These preferences suggest that developers gravitate toward languages they are already skilled in, ensuring familiarity and efficiency in their off-chain development efforts. This pattern is consistent with broader developer trends observed in industry surveys, such as Stack Overflow's, where TypeScript, JavaScript, and Python frequently top the lists of most-used languages.`,
        ),
        question14: question(
          "How satisfied are you with the current state of the smart contract ecosystem?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
	  `Satisfaction with the current state of the smart contract ecosystem shows a positive trend, with a median score of 7, up slightly from 6 in 2023. This improvement suggests growing confidence and maturity within the ecosystem. When segmented by the tools respondents use, the satisfaction distribution remains fairly consistent across most groups, with a median of 7. Notably, developers using OpShin and Plutarch exhibit slightly narrower interquartile ranges, with a Q3 of 7, indicating a somewhat more cautious optimism. Conversely, Aiken, Plu-ts, and Scalus users report a broader satisfaction range, aligning closely with the overall sentiment, reinforcing the ecosystem's adaptability across diverse tools and preferences.`,
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
          },
	  `Decentralized Finance (DeFi) continues to dominate as the most popular category of interest, with 56.7% of respondents working on or expressing interest in this area. This trend holds consistently across all subgroups, underscoring DeFi's central role in the ecosystem. Other prominent categories include Identity and Authentication (39.8%) and Real-World Asset Tokenization (38.5%), reflecting a strong interest in applications that address broader societal challenges. Governance (37.1%) also ranks high, highlighting its importance within the decentralized ethos. Notably, "Wallets" emerged as a recurring mention under the "Other" category, emphasizing their foundational role in enabling diverse DApp interactions.`,
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
          },
	  `The Blockfrost SDK maintains its position as the most widely used library, with 44.7% of respondents integrating it into their projects, reflecting its sustained popularity and reliability. Mesh has shown impressive growth, rising from 21.8% in 2023 to 29.3%, while Lucid has seen a notable decline, dropping from 40.6% to 28.6%. However, the emergence of "Lucid Evolution" (21.6%) and "Blaze" (18.8%) highlights promising new entrants that are rapidly gaining traction in the ecosystem. Conversely, Cardano API has experienced a significant drop from 29.0% in 2023 to 17.4%, suggesting a shift in developer preferences toward newer or more versatile tools. This dynamic landscape underscores the evolving needs and innovations within the Cardano developer community.`,
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
	  `The feedback from the Cardano developer survey highlights a strong desire for enhanced transaction builders across multiple programming languages, aiming to streamline smart contract interactions. This mirrors trends in other blockchain ecosystems, where developers seek robust tools to simplify complex processes.

- **Ethereum Ecosystem**: In the Ethereum community, tools like Hardhat and Truffle have been developed to facilitate smart contract development and testing. These frameworks offer comprehensive environments for compiling, deploying, and testing contracts, addressing the need for streamlined development processes.

- **Solana Ecosystem**: Solana developers utilize the Anchor framework, which provides a Rust-based environment for building and deploying smart contracts. Anchor simplifies the development workflow by offering features like automatic code generation and streamlined testing, catering to the demand for efficient tooling.

- **Polkadot Ecosystem**: For Polkadot, the Substrate framework enables developers to build custom blockchains with pre-built modules, reducing the complexity of blockchain development. Substrate's modular approach allows for flexibility and efficiency, aligning with developers' needs for adaptable and robust tools.

These examples illustrate a common trend across blockchain ecosystems: the development of specialized tools and frameworks to enhance the developer experience by simplifying complex tasks and improving interoperability. Cardano's focus on improving transaction builders and smart contract interactions is consistent with these industry-wide efforts to provide developers with more capable and user-friendly tools.`,
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
          },
	  `The 2024 survey reveals a shift in the usage of services among developers. Ogmios has taken the lead with 43.6%, up from 33.5% in 2023, followed by Kupo at 34.1%, also showing growth from 25.4% last year. In contrast, cardano-db-sync has declined to 31.7% from 37.2%, potentially reflecting a move toward lighter or more versatile tools. Mithril and Oura have also seen increases, with Mithril nearly doubling its adoption (19.8% compared to 9.9% in 2023), suggesting growing interest in its lightweight stake-based cryptographic proofs.

Interestingly, "None directly" ranks high for the "Gaming and Metaverse" subgroup, with 42.8% of respondents selecting it, highlighting a possible gap in specialized tooling for this niche. Dolos, a new entrant, has made a strong debut with 15.0%, indicating rapid adoption. These trends suggest an evolving landscape where developers are increasingly exploring more diverse and tailored solutions for their projects.`,
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
	  `The survey reveals a variety of improvements developers would like to see in Cardano's service ecosystem. Topping the list is a demand for more comprehensive analytics and content delivery APIs (16.0%), such as support for assets metadata, raw transactions, and stake distribution snapshots. Closely following are calls for better transaction handling and construction features (14.8%), an area repeatedly highlighted as a pain point in earlier questions, reinforcing the need for solutions like streamlined UTxO management and higher-level abstractions.

An equal percentage (14.8%) of respondents expressed satisfaction with the current services, suggesting that while many developers see room for improvement, a significant minority finds the existing tools sufficient. Another 14.8% emphasized the need for better documentation and updated examples, echoing ongoing concerns about accessibility and learning resources.

Other notable requests include easier deployment setups (11.1%) and trustless, decentralized data-availability solutions (8.6%), which align with broader blockchain trends, such as the push for zero-knowledge state proofs. Lower priorities include event streaming solutions (7.4%), smaller hardware requirements (4.9%), and advanced testing capabilities (2.4%).

This feedback highlights the need to focus on enhancing transaction management, analytics, and documentation while considering emerging demands for decentralization and developer-centric features like deployment simplicity and testing tools.`,
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
          },
	  `Blockfrost remains the leading hosted service among respondents, with usage increasing from 56.5% in 2023 to 65.6% this year. This growth reflects its reliability and widespread adoption as a cornerstone of many Cardano projects. Demeter.run also shows a slight increase, rising to 29.6% from 27.9%, indicating steady interest in its offerings.

CardanoScan usage has declined from 37.2% to 30.4%, and CF’s Token Registry has dropped significantly from 26% to 13.6%. These shifts may suggest developers are consolidating around fewer tools or prioritizing platforms that offer broader or more specialized functionality.

Koios and Maestro have gained traction, increasing from 18.0% to 24.0% and 11.1% to 15.2%, respectively, highlighting their growing appeal as alternatives for specific use cases. Conversely, NMKR usage has decreased slightly from 9.3% to 7.2%, suggesting a potential narrowing of its user base or relevance.

Notably, 19.2% of respondents reported using no hosted services directly, aligning with observations in other questions, such as the "Gaming and Metaverse" subgroup, where suitable tools might be less readily available. These trends point to an evolving service landscape where established leaders like Blockfrost continue to dominate, while emerging platforms like Koios and Maestro gain traction in specialized niches.`,
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
          },
	  `The preference for JSON over HTTP as the dominant interaction method, chosen by 80.8% of respondents, reflects broader industry trends favoring simplicity and ubiquity in API communication. Its lightweight nature and ease of implementation make it a go-to choice, both within and outside the blockchain ecosystem.

Other popular methods include JSON over WebSocket (42.4%) and gRPC / Protocol Buffers (35.2%), which cater to scenarios requiring real-time communication or higher performance. Interestingly, GraphQL, a rising star in other domains, was preferred by only 18.4%, possibly due to lower adoption in blockchain-related tooling or specific ecosystem needs.

The minimal uptake of protocols like MQTT (6.4%) and Thrift (0.8%) suggests these are niche or less relevant in Cardano’s development landscape. Bespoke protocols (2.4%) remain uncommon, indicating developers prefer standard and well-supported methods.

As this is a new question in 2024, tracking these preferences in future surveys will be critical to understanding shifts in developer practices and how emerging technologies influence interaction patterns.`,
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
          },
	  `The cardano-cli remains the most widely used command-line tool, with 60.8% of respondents relying on it, though its usage has declined from 73.1% in 2023. This reflects its continued importance as a versatile tool while suggesting that developers are diversifying their toolset. Aiken shows significant growth, increasing from 38.1% to 52.8%, underscoring its rapid adoption as a favored tool for Plutus development.

Other tools like bech32 and cardano-addresses saw more modest declines in usage, from 22.5% to 29.6% and 30.0% to 21.6%, respectively, suggesting these utilities are now more niche or being replaced by newer alternatives. Helios has grown slightly, from 1.2% to 5.6%, reflecting its gradual recognition in the ecosystem.

Interestingly, None directly ranks at 14.4%, hinting at the presence of developers who either rely on higher-level abstractions, hosted services, or are focused on non-CLI-based workflows. Tools like cncli and yaci’s devkit, while not dominant, indicate specialized usage within certain developer groups.

The rise of Aiken and the steady adoption of tools like yaci’s devkit suggest an ecosystem shifting toward more specialized and user-friendly command-line tools while maintaining the flexibility of foundational utilities like cardano-cli. This evolution reflects a maturing developer community with varied needs.`,
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
	  `The results indicate general satisfaction with current CLI tools, though key gaps remain. Developers prioritize simpler ways to manage private node clusters, manipulate CBOR, and build transactions tailored to popular dApps. Requests for lighter data access tools and improved wallet management reflect ongoing needs for streamlined workflows, while smaller niches highlight accessibility concerns for non-Unix users and visualization tools.`,
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
          },
	  `Public cloud providers dominate as the preferred infrastructure for deploying DApps, reflecting a trend toward scalability and accessibility. Private clouds and third-party services follow, appealing to developers prioritizing control or specialized tools. The adoption of decentralized cloud (29.0%) highlights growing interest in aligning deployment methods with blockchain principles, though it remains less common. Hybrid cloud's lower usage suggests developers tend to lean toward either public or private solutions rather than combining the two. These preferences highlight diverse deployment strategies influenced by scalability, control, and decentralization priorities.`,
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
          },
	  `Docker remains the dominant preference for consuming software, increasing significantly from 46.2% in 2023 to 58.9% this year, indicating a strong trend toward containerized solutions. Language package managers and OS package managers also rank highly, reflecting developers' need for easy integration and dependency management. The decline of Nix (from 25.9% to 18.8%) suggests a shift toward more mainstream solutions, while the growing popularity of static executables highlights demand for lightweight, portable options. Overall, the ecosystem shows a clear move toward simplicity and standardization in software consumption workflows.`,
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
	  `Aiken has surged as the most frequently cited asset of Cardano's developer ecosystem, rising significantly from 12.7% in 2023 to 22.0%, reflecting its growing influence and adoption. The community remains highly valued, with "a high concentration of talented developers" (19.0%) and "its people & resilient community" (10.0%) together highlighting the ecosystem's collective expertise and support.

The emphasis on "rigorous foundations and focus on correctness" (15.0%) and diverse tools/libraries (15.0%) underscores the ecosystem's technical robustness and versatility. However, mentions of community-driven education materials, while still appreciated (6.0%), have declined, possibly due to a growing reliance on emerging tools like Aiken to drive ecosystem innovation.

The shift in focus from community-first to tool- and foundation-driven strengths reflects a maturing ecosystem that increasingly values its technical assets and developer-centric advancements.`,
        ),
        question27: question(
	  "What do you think is the biggest pain point of Cardano's developer ecosystem?",
          { options:
	    [ [ [ "Documentation, broken down into different areas:"
	        , "&nbsp;&nbsp; <code>30.0%</code> → lack of documentation on specific topics (e.g. eUTxO design patterns, economics, hard fork changes, ...);"
	        , "&nbsp;&nbsp; <code>23.3%</code> → general/unspecified discontent;"
	        , "&nbsp;&nbsp; <code>13.3%</code> → outdated and/or fragmented documentation;"
	        , "&nbsp;&nbsp; <code>13.3%</code> → lack of (non-trivial) examples / in-depth explainers;"
	        , "&nbsp;&nbsp; <code>10.0%</code> → lack of variety in education materials (mostly text, little video or audio);"
	        , "&nbsp;&nbsp; <code>10.0%</code> → lack of entry-level documentation;"
	        ].join("<br/>")
	      , 30
	      , null
	      ]
	    , [ "Overall developer experience around transaction building and submission.", 16, null ]
	    , [ "Haskell/Nix, especially around tooling and setup.", 12, null ]
	    , [ "The fragility and immaturity of the ecosystem tooling, in particular for off-chain development.", 12, null ]
	    , [ "Sustaining the developer ecosystem, in particular open source projects.", 9, null ]
	    , [ "Wrong focus of efforts which hinders the overall developer experience.", 9, null ]
	    , [ "Tough onboarding for new developers.", 6, null ]
	    , [ "Lack of robus Oracle solutions.", 2, null ]
	    ]
          , link: `${repository}/2024/data/open-questions/what-do-you-think-is-the-biggest-pain-point-of-cardano-s-developer-ecosystem.md`
          },
	  `Documentation remains the most significant pain point, with 31.2% of respondents identifying issues such as gaps in coverage, outdated content, and a lack of practical examples. This has increased notably from 18.5% in 2023, highlighting persistent challenges despite ongoing efforts. Additionally, the developer experience around transaction building and submission (16.6%) continues to be a major hurdle, aligning with earlier feedback about tooling and transaction workflows.

Haskell and Nix maintain their position as notable sources of friction (12.5%), reflecting ongoing complexity in setup and tooling. Similarly, the immaturity of ecosystem tooling, especially for off-chain development (12.5%), underscores the need for more robust solutions. Sustaining open-source projects (9.3%) and improving onboarding for new developers (6.2%) are recurring themes, pointing to challenges in ecosystem growth and accessibility.

This year's feedback emphasizes foundational issues—documentation, tooling, and developer support—as critical areas for improvement, signaling a need for strategic focus to enhance the ecosystem's usability and appeal.`,
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
          },
	  `The data shows a steady engagement with Cardano Improvement Proposals (CIPs). A majority (76.9%) have read and used a CIP, up slightly from 75.0% in 2023, reflecting sustained interest and familiarity among developers. Participation in CIP discussions has increased to 35.3%, and authorship has grown to 22.1%, both indicating a more active role in shaping the ecosystem.

Notably, the percentage of respondents unfamiliar with CIPs has slightly decreased, from 9.2% in 2023 to 7.9%, suggesting improved awareness. However, the "No statements apply" group at 8.8% highlights a minority still disengaged, possibly indicating a gap in outreach or relevance for some developers.

These trends suggest a positive trajectory in CIP involvement, with growing participation in discussions and authorship driving deeper engagement within the developer community.`,
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
          },
	  `Discord servers, used by 81.4% of respondents (up from 68.2% in 2023), have solidified their role as the primary hub for technical help in the Cardano ecosystem. Its real-time, collaborative nature makes it a go-to platform for immediate support. GitHub discussions and friends/colleagues remain strong secondary options, reflecting the collaborative nature of the ecosystem.

Other platforms like Cardano StackExchange (21.2%, down from 27.1%) and the Cardano forum (18.5%, down from 23.8%) have seen declines, suggesting a shift toward faster, real-time platforms. Twitter/X usage has increased (23.0% from 15.2%), indicating its growing relevance for quick updates and interactions.

The preference for Discord highlights a trend toward real-time communication, while declines in traditional forums suggest a need to modernize slower, asynchronous platforms to remain competitive. However, its ephemeral nature and poor searchability pose a significant challenge, as valuable insights shared on Discord often vanish in the flow of conversations. This transient quality may contribute to the broader issue of inadequate documentation, highlighted as a major pain point in the ecosystem. Developers relying heavily on Discord could benefit from efforts to capture and structure this knowledge in more permanent, searchable formats, such as enhanced documentation or community-maintained repositories.`,
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
          },
	  `The 2024 survey reveals shifting trends in how developers access technical details about Cardano. Discord servers (69.0%) and source code (66.3%) have become the most relied-upon resources, reflecting a notable increase in reliance on these sources since 2023 (45.6% and 54.9%, respectively). The high dependence on source code highlights its role as the most reliable and detailed information source, likely compensating for persistent issues with fragmented or incomplete documentation. Similarly, Discord's popularity underscores its immediacy but raises concerns about its ephemeral and unstructured nature, which complicates long-term knowledge sharing.

Surprisingly, scientific papers and specifications (24.7%) have seen reduced reliance despite the community’s emphasis on rigor and correctness. This shift suggests a growing preference for practical, accessible resources over theoretical foundations. Meanwhile, official resources like Cardano docs (41.5%) and the developer portal (37.1%) have seen reduced usage compared to 2023, indicating possible dissatisfaction with their depth or organization.

This increased reliance on ephemeral and ad-hoc sources like Discord and code repositories highlights the need for improving and centralizing official documentation to better support both current and future developers.`,
        ),
        question31: question(
          "On average, how satisfied are you with the technical answers/details you find in documentation and within the community?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
	  `The overall satisfaction with the technical answers and details in documentation and the community remains moderate, with a median of 6, consistent with 2023. Notably, satisfaction increases to 6.5 among those relying on scientific papers, and to 7 for those using YouTube and Twitter/X, suggesting that developers seeking more accessible or engaging formats may find them more effective.

Experienced developers (7+ years in blockchain) also report higher satisfaction (median of 7), which may reflect their ability to navigate and synthesize disparate information sources effectively. However, the unchanged median overall highlights persistent gaps in documentation and community resources, especially for less experienced or less technical users, emphasizing the need for clearer and more comprehensive support.`,
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
          },
	  `The overwhelming preference for English (99.0% of respondents, 74.8% of answers) as the primary language for consuming documentation and educational content reflects the dominant role of English in technical resources globally. However, the survey's English-only format likely skews these results, underrepresenting the demand for content in other languages.

Smaller preferences for Spanish (7.2%), German (4.5%), and French, Italian, and Polish (each 3.6%) suggest localized demand for multilingual resources. Expanding high-quality documentation and educational materials in these languages could improve accessibility for non-English-speaking developers and foster broader global participation in the ecosystem.`,
        ),
        question33: question(
	  "Did you attend the Cardano Buidler Fest in April 2024?",
          {},
	  `The survey reveals that 12.3% of respondents attended the Cardano Buidler Fest in April 2024, aligning with the event's attendance of around 100 participants. This represents roughly 25% of Buidler Fest attendees participating in the survey, providing a small but potentially significant subset for insights into the event's impact. While the sample size is limited, this overlap offers valuable feedback from a group actively engaged in the ecosystem, helping identify areas for improvement and gauge the event's influence on developer sentiment.`,
        ),
        question34: question(
          "How satisfied were you with the Cardano Buidler Fest?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
	  `The satisfaction levels for the Cardano Buidler Fest are exceptionally high, with a median score of 9 and an interquartile range between 9 and 10. This indicates overwhelmingly positive feedback from attendees, suggesting that the event successfully met or exceeded expectations. Despite the small sample size, this level of satisfaction reflects the event’s strong impact on the engaged participants, reinforcing its value within the Cardano developer ecosystem.`,
        ),
        question35: question(
          "Do you have any ideas on how to improve the next potential Cardano Buidler Fest?",
          { options:
	    [ [ "None, don't change anything.", 10, null ]
	    , [ "More time and/or shared space without anything planned but developers living the moment.", 6, null ]
	    ]
          , link: `${repository}/2024/data/open-questions/do-you-have-any-ideas-on-how-to-improve-the-next-potential-cardano-buidler-fest.md`
          },
	  `The inaugural Cardano Buidler Fest, held in April 2024, garnered positive feedback from attendees. Participants appreciated the event's technical focus and the opportunity for in-depth discussions. Suggestions for future improvements include allocating more unstructured time and shared spaces to foster spontaneous interactions among developers. These insights align with the [event's retrospective](https://buidl.2024.cardano.org/posts/2024-04-26-it-s-over/), which highlighted the value of impromptu conversations and the unique atmosphere of the Open Space format. `,
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
