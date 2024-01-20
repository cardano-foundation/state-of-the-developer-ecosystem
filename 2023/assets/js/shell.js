fetch("/state-of-the-developer-ecosystem/2023/data/answers.json").then(res => res.json()).then(data => {
  const repository = "https://github.com/cardano-foundation/state-of-the-developer-ecosystem/blob/main"
  const node = document.createElement("div");
  document.querySelector('body').appendChild(node);
  Elm.Main.init({
    node,
    flags: {
      title: "State of the Cardano Developer Ecosystem - 2023",
      introduction: "Like the inaugural 2022 survey, this year’s edition gauged the state of the Cardano developer ecosystem, this time presenting respondents with 30 questions. While a total of 174 replies were received, some questions obtained fewer replies than others.<br/><br/>This survey reinforces the Cardano Foundation’s commitment to both empower the Cardano community and support open source initiatives within the ecosystem. As such, the report, as well as the code for rendering it, are <a href='https://github.com/cardano-foundation/state-of-the-developer-ecosystem'>open source <svg class='icon' style='top: 2px; position: relative;'><use xlink:href='#icon-github'/></svg></a> and we eagerly encourage community members to perform supplementary analysis and derive further conclusions from the results. For example, users might want additional filters to complement those already included in the report. In order to help foster debates, [a GitHub discussion board](https://github.com/cardano-foundation/state-of-the-developer-ecosystem/discussions/) has also been created.<br/><br/>Moving forward, we will continue to conduct annual surveys in order to better evaluate what has been accomplished, which steps led to advantageous results, what these results were, and which aspects still require attention. The Cardano Foundation <u>thanks all those who took the time to answer the 2023 survey</u> and hopes to garner even more participation for the forthcoming third edition.",
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
`The composition of the developer panel skews noticeably towards the experienced end of the spectrum, with minimal representation from those in the earliest stages of their career. This trend suggests the industry might present a significant learning curve and barriers to entry that challenge beginners.

The notable absence of professionals with less than a year of experience, coupled with a strong presence of veterans with upwards of a decade in the field, raises questions about accessibility for newcomers. It highlights the need for mechanisms within the sector that can help bridge this gap, easing novices' entry through mentorship, education, and practical support. This point is later reinforced by answers to other questions.`
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
`The experience within the panel regarding functional programming presents a more evenly distributed picture, a departure from the previous observation of a largely senior-dominated landscape. Despite the strong presence of Haskell, known for its steep learning curve, the overwhelming number of participants with zero to three-years experience using a functional programming stack suggests that the ecosystem does not discourage non-functional programming (FP) enthusiasts, truly a heartening result.

Furthermore, the panel seems to house a higher concentration of functional programmers compared to other more typical developer ecosystems. FP developers are usually a rarity, often comprising around just 5% of the environment. Overall, the data points to a welcoming space for functional programming, inviting diverse experience levels and accommodating both dedicated practitioners and those just beginning to explore its potential.`
        ),
        question3: question(
          "How would you rate your sentiment towards functional programming?",
          { minimum: "Dreaded", maximum: "Loved" },
`The panel's sentiment towards functional programming trends positively, with an average rating of 7.4 out of 10. This favourable outlook is bolstered by a significant segment awarding it a perfect score. Notably, a correlation between experience and sentiment is apparent; the more seasoned the developer, the more likely they are to express a higher regard for functional programming.

This trend should not come as a surprise—it is reasonable to deduce that those who continue in the field correspond to the ones who find the most satisfaction and success in it, leading to a classic example of survivor bias. Nonetheless, it remains encouraging to see the positive reception among those who have delved deep into functional programming, affirming its value and appeal to practitioners who truly grasp its nuances through experience. This positive correlation suggests a rewarding journey for those willing to invest time in mastering functional programming, promising an appreciation that seems to deepen with time and expertise.`
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
`The results indicate that the Cardano developer community remains a mix of hobbyists and professionals, although there is a noticeable trend of hobbyists either transitioning to professional roles or departing from the ecosystem. Compared to 2022, the proportion of hobbyists has almost halved, suggesting that the environment is perhaps becoming more professional or that the platform's evolving scope and complexity play a role in influencing this shift.

Nevertheless, the persistence of a hobbyist segment highlights Cardano's ongoing appeal to a diverse range of enthusiasts, not just career-focused individuals. This trend could reflect the ecosystem's growing maturity and the increasing opportunities for professional development within Cardano.`
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
`Unsurprisingly, English remains the predominant language among the panel, consistent with its global status as the lingua franca of the tech industry. The preference for English, followed by Spanish, French, and German — mirroring last year's top four — underscores the influence of these languages in the professional and hobbyist communities surrounding software development and functional programming.

However, the high percentage of respondents who only speak English, approximately 80%, provides an interesting point to consider. This could perhaps be partly due to a selection bias as the survey was conducted in English, thus potentially limiting the diversity of respondents based on language fluency. This factor warrants consideration when interpreting the data, as it suggests that there might exist non-English-speaking communities with an interest in these areas that the survey did not reach. Understanding this limitation is crucial for future surveys or community outreach efforts, indicating a possible need for a more inclusive approach that encompasses multiple languages to capture a truly global perspective.`
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
`The panel features a diverse range of professions, though software engineers make up the largest group, encompassing 40% of the respondents. An unsurprising result given the technical nature of the topics at hand often directly relevant to software engineering.

What proves particularly striking is the significant presence of founders, co-founders, and executive officers, suggesting a vibrant startup culture within the Cardano developer community. This could indicate that the ecosystem attracts not just those who implement and manage technology, but also those looking to pioneer new ideas and drive technological innovation forward from a leadership perspective.

The substantial representation of this demographic might hint at a broader trend of entrepreneurial activity, perhaps fueled by the emerging opportunities in the fields related to functional programming and blockchain technology, where individuals are motivated to carve out their own path and shape the future of the industry.`
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
`The preferences for development environments among the panel members show a clear favouritism towards Visual Studio Code and Vim/NeoVim, standing out as the preferred editors across the board irrespective of programming language.

However, it is interesting to note that IntelliJ garners particular preference among those who primarily work with Java and C++, pointing to the environment's specific strengths or features that resonate with developers in these languages.

These insights not only reveal the most popular tools but also suggest that when it comes to development environments, one size does not fit all; specific languages might benefit from environments tailored to their unique demands.`
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
`The programming language proficiency among the panel mirrors trends observed in broader developer ecosystems, such as those documented in StackOverflow surveys, with JavaScript, TypeScript, and Python leading the pack. This prevalence aligns with the global demand and applicability of these languages in various domains.

However, the Cardano ecosystem shows, unsurprisingly, a distinctive spike in the number of developers proficient in Haskell and Rust, diverging from more typical developer environments. Remarkably, despite its novelty, over 20% of respondents claim proficiency in Aiken—a language that had not even marked its first anniversary at the survey's time. This could signal a strong enthusiasm for adopting new tech, the ease of learning Aiken, or perhaps a blend of both elements.

Additionally, the results showcase a noteworthy statistic within the subset of Plutus Pioneers: over 55% report proficiency in Haskell, almost double the rate reported by the panel at large. This suggests that the Plutus Pioneer Program is particularly effective in building Haskell knowledge, highlighting the program's role in skill development and capacity building within the Cardano community.`
        ),
        question9: question(
          "How would you rate your technical understanding of Cardano?",
          { minimum: "Rookie", maximum: "Expert" },
`The self-assessed technical understanding of Cardano among respondents is notably high, with an average score of 7.2 out of 10. This indicates a confident level of familiarity with Cardano's intricacies, reflecting perhaps the effectiveness of educational resources or the comprehensive nature of community-driven knowledge sharing.

Moreover, results show a marked progression in this metric, with the mean score climbing by 0.7 points compared to the previous year. This uptick provides a positive signal, denoting a collective deepening of knowledge and possibly the increased accessibility of information or enhanced learning avenues over time.

An interesting pattern emerges when the data is dissected by specific segments: both Plutus Pioneers and those proficient in Haskell report an even higher average understanding, registering at 8.1 out of 10. This strong correlation suggests that familiarity with Haskell, or experience going through the Plutus Pioneer Program, equips individuals with a deeper comprehension of Cardano.`
        ),
        question10: question(
          "Are you a certified Plutus Pioneer?",
          {},
`The survey results indicate a nearly identical distribution to 2022 concerning certified Plutus Pioneers:

- As seen from answers to previous questions, participating in the PPP enhances participants' overall technical understanding of the Cardano ecosystem. This could mean that the program offers valuable insights and education about Cardano.
- At the same time, a considerable number of respondents are not Plutus Pioneers, which suggests that, while the Plutus Pioneer Program (PPP) has proven benefits, it is not seen as a prerequisite for developing on Cardano.

These points suggest that the PPP maintains its relevance and offers clear benefits, but the community does not view it as the only path to proficiency in Cardano development.`
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
`The landscape of developers' preferences in the Cardano ecosystem is evolving rapidly, particularly in the tools used for crafting smart contracts. Aiken, a newcomer, has made a remarkable entrance, garnering attention and use from developers across various experience levels. Its broad appeal underscores its emerging importance and sets the stage for whether it will sustain this positive impression in the times ahead.

Meanwhile, Plutarch appears to find its niche among more seasoned developers, suggesting its appeal might be rooted in advanced features or complexities that cater more effectively to those with extensive backgrounds. This dynamic illustrates a vibrant and responsive ecosystem, with innovative tools emerging and developers open to adapting their preferences and workflows—each trend influenced by ongoing advancements in platform capabilities, user guidance, and overall usability.`
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
`The choices developers make for writing off-chain code in the Cardano ecosystem seem to mirror their language proficiencies. JavaScript and TypeScript, widely popular in the broader developer community, stand out as the primary languages. This trend likely owes itself to the wealth of development resources available for these languages, making them accessible and practical options.

Notably, there is a discernible and rather unsurprising pattern relating the choice of on-chain and off-chain languages. For instance, those who lean towards Haskell or PlutusTx for on-chain development also show a preference for using Haskell for their off-chain code, demonstrating a consistency in their development stack. Similarly, Aiken users exhibit a tendency for Rust in off-chain scenarios, while OpShin's adherents gravitate towards Python.`
        ),
        question13: question(
          "How satisfied are you with the current state of the smart contract ecosystem?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
`The current sentiment within the developer community towards the Cardano smart contract ecosystem registers a middling average satisfaction score of 5.4 out of 10. This sense of moderate contentment, or perhaps tentative optimism, is uniform across various degrees of developer experience, suggesting that the ecosystem's offerings have yet to fully meet the expectations or desires universally.

However, this landscape of satisfaction, or the lack thereof, might be on the cusp of evolution. The emergence and potential adoption of alternative solutions such as Aiken, Helios, Plu-ts, or OpShin, coupled with the fresh introduction of Marlowe now available on Mainnet, could herald significant changes. These innovations might address prevailing concerns or limitations, bringing new capabilities, efficiencies, or simplicities that could enhance developer satisfaction. Hence, it's a dynamic scenario, and the community's pulse on this matter is poised for interesting shifts in the near future.`
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
`The anticipation within the Cardano community is palpable, especially concerning the forthcoming Plutus V3, which is expected to bring groundbreaking advancements in zero-knowledge cryptography for Cardano. This feature tops the list of most-awaited developments, underscoring the community's keen interest in more sophisticated and privacy-preserving cryptographic techniques.

In parallel, there's a significant eagerness surrounding the maturation of new smart contract technologies like Aiken and Helios. Developers are not just looking for innovations; they're looking for these platforms to evolve into stable, robust solutions that they can rely on for building advanced applications.

While technical advancements are a priority, there's an unmistakable call for enhanced educational resources, simplified onboarding processes, and improved tooling. These necessities, although not at the forefront, are crucial for expanding the developer base and making the ecosystem more accessible and navigable, especially for newcomers.

A specific area that respondents highlighted was the need for established design patterns and best practices tailored to the EUTxO model, specific to Cardano's design, differentiating it from development on the Ethereum Virtual Machine (EVM). Developers are seeking guidance on effectively navigating this distinct environment, emphasising the need for resources that go beyond basic instructions and delve into strategic development approaches within an EUTxO architecture.`
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
`The survey reveals enduring popularity and trust among developers Blockfrost SDKs retaining the top spot as a favoured resource for two consecutive years, seeing usage in over 40% of projects. This enduring preference highlights the developer community's appreciation for Blockfrost's services, likely due to its reliability, ease of use, or comprehensive features.

In the same vein, the cardano-serialization-lib and cardano-multiplatform-lib continue to be fundamental within the ecosystem, each integral to around 30% of projects.
Notably, there's been a significant uptick in the adoption of Lucid and Pallas, each experiencing a fourfold increase since the last survey to 40% and 15%, respectively. This surge might be attributed to enhanced features, improved developer experience and positive community feedback, fueling their rapid embrace. Conversely, there seems to be a gradual shift away from cardano-api, suggesting that developers might be finding more value or compatibility in alternative tools.

An interesting development is the swift rise of Mesh.js, which, despite being a newer contender, has been adopted by 22% of the panel. Its rapid integration into the developer toolkit suggests that it meets a pressing need or offers unique advantages that have been well-received by the community.`
        ),
        question16: question(
          "How satisfied are you with the current state of the Cardano libraries listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
`The average satisfaction score of 6 out of 10 for Cardano libraries signals room for improvement across the developer community. This relatively low rating underscores the ecosystem's nascent stage, still exploring its full potential. The community clearly anticipates further enhancements as the libraries mature, seeking increased stability and a broader range of capabilities in the future. This sentiment serves as a reminder of the continuous evolution required in the space and the opportunities it presents for contributors to shape a more robust development environment.`
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
`Cardano-db-sync leads as the most utilised service in the ecosystem, closely followed by Ogmios, essential for bridging non-Haskell applications with the node. Apart from Ogmios, all top services function as 'chain-indexers,' each offering unique trade-offs while addressing similar challenges within the ecosystem.

Besides, there's a notable curiosity and forward-thinking spirit among developers, highlighted by the 10% engagement with Hydra and Mithril. These services are still in the exploratory phases, yet their traction testifies developers' willingness to innovate and trial avant-garde solutions.

Conversely, cardano-rosetta's usage has dwindled to 1.6% from 10% in the previous year, possibly due to Coinbase's shift away from the original Rosetta specification for their newer ‘Coinbase Cloud’ solution.

Additionally, community-driven services play a significant role, indicating a healthy, decentralised ecosystem development beyond foundational entities. This diversity not only enhances the network's robustness but also encourages a participatory culture in building Cardano's infrastructure.`
        ),
        question18: question(
          "How satisfied are you with the current state of the Cardano services listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
`The Cardano services currently receive a lukewarm reception, with an average satisfaction score of 6.0 out of 10. Most respondents' scores cluster within the 5 to 7 range, signalling an attitude of acceptance rather than enthusiasm. This middling response suggests that while the existing services meet developers' needs in a fundamental sense, there's a palpable desire for enhancements and refinements. The collective sentiment can be distilled to an acknowledgment that the services are functional but have considerable room for improvement.`
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
`Blockfrost emerges as a predominant choice among developers, with over half of them relying on its capabilities, affirming its strong presence noted already in previous responses. Following Blockfrost, CardanoScan and CExplorer, both serving as blockchain explorers, occupy the second and third spots, respectively. These platforms are integral for developers needing both a user interface and an API for common data interaction.

Noteworthy are Demeter.run and Maestro, newer entrants to the Cardano ecosystem, yet they've quickly carved out their space. Their rapid adoption indicates a vibrant, evolving community eager to embrace and support fresh, beneficial technologies that enhance their project execution.`
        ),
        question20: question(
          "How satisfied are you with the current state of the Cardano hosted services/platforms listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
`Satisfaction with Cardano's hosted services/platforms is noticeably higher, averaging 6.6 out of 10, outpacing the contentment levels for libraries and self-hosted services. This score suggests that these platforms offer significant user experience benefits. However, a disparity is evident between newer entrants and seasoned participants, with juniors rating their satisfaction at 5.7 compared to the seniors' 7.0. This gap implies that while experienced developers find considerable value, the onboarding process for these services may present hurdles for beginners, indicating an area for potential improvement in making these tools more accessible to newcomers.`
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
`The cardano-cli tool is the standout in command-line utilities, used by an overwhelming 73.1% of participants, emphasising its role as an essential multi-tool for developers within the Cardano ecosystem. Meanwhile, the Aiken command line, a newcomer in the space, has gained significant traction. It's particularly noted for its utility in handling low-level smart contract functionalities and serving as the platform for the Aiken compiler, marking its strong entrance and immediate impact in the community.`
        ),
        question22: question(
          "How satisfied are you with the current state of the Cardano command-line tools listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
`Command-line tools in the Cardano ecosystem receive a fairly positive reception, with an average satisfaction score of 6.5/10. However, like for hosted services, a notable disparity is apparent between junior developers (5.3/10) and their more experienced counterparts (6.8/10). This gap hints at a significant entry barrier for novices, indicating that these tools, while valued, might be more accessible or developer-friendly for seasoned professionals.`
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
`Docker, commanding a 46% preference, leads as the top deployment mechanism among Cardano developers, highlighting the popularity of container-based solutions, further evidenced by Kubernetes' notable 21% usage. The significant reliance on Nix/NixOS, at nearly 26%, isn't surprising given Cardano's leanings towards functional programming and Haskell. This preference also underscores the necessity for robust tools capable of managing the intricate build orchestration inherent in the Cardano ecosystem.`
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
`The preference for consuming software via language or OS package managers, despite a strong inclination for container-based solutions like Docker for deployment, is quite telling. This discrepancy suggests a potential gap in the Cardano ecosystem's packaging options, indicating that developers might appreciate more Cardano components being accessible through these preferred channels. Additionally, the significant proportion of developers favouring source code compilation—despite its notorious complexity—points to a desire for control or trust in the build process, which is an interesting insight into the community's mindset.`
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
`The Cardano developer ecosystem's greatest asset is its vibrant and supportive community, celebrated for its expertise and mutual assistance. Specific individuals and companies within the community are recognized as pivotal contributors, enhancing the ecosystem's strength and cohesion.

Additionally, the ecosystem's wealth of robust, community-maintained open-source tools is a significant boon, with Aiken receiving particular emphasis for its impact, alongside notable mentions of Helios, Lucid, and Jambhala.

Finally, Cardano's commitment to a solid, evidence-based scientific approach and its reliance on functional programming principles and the EUTxO model continue to be highly regarded, underlining the community's appreciation for the project's rigorous foundations.`
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
`The most prominent pain point in Cardano's developer ecosystem is the scattered and sometimes hard-to-find documentation, particularly for newcomers seeking entry-level guidance. There's a strong sentiment about the need for better-organised, more accessible, and distinguishable quality resources.

The heavy reliance on Haskell is seen as a double-edged sword; while it underpins the network's robustness, it also poses a steep learning curve and potentially slows broader adoption due to its niche status. This perception extends to the use of Nix, adding another layer of complexity for those unfamiliar with these technologies.

Inconsistencies across development libraries and APIs create an additional challenge, particularly for new developers trying to piece together their learning and projects. The lack of uniformity in terminology and processes can be a barrier to seamless integration and efficient learning.

Furthermore, there are concerns about obtaining consistent funding and financial support, particularly during bear markets, impacting ongoing development and sustainability of projects.

Infrastructure complexities, the unique aspects of working with the EUTxO model, and concerns related to network throughput also add to the challenges faced by developers in the ecosystem.`
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
`The awareness and engagement regarding Cardano Improvement Proposals (CIPs) have shown a significant positive trend. Notably fewer participants are unaware of CIPs, pointing to improved communication and perhaps broader community involvement.

There's an uptick in active engagement, with more individuals reading, utilising, contributing to discussions, and even authoring CIPs. This active participation is crucial as it indicates a growing sense of ownership and influence among community members in shaping Cardano's trajectory.

Continuing to monitor this trend will be vital, as sustained engagement with the CIP process will signal a healthy, collaborative, and inclusive ecosystem evolution.`
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
`The data indicates a preference among developers for real-time, interactive platforms, with Discord servers emerging as the top choice for technical discussions. This preference underscores the value of immediate feedback and a communal problem-solving atmosphere. GitHub remains a crucial resource, aligning with its role as a primary repository for code and a space for detailed technical inquiries and contributions.

Personal networks, including friends, colleagues, and community members, rank significantly, highlighting the importance of interpersonal relationships and peer support in navigating technical challenges.

Traditional forums and Q&A platforms like StackExchange or the Cardano forum have seen less traction, possibly due to their less immediate nature of communication. Social media platforms, while important for broader community engagement and updates, are not the preferred avenues for deep technical discourse, likely due to their format limitations.

Overall, the trend emphasises the desire for collaborative, immediate, and interactive problem-solving methods in the developer community.`
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
`The insights from this data indicate a community that heavily relies on primary sources, like source code, to understand the technical workings of Cardano. This reflects a demographic that values precise, first-hand information that's free from interpretation or potential inaccuracies. This is a common approach in developer communities, particularly in blockchain and other open-source ecosystems, where the codebase is readily available for scrutiny.

The strong reliance on the official documentation sites (docs.cardano.org and developers.cardano.org) underscores the need for authoritative content that is easily accessible and comprehensible.

The lower reliance on scientific papers may indicate the dense, often less accessible nature of these materials, especially for developers who are looking for practical, actionable information. However, the fact that they are consulted before social media points to a preference for high-quality information sources over more informal channels, which might be prone to misinformation and speculation.

Friends and colleagues ranking above scientific papers, and relatively high overall, suggests the importance of community knowledge sharing and mentorship, reinforcing the idea that the Cardano community is not just technically driven but also socially interconnected.

The lower ranks of social media platforms, including Twitter and Telegram groups, for technical learning, emphasise that while these platforms are good for news and general community interaction, they are less relied upon for in-depth technical understanding.

Overall, the data once again suggests a community that leans heavily on direct, official sources and personal networks for their learning, demonstrating both a commitment to precision and the value of communal knowledge sharing.`
        ),
        question30: question(
          "On average, how satisfied are you with the technical answers/details you find in documentation and within the community?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
`This data reveals a dichotomy in the Cardano developer community's experience. The satisfaction rate below 6 suggests that the existing technical documentation may not be meeting the community's needs in terms of clarity, completeness, accessibility, or up-to-date information. This can be a significant hurdle, especially for new developers entering the ecosystem, and can slow down development processes even for more experienced individuals.

However, the earlier data indicating that community members consider themselves quite knowledgeable about Cardano (as per question 9) paints a picture of a resilient and resourceful community. This suggests a willingness among community members to dive into source code, engage in forums, or rely on personal networks to fill in the gaps left by official documentation. Such behaviour is common in open-source ecosystems, where learning often happens through active participation and direct engagement with the codebase.

Moreover, this scenario underscores the vital role played by the community, where peer support and knowledge sharing significantly contribute to individual learning and problem-solving. It also highlights an opportunity for improvement in the ecosystem's official channels. By enhancing the quality, breadth, and depth of official documentation, the overseeing entities can better support the community's needs, potentially accelerating innovation and adoption within the Cardano ecosystem.

In summary, the community's resilience is a strong asset, but there's a clear call to action here for improving official resources and documentation to better support developers' needs and foster the ecosystem's growth.`
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
