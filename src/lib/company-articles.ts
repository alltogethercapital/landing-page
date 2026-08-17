import type { Article } from "./articles";

// Portfolio notes, one per company, in portfolio order. Written and
// fact-checked against each company's own site, then line-edited for voice.
// Covers regenerated from company photography (see /updates/covers).
export const COMPANY_ARTICLES: Article[] = [
  {
    slug: "shield-ai",
    title: "Shield AI.",
    date: "June 3, 2026",
    dateISO: "2026-06-03",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Shield AI builds Hivemind, an AI pilot for military aircraft, and X‑BAT, a runway-independent autonomous fighter jet.",
    image: "/updates/covers/shield-ai.jpg",
    sections: [
    {
      body: [
        "Shield AI builds AI pilots for aircraft. The company's stated mission is to protect service members and civilians with intelligent systems. Its core product is Hivemind, an autonomy stack that flies military aircraft when GPS is denied, communications are cut, and a remote operator is no longer an option.",
        "Hivemind has moved past the single-airframe demo. It flies V‑BAT, Shield AI's runway-independent aircraft for reconnaissance and targeting on the electronic-warfare battlefield, and it has flown on jets including the Avenger, Firejet, and the VISTA test aircraft. The premise is plain. In a contested fight the links break, and the aircraft that finishes the mission is the one carrying its pilot in software.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The next product is X‑BAT, which Shield AI calls the first AI-piloted VTOL fighter jet. It takes off and lands vertically with no runway required, which lets it operate from ships and remote islands, or from austere forward bases. Internal bays carry air-to-air and air-to-surface weapons, with external hardpoints for large strike weapons, and the company lists a maximum range above 2,000 nautical miles and a ceiling above 50,000 feet. Hivemind is the pilot, and a single commander flies a team of X‑BATs at once.",
        "The schedule is public. First flight is planned for 2026, with production beginning in 2029. Shield AI says three X‑BATs fit in the deck space of one legacy fighter. Flight test and weapons integration sit between those two dates, along with manufacturing at rate.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Defense autonomy sits squarely on the frontier we back: software that has to work on real hardware, under jamming, with program offices and test ranges in the loop. Shield AI did the work in the right order. It built the pilot first and proved it on other people's airframes. Then it built the airframe the pilot makes possible. X‑BAT assembles autonomy, propulsion, airframe, and weapons into one machine.",
        "Most of what happens between now and production will be sorties, integration, and tooling rather than announcements. It is the long middle, where nothing demos well. A fighter that needs no runway changes the math of basing and sortie generation in a contested theater. That is worth building through, and Shield AI is doing it.",
      ],
    },
    ],
  },
  {
    slug: "1x",
    title: "1X.",
    date: "May 31, 2026",
    dateISO: "2026-05-31",
    category: "Portfolio",
    author: "All Together",
    excerpt: "1X builds NEO, a soft-bodied humanoid for household chores, run by Redwood, its own generalist AI model.",
    image: "/updates/covers/1x.jpg",
    sections: [
    {
      body: [
        "1X builds humanoid robots for the home. Its robot, NEO, stands five foot six and weighs 66 pounds. It is made to do chores in houses where people actually live, and orders are open now with a $200 deposit.",
        "The company designs its own hardware and its own AI model, and sells the result as one product. That is the hard version of the problem. A robot in a home cannot be caged off the way a robot in a warehouse can. The machine has to be safe by construction and quiet enough to ignore. And it has to stay useful, week after week.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "NEO is soft where most humanoids are hard. Tendon-driven actuators keep its movements safe. The hardware is wrapped in a 3D lattice polymer under a machine-washable knit suit, and the joints are covered from the outside so the surface is pinch proof. At 22 decibels it runs quieter than a modern refrigerator; it lifts 154 pounds and carries 55. Those are appliance constraints. A lab demo never has to meet them.",
        "The intelligence is Redwood, 1X's generalist AI model. It is among the first vision-language-action models to control locomotion jointly with manipulation, which lets the robot brace against a wall or lean while it works. Behind it sits a world model, a learned simulator that imagines how a scene responds to a proposed action. 1X uses it to evaluate policies across millions of scenarios before they run on hardware. NEO ships with foundational autonomy; for tasks past its current skill, owners can schedule a remote 1X expert to supervise while Redwood trains on the data, successes and failures both.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "The home is the hardest deployment environment in robotics. Every house is laid out differently and the objects in it are unstructured. The safety bar is absolute, because the robot shares rooms with children and pets. Most of the work here does not demo well: actuator design, suit textiles, safety margins, and the slow accumulation of training data from offices and real homes. 1X chose to build the hardware and the model at once, because in this market the pieces do not work separately.",
        "The first general-purpose machine in the home will arrive as an appliance rather than a demo, one that works, week after week, in a house it has never seen before. 1X is building that machine.",
      ],
    },
    ],
  },
  {
    slug: "openai",
    title: "OpenAI.",
    date: "May 27, 2026",
    dateISO: "2026-05-27",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Frontier AI research turned into products, from ChatGPT and the GPT models to the machinery required to train and serve them.",
    image: "/updates/covers/openai.jpg",
    sections: [
    {
      body: [
        "OpenAI is a frontier AI research company that turned its research into products people use every day. It built ChatGPT and the GPT family of models, and it sells access to those models in two ways, as a consumer product with a chat window and as an API that other companies build on. Its stated mission is to ensure that artificial general intelligence benefits all of humanity.",
        "For most people, ChatGPT was their first conversation with a large language model. That one product reset expectations for what software can do (write, summarize, reason through a problem, hold a conversation) and pulled the rest of the industry into the race. The company behind it still runs as a research lab at its core, with a product organization built around it at unusual speed.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The visible output is the models, successive generations of GPT systems that read, write, see, hear, and increasingly act. Less visible is everything required to make them: data pipelines, training runs across very large GPU fleets, post-training to make the models useful and safe, and inference infrastructure that serves answers to a global user base without falling over.",
        "Each layer is its own hard problem. Securing compute means a multi-year negotiation over chips and power. Driving down the cost of serving a model decides whether the API business works. Then there is evaluation, knowing what a model can actually do before users find out, which is unglamorous and decisive. Most of the work between releases is exactly this kind of work.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "We back companies on the hard frontier, and AI is the frontier the others now run through. Robotics, defense, energy, and semiconductors all bend around what frontier models can do and what they cost to train and run. OpenAI sits where that demand concentrates.",
        "The bet is on assembly. One organization has to be good at research, compute, product, and distribution at the same time, and OpenAI has so far refused to drop any of them. Model names will keep changing, and the asset is the capacity to ship the next one.",
      ],
    },
    ],
  },
  {
    slug: "blue-origin",
    title: "Blue Origin.",
    date: "August 12, 2026",
    dateISO: "2026-08-12",
    category: "Portfolio",
    author: "All Together",
    excerpt:
      "Blue Origin builds reusable rockets, engines, lunar systems, and in-space infrastructure.",
    image: "/updates/covers/blue-origin.jpg",
    sections: [
    {
      body: [
        "Blue Origin builds the transportation and infrastructure required to expand human activity in space. Founded by Jeff Bezos, the company develops reusable launch vehicles, rocket engines, lunar landers, and systems for moving and operating beyond Earth.",
        "New Glenn is the company's orbital workhorse: a heavy-lift rocket designed around a reusable first stage and a single configuration for civil, national-security, and commercial missions. The cover image is courtesy of Blue Origin.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "New Glenn stands more than 320 feet tall, carries a seven-meter payload fairing, and is designed to lift 45 metric tons to low Earth orbit or more than 13 metric tons to geostationary transfer orbit. Its first stage is built for at least 25 flights and is powered by seven reusable BE-4 engines; the same engine family also powers United Launch Alliance's Vulcan rocket.",
        "Around that vehicle sits a broader space platform. New Shepard flies people and research payloads on suborbital missions. Blue Moon is the company's lunar-lander family. Blue Ring is designed to host and move payloads across orbits. Blue Origin also develops the propulsion, robotics, and exploration systems that connect those programs.",
      ],
    },
    {
      heading: "Why we backed the founder and team",
      body: [
        "Space infrastructure rewards teams willing to build through long technical and industrial cycles. Engines, launch vehicles, landing systems, factories, and mission operations all have to work as one system, and the feedback loop is measured in hardware and flights rather than software releases.",
        "Blue Origin has assembled those capabilities under one roof and kept building toward a durable road to space. We backed the founder and team because reusable launch and in-space infrastructure can lower the cost of reaching orbit, expand what can be built there, and compound into an enduring industrial platform.",
      ],
    },
    ],
  },
  {
    slug: "longshot-space",
    title: "Longshot Space.",
    date: "August 17, 2026",
    dateISO: "2026-08-17",
    category: "Portfolio",
    author: "All Together",
    excerpt:
      "Longshot Space builds reusable ground accelerators for hypersonic testing and future cargo launch.",
    image: "/updates/covers/longshot-space.jpg",
    sections: [
    {
      body: [
        "Longshot Space is building reusable ground infrastructure that accelerates payloads instead of asking a rocket to carry all of its fuel and propulsion into flight. Its first market is high-cadence hypersonic testing; the longer-term goal is a lower-cost path to orbit for cargo.",
        "The company has already fired a six-inch, 60-foot accelerator more than 100 times and reached Mach 4.2. It is now advancing side-injection testing on a 30-inch, 120-foot system at Alameda Point. The cover image is courtesy of Longshot Space.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Longshot's accelerator uses many compressed-light-gas injection points along a long tube. Each one adds momentum as the payload passes, spreading acceleration across the length of the system instead of delivering one violent push at the start. Moving the machinery onto the ground makes the expensive infrastructure reusable and gives engineers a faster test-and-iterate loop.",
        "The near-term product is repeatable test capacity for defense and aerospace teams developing hypersonic systems. From there, Longshot plans to scale toward a five-kilometer accelerator and future launch services for non-human cargo. The same architecture connects a present infrastructure bottleneck to a much larger space-access ambition.",
      ],
    },
    {
      heading: "Why we backed the founder and team",
      body: [
        "Mike Grace built Longshot's first multi-injection accelerator in a San Jose garage in 2020. The team then moved through larger systems, repeated shots, measured failures, and another round of hardware. That progression matters more to us than a pristine rendering: the company has built the machine, fired it, learned from it, and kept scaling.",
        "Hard infrastructure companies earn credibility one test cycle at a time. Longshot pairs that practical engineering loop with a near-term customer problem and a long-term view of what dramatically cheaper cargo access could unlock in orbit. We backed Mike and the team because they are turning a radical idea into increasingly real, reusable infrastructure.",
      ],
    },
    ],
  },
  {
    slug: "weave-robotics",
    title: "Weave Robotics.",
    date: "August 11, 2026",
    dateISO: "2026-08-11",
    category: "Portfolio",
    author: "All Together",
    excerpt:
      "Weave Robotics builds Isaac, a practical home robot that folds laundry and takes on the daily reset.",
    image: "/updates/covers/weave-robotics.jpg",
    sections: [
    {
      body: [
        "Most home robots still live in staged demos. Weave Robotics starts from a simpler test: can a robot do an unwanted household chore, in a real home, often enough that someone would keep it? Its first product, Isaac 0, folds laundry and is already shipping across California.",
        "That deployment matters. Weave says Isaac 0 has logged more than 2,000 hours in the field and now folds more than 1,000 pounds of laundry each week. The company is using that foundation to build Isaac 1, a mobile home robot designed to take on more of the daily reset.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Isaac 1 is a seated, wheeled robot with two arms. It is designed to fold laundry, move through a home, tidy rooms, and help with recurring household work. Weave expects first shipments in fall 2026.",
        "Rather than assembling off-the-shelf parts, Weave builds its own actuators, end-effectors, and linkage systems, then assembles the robots in California. The design puts safety, quiet operation, reliability, physical camera shutters, and a compact charging home ahead of spectacle.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Kaan Dogrusoz and Evan Wineland have known each other since Carnegie Mellon and bring experience shipping consumer hardware and AI products at Apple. That pairing matters in home robotics, where the machine has to be technically ambitious and still feel like a product someone can live with.",
        "A useful home robot requires manipulation, perception, hardware reliability, safety, service, and a steady stream of real-world learning to work as one system. Weave chose a pragmatic form and a chore people already want to hand off, then put robots into homes early. We backed the founders and team because they are building through the unglamorous deployment work that turns a robot from a video into an appliance.",
      ],
    },
    ],
  },
  {
    slug: "supabase",
    title: "Supabase.",
    date: "July 28, 2026",
    dateISO: "2026-07-28",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Supabase is the open-source Postgres development platform for building apps with database, auth, APIs, realtime, storage, functions, and vectors.",
    image: "/updates/covers/supabase.jpg",
    sections: [
    {
      body: [
        "Supabase builds the Postgres development platform: database, authentication, data APIs, Edge Functions, Realtime, Storage, and Vector in one open-source stack. The company's line is simple: build in a weekend, scale to millions. That is the right promise for a generation of builders who want production infrastructure without spending the first month stitching together the basics.",
        "At the center is Postgres. Each Supabase project starts as an isolated Postgres database, then gets the surrounding primitives developers expect: auth, row-level security, realtime streams, auto-generated APIs, file storage, serverless functions, and a web interface. The product feels like a backend a small team can start with and a larger team can keep.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The product is not just hosted Postgres. Supabase is turning the database into an application platform. A developer can start with tables and policies, wire in auth, expose APIs, store files, run functions, subscribe to changes, and add vector search without leaving the same operating surface.",
        "That matters more as AI pushes more people to ship software. Agents and builders can generate interfaces quickly, but the backend still has to be trustworthy: data model, permissions, logs, migrations, and production controls. Supabase gives that work a real substrate instead of a throwaway prototype stack.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Paul, Ant, and the Supabase team built with the right wedge: make Postgres feel immediate without hiding the database. They also chose open source early, which turns trust into distribution. Developers can inspect it, self-host it, contribute to it, and still choose the managed product when they want speed.",
        "We like infrastructure that starts as a developer favorite and hardens into company-critical software. Supabase has that shape. It is simple enough for the first weekend and serious enough for the million-user version. That combination is rare, and it is why we backed the founders and team.",
      ],
    },
    ],
  },
  {
    slug: "valstad",
    title: "Valstad.",
    date: "July 28, 2026",
    dateISO: "2026-07-28",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Valstad builds AI-enabled robotic fabrication systems for distributed ship production and repair.",
    image: "/updates/covers/valstad.jpg",
    sections: [
    {
      body: [
        "Valstad builds AI-enabled manufacturing systems for distributed ship production and repair. The product starts with structural panel kits and autonomous robotic fabrication cells, but the deeper bet is larger: turn shipbuilding into a software-defined production system that can move faster than the capacity-constrained yards America relies on today.",
        "The company's mission is to supercharge America's maritime industrial base. That is not a slogan problem. It is steel, labor, welding, planning, supply chains, and throughput. Valstad is attacking the factory itself, building systems that let more production happen across existing industrial partners instead of waiting for a single new shipyard to solve the bottleneck.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Valstad's modular robotic cells perform common shipbuilding operations autonomously: primary stiffening, micropanel and T-beam fabrication, material handling, welding, and inspection. The system is designed to fit in a smaller footprint than traditional shipyard automation, which matters if the goal is distributed production instead of one-off megaprojects.",
        "The software layer is the other half. Feed in a 3D model, and Valstad's planning engine generates a build sequence: every cut, weld, robotic motion, and inspection point. When reality moves, it can replan. Around that, Valstad is developing phased array laser welding for thick structural steel, with the aim of making long welds faster, cleaner, and less dependent on scarce manual labor.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Dustin and the Valstad team are working on the kind of unglamorous bottleneck that decides national capacity. Shipbuilding is not short on demand. It is short on production systems that can scale when labor is tight, yards are full, and the customer needs finished hardware instead of a roadmap.",
        "We like companies that assemble software, robotics, manufacturing process, and industrial urgency into one operating system. Valstad is doing that for ships. If the machine that builds the ships works, it does not just make one yard better. It gives the maritime industrial base a repeatable way to add capacity.",
      ],
    },
    ],
  },
  {
    slug: "sunflower-labs",
    title: "Sunflower Labs.",
    date: "July 31, 2026",
    dateISO: "2026-07-31",
    category: "Portfolio",
    author: "All Together",
    excerpt:
      "Sunflower Labs builds autonomous drone security systems that combine perimeter sensors, docking stations, and autonomous Bee drones.",
    image: "/updates/covers/sunflower-labs.jpg",
    sections: [
    {
      body: [
        "Sunflower Labs builds autonomous security systems for large properties. The company turns a perimeter into a sensor network, then gives that network an aerial responder: Sentry sensor columns, Hive docking stations, and Bee drones that launch when the system needs to understand what is happening.",
        "The product is aimed at homes, estates, and larger sites where fixed cameras and alarms leave too much ambiguity. A camera can record an event. A guard can investigate one place at a time. Sunflower is building the machine that notices, verifies, and shows the owner what is happening from the air.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The system starts with Sentries placed around a property. They use motion, vibration, acoustic sensing, lights, and AI to detect activity and decide whether it is worth escalating. When an event needs investigation, a Bee drone deploys from a Hive, flies autonomously to the area, streams video back to the owner or security team, then returns to recharge. One Sentry covers roughly 1.5 acres, and one Bee covers up to 20 acres, so the system can scale across larger properties by adding more hardware.",
        "Sunflower reached an important deployment milestone in 2025, when it announced nationwide FAA approval for a fully automated residential drone security system. The company also closed a $16 million Series B led by Sequoia Capital. General Catalyst backed the company from the seed round, and we were glad to invest in a company that has drawn the kind of patient, serious capital hard robotics requires.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Alex, Chris, Nick, and the Sunflower team are working on a category that looks simple only from far away. A security drone has to be quiet enough to live near people, safe enough to launch without a pilot, useful enough to beat a fixed camera, and reliable enough that owners trust it when they are not home. That means robotics, perception, autonomy, industrial design, regulation, and customer trust all have to be assembled into one product.",
        "We like companies where the demo is only the surface of the work. Sunflower has had to build through FAA approvals, hardware reliability, on-property deployment, sensor fusion, and the user experience of handing someone an autonomous security team. If the system works, the property gets a new nervous system: something that watches, moves, verifies, and returns to base without waiting for a person to notice first.",
      ],
    },
    ],
  },
  {
    slug: "atoms",
    title: "Atoms.",
    date: "August 1, 2026",
    dateISO: "2026-08-01",
    category: "Portfolio",
    author: "All Together",
    excerpt:
      "Atoms builds physical automation across food, mining, and transport, turning industrial work into specialized, gainfully employed robots.",
    image: "/updates/covers/atoms.jpg",
    sections: [
    {
      body: [
        "Atoms builds physical automation for food, mining, and transport. Travis Kalanick describes the company as the continuation of a long arc: digitizing the physical world, first through Uber, then through CloudKitchens, and now through a broader industrial automation platform.",
        "The company is organized around a simple premise. The physical world can be understood, predicted, and controlled with software, sensors, robotics, AI, manufacturing, real estate, and operations tied together. Atoms calls the result atoms-based computers: manufacturing as CPU, real estate as storage, and transport as the network.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Atoms has three public operating areas. Atoms Food builds infrastructure for better food. Atoms Mining is aimed at more productive mines, with Pronto's autonomous haulage system becoming a core technology engine after its acquisition by Atoms. Atoms Transport is described as the wheelbase for robots. The connective tissue is not humanoid theater. It is specialized machines with productive jobs in high-throughput industrial settings.",
        "The company came out of stealth in 2026 and announced a $1.7 billion equity investment led by a16z, with Ben Horowitz joining the board. Atoms also lists Bain Capital, Uber, Fifth Wall, Chemistry, A*, K5 Global, Abstract, SV Angel, and Alpha Square Group among its equity partners. That capital matches the ambition. Building physical automation across major industrial sectors takes time, balance sheet, and an organization willing to own messy real-world systems.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Travis has spent his career building networks that move the physical world. Atoms is the next version of that work, and it is pointed at the right bottleneck: not a single robot demo, but the operating systems underneath food production, mining, logistics, and transport.",
        "We like companies that refuse to stop at software interfaces when the constraint is physical. Atoms is taking on labor, land, fleets, kitchens, mines, robotics, and operations in one system. That is hard in exactly the way we care about. If physical AI becomes real at industrial scale, it will look less like a stage demo and more like specialized machines doing valuable work every day. Atoms is building for that version of the future.",
      ],
    },
    ],
  },
  {
    slug: "higgsfield",
    title: "Higgsfield.",
    date: "July 10, 2026",
    dateISO: "2026-07-10",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Higgsfield builds AI video and image creation workflows for creators, marketing teams, and enterprise content teams.",
    image: "/updates/covers/higgsfield.jpg",
    sections: [
    {
      body: [
        "Higgsfield builds AI video and image creation software for people who need to make content fast. The product is not just a single model endpoint. It is a creative workspace with image tools, video tools, a Supercomputer layer for assembling workflows, plugins, and studio products for shorts, explainers, cinema, and marketing work.",
        "The company is aimed at the practical middle of generative media. Creators, agencies, and marketing teams do not only need a model to produce one impressive clip. They need repeatable workflows, references, edits, formats, and speed, because the output has to become campaigns, posts, product videos, and branded creative on a real calendar.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Higgsfield describes its product as infrastructure for AI video and image generation. The interface brings together image generation, video generation, cinematic controls, creator apps, and enterprise-oriented workflows. Its public product surface also includes integrations with major models and tools, including workflow paths for teams that want AI-generated content to move from idea to finished asset without leaving the system.",
        "That matters because video generation is becoming less about a one-shot prompt and more about control. The user wants to keep a person, product, style, shot, or brand coherent across multiple outputs. Higgsfield is building around that workflow reality: fast exploration at the front, then enough structure to turn the output into something a company can actually publish.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Alex, Yerzat, Mahi, and the Higgsfield team are building where consumer creation and enterprise marketing are starting to collapse into the same toolchain. The hard part is not only model quality. It is product assembly: creative UX, speed, model orchestration, distribution, and trust from professional teams that need the work to land.",
        "We like companies that make frontier technology usable by the people who will pull it into daily operations. Higgsfield is doing that for AI media. The models will keep changing, but the workflow layer that lets people plan, generate, edit, and publish is where the leverage compounds.",
      ],
    },
    ],
  },
  {
    slug: "decart",
    title: "Decart.",
    date: "July 9, 2026",
    dateISO: "2026-07-09",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Decart builds the infrastructure and real-time models behind live AI, from faster inference to interactive world models.",
    image: "/updates/covers/decart.jpg",
    sections: [
    {
      body: [
        "Decart builds infrastructure for live AI. The company works at the layer where models stop being offline artifacts and start responding in real time: inference, optimization, video generation, world models, and the compute stack underneath them.",
        "That distinction matters. A model that is impressive in a batch pipeline can still feel too slow or too expensive to become a product. Decart is focused on the part of AI that has to run at the speed of interaction, where latency, cost, and hardware utilization decide what can exist.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The company describes its Decart Optimization Stack as software that runs across NVIDIA GPUs, AWS Trainium, and Google TPUs. The goal is to make large models cheaper and faster to train and serve, without tying the entire system to one chip vendor or one cloud. That is infrastructure work in the practical sense: memory, kernels, scheduling, and the unglamorous machinery that turns compute into usable product.",
        "On top of that infrastructure, Decart is building interactive models. Oasis is a real-time world model aimed at physical AI use cases including robotics, autonomous vehicles, manufacturing, and drones. Lucy is a live video editing model that transforms video as it runs. Both products point at the same premise: AI should be able to generate, simulate, and respond while the user or machine is still in the loop.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Dean, Orian, Moshe, and the Decart team are building in the part of AI where demos collide with physics. A real-time model is not just a better checkpoint. It is a systems problem across chips, serving infrastructure, model design, and product constraints. That is the kind of assembly we like.",
        "The frontier is moving from text boxes into worlds: robots, vehicles, games, factories, and live video. Those systems need models that are fast enough to steer reality instead of merely describing it afterward. Decart is building the stack for that moment.",
      ],
    },
    ],
  },
  {
    slug: "core-automation",
    title: "Core Automation.",
    date: "June 26, 2026",
    dateISO: "2026-06-26",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Core Automation is building the world's most automated AI lab, starting by automating research itself.",
    image: "/updates/covers/core-automation.jpg",
    sections: [
    {
      body: [
        "Core Automation is building an automated AI lab. The company's stated objective is systems that optimize and automate work, starting with research itself. The first customer is the lab. Automate the work of asking questions, running experiments, reading results, and deciding what to try next, then use that loop to build better systems.",
        "That is a different shape from a normal AI company. Most teams start with a model or an application. Core is starting with the machinery of research: agents, evaluation loops, experiment infrastructure, and the operating model for a small team that wants to do work normally reserved for a much larger organization.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The research agenda is aimed below the product surface. Core says it is pursuing new learning algorithms that supersede large-scale pretraining and reinforcement learning, and architectures that scale better than transformers. Those are not incremental claims. They are bets on the substrate of frontier AI: how models learn, how they are organized, and how much human labor it takes to move the frontier forward.",
        "The method is recursive. Core starts by automating its own work. The more of the research loop the system can handle, the more ambitious the team can be. Each automation makes room for harder questions, and each hard question reveals the next thing to automate. If it works, the lab becomes both the product and the proof.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "We back founders who are willing to attack the bottleneck instead of the visible symptom. In AI, one bottleneck is research labor: the number of good ideas a small team can test, discard, combine, and push through to something real. Core's bet is that highly capable agents can change the throughput of research itself, not just the workflows around it.",
        "Jerry, Rohan, Joanne, Anmol, and Julia have the right kind of ambition for that problem. The work will be quiet for a while. It is experiment harnesses, evaluations, new architectures, and the uncomfortable middle where most results are negative. But if small teams with automated research systems can take on work that once required entire organizations, the leverage is enormous. Core is building for that world.",
      ],
    },
    ],
  },
  {
    slug: "anduril",
    title: "Anduril.",
    date: "May 25, 2026",
    dateISO: "2026-05-25",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Anduril builds autonomous defense hardware and the Lattice software that runs it, selling finished products instead of cost-plus programs.",
    image: "/updates/covers/anduril.jpg",
    sections: [
    {
      body: [
        "Anduril is an American defense technology company that builds autonomous systems for the United States and its allies. The hardware includes autonomous aircraft, undersea vehicles, sentry towers for land and border security, and solid rocket motors. The software that runs all of it is a platform called Lattice.",
        "The company inverted the standard defense contracting model. Rather than waiting for the government to define a requirement and fund the development, Anduril identifies problems and funds its own R&D, then sells finished products off the shelf. The engineering has to work before the revenue arrives.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Lattice is the center of the company. Anduril describes it as the software platform that powers its software-defined weapons and integrates third-party and government-owned systems into an extensible network of sensors and effectors. Around it sits a family of hardware: air systems, tasked and controlled through Lattice, for intelligence, surveillance, reconnaissance, and strike; land systems that keep persistent watch over land regions and critical infrastructure; undersea vehicles built for survey, inspection, and delivery of effects in littoral and deep water. With a team of partners, the company is also working on space-based interceptors for the Space Force's Golden Dome program.",
        "The other half of the work is production. Anduril calls it rebooting the arsenal. Arsenal-1, its hyperscale manufacturing facility in Ohio, is a bet that autonomous systems can be produced at volume, and that the constraint on Western defense is throughput rather than invention.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Defense is the hard frontier without the gloss. The customer moves slowly and the testing and qualification burden is real. Most of the work never demos well (integration, certification, tooling, the long middle). Anduril chose to carry those costs itself and let working products argue for the contracts.",
        "We back companies that assemble, ones that take autonomy software, sensors, airframes, and factories and weld them into something the parts could not do alone. Lattice plus the hardware family is that assembly, and Arsenal-1 is what makes it repeatable. The systems already fly, dive, and keep watch. What remains is volume, which is a thing you build.",
      ],
    },
    ],
  },
  {
    slug: "aurelius-systems",
    title: "Aurelius Systems.",
    date: "May 20, 2026",
    dateISO: "2026-05-20",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Archimedes is an autonomous counter-drone laser. It detects and tracks threats, then neutralizes them for the cost of electricity.",
    image: "/updates/covers/aurelius-systems.jpg",
    sections: [
    {
      body: [
        "Aurelius Systems builds directed-energy weapons that shoot down drones. Its system, Archimedes, is an autonomous counter-UAS laser: optical sensors and machine learning detect and track a threat, and a laser neutralizes it in seconds. No operator sits in the loop, and no interceptor is expended.",
        "The problem is arithmetic. Small drones are cheap and the missiles fired at them are expensive, so any defense that trades an expensive interceptor for every cheap drone loses on price before it loses on the battlefield. A laser engagement costs roughly the electricity behind it. Archimedes can draw that power from grid, generator, or battery, and switch between sources.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "A single Archimedes unit carries the complete kill chain, from detection and tracking through engagement. Optical sensing paired with machine learning handles detection and targeting in real time, and the system runs without an operator. The hardware is built on commercial off-the-shelf components, which keeps it compact and field-portable and makes it simple to maintain. Deployed in numbers, units network into a resilient defense grid.",
        "Archimedes has run outside the lab. The company says it has been tested and operated in live field conditions, including adverse weather, and recently demonstrated autonomous directed energy at the T-REX 26-2 experimentation event. Aurelius also runs its own manufacturing arm, Aurelius Manufacturing, building the systems in America rather than outsourcing the part of the business that decides whether you can ship.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Directed energy has been ten years away for fifty years. The physics worked; the packaging did not. Power, thermal management, beam control, and target acquisition kept lasers on test ranges instead of in the field. Aurelius's bet is that cheap optics and cheap compute, combined with modern machine learning, have turned those into engineering problems, and that the winner will be whoever does the unglamorous integration work fastest.",
        "That is our kind of company. Drones made offense cheap, and Aurelius is making defense cheap again. Little of that shows up in announcements. The day-to-day is sensors that hold a track in bad weather, power systems that run off whatever is available, and a factory that can build the next hundred units.",
      ],
    },
    ],
  },
  {
    slug: "salient-motion",
    title: "Salient Motion.",
    date: "May 17, 2026",
    dateISO: "2026-05-17",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Salient Motion builds certified electromechanical actuation systems for aviation and defense from its own factory in Southern California.",
    image: "/updates/covers/salient-motion.jpg",
    sections: [
    {
      body: [
        "Salient Motion designs, manufactures, and supports electromechanical actuation systems for commercial aviation and defense. Actuators are the muscles of an aircraft, the motors and mechanisms that move whatever has to move on command, every flight, without fail. Salient builds them at its own factory in Southern California.",
        "The market it sells into is dominated by legacy suppliers with long lead times and heavy overhead. Salient's pitch to OEMs and MROs is blunt: certified actuation systems in weeks rather than quarters, at lower cost, with support that runs from concept through sustainment.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The company is built around a software-first architecture. Core motor control software is developed and certified to DO-178C standards, so each new actuator starts from a certified base instead of a blank page. The same modularity runs through the hardware, from linear and rotary actuators to multiple motor types, all designed from the start for faster certification and delivery.",
        "That approach is reaching real airplanes. The company has secured its first production contract and is working with Boeing to certify modular actuators for commercial airliners, parts that millions of people rely on at 35,000 feet.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Aerospace actuation is exactly the kind of problem we look for. The work is certification, tooling, qualification testing, and supply chain, a long middle where nothing demos well. It takes years of disciplined engineering to prove a part safe enough to fly, and that, more than any idea, is the barrier to entry. Salient turned the barrier into its product by making certification a software asset that compounds across programs.",
        "Commercial aviation needs new suppliers, and defense programs need them faster. Both need parts that arrive on time. The team designs, builds, and ships from one factory in Southern California.",
      ],
    },
    ],
  },
  {
    slug: "replit",
    title: "Replit.",
    date: "May 15, 2026",
    dateISO: "2026-05-15",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Replit folds the editor, runtime, database, and deployment into one system, then hands the whole machine to an AI agent.",
    image: "/updates/covers/replit.jpg",
    sections: [
    {
      body: [
        "Replit is a platform for building software by describing it. A user types what they want and an AI agent writes the code. The platform runs it. The editor, the runtime, the database, the authentication, and the hosting live in one system, so the distance from idea to deployed application is a single conversation.",
        "The company was founded by Amjad Masad and Haya Odeh and is based in California. The homepage pitch is blunt: \"Turn ideas into apps in minutes, no coding needed.\" The customers run from founders and product managers to enterprise teams that need SSO and SOC 2, and to working developers who use it because the loop from code to running software is short.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The product centers on Agent 4, which Replit says \"writes production-ready code, evolves it, and stays out of your way.\" Agents run in parallel on separate tasks, and a visual design surface called Infinite Canvas lets users direct design changes without writing code. Around the agent sits the infrastructure. Authentication, database, hosting, and monitoring are built in, along with more than 100 integrations including OpenAI, Google Workspace, and other developer tools.",
        "The distinction from other coding tools matters. Most of them produce text and leave the user to assemble an environment around it. Replit gives the agent a computer where it can execute, test, deploy, and observe what it built. That step turns generated code into shipped software.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "AI now writes a growing share of the world's code, but code is not a product until it runs somewhere (provisioned, secured, deployed, watched). Replit spent years on that layer, executing arbitrary programs from anyone on the internet safely and packaging compilers, containers, and databases into something a browser tab can hold. None of it demos well, but all of it compounds.",
        "When capable coding agents arrived, Replit was one of the few companies that could hand them a complete machine instead of a text box. Model, runtime, and infrastructure were joined into one loop and owned end to end. That is the assembly we look for. The number of people who can ship software is about to grow by orders of magnitude, and Replit built the factory floor before the workers showed up.",
      ],
    },
    ],
  },
  {
    slug: "sourcerer",
    title: "Sourcerer.",
    date: "July 9, 2026",
    dateISO: "2026-07-09",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Sourcerer is building an AI-native distributor that automates sourcing, supplier quotes, freight, and trade finance.",
    image: "/updates/covers/sourcerer.jpg",
    sections: [
    {
      body: [
        "Sourcerer is building an AI-native distributor for global trade. The company starts with a basic customer problem: a business needs parts, products, or materials, and the process of finding suppliers, comparing quotes, arranging freight, and financing the order is still slow and fragmented.",
        "Most software in procurement helps a human manage the work. Sourcerer is aiming at the work itself. Its agents identify suppliers, negotiate quotes, arrange logistics, and package the result into a single buying flow.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The product combines AI agents with operational infrastructure. A customer can bring a product spec, invoice, or description, and Sourcerer handles the search across suppliers, price comparison, freight, and credit terms. The company is not trying to be another dashboard that watches the supply chain from the side. It wants to become the supplier of record, which means owning the outcome instead of only routing the task.",
        "That is a harder shape, but a more useful one. Procurement is not one workflow. It is tariffs, logistics, supplier reliability, currency, trade credit, shipping schedules, and documentation, all changing while the buyer is trying to make a decision. Agents are useful here only if they are connected to the operating rails that can actually move goods and money.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Peter and Robert are going after a market where the software surface has been underbuilt because the physical world is messy. The opportunity is not merely to make procurement prettier. It is to collapse the distance between needing something and getting a committed, financed, shippable quote.",
        "We like companies that take responsibility for the real transaction. Sourcerer is doing that in global trade, where a better interface is not enough and the winner has to combine software, operations, and trust into one machine.",
      ],
    },
    ],
  },
  {
    slug: "applied-intuition",
    title: "Applied Intuition.",
    date: "May 11, 2026",
    dateISO: "2026-05-11",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Applied Intuition builds the simulation, tooling, and operating layer that autonomous vehicles and machines actually run on.",
    image: "/updates/covers/applied-intuition.jpg",
    sections: [
    {
      body: [
        "Applied Intuition builds the software layer underneath autonomous machines. The company started in simulation and developer tooling for autonomous vehicle programs and now sells a full stack: development tools, a vehicle operating system, and an autonomy system that manufacturers license instead of building from scratch. Its tagline is \"Physical AI that moves the world,\" and the substance behind it is mostly infrastructure rather than spectacle.",
        "The customer list is heavy industry. Toyota, Porsche, Volkswagen, Nissan, and Stellantis appear on the company's site, alongside Komatsu in mining and construction equipment, and TRATON is building its TRATON ONE OS in partnership with the company. Beyond automotive, Applied Intuition serves defense, trucking, mining, construction, and agriculture. In each of those domains, a software failure breaks something physical.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Three product lines. Tools for Vehicle Intelligence is the development platform. It covers simulation, evaluation, data collection, and quality control, including petabyte-scale ingestion pipelines and a closed-loop system that turns real-world sensor data into labeled training segments. Vehicle OS is one operating system meant to run across trucks, drones, robots, and humanoids, with observability and code-first tooling built in. The Self-Driving System packages multi-domain autonomy models with simulation-based safety validation.",
        "Simulation is the thread through all of it. An autonomy program might wait years to encounter a rare highway scenario in the field; in simulation it can run that scenario thousands of times a night. That is how validation actually gets done.",
      ],
    },
    {
      heading: "Why we're investing",
      body: [
        "Autonomy is a hard-frontier problem in the precise sense we care about. The demo is the easy part. What follows is a long middle of validation, certification, OEM integration, and data infrastructure, where nothing demos well. Applied Intuition sells exactly that middle, the connective tissue between AI models and the machines that have to carry them. It is assembly work, done as a product.",
        "The company's own line is that 99% of autonomy's impact lies ahead. That can sound like hype. We read it as a claim about duration. Vehicles will need this software underneath them for decades, and so will equipment and defense systems. If autonomy reaches roads, mines, and battlefields at scale, a large share of it will run on this stack. That is a position worth taking before the outcome is obvious.",
      ],
    },
    ],
  },
  {
    slug: "figure-ai",
    title: "Figure AI.",
    date: "May 8, 2026",
    dateISO: "2026-05-08",
    category: "Portfolio",
    author: "All Together",
    excerpt: "General-purpose humanoid robots for the workforce, built around one body and one AI system, with a plan to make both at volume.",
    image: "/updates/covers/figure-ai.jpg",
    sections: [
    {
      body: [
        "Figure AI builds general-purpose humanoid robots for the workforce. The form factor is deliberate. Two legs, two arms, hands. Factories, warehouses, and homes were built around the human body, so a machine that matches it can work in those places without remodeling them. One robot with a general interface can serve millions of tasks.",
        "The current robot is Figure 03, which the company describes as a general-purpose humanoid robot for every day. It runs Helix, Figure's in-house AI system, built to handle unpredictable, ever-changing environments. The stated problem is blunt. By the company's count, there are over 10 million unsafe or undesirable jobs in the U.S. alone, and an aging population will make them harder to fill.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Figure's master plan runs in three phases: build a feature-complete electromechanical humanoid, then perform human-like manipulation, and finally integrate humanoids into the labor force. First markets are manufacturing, shipping and logistics, warehousing, and retail. Those are the environments where the company says labor shortages are most severe. Behind those sit the home and care for an aging population, which is where Figure 03 and Helix are already pointed.",
        "Two problems sit under everything. One is the AI. A humanoid is only as useful as the system driving it, and Helix is Figure's bet that a single system can generalize across tasks instead of being scripted per job. The other is cost. The master plan calls plainly for reducing unit costs through high-rate volume manufacturing. That makes Figure as much a manufacturing company as a robotics company.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Humanoid robotics is where AI meets the physical world, and the demo is the easy part. The hard part is actuators that survive years of duty cycles, hands that hold tolerance, supply chains, safety standards for working next to people, and unit economics that close at volume. That long middle, where nothing demos well, is where Figure is spending its time.",
        "It is also an assembly problem, which is the kind we look for. The robot only works if the AI, the electromechanical hardware, and the manufacturing all work, and Figure is building all three under one roof. If general-purpose robots arrive this decade, they will come from a company that treats the factory as part of the product. Figure is building that way.",
      ],
    },
    ],
  },
  {
    slug: "apptronik",
    title: "Apptronik.",
    date: "May 4, 2026",
    dateISO: "2026-05-04",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Apptronik builds Apollo, a general-purpose humanoid robot for warehouses and factories, designed for mass manufacture rather than the demo reel.",
    image: "/updates/covers/apptronik.jpg",
    sections: [
    {
      body: [
        "Apptronik builds Apollo, a general-purpose humanoid robot for industrial work. The company spun out of the Human Centered Robotics Lab at the University of Texas at Austin, where the team worked on NASA's Valkyrie; before Apollo it built exoskeletons, humanoid torsos, and biped platforms. That lineage shows in the product. Apollo is designed for mass manufacture rather than the demo reel.",
        "The robot stands 5'8\", weighs 160 pounds, lifts 55 pounds, and runs four hours on a hot-swappable battery pack. It is aimed at the work warehouses and factories struggle to staff: trailer unloading, case picking, palletization, machine tending, line replenishment.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The case for the humanoid form is simple. Industrial facilities were built for human bodies, from the shelf heights and the tools to the doorways. There are millions of special-purpose robots that each do one or two things; Apptronik's bet is one robot that can do many, dropped into existing facilities without rebuilding them. Apollo is modular. It can run on legs, sit on a stationary mount, or ride a mobility platform, depending on the task.",
        "The less visible work is in safety and deployment. Apollo carries defined perimeter and impact zones, pausing the moment something moves into its impact radius, and it ships with software for point-and-click task control. The company sells it as robots-as-a-service, which puts the uptime problem on Apptronik instead of the customer.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Humanoid robots are an assembly problem, a matter of actuators, batteries, perception, control software, and a supply chain that can produce all of it at a cost a warehouse will pay. None of that demos well. It is hardware revisions, field reliability, and safety engineering, the long middle. Apptronik spent years there before Apollo existed, and built a team that can keep working through it.",
        "We back companies on the hard frontier, and physical labor is as hard as frontiers get. If general-purpose robots reach industrial reliability at industrial cost, the companies that own both the hardware and the deployment model will matter for decades. Apptronik is building like it intends to be one of them.",
      ],
    },
    ],
  },
  {
    slug: "volantis",
    title: "Volantis.",
    date: "May 2, 2026",
    dateISO: "2026-05-02",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Volantis builds a photonic motherboard that moves data between chips as light, attacking the interconnect bottleneck in AI compute.",
    image: "/updates/covers/volantis.jpg",
    sections: [
    {
      body: [
        "Volantis builds photonic interconnect for AI compute. Its product is a photonic motherboard, a board that moves data between chips as light, through waveguides integrated into the board itself rather than copper traces or fiber-optic cable. The premise is simple, and the company states it plainly: the problem is moving information rather than processing it.",
        "Modern AI clusters are bound by communication. Accelerators sit idle while weights and activations cross electrical links that have not kept pace with the chips they connect. Volantis, founded by Tapa Ghosh, is going at that bottleneck directly. The team has led fifteen idea-to-silicon tapeouts in photonic chip manufacturing, and the company's backers include Sam Altman and Alex Wang.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The photonic motherboard departs from conventional silicon photonics in two ways. It uses direct modulation, and it uses waveguides in place of fiber. Dropping fiber removes the bulky optical channels that limited density in earlier optical systems. Volantis says the result is one hundred times the optical wire density of fiber-based designs and ten to one hundred times more bandwidth. The company also measures inference at fifteen times faster per dollar than Nvidia B100s.",
        "The system is built to scale out. A deployment can connect up to 400 nodes with up to 24 terabytes of memory, which matters for serving large models, where memory capacity and interconnect latency set the ceiling. The company's published roadmap puts pre-orders in the first quarter of 2026 and launch in the second.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Photonics has been the right answer on paper for decades. Physics favors light for communication; the obstacle has always been manufacturing. Modulators have to yield and packaging has to survive. The channels need to be dense enough to be worth the trouble. That gap between the physics and the product is the terrain we look for. It does not demo well. The work is tapeouts, test structures, and thermal budgets, repeated until the board works.",
        "If Volantis is right, the unit of AI compute stops being the chip and becomes the board, accelerators and memory and light assembled into one system. That is an assembly problem as much as a silicon problem, and it sits at the center of our thesis. The hard frontier goes to teams willing to build through the long middle. Volantis is doing that work now, in hardware and on a schedule.",
      ],
    },
    ],
  },
  {
    slug: "starcloud",
    title: "Starcloud.",
    date: "April 27, 2026",
    dateISO: "2026-04-27",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Starcloud is building orbital data centers, GPU clusters powered by continuous sunlight and cooled by the vacuum of space.",
    image: "/updates/covers/starcloud.jpg",
    sections: [
    {
      body: [
        "Starcloud builds data centers in orbit. The binding constraint on AI compute has shifted from chips to power. In practice that means land, cooling water, grid interconnects, and the years it takes to permit a gigawatt on Earth. Starcloud's answer is to put the compute where the sun never sets and waste heat radiates straight to deep space.",
        "The team maps to the problem. Ezra Feilden, co-founder and CTO, spent a decade designing satellites and deployable structures at Airbus Defence and Space and Oxford Space Systems. Adi Oltean, the co-founder and chief engineer, came from SpaceX, where he was a principal software engineer after twenty years at Microsoft working on GPU clusters. Philip Johnston, co-founder and CEO, worked on satellite projects for national space agencies as a consultant before starting the company. They are working through a numbered flight roadmap, Starcloud-1 through Starcloud-4, and the company points to coverage of the first AI model trained in space.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "An orbital data center is three subsystems that have to hold together: solar arrays large enough to feed a compute cluster, radiators that dump waste heat to deep space, and the racks of accelerators in between. In the right orbit the arrays see near-continuous sunlight, so power is steady without batteries or backup generation. Cooling is radiative rather than evaporative, with no water, chillers, or diesel.",
        "The stated goal is to \"grow to gigawatt scale without terrestrial constraints.\" That means no land acquisition, no interconnection queue, and no county permitting fight. The first flights are demonstrations. The architecture is designed to scale past them.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Starcloud sits where three of our sectors (AI, energy, and space) stop being separate. It is an assembly problem, one that joins launch economics, deployable structures, thermal engineering, radiation-tolerant compute, and the operating discipline of a cloud provider into one machine nobody can buy off a shelf. That is the kind of company we look for, because the assembled whole is the moat.",
        "The work from here is structural test and thermal margin, then flight after flight of hardware that has to survive. This is the long middle, where little of it demos well. If compute demand keeps compounding, someone has to build the power plant that goes with it. Starcloud is betting the cheapest place to put it is orbit. We think the physics is on their side.",
      ],
    },
    ],
  },
  {
    slug: "reflect-orbital",
    title: "Reflect Orbital.",
    date: "June 30, 2026",
    dateISO: "2026-06-30",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Reflect Orbital is building space-enabled infrastructure to redirect sunlight from orbit to precise locations on Earth.",
    image: "/updates/covers/reflect-orbital.jpg",
    sections: [
    {
      body: [
        "Reflect Orbital is building space-enabled infrastructure for sunlight after dark. The company's direction is deliberately simple to say and hard to execute: redirect sunlight from orbit to a precise location on Earth, turning orbital mechanics, reflectors, pointing, scheduling, and ground operations into a service.",
        "That makes it an energy company wearing a space company shell. The power source already exists. The hard part is making it useful after sunset, at a place and time a customer can actually use. Reflect is going after the interface between the sun and the ground.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Reflect organizes the product around Light and Energy. Both depend on the same core stack: satellites in orbit, deployable reflective surfaces, accurate pointing, customer scheduling, and the operating discipline to deliver illumination to a specific location without asking the customer to become a space operator.",
        "The product is infrastructure, not a science project. A working system has to survive launch, deploy in orbit, hold attitude, track ground targets, coordinate with customers, and earn trust around safety and reliability. Each piece is hard on its own. The company is assembling them into one service.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Ben Nowack and Tristan Semmelhack are building in the zone we care about: a simple customer promise that requires serious hardware, software, and operations underneath. The obvious version of this company is a rendering. The real version is optics, structures, controls, orbital operations, and commercial discipline.",
        "We like teams that make physical infrastructure feel inevitable before it is obvious. If Reflect works, sunlight becomes a schedulable resource instead of a daily window. That is the kind of frontier company we want to back: weird at first glance, practical once the engineering catches up, and enormous if it compounds.",
      ],
    },
    ],
  },
  {
    slug: "exowatt",
    title: "Exowatt.",
    date: "April 24, 2026",
    dateISO: "2026-04-24",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Exowatt builds modular solar-thermal systems that store sunlight as heat and dispatch electricity around the clock for AI compute.",
    image: "/updates/covers/exowatt.jpg",
    sections: [
    {
      body: [
        "Exowatt builds modular solar-thermal energy systems for the AI compute era. Where a photovoltaic panel converts sunlight directly to electricity, the P3 unit captures it as heat, holds that heat in a thermal battery, and converts it to electricity when the customer asks for it. The result is up to 24 hours of dispatchable power.",
        "The customers are utilities and data centers, the two parties most exposed to the gap between AI's appetite for firm power and the grid's ability to supply it. P3 units can be deployed with or without a grid interconnection, which matters when interconnection queues stretch for years. The systems are factory-built in the United States from abundant, low-cost materials, with no rare earth minerals.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The P3 is a three-stage machine. Proprietary Fresnel lenses and heat exchangers collect solar heat. A heat battery stores it at high temperature with minimal losses, and a heat engine converts the stored heat to electricity on demand, day or night. The company designs the unit for a 30-year lifespan with minimal maintenance, and because it ships from a factory instead of rising from a construction site, capacity scales by adding units rather than by permitting a new plant.",
        "Around the hardware, Exowatt offers ExoRise: powered land and energy for hyperscale data centers. The offering bundles land sited for utility-scale data centers, colocated solar-thermal generation with long-duration thermal storage, and modular data centers built for high-power AI workloads at gigawatt scale and beyond. The product is the ground the facility stands on as much as the generator.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Energy is one of the frontiers we exist to back. The binding constraint on AI has shifted from chips to electrons, delivered firm and around the clock at a price that makes the math work. Photovoltaics plus chemical batteries strain at that job. Exowatt's bet is that storing heat is cheaper than storing electrons, and that a repeatable factory product beats a bespoke construction project.",
        "That bet is won in unglamorous places, in lens yield, heat-engine reliability, and the cost curve of the ten-thousandth unit. Exowatt is assembling lenses, heat, land, and data centers into the thing the next decade of compute actually needs, which is power that shows up. Nothing about thermal storage demos well. It just runs through the night, and that is the entire point.",
      ],
    },
    ],
  },
  {
    slug: "apollo-atomics",
    title: "Apollo Atomics.",
    date: "July 8, 2026",
    dateISO: "2026-07-08",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Apollo Atomics builds compact pressurized-water reactors designed to turn nuclear power from a megaproject into a factory-built machine.",
    image: "/updates/covers/apollo-atomics.jpg",
    sections: [
    {
      body: [
        "Apollo Atomics is building compact pressurized-water reactors. The company starts with the nuclear technology that already powers most of the world's commercial reactors, then changes the part that makes the plant too large and too slow to deploy: the steam generator.",
        "That is the point of the company. Apollo is not trying to make nuclear work by betting everything on exotic fuel, a new coolant, or a supply chain that has to be invented from scratch. It keeps light water, low-enriched uranium, and familiar qualified components, then makes the steam system compact enough for a plant that can be factory-built and shipped.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The core product is a compact steam generator that replaces the massive, hand-built steam generator inside a conventional pressurized-water reactor with a component that is roughly twenty times smaller. Apollo says that change makes its reactor roughly forty times more compact, while preserving the physics and operating base regulators and utilities already know.",
        "The roadmap is a family of truckable reactors: A-10 at 10 megawatts electric, A-50 at 50 megawatts electric, and A-300 at 300 megawatts electric. The first customers are the ones that cannot wait a decade for power: data centers, industrial offtakers, and utilities that need firm clean electricity or process heat on a deployment timeline measured in years, not generations.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Nuclear is usually discussed as physics, but most of the failure mode is delivery. Plants arrive late because the work is bespoke, construction-heavy, and hard to repeat. Apollo's wedge is a manufacturing wedge: make the key component compact, testable, transportable, and contracted at a fixed price, then let the rest of the plant shrink around it.",
        "Assil and Drew have the right kind of founder mix for that job. Assil brings reactor design and operating depth from MIT and commercial nuclear work. Drew brings manufacturing and operations experience from electric hardware companies and the White House. We backed the founders and team because compact nuclear only matters if it can actually ship, and Apollo is built around that constraint.",
      ],
    },
    ],
  },
  {
    slug: "aalo-atomics",
    title: "Aalo Atomics.",
    date: "April 22, 2026",
    dateISO: "2026-04-22",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Factory-built nuclear plants for data centers, with the reactor treated as a manufacturing problem instead of a construction project.",
    image: "/updates/covers/aalo-atomics.jpg",
    sections: [
    {
      body: [
        "Aalo Atomics builds nuclear power plants on a production line. The flagship product is the Aalo Pod, a 50-megawatt-electric plant purpose-built for data centers. Instead of pouring a bespoke plant into the ground over a decade, Aalo manufactures reactor modules in a factory and assembles them on site. The target is electricity at three cents per kilowatt-hour.",
        "The company runs a 40,000-square-foot pilot factory and headquarters in Austin, Texas, with a second office in Idaho Falls. Aalo-X, its 10-megawatt-electric experimental plant, was unveiled at Idaho National Laboratory in 2026. By the company's account, it is the first new reactor at the lab in fifty years. Initial criticality is the next milestone on its roadmap.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The Pod is cooled by liquid metal, which pulls heat from the core faster than water or gas. By the company's numbers, the design extracts up to ten times more energy than other nuclear technologies of a similar physical size. Safety rests on passive systems. The plant can remove decay heat for 72 hours without power, and shutdown relies on diverse, independent mechanisms. The core itself has inherent negative reactivity.",
        "The manufacturing discipline shows in the sequence. Before fueling anything, Aalo built Aalo-0, a full-scale non-nuclear prototype, to surface assembly problems while they were still cheap. Aalo-X is the critical test reactor, and the Pod is the product. The stated next step is the Aalo Gigawatt Factory, where modules come off a production line at scale.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Nuclear's problem sits in construction rather than physics. Every plant has been a one-off civil-engineering project, and every overrun has run a decade. Aalo treats the reactor as a manufacturing problem and moves the work from the construction site to the factory floor, where tolerances tighten and unit costs fall with volume. That is assembly, and it is the kind of compounding advantage we look for.",
        "The demand already exists. Data centers need firm, clean power in 50-megawatt increments, sited where the load is. The work between here and that grid is licensing, fuel, coolant handling, and yield on a factory line, the long middle where nothing demos well. Aalo is built for that stretch. The prototype is assembled and the test reactor stands at Idaho. A factory is tooling up behind them.",
      ],
    },
    ],
  },
  {
    slug: "quaise-energy",
    title: "Quaise Energy.",
    date: "April 18, 2026",
    dateISO: "2026-04-18",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Quaise uses fusion-lab gyrotrons to vaporize rock miles down, turning superhot geothermal into clean baseload power almost anywhere.",
    image: "/updates/covers/quaise-energy.jpg",
    sections: [
    {
      body: [
        "Quaise Energy drills for heat. The company is building millimeter wave drilling systems to reach superhot rock, up to 500°C and as deep as 20 kilometers, far beyond where conventional geothermal wells stop. At those temperatures and pressures, geothermal is no longer a resource tied to volcanic geography. It becomes clean baseload power that can sit under almost any grid on Earth.",
        "The technology comes out of a decade of research by Paul Woskov at MIT's Plasma Science and Fusion Center. Co-founders Carlos Araque and Matthew Houde took the gyrotron, a tool built for fusion experiments, and aimed it at a different problem: rock too hot and too hard for any drill bit.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "A Quaise rig starts conventionally, with rotary drilling down to basement rock. Then the gyrotron takes over. It generates high-power millimeter waves at the surface, and standard tubing acts as the waveguide carrying the beam downhole. The beam vaporizes the rock face, and a purge gas lifts the vaporized rock back out. There is no bit grinding at the bottom of the hole, which is the part of deep drilling that breaks first.",
        "The plan deliberately reuses existing rigs, standard tubing, and fossil-fired infrastructure rather than replacing them. The first power project is Project Obsidian in Central Oregon. Its first phase is 50 megawatts, designed to grow to 250 as more wells are developed, targeting commercial operation by 2030. Araque states the ultimate goal plainly. He wants to replace every oil and gas well with a supercritical geothermal well providing the same energy.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Energy is the substrate under everything else we back. AI, semiconductors, and manufacturing all reduce to demand for cheap, firm power. Most clean generation is intermittent or geographically stranded. Heat at 20 kilometers is neither. If Quaise works, the answer to baseload decarbonization is a new hole rather than a new grid.",
        "We also like how the company is built. It combines fusion-lab physics and oilfield drilling practice with utility-scale project development, an assembly no single industry would have produced on its own. The years ahead are waveguides that survive depth, materials that hold up at 500°C, and well completions nobody has done before. This is the long middle, where nothing demos well. Quaise signed up for exactly that part, and that is why we signed up with them.",
      ],
    },
    ],
  },
  {
    slug: "unspun",
    title: "Unspun.",
    date: "April 15, 2026",
    dateISO: "2026-04-15",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Unspun builds Vega, an automated 3D weaving system that turns yarn directly into garments, cutting lead times from months to days.",
    image: "/updates/covers/unspun.jpg",
    sections: [
    {
      body: [
        "Unspun builds automated machines that weave clothing directly from yarn. Its 3D weaving system, Vega, starts with thousands of individual yarns and weaves them into three-dimensional textiles with no seams. The garment takes shape on the machine rather than on a sewing line assembling cut panels, and entire steps of the conventional cut-and-sew process are skipped.",
        "The consequence is speed and proximity. Conventional apparel runs on long lead times: brands forecast demand and place bulk orders with factories an ocean away, then mark down or destroy whatever the forecast got wrong. Unspun says a Vega machine compresses production lead time from months to days. At that speed, a brand can produce in small batches with little inventory, or on demand with none.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Vega is built for onshore and on-demand production of woven apparel. Because the machine forms the woven structure directly, steps of conventional manufacturing (spreading, cutting, most of the sewing) drop out. Unspun's claim is that this makes nearshore and onshore production financially feasible without sacrificing competitiveness, and lets brands adjust production to what the market actually does.",
        "The machines are already making real product. Unspun has partnered with Walmart and Decathlon, and Vega-woven pieces have appeared on the runway with Eckhaus Latta.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Apparel is one of the largest manufacturing industries on earth and one of the least automated. Sewing has defeated automation for decades because limp fabric is hard for machines to handle. That difficulty is much of why the industry chased low-cost labor offshore. Unspun's answer is to stop handling fabric altogether and build the garment at the yarn level, where a machine can hold every thread under tension. That is a harder machine to build, and a better problem to own.",
        "This is the work we look for. Progress at Unspun is measured in yarn handling, weave quality, machine uptime, and cost per garment, the long middle where nothing demos well. If the machines keep getting faster and cheaper, the factory moves back to where the customer is, and a supply chain built on container ships and forecasts becomes a room of machines making what people already bought.",
      ],
    },
    ],
  },
  {
    slug: "mav-unlimited",
    title: "MAV Unlimited.",
    date: "July 9, 2026",
    dateISO: "2026-07-09",
    category: "Portfolio",
    author: "All Together",
    excerpt: "MAV Unlimited builds volumetric 3D printers that cure whole engineering-grade parts in minutes instead of printing layer by layer for hours.",
    image: "/updates/covers/mav-unlimited.jpg",
    sections: [
    {
      body: [
        "MAV Unlimited is building volumetric manufacturing. Conventional 3D printers build parts one layer at a time, which makes them slow and leaves layer interfaces where parts can fail or scatter light. MAV projects light images into resin and cures the whole part at once.",
        "The result is a different manufacturing loop. The company says it can make optically clear, layerless parts in about three minutes, versus roughly five hours for a typical engineering-grade part on a commercial printer. That matters because speed is not just convenience. It changes whether additive manufacturing can become production rather than prototyping.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "MAV's machine uses volumetric printing to cure parts inside a resin volume rather than tracing toolpaths through layers. The company says the process can handle materials up to 100 times more viscous than traditional 3D printing resins, which expands the path toward structurally useful, engineering-grade parts. It can also print around inclusions, curing polymer around metals, electronics, sensors, antennas, magnets, and board assemblies that would otherwise need to be added in a later step.",
        "The origin is serious research. Computed axial lithography proved that parts could be printed volumetrically, nearly all at once. MAV co-founder Professor Robert Shepherd patented a new approach that the company says prints 30 times the volume of the original invention at 10 times the speed. The Engine describes MAV as developing a large-format volumetric additive manufacturing system up to 50 times faster than the next fastest commercial 3D printer, aimed at high-performance, customized parts across aerospace, defense, medical, footwear, and other markets.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Manufacturing is one of the places where the hard frontier becomes visible. The bottleneck is not a dashboard. It is tooling, cycle time, material properties, and whether a part can be made locally at a cost and quality that customers will accept. MAV is attacking those constraints at the process level.",
        "Aaron, Robert, T.J., and the team combine business operating experience, materials science, mechanical engineering, and a manufacturing process that changes the geometry of the problem. If it works, parts move from hours to minutes, from layers to volumes, and from centralized runs to local, on-demand production. That is exactly the kind of physical leverage we like to back.",
      ],
    },
    ],
  },
  {
    slug: "lance",
    title: "Lance.",
    date: "April 11, 2026",
    dateISO: "2026-04-11",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Lance builds AI agents that answer hotel guests and then finish the work inside the hotel's own software.",
    image: "/updates/covers/lance.jpg",
    sections: [
    {
      body: [
        "Lance builds AI agents that staff hotels. The agents pick up guest calls, respond over SMS and email, and then do the work the request requires inside the hotel's existing software. That can mean opening a work order, modifying a reservation, or coordinating housekeeping. The request gets completed instead of logged.",
        "Hotels run on old systems. The property management software predates modern APIs, and so do the reservation tools and task platforms. None of it is getting replaced anytime soon. Lance's agents operate that software visually, on screen, the way a front-desk employee would, with no custom development and no vendor integration projects. One customer quoted on the company's site says Lance cut front desk call volume by more than 30 percent.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Lance describes the product as a multimodal AI workforce, with voice, SMS, email, and vision in one system. Guests see the conversation layer. The harder part comes after the guest hangs up, when the agent navigates the property's management system, along with its reservation tools and task platforms, and executes the request end to end.",
        "The mechanism is computer use. Because the agents work the screen rather than an API, they can run on legacy systems other AI tools can't touch, which covers much of what is actually installed in hotels today. That choice trades integration elegance for coverage, and coverage is what the market is.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Computer-use agents that complete tasks reliably in messy, decades-old software are a hard AI problem, and hospitality is a sharp place to solve it. Labor is thin and phones still carry the load, while the software stack punishes anything that requires a custom integration. A chatbot that drafts a ticket doesn't change a hotel's operating math. An agent that owns the outcome is the version of this that does.",
        "The work from here is reliability per task and edge cases at 2 a.m., one property going live at a time. Very little of it will look like an announcement. Lance is built for that middle, and the team is doing the unglamorous part on purpose. That is why we backed them.",
      ],
    },
    ],
  },
  {
    slug: "samply",
    title: "Samply.",
    date: "April 9, 2026",
    dateISO: "2026-04-09",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Samply gives music producers one place to store, stream, and get feedback on their audio. Files stay lossless and private, and every version is kept.",
    image: "/updates/covers/samply.jpg",
    sections: [
    {
      body: [
        "Samply is audio file sharing for music producers. A producer's working material (samples, stems, bounces, mixes) tends to live everywhere at once, scattered across hard drives, cloud folders, email threads, and text messages. Samply gives it one home, organized and playable from any device.",
        "The product also covers the part of production that happens between people. Producers share private links and collaborators stream the audio losslessly. Feedback arrives as time-coded comments pinned to the exact second in the track. Versions stay attached to the project instead of multiplying in a downloads folder.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The core is a private streaming layer for audio files. Lossless matters here because compressed previews change what a producer hears, and mixing decisions ride on details that compression throws away. Samply streams the full-resolution file to whatever device the listener opens (the company ships a web app and an iOS app), so the reference everyone reacts to is the actual audio rather than an approximation of it.",
        "Around that core sits the collaboration tooling: time-coded comments, version history, password protection and download prevention for sends that need to stay contained, and imports from the storage producers already use, including Dropbox. The product is shaped more like a working surface than a new instrument, the place a track lives from rough loop to final master.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Most of our portfolio sits on the hard frontier, in defense, energy, semiconductors, and robotics. Samply is a different domain, but the principle is the same. The valuable work is rarely the demo. Music production runs on file handling (naming, versioning, sending, re-sending), and that layer has long been an afterthought, duct-taped together from generic cloud drives and chat apps.",
        "Samply picked the unglamorous middle of a creative industry and is building it directly, from storage and streaming to comments and versions. Producers do not need another synthesizer. They need the plumbing between collaborators to hold, and that is the part Samply is building.",
      ],
    },
    ],
  },
  {
    slug: "hark",
    title: "Hark.",
    date: "April 4, 2026",
    dateISO: "2026-04-04",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Hark is building personal intelligence, developing foundation models, AI-native hardware, and its own compute as one stack.",
    image: "/updates/covers/hark.jpg",
    sections: [
    {
      body: [
        "Hark builds personal intelligence: foundation models paired with hardware the company designs itself. The system listens and speaks, sees the world around it, builds persistent memory of its user, and acts on its own initiative. Hark describes the goal as a new interface to artificial intelligence.",
        "The company is about 70 people. It raised more than $700 million in Series A funding at a $6 billion post-money valuation, led by Parkway Venture Capital, with NVIDIA, AMD Ventures, Intel Capital, Qualcomm Ventures, and Salesforce Ventures among the participants. Four semiconductor firms on the cap table of a consumer company is a tell that the hard problems here go beyond software. The product is entering beta now; the full platform launches this summer.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The models come first. Hark is training them from scratch. They are agentic and multimodal, handling speech, text, and vision in one architecture rather than stitching together separate systems. Around the models sits memory. The assistant is designed to remember its user across time and act proactively, managing a person's digital life instead of waiting for a prompt.",
        "The other half is physical. Hark is designing AI-native devices to carry these models, and it is building the compute underneath them, including its own NVIDIA B200 data center. One team develops the models, the devices, and the infrastructure as a single stack, so the parts fit.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Most consumer AI products are a thin layer on someone else's model, reached through hardware designed for a previous era of computing. Hark is taking the longer route, training the models, building the devices, and owning the compute. Little of that work demos well (training runs, memory architecture, data center buildout). It is the long middle, where the product gets made.",
        "We back teams that assemble whole systems rather than features. A computer that listens, sees, and remembers a person is a whole system, built from semiconductor partners, native hardware, owned infrastructure, and models trained for the job. The bet is seventy people taking all of it on at once, with the capital to finish.",
      ],
    },
    ],
  },
  {
    slug: "campus",
    title: "Campus.",
    date: "April 1, 2026",
    dateISO: "2026-04-01",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Campus is an accredited online college putting live, professor-taught degrees within reach of a Pell Grant.",
    image: "/updates/covers/campus.jpg",
    sections: [
    {
      body: [
        "Campus is an accredited online college that grants associate degrees in as little as two years. Classes are taught live rather than as recorded lectures, and many of the professors also teach at universities like NYU and UCLA. The degree programs are practical: business with an applied AI concentration, plus information technology and healthcare administration.",
        "The point is access. Tuition is $7,320 a year, and many enrolled students cover it entirely through the federal Pell Grant program, with nothing out of pocket and no debt. Campus provides laptops and Wi-Fi to students who need them and assigns each student a personal success coach for tutoring, career services, and wellness support. Just over 3,000 students are enrolled today, and the graduation rate for full-time, first-time students is 68 percent, well above the community-college norm.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The product is a college, and a college is mostly infrastructure. Campus holds accreditation from the Accrediting Commission for Community and Junior Colleges, a lineage that runs back to 1999 through the institution formerly known as MTI College. That accreditation is what makes its students eligible for federal aid.",
        "On top of it sits the delivery system, which covers live synchronous instruction, the coaching operation, and the software that holds it all together. Jerome Pesenti, who held VP roles at Meta and IBM Watson, runs technology as CTO, a serious hire for a two-year college and a signal of where the advantage lies. Graduates can stop with the degree or use it as a transfer path into four-year universities.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Most education startups sell software around the edges of the institution. Founder Tade Oyerinde, who previously built Campuswire into a platform used at more than 300 universities, took the harder route of becoming the institution. That meant accreditation and federal aid eligibility, then the slow work of enrollment, retention, and graduation rates. It added up to years of certification and operations where nothing demos well.",
        "That is the kind of assembly we look for. The hard part is bolting live instruction, coaching, hardware, and federal aid plumbing into one accredited machine that a Pell Grant can pay for. No single technology does that. If Campus holds its graduation rate as it scales, it will have rebuilt the community college. The transfer on-ramp to four-year universities will run through it.",
      ],
    },
    ],
  },
  {
    slug: "bud-break-innovations",
    title: "Bud Break Innovations.",
    date: "March 30, 2026",
    dateISO: "2026-03-30",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Autonomous scouting robots that photograph every vine, flagging disease early and forecasting yield for specialty-crop growers.",
    image: "/updates/covers/bud-break-innovations.jpg",
    sections: [
    {
      body: [
        "Budbreak Innovations builds autonomous scouting robots for specialty agriculture. Its robot, Emma, drives vineyard and orchard rows on its own, photographing every plant in high resolution. The company's AI turns those images into a per-plant record of disease, canopy condition, and crop load. The record amounts to a digital twin of the field, updated with every pass.",
        "Crop scouting today is mostly people walking rows and sampling what they can reach. Emma scans every plant. The robot is already working in wine grapes as well as blueberries and lettuce, with deployments across Napa, Sonoma, Lodi, and the Finger Lakes. The company is taking applications for its 2026 closed beta.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Emma runs ATV-mounted or as a standalone autonomous ground robot. It handles slopes and variable row widths, and it works in both sunny and cloudy conditions with minimal setup on the farm. The detection models flag red blotch, leafroll, powdery mildew, downy mildew, and nutrient deficiencies. Catching these earlier cuts crop loss and unnecessary sprays, and it lets growers isolate infected areas before problems spread. The same imagery drives yield estimation. Counts of buds, clusters, and berries, along with weight forecasts, inform thinning and irrigation as well as labor planning.",
        "Results land in BudBase, the company's analytics platform. Growers see a map of exactly which vines need attention, filterable by block, with priority plants flagged and an exportable action plan. Every scan also feeds the models, so detection gets more accurate as acreage accumulates. The company joined Cornell Tech's Runway startup program in 2025, and Cornell research has shown robotic scouting matching highly trained human scouts at detecting vineyard diseases.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Field robotics is a hard frontier. The machine has to survive mud, dust, slope, and glare, and the models have to tell powdery mildew from dirt on a leaf, from a moving platform, week after week as the biology changes. None of this demos well. It gets built row by row, season by season, on working farms. That is the kind of work we want to back.",
        "Budbreak is also an assembly story. Cameras, an autonomy stack, plant-pathology models, and grower software combine into one loop: scan, map, action plan, and back into the next model. Specialty crops carry high value per acre and a shrinking labor pool. The grower who sees every plant first makes better calls on sprays, water, and harvest, and Budbreak is building the machine that lets a grower see every plant.",
      ],
    },
    ],
  },
  {
    slug: "maven-robotics",
    title: "Maven Robotics.",
    date: "March 26, 2026",
    dateISO: "2026-03-26",
    category: "Portfolio",
    author: "All Together",
    excerpt: "A general-purpose industrial robot combining strength, dexterity, and physical AI, from a small team out of Apple, Tesla, Cruise, and Boeing.",
    image: "/updates/covers/maven-robotics.jpg",
    sections: [
    {
      body: [
        "Maven Robotics is building a new kind of working robot, a general-purpose machine that is purpose-built for industry. The company describes it as combining strength, adaptive dexterity, fluid mobility, and what it calls the most reliable physical AI. Its customer is manufacturing and logistics, where the work is physical and repetitive, and most of it is still done by hand.",
        "The company is based in Silicon Valley, and the team is small. Its engineers and scientists come from Apple, Tesla, Cruise, Boeing, Ford, Rivian, and McLaren Racing, with roots at MIT, Stanford, Carnegie Mellon, Berkeley, and Harvard. Maven is already working with some of the largest global manufacturing and logistics organizations, and it says the goal is automation that businesses of every scale can afford.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Maven is building the whole machine, from the hardware and software through to the AI that runs it. The robot is designed to work safely alongside people and to compete on cost rather than novelty. Open roles describe the stack plainly: mechanical and compute hardware, real-time embedded software, foundation models, perception and manipulation, motion planning and controls, and data collection operators. That last role matters. General-purpose manipulation is a data problem as much as a modeling problem, and Maven is staffing for it.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Industrial robotics is hard in the ways we look for. The demo is the easy part; the product is uptime, safety, cost per task, and a robot that runs the second shift the same as the first. Maven is taking on mechanical hardware, compute, real-time software, and learned manipulation all at once, because in this category integration is the advantage. You cannot buy your way to a working robot. It has to be assembled.",
        "Physical labor is one of the largest markets there is, and industry is where the willingness to pay already exists. We backed Maven because the team has shipped hardware at companies that punish sloppiness, and because they are pointed at work measured in throughput rather than applause. Most of what comes next will not be announcements. We are comfortable with that.",
      ],
    },
    ],
  },
  {
    slug: "eccentric-machines",
    title: "Eccentric Machines.",
    date: "March 23, 2026",
    dateISO: "2026-03-23",
    category: "Portfolio",
    author: "All Together",
    excerpt: "A new actuator architecture for robotic motion and control, built for the next wave of robotics and embodied AI.",
    image: "/updates/covers/eccentric-machines.jpg",
    sections: [
    {
      body: [
        "Eccentric Machines is rearchitecting robotic motion and control around a fundamentally new actuator architecture, built for the next wave of robotics and embodied AI. The actuator (the motor, transmission, and control electronics at every robot joint) is what turns a command into physical motion. Its tagline is two words, reimagine motion.",
        "The timing matters. Robot intelligence is improving fast, and models can now plan movements the hardware underneath struggles to execute. Most robots still run on actuators adapted from industrial automation, parts that are heavy and stiff, tuned to repeat one motion inside a cage. Eccentric Machines starts at that gap.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The product is an actuator architecture rather than a robot. In the company's words, they are \"rearchitecting robotic motion and control with a fundamentally new actuator architecture.\" The actuator sets the limits on everything a robot does: how much force it applies, how fast it reacts, how precisely it moves, how long it runs on a battery, and what the machine costs to build. Improve the actuator and every robot built on top of it improves.",
        "This is physical, unglamorous work. Actuator development is torque curves, thermal limits, machining tolerances, and test rigs, hardware that either holds up under load or does not. There is no shortcut through it, which is part of the point.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Our thesis is that the next decade belongs to companies doing the hard physical work underneath the software everyone can see. Robotics is the clearest case. The models are arriving, but the bodies are not. Actuators are among the most constraining components in a modern robot, and a company that solves them becomes infrastructure for the field, for every arm, leg, and gripper that follows.",
        "Eccentric Machines is building at exactly that layer, below the demo, at the joint where intelligence becomes motion. That is the kind of company we back. The work is measured in prototypes and test cycles rather than announcements.",
      ],
    },
    ],
  },
  {
    slug: "array-labs",
    title: "Array Labs.",
    date: "March 19, 2026",
    dateISO: "2026-03-19",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Array Labs flies clusters of small radar satellites that measure Earth's surface in native 3D, through clouds and darkness.",
    image: "/updates/covers/array-labs.jpg",
    sections: [
    {
      body: [
        "Array Labs designs, builds, and operates radar satellites that fly in formation. Instead of one large spacecraft carrying one large radar, the company flies clusters of small satellites designed for mass production, imaging the same patch of ground from multiple angles at once. The output is native 3D imagery, a direct measurement of the Earth's shape rather than photographs draped over an old terrain model.",
        "Radar earns its keep where cameras fail. It sees at night and through cloud cover, which matters when the customer is a planner who cannot wait for a clear day. Array Labs is based in Silicon Valley. Its work has drawn support from DARPA, the Office of Naval Research, SOCOM, and the U.S. Navy, alongside investment from Y Combinator and In-Q-Tel.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The stack has three layers. The bottom layer is turnkey radar sensors built for mass production, on the bet that radar satellites should be manufactured like products instead of commissioned like ships. Above that sit the multistatic clusters, distributed groups of those satellites imaging cooperatively to deliver native 3D imaging and real-time moving-target indication at a fraction of the cost of a single large aperture.",
        "At the top sits the product most people will touch: digital elevation models of the Earth at up to 10-centimeter resolution. Today's global terrain data is coarse and years stale. A current, fine-grained model of the planet's surface is useful to anyone who plans against the physical world, militaries first and then everyone else.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "This is the kind of company we exist to back. Multistatic radar from small satellites means solving formation flying and precision timing, and synchronizing spacecraft that move at orbital speed. Those problems do not yield to a pivot or a clever launch announcement. The work is RF hardware, orbital mechanics, and manufacturing, and most of it will never demo well.",
        "We also like what the architecture implies. Clusters of cheap, modular satellites improve the way fleets do, unit by unit and launch by launch. Each added spacecraft compounds the value of the ones already flying. If Array Labs gets the swarm right, the prize is the base map for everything that moves on or above the Earth, refreshed in something close to real time.",
      ],
    },
    ],
  },
  {
    slug: "commons-clinic",
    title: "Commons Clinic.",
    date: "March 17, 2026",
    dateISO: "2026-03-17",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Value-based specialty care in Los Angeles, from bundled-price orthopedics and an owned surgery center to whole-body diagnostics.",
    image: "/updates/covers/commons-clinic.jpg",
    sections: [
    {
      body: [
        "Commons Clinic is a specialty care group in Los Angeles. It treats spine, joint, and orthopedic conditions across clinics including Santa Monica, Marina del Rey, Long Beach, and Beverly Hills, and runs its own outpatient surgery center, the Marina Orthopedic & Spine Institute. The unit of sale is the whole episode of care rather than the visit, from first consult through recovery, at one bundled price.",
        "That structure cuts against the grain of American orthopedics, where fee-for-service pays per procedure and the bill arrives in pieces. Commons quotes one transparent price covering the surgeon, the facility, anesthesia, implants, imaging, and post-operative recovery. Because the company is not paid more for operating more, its stated default is the least invasive path that works; its physicians recommend surgery only when necessary. It says patients spend nearly three times longer with their physician than the national average.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Commons runs clinics, an ambulatory surgery center, on-site imaging and physical therapy, virtual visits, and post-operative recovery programs as one operation, a vertically integrated specialty care system. The surgical work uses current tooling aimed at faster recovery, including Mako robotic joint replacement, artificial disc replacement, and minimally invasive technique. On the payer side, Commons is in-network with major insurers and connects to employer surgical benefit programs through Carrum, Transcarent, and LanternCare, which give eligible employees surgery at zero out-of-pocket cost.",
        "The newest layer is Wholebody Assessment, a full-body MRI plus more than 100 biomarker labs, read by a care team and sold as preventive diagnostics. It extends the model from fixing joints to finding problems early, which is where the bundled-price logic points. A clinic accountable for the whole episode does better when it catches things sooner.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "We back companies that build through certification, contracts, and physical plant, the parts that don't demo well. Care delivery is all of that. Standing up a surgery center means leases, licensure, payer negotiations, surgeon recruitment, and operating-room logistics. That work compounds slowly and is hard to copy. A bundled price is easy to put on a website and hard to honor; you can only quote one number if you control every line item underneath it. Commons built that control the long way, by owning the stack.",
        "Healthcare is one of the largest industries in the country and one of the least assembled. Commons is assembling a piece of it, one clinic, contract, and operating room at a time.",
      ],
    },
    ],
  },
  {
    slug: "plena-health",
    title: "Plena Health.",
    date: "March 15, 2026",
    dateISO: "2026-03-15",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Plena Health is the AI operating system for specialty medical practices, automating the back-office work that keeps clinics running.",
    image: "/updates/covers/plena-health.jpg",
    sections: [
    {
      body: [
        "Plena Health builds the AI operating system for specialty medical practices. The company automates the administrative workflows that keep clinics running: referrals, fax intake, scheduling, procedure compliance, records, prior authorizations, billing, and collections. It is aimed at the work around the medicine rather than the medicine itself.",
        "The important architectural choice is that Plena does not ask practices to rip out the systems they already use. It runs across EHRs, faxes, phones, clearinghouses, payer portals, and patient communication tools, taking over the rote work end to end while leaving the practice's existing stack in place.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Specialty practices are operationally dense. A single referral can mean reading a fax, matching a patient, extracting clinical details, checking insurance, updating the EHR, attaching documents, routing tasks, and chasing missing information. Multiply that across dozens of workflows every day and the clinic becomes a system of people manually bridging software that was never built to talk to itself.",
        "Plena's answer is a base platform of reusable workflow primitives, integrations, and agent harnesses that can be assembled around each practice. Customers can start with one painful workflow, such as referrals, collections, or scheduling, and expand as the system proves itself. That is the wedge: do the work, then become the operating layer.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "We like companies that choose the ugly, operationally real version of a market. Healthcare AI is full of demos. Plena is focused on the back office: faxes, portals, phone calls, insurance checks, and the exact handoffs that decide whether a clinic runs smoothly. Those are not glamorous workflows, but they are where labor, revenue, and patient access actually get stuck.",
        "Eyad and Ahmed grew up around medicine and then built in serious engineering environments: Datadog, Shopify, AWS, and nuclear systems. That combination matters. Selling into specialty practices requires empathy for clinical operations, and building the product requires infrastructure that does not fall over. Plena is taking on both.",
      ],
    },
    ],
  },
  {
    slug: "corgi",
    title: "Corgi.",
    date: "March 12, 2026",
    dateISO: "2026-03-12",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Corgi is rebuilding business insurance for startups as one full-stack machine, with underwriting, policy design, and claims under one roof.",
    image: "/updates/covers/corgi.jpg",
    sections: [
    {
      body: [
        "Corgi sells business insurance to startups. A founder fills out an application and gets a quote in minutes. Coverage can be bound the same day. Policies are modular (general liability, cyber, directors and officers, tech and AI liability) and packaged by stage, from pre-seed through growth, so coverage grows with the company instead of getting renegotiated around it.",
        "The company is full-stack rather than a broker sitting on someone else's paper. Corgi controls underwriting, policy design, and claims in one place; its policies are underwritten through Technology Risk Retention Group and administered by its own licensed producer. Customers include Deel, Bland, and Origami. The company has announced $108 million in funding across its seed and Series A.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "Legacy commercial insurance runs a startup through broker review, manual risk audits, and underwriting cycles measured in days or weeks. Corgi replaces that pipeline with a self-serve application and underwriting software it owns end to end, so the product is the whole machine rather than a storefront. Owning the stack is what makes the speed real, because there is no outside carrier waiting on the other side of the quote.",
        "That ownership also lets Corgi write lines that older carriers handle badly. Tech and AI liability covers products that did not exist when standard policy forms were drafted. An underwriter that designs its own policies and handles its own claims can price that risk from data instead of precedent, and tighten the loop with every policy written.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Insurance is a trillion-dollar industry held together by paper, and rebuilding it does not look like a software demo. The work is licenses, state filings, policy forms, reserves, and claims handling, the long middle where nothing demos well. Corgi could have rented a carrier's balance sheet and called the markup a product. It chose to own all of it. That is the pattern we look for, because assembling the hard, regulated parts into one machine is where the durable advantage sits.",
        "There is a second reason. We back companies in AI, defense, energy, and robotics, and they generate risks no standard form anticipated. Someone has to underwrite the frontier, and Corgi is building the insurer that can.",
      ],
    },
    ],
  },
  {
    slug: "aformic",
    title: "Aformic.",
    date: "March 9, 2026",
    dateISO: "2026-03-09",
    category: "Portfolio",
    author: "All Together",
    excerpt: "Aformic builds autonomous mobile robots and the QURSOR fleet software that move pallets, carts, and racks across factory floors.",
    image: "/updates/covers/aformic.jpg",
    sections: [
    {
      body: [
        "Aformic builds autonomous mobile robots for factory and warehouse intralogistics, the transport work between dock, line, and rack that most plants still do with forklifts and manual labor. The company is headquartered in Duncan, South Carolina, with operations in Gliwice, Poland.",
        "The product has two halves. F Series robots do the physical work. They move pallets and lift loads, and they slide under carts. QURSOR, the company's fleet management platform, handles the coordination, assigning tasks and planning paths while monitoring the whole floor in real time.",
      ],
    },
    {
      heading: "What they're building",
      body: [
        "The F Series spans ten models. The lifting robots are automated versions of familiar machines, from pallet jacks and stackers to counterbalance forklifts and a reach truck that lifts 1,600 kilograms to 4.8 meters. The underride robots slide beneath carts and racks, with payloads from 300 kilograms up to 6,000. Navigation is SLAM-based, and the robots pair 360-degree obstacle detection with 3D cameras and Sick safety laser scanners. Positioning accuracy is one centimeter on most models.",
        "QURSOR is the part that makes a fleet usable. It assigns tasks, plans paths, coordinates multiple robots, tracks inventory, and supports Kanban workflows. The software is built for plants as they actually are, where aisles are tight and people and forklifts share lanes, with AGVs from other vendors already on the floor. It integrates with existing factory IT and OT rather than demanding a greenfield.",
      ],
    },
    {
      heading: "Why we backed the founders and team",
      body: [
        "Intralogistics is a physical bottleneck, and it does not yield to software alone. Aformic builds the machine and the coordination layer together, from drives, masts, and safety scanners to the fleet logic that keeps a busy floor from gridlocking. That is assembly in the sense we mean it. Hardware, safety systems, and software are integrated into something a plant manager can actually run.",
        "Most of this work never demos well. It is safety certification, sensor calibration, integration with control systems written decades ago, and the slow accumulation of uptime in facilities that cannot afford to stop. We back companies that take that work on. Aformic does it from a base in South Carolina's Upstate manufacturing corridor, robot by robot, plant by plant.",
      ],
    },
    ],
  },
];
