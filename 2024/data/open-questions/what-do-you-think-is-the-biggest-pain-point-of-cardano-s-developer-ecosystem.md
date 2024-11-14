<table> <tr> <td>
<strong>DISCLAIMER</strong>
<hr/>
The answers expressed in this survey by the community are not intended to reflect the opinions or views of the Cardano Foundation or its members. The designations employed in this survey do not imply the expression of any opinion whatsoever on the part of the Cardano Foundation regarding the questions and answers presented herein.
</td></tr></table>

# What do you think is the biggest pain point of Cardano's developer ecosystem?

## Documentation [30]

### Lack on specific topic (e.g. eUTxO design patterns, economics, hard fork changes, ...) [9]

- "As far as tools, I think things are fine. However, as far as education, I think there is a general lack of economic/financial understanding of incentives among DApp developers. The average DApp developer is a software engineer and yet DeFi is fundamentally about building *economic* utilities. If you wouldn't trust a neurosurgeon to file your taxes, why would you trust a software engineer to design markets?"
- "Not enough resources for building. You have to figure a lot out on your own"
- "Lack of good documentation, design patterns dapps actually uses, etc...."
- "Lack of examples and use cases to accelerate eUTXO model adoption"
- "Needs online tutorials for more dev tools."
- "Lack of atomic examples. Simple examples just to do the bare minimum, but cover both the onchain and offchain at the same time. For example, just governance contract with offchain, just staking contract (with always_true spending &/ governance validator) with offchain, etc. No fancy integration utilizing various concepts."
- "Obviously lack of documentation. [...] Also, documentation around hard forks. From my talks with other technical guys nobody really knows what was changed with Chang (i.e. do scripts need to be registered now to DRep to get rewards, when do you need to upgrade to V3, etc.). All of it seems folklore and there is no developer guide, just buzz articles about governance."
- "Docs on underlying cardano info. For instance if I google what encoding are asset names in cardano i wont find it easily. Hex i think. What type is the policy? How abt scripts.. idk if this even makes sense"
- "documentation, complex build instructions, with docker....."

### General discontent [7]

- "docs"
- "documentation. Move fast and break docs!"
- "documentation"
- "the lack of documentation in an ever changing world"
- "Documentation"
- "Documentation"
- "documentation [...]"

### Outdated and/or fragmented documentation [4]

- "Outdated and poor documentations with incomplete examples."
- "Fragmentation of documentation or out of date documentation. Most questions I search for on stack exchange have no answer - other data sources have old outdated information.  When smart contracts fail to execute the error messages are seldom helpful or intuitive."
- "Outdated documentation"
- "Lack of updated centralised source of information"

### Lack of (non-trivial) examples / in-depth explainers [4]

- "LACK OF DOCUMENTATION AND EXAMPLES"
- "Documentation. e.g. in MeshJS the documentation show simple examples and that's it, more complex one would be helpful, but I'm planning to contribute to this particular project to fix it."
- "Basically the same point that I mentioned under biggest asset (great talent that understand how to use Cardano's unique smart validator system) but unfortunately at a very deep level there are too few people. Educational resources in that depth are rare and educational material for people from other ecosystems are also rare."
- "Lack of thorough documentation. Too much nerds."

### Lack of variety in education materials (mostly text, little video/audio). [3]

- "The biggest issue is still bad documentation, we lack easy to consume video tutorials and more advanced examples beyond e.g. vesting contract examples. It is clear devs do not want to focus on Video Content or documentation but it is actually badly needed. Thinking in eUTxO requires people to actually understand to decompose the problem in a different way than account model. It is hard. eUTxO Design Patterns are actually critical as often it is impossible to do anything sensible in a real world."
- "Lack of ELI5 tutorials/videos on developing smart contracts with any of present libraries."
- "Lack of free and engaging video materials for developer onboarding!"

### Lack of entry-level documentation [3]

- "Not sufficient tutorials for new devs"
- "Resource availability regarding knowledge and various problems in the Internet"
- "[...] 3) Not enough education material with direct step by step instructions for absolute beginners."

## Overall developer experience around transaction building and submission. [16]

- "Transaction building and serialization libraries"
- "Building a transaction programmatically"
- "The lack of high quality libraries/SDKs or tools to build on. There are a handful of great teams and projects out there, but most projects are still very immature/young."
- "tx building libraries are still weak"
- "The current state of off-chain tools"
- "Not having something like Aiken for the off-chain as well."
- "The gap between offchain and onchain code (bad error messages in case of validation failures)"
- "[...] but also not (yet) having standards for dapp composability, figuring out various js offchain libraries, cbor"
- "[...] Something like PPP but for offchain tx building and Plutarch. Could be as low level as cardano-api to show how it's done. [...]"
- "Super difficult to kick-start. Scattered toolings, Lucid? Mesh? Lucid Evo? Blaze? Without a single one of them being completely feature complete (no blame, Cardano tooling is much more difficult than other ecosystem to implement). More collab would solve this problem drastically"
- "cohesive dev tooling across the whole stack"
- "since most code is off-chain and interfaces can (and usually are) obscure it's hard to compose apps!"
- "PPViewHashDontMatch"
- "Transactions failing only when submitting them with pycardano. Client side validation should catch errors sooner, and have much clearer error messages and guidance on how to correct the errors. Example: hashes don’t match"
- "Utxo contention and lack of signable intentions"
- "Take your validator and make the off chain work. I use the cli because that is easy. But that doesn’t work for everyone. It still the biggest hurdle. Not everyone wants to build a js app. Some of us want headless dapps."

## Haskell/Nix, especially around tooling and setup. [12]

