<table> <tr> <td>
<strong>DISCLAIMER</strong>
<hr/>
The answers expressed in this survey by the community are not intended to reflect the opinions or views of the Cardano Foundation or its members. The designations employed in this survey do not imply the expression of any opinion whatsoever on the part of the Cardano Foundation regarding the questions and answers presented herein.
</td></tr></table>

# What do you think is the most painful point of Cardano's developer ecosystem?

## Hard to find / scattered documentation (26)

- Documentation, dev experience
- cbor/plutus data. There just doesn't seem to be any good resources for getting a good understanding of this, at least I haven't seen any. Aiken blueprint helps abstract some of this away but grasping the concepts on a fundamental level still seems important to build on Cardano. Would like to see more ways to make this less painful
- Documentation & Video tutorials
- no playground
- Finding the right tools for the right job (in particular if one doesn't exactly know what they need and has too little understanding of eUTXO on top of it)
- Nowhere near enough emphasis on user experience
- The lack of open source tooling, examples and documentation
- The lack of any integrated development kit or comprehensive integrated documentation. Far too much is piecemeal and needs to be cobbled together from multiple different sites. Whenever I raise this, all that happens is that people suggest I contribute to yet another site.
- Finding good source of documentation, many times the information is spread all over the community.
- Having to use linux and the lack of good guides
- Documentation
- Useful information scatteres all over the place
- Lack of educational resources
- Lack of documentation and examples.
- Documentation
- lack of documentation and ease of use of tools
- technical documentation is hard to find (not true for higher level libraries)
- In my case, access to information and content in Spanish
- I find it hard to find trustworthy information that helps me build meaningful things, I've a back log as long as my arm of features and app's I want to build but I am likely to just use a different blockchain to build them.
- Documentation
- Tooling and documentation.
- Lack of standards Documentation
- no proper documentation for Aiken language and no tutorials , if you want developers to work in your ecosystem then please put more effort in these things.
- Lack of relevant examples in documentation.
- Documentation
- the documenation with real world examples

## Haskell (22)

- It is very time consuming to learn Plutus right now, this is where my pain is at the moment.
- Learning curve especially functional Haskell.
- Haskell
- developer experience. the people who built the haskell/plutus toolchain have very painful idea of developer experience
- Picking up functional programming
- The learning curve for understanding the way the smart contract system, and Haskell, work together. Plutus is not friendly to new developers, definite learning curve there.
- Haskell off-chain
- Haskell
- funtional programming
- all the core tooling is in haskell but third parties aren't numerous or well funded enough to make suitable replacements that can reach a wider audience.
- availability of high quality documentation that is complete with examples.
- Really, it's the lack of language diversity in the ecosystem. Nobody uses Haskell compared to other programming languages. I'm not disparaging the language. There's simply millions more developers available for other languages.
- Haskell (and Nix)
- Complexity of haskell
- Used to be plutus, but there are new exciting projects covering this
- Haskell
- haskell being used for anything but the cardano node
- Push for plutustx despite being unusable
- Definitely haskell, nobody I know uses haskell, and it's such a niche language that unless someone is dedicated to some academic setting it's not going to be something that professionals in the industry use. Everything i'm seeing recnetly is java, c#, or javascript for developers.
- Haskell
- plutus development
- Haskell (and nix) everywhere
- Legacy Haskell code is a sticking point for many of us.
- Plutus, Hydra

## Tough on-boarding, hard to get started (15)

- Getting started
- I am still learning and find it is hard to find great educational material. Would love to see more courses on Aiken and other SC languages. And also videos about the dev tools from earlier in the survey.
- Lack of beginner tutorials, and documentation
- Little information for beginners and overall I don't see the point in using blockchain in smaller projects. We should focus on what blockchain is suitable for, which is the transfer of value, quickly, cheaply, anytime and anywhere. And by that I mean ideally even offline because that is something that would be revolutionary and that would help higher adoption.
- Onboarding the dev experience
- The lack of resources for new entry devs.
- Accessibility. I have had several developers with many years of experience approach me confused and unable to find a way to get familiar with Cardano.
- hard to learn
- Getting started is not smooth
- Lack of high level “explain to me like I’m 5” tutorials and documentation.  Plus the toolset is ever changing, very hard to keep up.
- It is not an easy development environment.  Admittedly, I'm a noob who hasn't really been adeveloper since before the days of blockchain.  But in a fit on enthusiasm, I took the Plutus/Haskell course from Emurgo, learned a lot but did struggle.  Admittedly, as I said my skills are rusty and I had never really used functional programming much.  But I did struggle more than expected.  I'm not actively developing, but am trying to pay attention to the improving environment.  Go Marlowe!
- The lack of a well structured onboarding process for new developers, in particular around the Extended UTXO model.
- Now is the time to deliver and provide a better development experience, the resources are inconsistent and at times look more like they were produced by academics for themselves rather than developers. If MS or Google released libraries like these they would not get the traction they have had we need it now!
- At present, there is no standardized resource available for beginners.
- Lack of great documentation to start from zero

## Inconsistence between development libraries & APIs (14)

- Infighting between solutions.
- drama and fighting between projects beyond competition and healthy rivalry. also projects rugging after draining community funds.
- Effective communication and collaboration between projects/toolmakers.
- Tooling, particularly around testing. Inconsistent terminology / APIs
- bad naming for things.
- No standard for different provider apis (REST apis)
- Lack of cross compatibility
- Serialization. Wallets using newer or older or different serialization. Hardware wallets needing different serialization. Different libraries, different types, conversions between them, and of course possibly different serializations.
- Fragmented libs that no one knows how to connect them. For example, the cardano-cli is used for what? Dev? If yes does it need a node? Oh wait it is baked into a node. But can you install a node without it?   Node running and offchain data, how to linked them? And the stake operator learning curve is high
- Poor foundational types in haskell, lackluster documentation
- Lack of tools and standards, not thinking ahead and having multiple ways to do the same thing, ex. script datums, or on/off-chain NFT metadata
- lack of consistency; the uphill battle of developing and E2E application; utxo management
- Too many layers of abstraction in the core Cardano libraries (cardano-ledger, ouroboros-consensus, cardano-api, etc.), leading to downstream libraries repeatedly reinventing APIs and types in misguided attempts to mitigate some complexity.
- In places they are hard to follow and and naming conventions and standards are all over the place between projects and within projects.

## Off-chain transaction building & on-chain/off-chain interoperability (10)

- Debugging serialization problems & onchain bugs is still difficult. Aiken has made good progress here, but there's lots of room to improve.
- The offchain needs a lot of work to be much simpler and not in JS. This is a crucial part of transaction building. And a massive blocker to rapid contract improvement.
- Developer Experience tools and libraries are not matured enough
- Ofchain transaction building.
- Construction transactions, tests and resource estimation.
- Tools aren't always state of the art, but we are getting there
- Aligning onchain and, offchain code and both of these against comprehensive testing. No framework does all things well enough
- Interacting with a Plutus protocols/dApps is a nightmare. Transaction building and protocol querying could and should have been trivial, but instead it's hard and requires us to build and maintain custom software. Assembling and offchain and onchain and deploying it is still brittle.
- Bridging on chain and off chain
- Getting a frontend engineer to build correct off chain in some library that Ale's made where he stopped maintaining it after his mvp release is painful. Then we try to use some other lib that is even worse to use in terms of devx since they are just forks of some other repo no one maintains. It's literally the worst part of cardano. For how easy it is to use the cli, it's a joke when it comes to getting anything else to work. The amount of effort to make a dapp work on the frontend is crazy."

## Finding funding & financial support (10)

- Bad financial support for diverse dev-system contributors like Adriano / GameChanger, Gimbalabs, and many more.  No economic reciprocity for dedicated contributions, resulting in talent being wasted to friction & attention-leakage.  difficult mental/operational models, low accessibility of learning materials, no /low maturity of architectural / system-design patterns / practical lifecycle support.  anarchic / chaotic / you're-on-your-own vibe.
- It is severely underfunded! Many libraries like PyCardano or OpShin are mainly built by a single person who also runs this library only as a side project. If there were maybe 2 or 3 more people working on these libraries (even just part-time), the developer experience would be sooo much better. The ideas behind these tools are sometimes very good, but the resources needed to put the ideas into practice are lacking.
- no jobs for entry level
- Demoralisation from unsuccessful Catalyst proposals. Chicken and egg situation when seeking commercial clients/projects and having no production experience.
- It is a closed club where people support each other in the very top part. The rest does neither have support nor infrastructure and those who want to build it get snuffed out by the closed club that takes all financial opportunities aka project catalyst
- Funding
- Lack of support from entities with resources to support tooling developers.
- Sustainable funding
- See previous response about limited funding.
- Lack of support, software quality

## Delays and disappointments from genesis entities (9)

- Technical decisions made by IOG
- Open source projects are slow to deliver.
- IOG the company has become overweight and slow
- iohk
- IOG doesn't have strong engineering skills and has delegated the community to build solutions to the problems generated by questionable decisions. The result is a jungle of many \"almost ready/not maintained/defunct/to update\" tools that promise to solve those problems, but which devs and businesses cannot rely on.
- Delays, mythril should have been release a year ago…
- False Marketing around scientific process (stopped in 2021), community's blind following towards the influential faces - which end up putting false position, and thus - limit improvement potential
- Founding entitites disconnected from dev env reality,
- Most of the tooling around/built by iohk, cardano foundation, etc

## Adoption and general lack of users/developers/liquidity (9)

- the relatively low uptake and the still small ecosystem make it difficult to determine the likely medium- and long-term success of projects that are present and further developed
- Users
- Lack of liquidity and a radically different model from EVM
- not to much developers
- Severe lack of acceptance of Cardano in the wider world.  Cardano is not even part of the list of shared ecosystems.  This makes cardano very niche.
- Marketing
- Very few professional developers
- Community is very small
- There's need to more innovation, more young developers interested in building on cardano

## Nix (6)

- Also Nix. Besides being able to integrating anything, it has a step learning curve. I would love to see some movement on improving the Nix language and tooling towards a more unified Cardano-Nix ecosystem.
- Nix
- nix is a must
- Nix, and the lack of great developer videos
- (Haskell and) nix everywhere
- (Haskell and) Nix

## Smart-contract debugging / testing / benchmarking (6)

- on-chain script debuging
- Smart contract testing and frameworks for off-chain code in general.
- Smart contract limits
- Smart contract still cannot log traceError
- Debugging serialization problems & onchain bugs is still difficult. Aiken has made good progress here, but there's lots of room to improve.
- Complexity of smart contract development

## Infrastructure costs & complexity (6)

- It's hard to run a node locally without powerful hardware.
- Demanding on resources and technical skills
- heavy and bloated dependencies/environments for a (seemingly) common dev environment; think sql, node, etc.; being able to start programming from scratch and finding how to get to that point needs to be as painless and quick as possible. Even something deceptively simple and fundamental as spinning up a wallet with API is a pain point.
- Compute requirements and cost.
- Support for equipment
- The lack of alternative node clients (eg. ready only or light clients) and the high cost of indexing datum data for dapps

## Understanding EUTxO & how to build in this model (5)

- Lack of understanding of Smart Contract Plutus V2 Design Patterns, semantics is hard, syntax became easy these days.
- Batching, lack of atomic composability
- No good solution to parallelism for protocols building on Cardano. Batchers, batchers, everywhere!!! Having every single protocol launching on Cardano maintaining a unique group of batching infrastructure operations is pretty awful and doesn't scale well. It's wasteful and should be a problem solved by the Cardano protocol itself.
- Leaving some of the critical things that should be part of core libraries, to interpretation and implementation by the dapp teams which makes their life difficult!
- The eUTxO model :) ... though allowing for interesting design solutions it can be a hurdle until you understand the benefits and find solutions to certain problems easier solved with an account based model.

## Speed/throughput of the network (3)

- Speed of the network
- Speed & integration & flexibility
- The chain is still slow.

## Unclassified

- Assets as non-first class citizens (represented as map with no special or efficient Plutus core built-ins).  No real formal verification framework.
- Whales
- Cardano Aims to Create a Stable Cardano Aims to Create a Stable Cryptocurrency Ecosystem.
- i recommend something as remix
- ledger state
- non-believers
- Twitter
- Date management
- Not being icp
- can't tell
- It’s people
- it's still very early. Maturation processes suck.
