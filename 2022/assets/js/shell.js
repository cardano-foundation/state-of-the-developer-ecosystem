fetch("/state-of-the-developer-ecosystem/2022/data/answers.json").then(res => res.json()).then(data => {
  const repository = "https://github.com/cardano-foundation/state-of-the-developer-ecosystem/blob/main"
  const node = document.createElement("div");
  document.querySelector('body').appendChild(node);
  Elm.Main.init({
    node,
    flags: {
      title: "State of the Cardano Developer Ecosystem - 2022",
      introduction: "For the first time ever, an annual survey to assess the state of the Cardano developer ecosystem was conducted. It consisted of 31 questions. While a total of 389 replies were received, some questions obtained fewer responses than others.<br/><br/>The Cardano Foundation invites anyone interested in performing supplementary analysis of the results to do so. This survey comes as part of our commitment to both empower the Cardano community and foster the open source maturity of the Cardano ecosystem. Consequently, the report, as well as the code for rendering it, are <a href='https://github.com/cardano-foundation/state-of-the-developer-ecosystem'>open source <svg class='icon' style='top: 2px; position: relative;'><use xlink:href='#icon-github'/></svg></a> and we heartly welcome contributions from the community. For instance, the community might want to add more filters to the ones already included in the report. A [Github discussion board](https://github.com/cardano-foundation/state-of-the-developer-ecosystem/discussions/) has been created to encourage the debate.<br/><br/>Going forward, [we expect to conduct annual surveys](https://cardanofoundation.org/en/news/state-of-the-cardano-developer-ecosystem-a-survey-to-equip-the-community/) in order to better evaluate what has been accomplished, which steps led to advantageous results, what these were, and which aspects still require attention.<br/><br/> The Cardano Foundation <u>thanks all those who took the time to answer this year’s survey</u> and hopes to also count with their participation for the forthcoming second edition.",
      questions: {
        question1: question(
          "Which language(s) are you fluent in?",
          { options:
            [ "English"
            , "Spanish"
            , "German"
            , "Italian"
            , "Japanese"
            , "French"
            , "Hindi"
            , "Dutch"
            , "Polish"
            , "Indonesian"
            , "Russian"
            , "Portuguese"
            , "Ukrainian"
            ]
          , sortDesc: true
          },
          "As usual in these cases, English stands as the language most participants are fluent in (326 replies). This, however, does not signal nationality nor does it mean English is the mother tongue for the vast majority of respondents. In fact, despite also speaking English, several participants request more documentation and content in their native languages. There appears to exist a want, as well as a potential need, for Cardano material in other languages besides English.<br/><br/>Although with significantly lower numbers, Spanish (51), French (40), and German (38) are the next three languages most identified as being fluent in."
        ),
        question2: question(
          "Which best describes your current profession?",
          { options:
            [ "Web developer"
            , "Software engineer"
            , "System administrator"
            , "Database administrator"
            , "SRE"
            , "R&D engineer"
            , "Project manager"
            , "Product manager"
            , "Marketing / sales"
            , "Designer"
            , "Artist"
            , "Data scientist"
            , "Educator"
            , "Financial analyst"
            , "Trader"
            , "Academic researcher"
            , "Student"
            ]
          , sortDesc: true
          },
          "As expected, software engineers form the majority of those participating in the survey (129). Nonetheless, there is also a significant number of students (42), potentially signalling an interest from younger audiences and younger academic audiences on Cardano. And although the survey targeted developers, a large proportion of non-developers equally took part in the survey. Non-developers, however, were not asked certain questions and thus have not influenced the overall results of the survey."
        ),
        question3: question(
          "Do you work on Cardano as a hobby or professionally?",
          { options:
            [ "Profession"
            , "Hobby"
            , "Both"
            ]
          , sortDesc: true
          },
          "Despite most respondents being hobbyists (173), there is still a relatively high proportion of professionals working on Cardano. A somewhat smaller number indicates working on Cardano as a full-time profession (89), while 127 say they work on Cardano both as a profession and as a hobby. This will probably offer an interesting distribution to accompany over the years.<br/><br/>When filtered by profession—as provided in the previous question—, other noteworthy results become apparent. Software engineers appear more or less evenly distributed along all three categories. On the other hand, about 70% of participants identifying as artists fall into the hobbyist category, with 20% featuring as full-time professionals. Similarly, 60% of academic researchers indicate working on Cardano as a hobby and only 10% as a full-time profession."
        ),
        question4: question(
          "How many years of experience do you have writing software?",
          { options:
            [ "Less than 1 year"
            , "Between 1 and 3 years"
            , "Between 3 and 10 years"
            , "Over 10 years"
            , "I do not write software"
            ]
          , sortDesc: false
          },
          "The results clearly point to Cardano attracting more senior profiles at the moment. The vast majority of the Cardano developer ecosystem has either over 10 years experience writing software (111) or between 3 and 10 years experience (64). Beginners—be it with less than 1 year experience (43) or between 1 and 3 years experience (48)—seem deterred from working on Cardano, perhaps due to a lack of appropriate entry-level content as specified in later questions. Once again, the results suggest the survey attracted a considerable number of non-developers (123)."
        ),
        question5: question(
          "How many years of experience do you have writing software using a functional programming stack?",
          { options:
            [ "Less than 1 year"
            , "Between 1 and 3 years"
            , "Between 3 and 10 years"
            , "Over 10 years"
            , "None"
            ]
          , sortDesc: false
          },
          "In spite of the apparent general seniority of the Cardano developer community, the vast majority remains quite new to functional programming. Most indicate less than 1 year (139) or between 1 and 3 years experience (66) using functional programming, with 20 signaling no experience at all. Only 12 declare having more than 10 years experience. The present distribution might imply that both the eUTXO model and Cardano’s overall functional approach adds some extra difficulties for users, leading to fewer writing software for Cardano using a functional programming stack.<br/><br/>It should be noted that those who previously replied they “do not write software” were not asked this question and therefore did not impact the results. They similarly account for the difference in the number of total answers."
        ),
        question6: question(
          "What is your development environment?",
          { options:
            [ "Visual Studio Code"
            , "Visual Studio"
            , "IntelliJ"
            , "Notepad++"
            , "Sublime Text"
            , "Atom"
            , "Vim / NeoVim"
            , "Emacs"
            ]
          , sortDesc: true
          },
          "In a question tailored to those implementing tools and plugins for editors, results show a distribution consistent with other developer-focused surveys. It probably signifies a lack of relation to Cardano and can be another distribution to pay close attention to over the years.<br/><br/>Visual Studio emerges as the clearly preferred environment, whether as Visual Studio Code (114)—a lightweight editor option—or simply as Visual Studio (33)—an integrated development environment (IDE). For this reason, Visual Studio might offer a good option to prioritize when looking for IDE integrations."
        ),
        question7: question(
          "Which programming language are you proficient in?",
          { options:
            [ "JavaScript"
            , "TypeScript"
            , "Python"
            , "Java"
            , "C#"
            , "Ruby"
            , "PHP"
            , "Rust"
            , "C"
            , "Haskell"
            , "Scala"
            , "Kotlin"
            , "Swift"
            , "Elixir"
            , "Elm"
            ]
          , sortDesc: true
          },
          "As expected for the Cardano developer ecosystem, a large portion of respondents states they are being proficient in Haskell (68). Indeed, it corresponds to approximately 25% of all answers provided and stands in stark contrast with the approximate 2% mark in the recent Stack Overflow developer survey. <br/><br/>Moreover, a combination of Java (79), Python (137), and JavaScript (162) or TypeScript (88) leads the programming languages’ popularity on Cardano, providing evidence that Cardano attracts not only Haskellers but also a much broader audience."
        ),
        question8: question(
          "Are you a certified Plutus Pioneer?",
          {},
          "About 26% of participants indicate being a certified Plutus pioneer (102), a number that roughly coincides with the percentage of those identifying as Haskellers (approximately 25%). <br/><br/>Results from the coming years will play a key role in evaluating whether the two variables are indeed correlated. Likewise, it could be worth appraising if Plutus pioneers feel they have attained proficiency in Haskell after going through the Plutus certification."
        ),
        question9: question(
          "Which resources did you use to learn Haskell?",
          { options:
            [ "Books"
            , "Haskell's wiki"
            , "Online courses / videos"
            , "Coding platforms"
            , "School"
            , "Pair-programming"
            , "Side-projects"
            , "Reading source code"
            , "Plutus Pioneer Program"
            , "Emurgo Academy"
            ]
          , sortDesc: true
          },
          "Even though books (159) remain a cherished option, videos and online courses (198) are at the forefront of resources used to learn Haskell. Reading source code (93) appears in the third position and seems to rank higher than usual in developer-focused surveys. It likely signals a need to refine the onboarding documentation to learn Haskell as it might currently prove inadequate."
        ),
        question10: question(
          "How would you rate your sentiment towards Haskell?",
          { minimum: "Dreaded", maximum: "Loved" },
          "The results lead to an average of 6.8. However, and regardless of an otherwise somewhat Gaussian distribution, it should be noted that there is a large peak at 10 (82). This end of the scale corresponds to an overwhelmingly positive sentiment towards Haskell and it not only heavily influences the arithmetic mean but also contrasts with the survey’s overall results concerning Haskell. <br/><br/>Far more participants indicate loving Haskell (82) than those stating to be proficient in it (68). Given the results’ slight oddity, it could be interesting observing their evolution in coming years. It is also worth considering that upon removing 10 from calculations the arithmetic mean becomes 6."
        ),
        question11: question(
          "How would you rate your sentiment towards functional programming?",
          { minimum: "Dreaded", maximum: "Loved" },
          "The arithmetic mean is 7.6, with the distribution assuming a similar configuration as the one about the sentiment towards Haskell. In this instance, however, it presents as somewhat more skewed towards “Loved”, possibly suggesting a true appreciation for functional programming but some small reservations about Haskell in particular."
        ),
        question12: question(
          "What do you use (or plan to use) for writing Plutus script validators / Smart Contracts?",
          { options:
            { "plutus-tx (input-output-hk)": "Plutus-tx"
            , "Marlowe (input-output-hk)": "Marlowe"
            , "Plutarch (Plutonomicon)": "Plutarch"
            , "Pluto (Plutonomicon)": "Pluto"
            , "Solidity (w/ Milkomeda)": "Solidity"
            , "Glow (mukn)": "Glow"
            , "plutus-light (OpenEngineer)": "Plutus-light"
            }
          , sortDesc: true
          },
          "Although plutus-tx (143) ranks higher than any other tool, both Plutarch (65) and Pluto (39) display considerable use, especially for two community-driven tools released after plutus-tx. This incidence probably speaks to a demand for alternatives to plutus-tx from a quite early stage. The use of Solidity, via Milkomeda, also appears to gather some significant momentum amongst Cardano developers. On the other hand, the number of developers using Marlowe (106) might seem unexpected given that Marlowe is not yet fully ready nor has it been officially released for production.<br/><br/>This distribution presents another compelling case to track and compare in following years, particularly with a considerable number of new solutions currently under development. Some of these already appear mentioned by respondents that specify the use of other tools, like Helios and Aiken, and the Foundation will look to trail their progression in the future."
        ),
        question13: question(
          "How satisfied are you with the current state of the Plutus ecosystem?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "An arithmetic mean of 6.5 stems from the results. While far from unsatisfactory, the number nonetheless suggests the Cardano libraries in offer could do with both refinement and improvements."
        ),
        question14: question(
          "Which libraries do you use in your projects?",
          { options:
            { "blockfrost-sdk (blockfrost- any language)": "blockfrost-sdk(s)"
            , "cardano-api (input-output-hk)": "cardano-api"
            , "cardano-js-sdk (input-output-hk)": "cardano-js-sdk"
            , "cardano-client-lib (bloxbean)": "cardano-client-lib"
            , "cardano-python (emesik)": "cardano-python"
            , "cardano-serialization-lib (Emurgo)": "serialization-lib"
            , "cardano-multiplatform-library (DCSpark)": "multiplatform-library"
            , "cardano-wallet-js (tango-crypto)": "cardano-wallet-js"
            , "cardanocli-js (shareslake)": "cardanocli-js"
            , "cardanosharp-wallet (CardanoSharp)": "cardanosharp-wallet"
            , "Lucid (BerryPool)": "Lucid"
            , "Koios' client (cardano-community- any language)": "Koios' client(s)"
            , "Ogmios' client (CardanoSolutions- any language)": "Ogmios' client(s)"
            , "Pallas (txpipe)": "Pallas"
            , "pycardano (cffls)": "PyCardano"
            , "toolkit-for-cardano (SundaeSwap-finance)": "toolkit-for-cardano"
            , "cardano-wallet-connector (dynamicstrategies)": "wallet-connector"
            , "typhonjs (StricaHQ)": "TyphonJS"
            }
          , sortDesc: true
          },
          "The library cardano-api (174) sits at the very top of those used in programming projects, likely as a consequence of Haskell remaining the primary option for writing on-chain and off-chain code on Cardano. A shifting might occur as the ecosystem continues to grow and other programming languages become more frequently used. In addition, cardano-js-sdk also ranks high (76). Despite it being the library behind Lace wallet, no particular promotional announcements surrounded it and its visibility comes solely from community influence as well as informal conversations.<br/><br/> Other often used libraries include Ogmios (47), cardano-python (42), Pallas (24), and wallet-connector (30), all developed by independent groups and a testament to how community-driven libraries comprise a substantial segment of the ecosystem.<br/><br/> All those interested in examining or simply browsing available tools and libraries, can find them on the [Developer Portal](https://developers.cardano.org/tools)."
        ),
        question15: question(
          "How satisfied are you with the current state of the Cardano libraries listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "An arithmetic mean of 6.5 stems from the results. While far from unsatisfactory, the number nonetheless suggests the Cardano libraries in offer could do with both refinement and improvements."
        ),
        question16: question(
          "Which services do you use in your projects?",
          { options:
            { "Blockfrost (5Binaries)": "Blockfrost"
            , "cardano-db-sync (input-output-hk)": "cardano-db-sync"
            , "cardano-graphql (input-output-hk)": "cardano-graphql"
            , "cardano-rosetta (input-output-hk)": "cardano-rosetta"
            , "cardano-transaction-lib (Plutonomicon)": "transaction-lib"
            , "cardano-wallet (input-output-hk)": "cardano-wallet"
            , "Heidrun (adosia)": "Heidrun"
            , "Kupo (CardanoSolutions)": "Kupo"
            , "Ogmios (CardanoSolutions)": "Ogmios"
            , "Oura (txpipe)": "Oura"
            , "Koios (Cardano Guild Operators)": "Koios"
            , "Freeloaderz (FreeLoaderz)": "FreeLoaderz"
            , "PAB (input-output-hk)": "PAB"
            , "DAB (CardanoFoundation)": "DAB"
            , "Scrolls (TxPipe)": "Scrolls"
            , "SMASH (input-output-hk)": "SMASH"
            , "Tangocrypto (tango-crypto)": "Tangocrypto"
            , "cardano-metadata-oracle (5Binaries)": "metadata-oracle"
            , "token-registry / offchain-metadata-tools (input-output-hk / CardanoFoundation)": "Token Registry"
            }
          , sortDesc: true
          },
          "Both Blockfrost (144) and tools developed by IOHK—such as cardano-db-sync (141), cardano-wallet (126), or cardano-graphql (82)—command the most use in programming projects. Such a prominence probably ensues partly from their widespread visibility in documentation. On the other hand, most community-driven tools are still fairly young, with some only reaching sufficient maturity during the first half of 2022. A striking shift may therefore come along in upcoming years, making this distribution yet another one to pay close attention to."
        ),
        question17: question(
          "How satisfied are you with the current state of the Cardano services listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "An arithmetic mean of 6.8 again points both to an overall positive experience and to the existence of significant room for improvement. An assessment of the difficulties and problems specified in the participants’ answers to other questions could provide crucial insights to improve satisfaction with developer tools. The results’ distribution on these types of questions may also indicate considerable variations in the quality, maturity, and readiness of the ecosystem.",
        ),
        question18: question(
          "Which command-line tool(s) do you use in your projects?",
          { options:
            { "cardano-cli (input-output-hk)": "cardano-cli"
            , "cncli (cardano-community)": "cncli"
            , "cardano-addresses (input-output-hk)": "cardano-addresses"
            , "bech32 (input-output-hk)": "bech32"
            , "cscli (CardanoSharp)": "cscli"
            , "offchain-metadata-tools (input-output-hk)": "metadata-tools"
            }
          , sortDesc: true
          },
          "For command-line tools, none features higher than cardano-cli (241), a versatile tool that has become the default option to work and build on Cardano and even the sole tool for many low-level operations. This ubiquity happens in part because the details needed to implement a similar tool are currently insufficiently known and would require a degree of reverse-engineering to do properly.<br/><br/>Among the tools used in programming projects, cardano-addresses ranks second (139). This presents a somewhat surprising result seeing as, nowadays, cardano-cli provides most of the functionality offered by cardano-addresses."
        ),
        question19: question(
          "How satisfied are you with the current state of the Cardano tools listed in the previous question?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "The average here is 7.0, demonstrating the good state and functionality offered by the current command line tools. Given the proportion of cardano-cli users, a focus on improving this particular tool may alone bring the average even higher."
        ),
        question20: question(
          "How do you manage deployment to your infrastructure?",
          { options:
            [ "Docker"
            , "Kubernetes"
            , "Nix / NixOS"
            , "Terraform"
            , "Ansible"
            , "Bash scripts"
            ]
          , sortDesc: true
          },
          "Docker assumes a first place (145) consistent with its usual high demand. Curiously, bash scripts occupy the second place (103), suggesting a fair opportunity to create better tooling or templates to replace them. Nix / NixOS—still the main recommended method to manage deployment of infrastructure—appears in third (72), and the container orchestration solution Kubernetes comes in fourth (60)."
        ),
        question21: question(
          "How would you rather consume software?",
          { options:
            { "Language package manager": "Language package manager"
            , "OS package manager": "OS package manager"
            , "Docker": "Docker images"
            , "Downloadable static executable (x86)": "Static executables (x86)"
            , "Downloadable static executable (ARM)": "Static executables (ARM)"
            , "Source code + build instructions": "From sources"
            , "Nix": "Nix"
            }
          , sortDesc: true
          },
          "Docker again ranks high, with docker images in first place (154). It is, however, closely followed by language package managers (139) that include options such as yarn, pip, maven, or cabal. Altogether, the distribution tends to point to a lack of strong preferences in the way of consuming software. The presence of static executables (ARM) towards the end (58) may potentially seem surprising seeing as it is a typical choice for low-consumption hardware and its recent cloud support also comes offered at a lower cost. Nonetheless, this same cloud support for the ARM architecture may yet originate a surge in ARM-based builds in coming years.<br/><br/>The individual entry for nix (3) did not feature in the original survey. It has now been included in the results because at least 3 respondents directly mention it in their replies."
        ),
        question22: question(
          "Select any statement that applies to you. (Catalyst)",
          { options:
            { "I have plans to submit a Project Catalyst proposal": "I plan to submit a proposal"
            , "I have submitted a Project Catalyst proposal": "I have submitted a proposal"
            , "I have got a proposal funded through Project Catalyst": "I have got a proposal funded"
            , "I am not interested by Project Catalyst": "I am not interested"
            }
          , sortDesc: true
          },
          "Many respondents express having plans to submit a proposal to Project Catalyst (180), Cardano’s hub for community innovation. Among those survey participants that already submitted a proposal (101), more than half received funding (66). This sizable ratio might attest both Catalyst’s significance and its success, an encouraging sign considering how Catalyst works as an off-chain training space to help bring Voltaire’s reality of on-chain governance to the Cardano blockchain.<br/><br/>Nevertheless, a still large proportion of the builders responding to the survey indicate not having an interest in submitting a proposal to Catalyst (113).<br/><br/>It is difficult to determine from the results whether this illustrates an indifference to Catalyst, an unfamiliarity, a dislike, a disregard for the funding provided, or even just a belief that Catalyst is not the appropriate opportunity for these builders’ specific case. Perhaps the results’ evolution during the following years will help in establishing a clearer understanding.",
          "Select any statement that applies to you regarding 'Project Catalyst'?",
        ),
        question23: question(
          "What do you think is Cardano’s developer ecosystem's greatest asset?",
          { options:
            [ "Its impressive community"
            , "Its core technology and focus on the fundamentals"
            , "Its variety of open source tools and libraries"
            , "Its educational resources"
            , "Its goal and mission"
            , "Its potential"
            ]
          , link: `${repository}/2022/data/open-questions/what-do-you-think-is-cardano-developer-ecosystem-greatest-asset.md`
          },
          "Respondents put a decided emphasis on the “impressive community” of Cardano’s developer ecosystem (85 mentions), with replies characterizing it both as goal-oriented and very helpful. Cardano fundamentals also receive praise (40 mentions), in particular its research-driven approach as well as the use of functional programming and the eUTXO model. Furthermore, several participants cite the vibrant open source ecosystem (31 mentions), with some bringing explicit attention to certain community-driven tools."
        ),
        question24: question(
          "What do you think is Cardano's developer ecosystem’s most painful point?",
          { options:
            [ "Its tough onboarding"
            , "The overwhelming presence of Haskell"
            , "The unreliable and cumbersome development of key components"
            , "The lack of development tools & libraries (e.g. IDE)"
            , "Its poorly organized and highly scattered resources"
            , "Its lack of maturity"
            , "Its outdated, inaccurate or incomplete documentation"
            , "The lack of real-world examples & best practices"
            ]
          , link: `${repository}/2022/data/open-questions/what-do-you-think-is-cardano-developer-ecosystem-most-painful-point.md`
          },
          "A distinct number of survey participants points to the onboarding process as the most painful point in Cardano’s developer ecosystem (44). Indeed, many reference an arduous technical experience when starting to work on Cardano that proves challenging to overcome and leads to a steep learning curve. However, although a lack of entry-level documentation is noticed (44), only a few consider the current volume of documentation a problem (6). Instead, most respondents identify a difficulty in finding the documentation due to resources being poorly organized and scattered across too many places (27). This stands as a clear aspect in need of improvement.<br/><br/>At the same time, and despite the general positive sentiment towards functional programming apparent in previous questions, Haskell features as an adversity in the Cardano developer ecosystem (32). Obstacles specific to Cardano’s seem to include an excessive predominance of Haskell in the Plutus platform and core components, as well as a lack of mature alternatives to Haskell.<br/><br/>Respondents also often describe a variety of setbacks relating to the development of the core stack (30), namely delays, excessive frequency of changes that make building on Cardano harder, and a lack of clear release documentation and processes."
        ),
        question25: question(
          "Select any statement that applies to you. (CIPs)",
          { options:
            { "I have participated in conversations or reviews related to a CIP": "I have reviewed a CIP"
            , "I have read and used a CIP ": "I have read and used a CIP"
            , "I have written or co-written a CIP": "I have co-written a CIP"
            , "I have never heard of the Cardano Improvement Proposals (CIPs)": "I have never heard of CIPs"
            }
          , sortDesc: true
          },
          "Although a fairly high number of survey participants have either read or used (201) a Cardano Improvement Proposal (CIP), almost a third remains entirely unaware of its existence (92), making it conspicuous that the program requires greater visibility. On the other hand, about a quarter of those respondents who use the CIPs have likewise contributed to the review process (67)—a promising number and one that will hopefully get increasingly higher.",
          "Select any statement that applies to you regarding Cardano Improvement Proposals (CIPs)?",
        ),
        question26: question(
          "If you had to name ONE, what tool/library/feature would you rather have right now to ease your developer experience on Cardano?",
          { options:
            [ "Complete SDKs in various languages (Python, JavaScript, C#, Rust...)"
            , "IDE & easier setup of development environments"
            , "More alternatives compiling to Plutus core"
            , "More tools around DApp ↔ Wallets integrations"
            , "A curated list of real-world / end-to-end examples"
            , "A Plutus application backend, or equivalent"
            , "Better access to on-chain data"
            ]
          , link: `${repository}/2022/data/open-questions/what-would-you-rather-have-right-now-to-ease-your-developer-experience-on-cardano.md`
          },
          "As usual in developer-focused surveys, both software development kits (SDKs)—such as Python, JavaScript, C#, or Rust—(25) and IDE integration (18) appear as the top wants, signaling a preference for basic developer tooling in the customary programming language of choice of each developer. Similarly, alternative languages for writing on-chain and off-chain code also feature high amongst requests (17). It is important to note that, during 2022, significant efforts have been started on this front.<br/><br/>Many also mentioned the need for a starter kit (13). Even though this does not quite qualify as a tool or library, it does speak to the previously mentioned lack of onboarding documentation and to the requirement of providing an easy to follow “how to” that also includes examples with steps from beginning to end.",
          "What would you rather have to ease your developer experience on Cardano?"
        ),
        question27: question(
          "Where do you usually seek help on technical issues?",
          { options:
            { "GitHub Discussions / Issues": "Github"
            , "Cardano Forum": "Cardano Forum"
            , "Cardano StackExchange": "StackExchange"
            , "IOG's Technical Community Discord": "IOG Discord"
            , "Other Discord Servers": "Other Discord"
            , "Telegram Groups": "Telegram Groups"
            , "Friends / Colleagues": "Friends / Colleagues"
            }
          , sortDesc: true
          },
          "StackExchange (155) and Github (136) both rank the highest, showing a persistent tendency to seek help on platforms actually meant to discuss technical issues. Nonetheless, a large portion of the communication still happens on Discord—IOHK Discord (101) as well as other Discord channels (74)—and on Telegram groups (72), where browsing proves quite unpractical and content is often hard to parse by new joiners making it difficult to reuse."
        ),
        question28: question(
          "Where do you look for technical information/updates?",
          { options:
            { "Twitter": "Twitter"
            , "Reddit": "Reddit"
            , "IOG Technical Community Discord": "IOG Discord"
            , "Other Discord Server": "Other Discord Server"
            , "Telegram Groups": "Telegram Groups"
            , "Cardano360": "Cardano360"
            , "Cardano Forum": "Cardano Forum"
            , "Cardano Developer Portal": "Cardano Dev Portal"
            , "Cardano Docs": "Cardano Docs"
            , "SPO Youtube's Channel": "SPO Youtube's"
            , "Blog articles": "Blog articles"
            , "GitHub releases": "Github releases"
            , "Cardano Guild Operators' guides": "Cardano Guild"
            , "Scientific papers / specifications": "Scientific Papers"
            , "Source code": "Source Code"
            , "Friends / Colleagues": "Friends / Colleagues"
            }
          , sortDesc: true
          },
          "The Cardano Developer Portal sits at the very top of the list (147), an encouraging result seeing as the Portal aggregates all relevant technical information and is therefore the appropriate place to look for information and updates. However, some other results seem to have an unexpected preponderance. The website Cardano Docs ranks second (132), but it mainly provides a high level overview of the Cardano blockchain rather than offering detailed technical content. <br/><br/>Source code is also mentioned by a significant number of participants (81), suggesting that many still do not find the technical information they require and so end up having to resort to reading the actual source code. And, somewhat baffling, Twitter (90) appears mentioned twice more than scientific papers (47), with the latter rating lower than perhaps expectable for a research-driven ecosystem such as Cardano."
        ),
        question29: question(
          "On average, how satisfied are you with the technical answers/details you find?",
          { minimum: "Unsatisfied", maximum: "Pleased" },
          "Once again, an average of 6.7 signals a chiefly positive situation where plenty of opportunities for improvement still exist. Simply the fact that many turn to reading code flags the need to assess the current state of the technical documentation. In fact, the answers to the previous two questions could provide some clues to where efforts should focus."
        ),
        question30: question(
          "How would you rate your technical understanding of Cardano?",
          { minimum: "Newbie", maximum: "Expert" },
          "Although an arithmetic mean of 6.5 is relatively low, it nonetheless points to the existence of some experts among the pool of participants in the survey. With added years of experience and a close attention to technical documentation, this number might increase in the future."
        ),
        question31: question(
          "If you had to name one, what (technical) subject would you like to get more information about?",
          { options:
            [ "End-to-end examples, best practices and design patterns about writing smart contracts for Plutus"
            , "Cardano's core architecture, internals and implementation details"
            , "Haskell"
            , "Plutus core and Plutus internals"
            , "Infrastructure and node deployment"
            , "Hydra"
            , "Vasil / Babbage and upcoming features"
            ]
          , link: `${repository}/2022/data/open-questions/what-technical-subject-would-you-like-to-get-more-information-about.md`
          },
          "Most participants request information about writing smart contracts for Plutus (60), with some specifically mentioning the need for more comprehensive end-to-end examples of applications built on Cardano using Plutus. In addition, a few participants again cite Haskell (10), suggesting there is indeed an appetite to better understand Haskell and that the existing online resources do not match the same quality as the ones regarding other mainstream programming languages.",
          "What (technical) subject would you like to get more information about?",
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