- "The biggest pain point of Cardano's developer ecosystem is its relatively steep learning curve and slower pace of adoption, primarily due to its use of Haskell and the complexity associated with the platform’s extended UTXO (EUTXO) model."
- "Haskell and Nix being the default choice for anything"
- "Lingering Haskell tooling"
- "Nix. I hate Nix. I know almost no one that enjoys using Nix. It makes it so much harder to bring devs into the ecosystem. Please stop using Nix."
- "Haskell."
- "nix"
- "Until Aiken, the Plutus (Haskell) language seems daunting to me, because I'm unfamiliar with its syntax. However, at the time I looked into that, I had zero knowledge (pun not intended ;) ) about the concepts of datums, redeemers and validators, which, of course, didn't help."
- "Haskell and some of the information is high level and a bit hard to digest at times."
- "Haskell + Nix"
- "Hakell and eUTXO"
- "Was setting up environment for haskell, nix, etc. Gotten much better these last years"
- "Nix"

## The fragility and immaturity of the ecosystem tooling in general, in particular for off-chain development. [12]

- "It's common for tooling software to break after Cardano node upgrades. So one big pain point is always be asking in social platforms which version to use it have to wait to continue deploying SC."
- "Inconsistency, breaking changes"
- "Everything is fragmented and bad in different ways or unmaintained. Take blockchain indexers. Blockfrost has really unoptimized queries designed to burn many API credits. Koios has ideal API endpoints but poor performance and querying some addresses may time out altogether. GoMaestro is fast but their indexer fell behind so many times already that it’s not a reliable option anymore. All other options are a nightmare to set up."
- "the lack of proper tooling"
- "Testing and slow development, emulators are not very stable so we always end up hitting the testnets."
- "The older half of the tooling is very user unfriendly, and the newer half is still immature"
- "[...] and tooling is still primitive"
- "[...] 2) Lack (slow development) of tooling [...]"
- "on chain tools are too slow to come out.  Still waiting on babel fees"
- "Its offchain ecosystem for dApps."
- "right now I'm waiting Blaze to be able to handle PlutusV3"
- "cardano-js-sdk (because all the private methods create issues with bundlers)"

## Sustaining the developer ecosystem, in particular open source projects. [9]

- "Not enough money"
- "lack of real, financed popularity implies not too much money to invest in developer tooling, comparing to Eth development for example"
- "Funding for open source projects"
- "[...] and long term support of open source projects."
- "Lack of liquidity in the ecosystem, when investors only invest in ADA Token and do not support much for quality projects in the ecosystem."
- "combined with comparably low salary opportunities."
- "Many developers we are working for free, costing our infrastructure by our own and spending hundreds of non-payed hours. Unfortunately, many are giving up."
- "Price action makes difficult to drive interest and engagement"
- "Funding"

## Wrong focus of efforts which hinders the overall developer experience. [9]

- "Technical debt and the focus on governance instead of scaling/improving the ledger and smart contract layer."
- "The cardano-node itself being basically useless for dapps. You have to have Ogmios, db-sync, or some other tool to suck the data out to make it useful. The node is entirely focused on block production and developer experience was dismissed from the start."
- "Developer experience"
- "IOGs absolutely mad attitude to dev relations. still lick old wounds. Don't have to much to do with them anymore."
- "Thinking different. A problem among crypto space, even happens inside Cardano itself. Even if you make the easiest tooling to onboard devs on more solid grounds, if the majority things differently, they will keep using what majority tell them to use. This is why EVMs are always winning the popularity battle. Still we will keep working for Cardano non stop to help spread our tech."
- "The increasing desire of the chain to support Ethereum and bridging"
- "lack of consistent vision which is a consequence of the funding model. too many half-baked solutions for the same thing"
- "education is big for onboarding, open source code for helping people discover things beyond basic ed. lots more language centric tools but I think we would be better off consolidating a lot of teams working on their own versions of the same tools. teams spending a lot of time doing basic community support, repeating the same info to people who don’t understand the basic concepts clearly, without a clear path to educate themselves"
- "Complexity, it's contradictory, but it happens, the more reproducible environment you have, the more complexity you bring to the project."

## Tough onboarding for new developers. [6]

- "barrier to entry"
- "Zero onboarding and support for companies wanting to build on Cardano."
- "Developer experience for onboarding."
- "I think to start developing/contributing to open source as Intersect. In starting it difficult to understand the flow."
- "it is not an easily graspable topic to new developers"
- "im not sure, as a new devloper it is hard to get into but as time goes on and understanding grows tools start to make more sense"

## Lack of robus Oracle solutions. [2]

- "Definitlly oracle side, because we need very secure DeFi. Cannot rely on pools and week source in case of prices. We need to encourage big wallets to invest in DeFi, i think indexes can work in this case (like Metera). I lost a lot on Genius Yield, I believe in project, good tech and idea, they need help."
- "lack of robust oracles [...]"

## Unclassified

- "-"
- "1) Difficulty/complexity in bootstraping full node locally for development and testing [...]"
- "???????????"
- "\"This question is required\"."
- "Absence of a global shared state"
- "Batching."
- "Can't find any"
- "Cardano node not being diverse enough."
- "Deployment"
- "Ghgffjjyyggghjhff"
- "I don't know"
- "Interoperability"
- "Lack of offchain in C#"
- "Lackluster error messages."
- "Non answer."
- "Popularity"
- "Retrogression"
- "There is very little room for non-functional folks to get involved. I have SEVERAL Mag 7 engineers in my network that brush off the project instead of giving it a fair chance"
- "Undecided"
- "use cases"
- "User"
