// Comprehensive Data for all 17 Computer Science & Tech Subjects
export const allSubjectsData = {
  "al": {
    slug: "al",
    title: "Artificial Intelligence",
    shortTitle: "AI & Neural Networks",
    tagline: "Master deep learning, neural architectures, LLMs, and autonomous intelligent systems.",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "42,850",
    coursesCount: 24,
    avgRating: 4.88,
    durationWeeks: "16-24 weeks",
    level: "Intermediate to Advanced",
    overview: "Explore the frontiers of modern Artificial Intelligence. From foundational mathematical principles of gradient descent and neural network theory to fine-tuning state-of-the-art Large Language Models, computer vision transformers, and autonomous reinforcement learning agents.",
    modules: [
      {
        title: "Module 1: Foundations of Machine Intelligence",
        duration: "4 Weeks",
        topics: ["Linear algebra & multivariate calculus for AI", "Probabilistic graphical models & Bayes theorem", "Loss functions, optimization & backpropagation", "Data preprocessing and vector embeddings"]
      },
      {
        title: "Module 2: Deep Learning & Neural Architectures",
        duration: "6 Weeks",
        topics: ["Convolutional Neural Networks (CNNs) for vision", "Recurrent networks and LSTM architectures", "Attention mechanisms and Transformer foundations", "PyTorch and TensorFlow production pipelines"]
      },
      {
        title: "Module 3: Generative AI & Large Language Models",
        duration: "6 Weeks",
        topics: ["Pre-training vs Fine-tuning (LoRA, QLoRA)", "Retrieval-Augmented Generation (RAG) architectures", "Vector databases (Pinecone, Chroma, Milvus)", "Prompt engineering & AI safety guardrails"]
      },
      {
        title: "Module 4: Reinforcement Learning & Autonomous Agents",
        duration: "4 Weeks",
        topics: ["Markov Decision Processes & Q-Learning", "Policy gradient methods & PPO", "Multi-agent systems & MCP tooling", "Deploying AI models to edge and cloud inference"]
      }
    ],
    careerRoles: [
      { role: "AI Research Scientist", avgSalary: "$165,000 - $240,000", companies: ["Google DeepMind", "OpenAI", "Meta AI", "Anthropic"] },
      { role: "Machine Learning Engineer", avgSalary: "$140,000 - $195,000", companies: ["Amazon", "Microsoft", "Uber", "NVIDIA"] },
      { role: "LLM Solutions Architect", avgSalary: "$150,000 - $210,000", companies: ["Databricks", "Snowflake", "Stripe", "Palantir"] }
    ],
    featuredCourses: [
      { id: "ai-101", title: "Deep Learning Specialization with PyTorch", instructor: "Dr. Andrew Patel", rating: 4.9, reviews: 1420, price: "$89", level: "Intermediate", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80" },
      { id: "ai-102", title: "Enterprise RAG & Generative AI Systems", instructor: "Sarah Jenkins", rating: 4.85, reviews: 980, price: "$99", level: "Advanced", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80" },
      { id: "ai-103", title: "Computer Vision from Scratch to Transformers", instructor: "Marcus Vance", rating: 4.92, reviews: 1105, price: "$79", level: "Intermediate", image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "What prerequisites do I need for this track?", a: "A comfortable foundation in Python programming and high-school level linear algebra and calculus is recommended." },
      { q: "Will I build real portfolio projects?", a: "Yes, you will construct a custom transformer from scratch, deploy a production RAG application, and build an autonomous agent." },
      { q: "Are cloud GPUs provided for training?", a: "Yes, our interactive browser lab environment provides hosted GPU compute allocations for all enrolled students." }
    ]
  },
  "cloud-computing": {
    slug: "cloud-computing",
    title: "Cloud Computing",
    shortTitle: "AWS, Azure & Cloud Native",
    tagline: "Architect scalable, fault-tolerant, and secure distributed cloud systems on AWS, Azure, and GCP.",
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "38,200",
    coursesCount: 28,
    avgRating: 4.86,
    durationWeeks: "14-20 weeks",
    level: "Beginner to Advanced",
    overview: "Master the cloud infrastructure that powers modern software engineering. Learn cloud architectures, container orchestration, serverless computing, infrastructure-as-code, and disaster recovery across the top cloud providers.",
    modules: [
      {
        title: "Module 1: Cloud Architecture Fundamentals",
        duration: "3 Weeks",
        topics: ["Virtualization, multi-tenancy & hypervisors", "VPCs, Subnets, Gateways & Security Groups", "Object storage, Block storage & Elastic File Systems", "IAM policies, RBAC & Cloud Governance"]
      },
      {
        title: "Module 2: Serverless & Microservices",
        duration: "4 Weeks",
        topics: ["AWS Lambda, Azure Functions & Cloud Run", "API Gateways, rate limiting & WebSocket support", "Event-driven architecture with Kafka & SQS", "DynamoDB, CosmosDB & managed caching with Redis"]
      },
      {
        title: "Module 3: Infrastructure as Code (IaC) & Automation",
        duration: "4 Weeks",
        topics: ["Terraform HCL modular provisioning", "AWS CloudFormation & CDK in TypeScript", "Immutable infrastructure with Packer", "GitOps continuous delivery with ArgoCD"]
      },
      {
        title: "Module 4: High Availability, Security & FinOps",
        duration: "4 Weeks",
        topics: ["Multi-region failover & Route53 latency routing", "Zero Trust cloud security architectures", "Cost optimization & FinOps budgeting models", "CloudWatch, Datadog & distributed tracing"]
      }
    ],
    careerRoles: [
      { role: "Cloud Solutions Architect", avgSalary: "$145,000 - $210,000", companies: ["Amazon AWS", "Microsoft", "Capital One", "Netflix"] },
      { role: "Site Reliability Engineer (SRE)", avgSalary: "$135,000 - $190,000", companies: ["Google", "Salesforce", "DoorDash", "Cisco"] },
      { role: "Cloud Security Specialist", avgSalary: "$140,000 - $200,000", companies: ["CrowdStrike", "Palo Alto Networks", "IBM", "Lockheed"] }
    ],
    featuredCourses: [
      { id: "cloud-101", title: "AWS Solutions Architect Professional Bootcamp", instructor: "David Thorne", rating: 4.91, reviews: 2310, price: "$95", level: "Intermediate", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80" },
      { id: "cloud-102", title: "Mastering Terraform & Multi-Cloud Infrastructure", instructor: "Elena Rostova", rating: 4.87, reviews: 1420, price: "$85", level: "All Levels", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" },
      { id: "cloud-103", title: "Kubernetes & Docker in Enterprise Cloud", instructor: "Kenji Sato", rating: 4.89, reviews: 1890, price: "$89", level: "Advanced", image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Does this prepare me for certification exams?", a: "Yes, the curriculum directly aligns with AWS Solutions Architect, Azure Administrator, and CKA (Certified Kubernetes Administrator) certifications." },
      { q: "Are cloud sandbox accounts included?", a: "Yes, you get sandboxed AWS and Azure accounts with pre-allocated credits to execute lab exercises safely without incurring personal bills." }
    ]
  },
  "code-foundations": {
    slug: "code-foundations",
    title: "Code Foundations",
    shortTitle: "Programming Basics & Logic",
    tagline: "Build rock-solid algorithmic problem solving, computational thinking, and software craftsmanship.",
    heroImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "64,100",
    coursesCount: 19,
    avgRating: 4.93,
    durationWeeks: "10-14 weeks",
    level: "Beginner",
    overview: "Whether you are entirely new to programming or brushing up on fundamental principles, Code Foundations breaks down programming logic, control flow, memory layout, clean code principles, and core algorithms into approachable, visual milestones.",
    modules: [
      {
        title: "Module 1: Computational Thinking & Syntax Basics",
        duration: "3 Weeks",
        topics: ["Variables, types, operators, and memory spaces", "Branching logic, boolean algebra, and condition matrices", "Loops, iteration patterns, and recursive thinking", "Functions, scope, closures, and call stack execution"]
      },
      {
        title: "Module 2: Essential Data Structures",
        duration: "4 Weeks",
        topics: ["Contiguous arrays, strings, and memory indexing", "Linked lists, stacks, and queue operations", "Hash tables, collision handling, and key-value lookups", "Trees, binary search trees, and tree traversals"]
      },
      {
        title: "Module 3: Fundamental Algorithms & Complexity",
        duration: "4 Weeks",
        topics: ["Asymptotic notation (Big-O, Big-Theta, Big-Omega)", "Searching algorithms (Linear, Binary, Interpolation)", "Sorting algorithms (Merge, Quick, Heap, Bubble)", "Two-pointer and sliding window algorithmic techniques"]
      },
      {
        title: "Module 4: Software Craftsmanship & Version Control",
        duration: "3 Weeks",
        topics: ["Git essentials: commits, branching, merging, pull requests", "Debugging strategies & writing unit test cases", "Clean Code principles & DRY architecture", "Building your first complete command-line software tool"]
      }
    ],
    careerRoles: [
      { role: "Junior Software Developer", avgSalary: "$75,000 - $110,000", companies: ["Tech Startups", "Consultancies", "Enterprise IT"] },
      { role: "Technical Support Engineer", avgSalary: "$65,000 - $95,000", companies: ["SaaS Firms", "HubSpot", "Zendesk"] }
    ],
    featuredCourses: [
      { id: "found-101", title: "Complete Computer Science Foundations", instructor: "Prof. Rachel Green", rating: 4.95, reviews: 3820, price: "$59", level: "Beginner", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" },
      { id: "found-102", title: "Algorithms & Logic in Practice", instructor: "Michael Chen", rating: 4.91, reviews: 2190, price: "$69", level: "Beginner", image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "I have never written a line of code. Is this for me?", a: "Absolutely! This track was created specifically for aspiring developers starting from ground zero with friendly visual explanations." }
    ]
  },
  "computer-science": {
    slug: "computer-science",
    title: "Computer Science",
    shortTitle: "CS Core, Systems & OS",
    tagline: "Master operating systems, computer architecture, compilers, databases, and theoretical computer science.",
    heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "51,400",
    coursesCount: 32,
    avgRating: 4.92,
    durationWeeks: "20-28 weeks",
    level: "All Levels",
    overview: "A rigorous, university-grade curriculum covering the core pillars of computer science: digital logic, computer organization, operating systems internals, concurrency, database management system internals, compiler design, and automata theory.",
    modules: [
      {
        title: "Module 1: Computer Architecture & Organization",
        duration: "5 Weeks",
        topics: ["Von Neumann architecture, CPU registers, ALU & buses", "Instruction Set Architecture (ISA) & x86/ARM assembly", "Memory hierarchy: L1/L2/L3 caches, cache coherence", "Pipelining, branch prediction, and superscalar execution"]
      },
      {
        title: "Module 2: Operating Systems Internals",
        duration: "6 Weeks",
        topics: ["Processes, threads, context switching & PCB", "CPU scheduling algorithms & multi-core balancing", "Process synchronization: mutexes, semaphores, deadlock detection", "Virtual memory, page tables, TLBs, and demand paging"]
      },
      {
        title: "Module 3: Database Internals & Storage Engines",
        duration: "5 Weeks",
        topics: ["B-Tree & LSM-Tree indexing algorithms", "ACID transactions, write-ahead logging (WAL), and MVCC", "Query execution engines, cost-based optimizers, and joins", "Distributed consensus: Raft, Paxos, and CAP theorem"]
      },
      {
        title: "Module 4: Theory of Computation & Compilers",
        duration: "6 Weeks",
        topics: ["Finite Automata (DFA, NFA) & Regular Expressions", "Context-Free Grammars & Pushdown Automata", "Turing machines, decidability, and P vs NP complexity", "Lexical analysis, parsing (LL/LR), ASTs & code generation"]
      }
    ],
    careerRoles: [
      { role: "Systems Software Engineer", avgSalary: "$150,000 - $225,000", companies: ["Apple", "Microsoft", "Intel", "AMD", "Linux Foundation"] },
      { role: "Database Kernel Developer", avgSalary: "$160,000 - $235,000", companies: ["Cockroach Labs", "MongoDB", "Oracle", "ClickHouse"] },
      { role: "Compiler Engineer", avgSalary: "$155,000 - $220,000", companies: ["NVIDIA", "Qualcomm", "Google", "LLVM Foundation"] }
    ],
    featuredCourses: [
      { id: "cs-101", title: "Operating Systems from Scratch to Kernel", instructor: "Dr. Vikram Sethi", rating: 4.96, reviews: 2980, price: "$99", level: "Advanced", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" },
      { id: "cs-102", title: "Database Systems Internals & Implementation", instructor: "Sophia Lin", rating: 4.93, reviews: 1840, price: "$89", level: "Intermediate", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is this suitable for GATE CSE, college exams, or FAANG systems interviews?", a: "Yes! Every topic is taught to the highest theoretical and practical standards required for top competitive exams and top-tier systems engineering interviews." }
    ]
  },
  "cybersecurity": {
    slug: "cybersecurity",
    title: "Cybersecurity",
    shortTitle: "InfoSec & Ethical Hacking",
    tagline: "Defend modern networks, master ethical penetration testing, cryptography, and zero-day threat analysis.",
    heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "35,900",
    coursesCount: 22,
    avgRating: 4.9,
    durationWeeks: "16-22 weeks",
    level: "Intermediate",
    overview: "Learn offensive security and defensive hardening. Explore network protocols, vulnerability scanning, web application security (OWASP Top 10), reverse engineering, exploit development, and SOC incident response.",
    modules: [
      {
        title: "Module 1: Network Security & Cryptography",
        duration: "4 Weeks",
        topics: ["TCP/IP packet dissection with Wireshark", "Symmetric & asymmetric encryption (AES, RSA, ECC)", "Public Key Infrastructure (PKI), TLS handshake & certs", "Firewalls, IDS/IPS configuration & VPN security"]
      },
      {
        title: "Module 2: Web Application Penetration Testing",
        duration: "5 Weeks",
        topics: ["OWASP Top 10 deep dive: SQLi, XSS, CSRF, SSRF", "Authentication bypass & JWT manipulation", "Burp Suite Professional automation & fuzzing", "API security testing: GraphQL & REST endpoints"]
      },
      {
        title: "Module 3: System Hardening & Defense Operations",
        duration: "4 Weeks",
        topics: ["Linux & Windows kernel hardening", "Active Directory exploitation & Kerberos attacks", "SIEM log analysis with Splunk and ELK stack", "Zero Trust network architecture implementation"]
      },
      {
        title: "Module 4: Incident Response & Digital Forensics",
        duration: "4 Weeks",
        topics: ["Memory forensics with Volatility", "Malware sandboxing & dynamic analysis", "Threat intelligence & MITRE ATT&CK framework", "Ransomware recovery & post-incident forensics"]
      }
    ],
    careerRoles: [
      { role: "Penetration Tester / Ethical Hacker", avgSalary: "$120,000 - $175,000", companies: ["HackerOne", "Bugcrowd", "Rapid7", "Deloitte"] },
      { role: "Security Operations Center (SOC) Analyst", avgSalary: "$95,000 - $145,000", companies: ["Mandiant", "CrowdStrike", "Cisco", "IBM"] },
      { role: "Information Security Architect", avgSalary: "$150,000 - $215,000", companies: ["JPMorgan Chase", "Apple", "Lockheed Martin", "Google"] }
    ],
    featuredCourses: [
      { id: "sec-101", title: "Hands-On Ethical Hacking & Penetration Testing", instructor: "Alex Mercer (OSCP)", rating: 4.94, reviews: 3120, price: "$99", level: "All Levels", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80" },
      { id: "sec-102", title: "Web Security & Bug Bounty Masterclass", instructor: "Rhea Thomas", rating: 4.88, reviews: 1750, price: "$89", level: "Intermediate", image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Are hands-on labs safe to practice?", a: "Yes, all labs run in isolated, sandboxed virtual environments specifically provisioned with vulnerable targets." }
    ]
  },
  "data-analytics": {
    slug: "data-analytics",
    title: "Data Analytics",
    shortTitle: "Business Intelligence & SQL",
    tagline: "Turn messy raw data into actionable executive insights with SQL, Tableau, PowerBI, and Python.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "47,800",
    coursesCount: 26,
    avgRating: 4.89,
    durationWeeks: "12-16 weeks",
    level: "Beginner to Intermediate",
    overview: "Data analytics bridges technology and strategic business decision-making. Learn advanced SQL querying, data modeling, automated ETL workflows, statistical hypothesis testing, and interactive dashboard storytelling.",
    modules: [
      {
        title: "Module 1: Advanced SQL for Analytics",
        duration: "4 Weeks",
        topics: ["Window functions, CTEs, and recursive queries", "Query optimization, indexing & execution plan analysis", "Data warehouse schemas (Star, Snowflake, Kimball)", "BigQuery & Snowflake cloud analytics"]
      },
      {
        title: "Module 2: Python Data Wrangling",
        duration: "4 Weeks",
        topics: ["Pandas dataframes: cleaning, pivoting & joining", "NumPy vectorization & performance acceleration", "Handling missing data, outliers, and time series", "Automated web scraping & API data extraction"]
      },
      {
        title: "Module 3: Business Intelligence & Dashboards",
        duration: "4 Weeks",
        topics: ["Tableau calculated fields & LOD expressions", "Power BI DAX formulas & data relationship models", "Data storytelling and KPI dashboard UX design", "Executive presentation & stakeholder communication"]
      },
      {
        title: "Module 4: Applied Business Statistics & A/B Testing",
        duration: "3 Weeks",
        topics: ["Hypothesis testing: t-tests, ANOVA, and Chi-Square", "Designing and evaluating randomized A/B experiments", "Statistical significance, p-values & confidence intervals", "Cohort retention & customer lifetime value (LTV) models"]
      }
    ],
    careerRoles: [
      { role: "Data Analyst", avgSalary: "$85,000 - $125,000", companies: ["Spotify", "Amazon", "Target", "McKinsey"] },
      { role: "Business Intelligence Engineer", avgSalary: "$110,000 - $160,000", companies: ["Airbnb", "Uber", "Meta", "Nike"] }
    ],
    featuredCourses: [
      { id: "da-101", title: "Complete SQL & Tableau Data Analyst Bootcamp", instructor: "Claire Bennett", rating: 4.92, reviews: 2640, price: "$79", level: "Beginner", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is prior coding experience required?", a: "No prior experience is necessary. We start with fundamental SQL and spreadsheet concepts before progressing to Python." }
    ]
  },
  "data-science": {
    slug: "data-science",
    title: "Data Science",
    shortTitle: "Statistical Learning & AI",
    tagline: "Build predictive models, machine learning pipelines, and extract scientific knowledge from massive data.",
    heroImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "49,300",
    coursesCount: 30,
    avgRating: 4.91,
    durationWeeks: "18-24 weeks",
    level: "Intermediate to Advanced",
    overview: "Data Science combines statistical rigor with high-performance computation. Master feature engineering, supervised regression & classification, unsupervised clustering, natural language processing, and MLOps production pipelines.",
    modules: [
      {
        title: "Module 1: Mathematical Foundations of Data Science",
        duration: "4 Weeks",
        topics: ["Probability distributions, expectation & variance", "Matrix decomposition (SVD, PCA, Eigenvalues)", "Maximum Likelihood Estimation (MLE) & Bayesian inference", "Optimization algorithms & regularizations (L1/L2)"]
      },
      {
        title: "Module 2: Supervised Machine Learning",
        duration: "5 Weeks",
        topics: ["Linear, Ridge, Lasso, and Logistic regression", "Decision Trees, Random Forests, and Gradient Boosting (XGBoost, LightGBM)", "Support Vector Machines & Kernel tricks", "Cross-validation, ROC-AUC, Precision-Recall trade-offs"]
      },
      {
        title: "Module 3: Unsupervised & Deep Learning",
        duration: "5 Weeks",
        topics: ["K-Means, DBSCAN, and Hierarchical clustering", "Dimensionality reduction: t-SNE & UMAP", "Neural networks with Keras & PyTorch", "Transfer learning and pre-trained foundation models"]
      },
      {
        title: "Module 4: MLOps & Production Data Science",
        duration: "4 Weeks",
        topics: ["Model tracking with MLflow & Weights & Biases", "Serving models via FastAPI & Docker containers", "Data drift & model degradation monitoring", "Scalable data processing with Apache Spark"]
      }
    ],
    careerRoles: [
      { role: "Data Scientist", avgSalary: "$130,000 - $185,000", companies: ["Netflix", "Google", "Stripe", "LinkedIn"] },
      { role: "Machine Learning Scientist", avgSalary: "$150,000 - $215,000", companies: ["Tesla", "Apple", "Uber", "Two Sigma"] }
    ],
    featuredCourses: [
      { id: "ds-101", title: "Complete Machine Learning & Data Science Masterclass", instructor: "Dr. Ethan Zhang", rating: 4.93, reviews: 3410, price: "$99", level: "Intermediate", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "What is the difference between Data Science and Data Analytics?", a: "Data Analytics focuses primarily on analyzing historical data to inform business choices, while Data Science focuses on building predictive statistical models and algorithms." }
    ]
  },
  "data-visualization": {
    slug: "data-visualization",
    title: "Data Visualization",
    shortTitle: "Interactive Charts & D3.js",
    tagline: "Design captivating, interactive data graphics, geospatial maps, and executive visual dashboards.",
    heroImage: "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "22,400",
    coursesCount: 14,
    avgRating: 4.87,
    durationWeeks: "8-12 weeks",
    level: "All Levels",
    overview: "Transform complex numerical patterns into intuitive, engaging visual narratives. Master perceptual human psychology, color theory, SVG vector graphics, D3.js interactive visualizations, and modern charting frameworks.",
    modules: [
      {
        title: "Module 1: Principles of Visual Design & Perception",
        duration: "2 Weeks",
        topics: ["Gestalt principles and visual hierarchy in charts", "Color palettes for accessibility (ColorBrewer, WCAG)", "Choosing the right visualization for distribution, relation, and time", "Avoiding deceptive charts & misleading visual axes"]
      },
      {
        title: "Module 2: Interactive SVG & D3.js Fundamentals",
        duration: "4 Weeks",
        topics: ["SVG coordinate system, paths, and DOM bindings", "D3 scales, axes, and animated transitions", "Enter, Update, and Exit data join patterns", "Building interactive scatterplots, heatmaps, and bar charts"]
      },
      {
        title: "Module 3: Advanced Charts & Geospatial Mapping",
        duration: "3 Weeks",
        topics: ["Force-directed network graphs & hierarchical treemaps", "GeoJSON, TopoJSON, and interactive map projections", "Leaflet.js & Mapbox integration with real-time data", "Canvas and WebGL rendering for 100k+ data points"]
      },
      {
        title: "Module 4: React & Observable Plot in Production",
        duration: "3 Weeks",
        topics: ["Integrating D3 within React lifecycle components", "Recharts, Chart.js, and Visx component libraries", "Observable Plot for rapid exploratory visual analytics", "Exporting publication-ready vector SVGs and PDFs"]
      }
    ],
    careerRoles: [
      { role: "Data Visualization Engineer", avgSalary: "$125,000 - $175,000", companies: ["The New York Times", "Bloomberg", "Uber", "Apple"] },
      { role: "Information Designer", avgSalary: "$95,000 - $140,000", companies: ["Financial Times", "National Geographic", "Consultancies"] }
    ],
    featuredCourses: [
      { id: "viz-101", title: "Mastering D3.js & Interactive Data Storytelling", instructor: "Nadia Bremer", rating: 4.95, reviews: 1120, price: "$85", level: "All Levels", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Do I need JavaScript knowledge?", a: "Basic JavaScript and HTML/CSS knowledge will help you get the most out of D3.js and React modules." }
    ]
  },
  "developer-tools": {
    slug: "developer-tools",
    title: "Developer Tools",
    shortTitle: "CLI, Git, Docker & Tooling",
    tagline: "Supercharge your daily engineering efficiency with modern shell scripting, debugging, and IDE workflows.",
    heroImage: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "31,800",
    coursesCount: 16,
    avgRating: 4.94,
    durationWeeks: "6-10 weeks",
    level: "All Levels",
    overview: "Elite software engineers distinguish themselves through mastery of their tools. Learn advanced Git rebasing and conflict resolution, Linux terminal productivity with tmux and zsh, Docker containerization, Chrome DevTools profiling, and VS Code optimization.",
    modules: [
      {
        title: "Module 1: Terminal & Shell Mastery",
        duration: "2 Weeks",
        topics: ["Zsh, Bash, and modern command-line utilities (fzf, ripgrep, bat)", "Pipes, streams, file descriptors, and sed/awk data wrangling", "Process monitoring (top, htop, ps, kill, nohup)", "Tmux multiplexing and remote SSH configurations"]
      },
      {
        title: "Module 2: Advanced Git & Team Collaboration",
        duration: "2 Weeks",
        topics: ["Interactive rebase, squash, cherry-pick, and bisect", "Git hooks automation with Husky and lint-staged", "Resolving complex merge conflicts and divergent branches", "Trunk-based development vs GitFlow workflows"]
      },
      {
        title: "Module 3: Containers & Local Development",
        duration: "3 Weeks",
        topics: ["Writing lean, multi-stage Dockerfiles", "Docker Compose for multi-container local clusters", "Volume mounting, container networking & environment secrets", "DevContainers for standardized team workspaces"]
      },
      {
        title: "Module 4: Profiling, Debugging & Performance",
        duration: "2 Weeks",
        topics: ["Chrome DevTools: memory leaks, CPU flame charts & render bottlenecks", "VS Code debugger configurations for Node.js, Python, and Go", "API testing with Postman, Bruno, and curl", "Benchmarking and load testing with k6"]
      }
    ],
    careerRoles: [
      { role: "Developer Productivity Engineer", avgSalary: "$140,000 - $195,000", companies: ["Google", "Meta", "Stripe", "Datadog"] },
      { role: "Software Engineer", avgSalary: "$115,000 - $170,000", companies: ["Global Tech Companies"] }
    ],
    featuredCourses: [
      { id: "tools-101", title: "The 10x Developer Tooling Masterclass", instructor: "Sarah O'Connor", rating: 4.96, reviews: 2480, price: "$59", level: "All Levels", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is this course applicable on Windows, Mac, and Linux?", a: "Yes! Every tool is configured across Windows (WSL2), macOS, and native Linux distributions." }
    ]
  },
  "devops": {
    slug: "devops",
    title: "DevOps",
    shortTitle: "CI/CD, Kubernetes & SRE",
    tagline: "Bridge software development and IT operations with automated delivery pipelines, Kubernetes, and monitoring.",
    heroImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "37,600",
    coursesCount: 25,
    avgRating: 4.9,
    durationWeeks: "16-20 weeks",
    level: "Intermediate to Advanced",
    overview: "Master the practices, methodologies, and cloud tools that accelerate software delivery with rock-solid stability. Build end-to-end GitHub Actions pipelines, orchestrate microservices with Kubernetes, automate provisioning with Ansible, and establish distributed observability.",
    modules: [
      {
        title: "Module 1: Continuous Integration & Delivery (CI/CD)",
        duration: "4 Weeks",
        topics: ["GitHub Actions workflows, matrix builds & reusable actions", "Automated unit, integration, and security scans in pipeline", "Artifact management (Docker Hub, AWS ECR, GitHub Packages)", "Canary deployments, blue-green releases & feature flags"]
      },
      {
        title: "Module 2: Kubernetes Orchestration at Scale",
        duration: "5 Weeks",
        topics: ["Pods, Deployments, ReplicaSets & StatefulSets", "Ingress controllers (Nginx, Traefik) and Cert-Manager TLS", "ConfigMaps, Secrets management (HashiCorp Vault)", "Horizontal Pod Autoscaler (HPA) and cluster autoscaling"]
      },
      {
        title: "Module 3: Configuration Management & GitOps",
        duration: "4 Weeks",
        topics: ["Helm charts: templating, packaging & repository management", "ArgoCD and Flux for declarative GitOps continuous delivery", "Ansible playbooks for server configuration and patch management", "Service mesh architecture with Istio & Linkerd"]
      },
      {
        title: "Module 4: Observability, SRE & Incident Response",
        duration: "4 Weeks",
        topics: ["Prometheus metrics collection & PromQL queries", "Grafana dashboards and alerting notification channels", "Distributed tracing with OpenTelemetry and Jaeger", "SLOs, SLIs, error budgets, and blameless post-mortems"]
      }
    ],
    careerRoles: [
      { role: "DevOps Engineer", avgSalary: "$130,000 - $185,000", companies: ["Amazon", "Salesforce", "Atlassian", "Twilio"] },
      { role: "Platform Engineer", avgSalary: "$145,000 - $205,000", companies: ["Spotify", "Coinbase", "Shopify", "GitLab"] }
    ],
    featuredCourses: [
      { id: "devops-101", title: "Complete DevOps & Kubernetes Architect Path", instructor: "Vikram Malhotra", rating: 4.93, reviews: 2950, price: "$95", level: "Intermediate", image: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Will I get practical Kubernetes cluster experience?", a: "Yes! Every learner is provided an isolated, multi-node Kubernetes cluster to deploy actual applications." }
    ]
  },
  "game-development": {
    slug: "game-development",
    title: "Game Development",
    shortTitle: "Unity, Unreal & C# / C++",
    tagline: "Create immersive 2D and 3D games with physics engines, shaders, real-time multiplayer, and spatial audio.",
    heroImage: "https://images.unsplash.com/photo-1552824722-ddab1374e622?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "28,700",
    coursesCount: 20,
    avgRating: 4.88,
    durationWeeks: "14-20 weeks",
    level: "All Levels",
    overview: "From indie game jams to AAA game engines, explore the complete game development lifecycle. Learn gameplay programming in C# for Unity and C++ for Unreal Engine, 3D math and physics simulation, particle effects, UI design, and networked multiplayer gameplay.",
    modules: [
      {
        title: "Module 1: Game Math & 2D Engine Programming",
        duration: "4 Weeks",
        topics: ["Vectors, matrices, quaternions, and raycasting", "Rigid body physics, collisions, and trigger events", "Sprite animations, tilemaps, and 2D camera controllers", "State machines for character movement and enemy AI"]
      },
      {
        title: "Module 2: 3D Game Development with Unity",
        duration: "5 Weeks",
        topics: ["Lighting, shadows, and Universal Render Pipeline (URP)", "Cinemachine camera systems and timeline cutscenes", "Navigation meshes (NavMesh) and pathfinding algorithms", "Audio management, 3D spatial sound, and music transitions"]
      },
      {
        title: "Module 3: Unreal Engine 5 & C++ / Blueprints",
        duration: "5 Weeks",
        topics: ["Unreal Engine architecture, Actors, and Components", "Nanite virtualized geometry & Lumen global illumination", "Blueprint visual scripting paired with high-performance C++", "Material graphs, HLSL shaders, and Niagara visual effects"]
      },
      {
        title: "Module 4: Multiplayer Networking & Game Publishing",
        duration: "4 Weeks",
        topics: ["Client-server architecture, replication, and lag compensation", "Steamworks SDK integration and achievement systems", "Mobile optimization for iOS and Android game builds", "Publishing games to Steam, Epic Games Store, and App Stores"]
      }
    ],
    careerRoles: [
      { role: "Gameplay Programmer", avgSalary: "$90,000 - $145,000", companies: ["Electronic Arts", "Ubisoft", "Riot Games", "Bungie"] },
      { role: "Technical Game Designer", avgSalary: "$85,000 - $135,000", companies: ["Epic Games", "Sony PlayStation", "Blizzard"] }
    ],
    featuredCourses: [
      { id: "game-101", title: "Complete Unity 3D & C# Game Developer Course", instructor: "Luke Skywalker", rating: 4.91, reviews: 2120, price: "$89", level: "All Levels", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Do I need an expensive graphics card to learn?", a: "Not to begin! 2D and lightweight 3D projects run smoothly on standard laptops. We provide cloud workstation access for demanding Unreal Engine labs." }
    ]
  },
  "it": {
    slug: "it",
    title: "Information Technology",
    shortTitle: "IT Ops, Hardware & Networks",
    tagline: "Administer enterprise networks, systems infrastructure, directory services, and IT support services.",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "32,900",
    coursesCount: 18,
    avgRating: 4.86,
    durationWeeks: "10-14 weeks",
    level: "Beginner to Intermediate",
    overview: "Master enterprise IT management and system administration. Learn network topology (DNS, DHCP, IPv4/IPv6), Windows Server, Active Directory, Linux system administration, virtualization, and ITIL service management.",
    modules: [
      {
        title: "Module 1: Computer Hardware & Networking Basics",
        duration: "3 Weeks",
        topics: ["Hardware components, motherboards, storage & RAID arrays", "OSI model, Ethernet switching, and router routing tables", "IP addressing, subnetting, DHCP, and DNS resolution", "Wireless security standards (WPA3) and remote access"]
      },
      {
        title: "Module 2: Operating System Administration",
        duration: "4 Weeks",
        topics: ["Windows Server: Active Directory, Group Policy Objects (GPO)", "Linux administration: systemd, cron jobs, file permissions", "PowerShell & Bash automation for sysadmins", "Patch management, antivirus enforcement, and backup policies"]
      },
      {
        title: "Module 3: Virtualization & Cloud Services",
        duration: "3 Weeks",
        topics: ["Hypervisors: VMware ESXi, Hyper-V, and Proxmox", "Microsoft 365, Google Workspace, and Azure AD administration", "Single Sign-On (SSO) and Multi-Factor Authentication (MFA)", "Disaster recovery planning and snapshot management"]
      },
      {
        title: "Module 4: Enterprise IT Support & ITIL Practices",
        duration: "3 Weeks",
        topics: ["ITIL service lifecycle: incident, problem, and change management", "Help desk ticketing workflows (Jira Service Management)", "Asset tracking, procurement & compliance auditing", "Customer empathy and effective technical troubleshooting"]
      }
    ],
    careerRoles: [
      { role: "Systems Administrator", avgSalary: "$85,000 - $125,000", companies: ["Enterprise Banks", "Hospitals", "Colleges", "Tech Firms"] },
      { role: "Network Administrator", avgSalary: "$80,000 - $120,000", companies: ["Telecoms", "Government", "Datacenters"] }
    ],
    featuredCourses: [
      { id: "it-101", title: "CompTIA Network+ & Security+ Complete Bootcamp", instructor: "Robert Vance", rating: 4.9, reviews: 1840, price: "$75", level: "Beginner", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Does this align with CompTIA A+ and Network+?", a: "Yes, our modules directly cover all objectives required for CompTIA A+, Network+, and Security+ exams." }
    ]
  },
  "machine-learning": {
    slug: "machine-learning",
    title: "Machine Learning",
    shortTitle: "Algorithms, PyTorch & MLOps",
    tagline: "Build, evaluate, and productionize supervised, unsupervised, and deep learning models at scale.",
    heroImage: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "53,100",
    coursesCount: 28,
    avgRating: 4.92,
    durationWeeks: "16-22 weeks",
    level: "Intermediate",
    overview: "Dive deep into machine learning mathematics, algorithmic implementations, and production deployment. Learn feature engineering, ensemble modeling, neural network optimization, NLP transformer pipelines, and model serving.",
    modules: [
      {
        title: "Module 1: Core Classical Machine Learning",
        duration: "4 Weeks",
        topics: ["Regression, classification, and regularized loss functions", "Tree-based ensembles (Random Forest, Gradient Boosting)", "Support Vector Machines, kernel methods & hyperplanes", "Evaluation metrics: ROC-AUC, F1-Score, PR curves & calibration"]
      },
      {
        title: "Module 2: Deep Learning & Neural Frameworks",
        duration: "5 Weeks",
        topics: ["Backpropagation mathematics & computational graphs", "PyTorch architecture: Tensors, Autograd, Modules & Datasets", "Convolutional neural networks for image classification", "Sequential models: RNNs, LSTMs, and self-attention"]
      },
      {
        title: "Module 3: NLP & Foundation Models",
        duration: "5 Weeks",
        topics: ["Word embeddings (Word2Vec, GloVe) and Byte-Pair encoding", "Hugging Face transformers ecosystem and pipeline APIs", "Fine-tuning BERT for classification & NER", "Sequence-to-sequence models and translation architectures"]
      },
      {
        title: "Module 4: Machine Learning Engineering & MLOps",
        duration: "4 Weeks",
        topics: ["Model packaging with ONNX and TensorRT optimization", "High-throughput model serving with Triton & FastAPI", "Data drift detection, feature stores, and CI/CD for models", "Scalable batch inference on cloud clusters"]
      }
    ],
    careerRoles: [
      { role: "Machine Learning Engineer", avgSalary: "$145,000 - $210,000", companies: ["Google", "Meta", "TikTok", "Uber", "Apple"] },
      { role: "Applied AI Researcher", avgSalary: "$160,000 - $230,000", companies: ["Anthropic", "Cohere", "Microsoft", "Salesforce"] }
    ],
    featuredCourses: [
      { id: "ml-101", title: "PyTorch for Deep Learning & Computer Vision Bootcamp", instructor: "Daniel Bourke", rating: 4.95, reviews: 3620, price: "$95", level: "Intermediate", image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is PyTorch used throughout this program?", a: "Yes, PyTorch is the primary deep learning framework utilized for all modern research and production exercises." }
    ]
  },
  "math": {
    slug: "math",
    title: "Mathematics for Computer Science",
    shortTitle: "Discrete Math, Linear Algebra & Calc",
    tagline: "Master the mathematical language of algorithms, graphics, cryptography, and artificial intelligence.",
    heroImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "44,700",
    coursesCount: 16,
    avgRating: 4.93,
    durationWeeks: "12-16 weeks",
    level: "All Levels",
    overview: "Computer Science is applied mathematics. Master discrete mathematics (logic, proofs, graphs, combinatorics), linear algebra (vectors, matrices, transformations), calculus (derivatives, gradients, integrals), and probability theory.",
    modules: [
      {
        title: "Module 1: Discrete Mathematics & Logic",
        duration: "4 Weeks",
        topics: ["Propositional & predicate logic, truth tables, and quantifiers", "Methods of proof: induction, contradiction, and contraposition", "Set theory, relations, equivalence classes, and functions", "Combinatorics, permutations, combinations, and pigeonhole principle"]
      },
      {
        title: "Module 2: Graph Theory & Trees",
        duration: "3 Weeks",
        topics: ["Graph representations (adjacency matrix vs list)", "Eulerian and Hamiltonian paths & traveling salesperson problem", "Planar graphs, graph coloring, and bipartite matching", "Tree properties, spanning trees (Kruskal, Prim), and cycles"]
      },
      {
        title: "Module 3: Linear Algebra for Computing",
        duration: "4 Weeks",
        topics: ["Vector spaces, linear independence, basis, and dimension", "Matrix multiplication, inverse, determinants, and rank", "Linear transformations, projections, and change of basis", "Eigenvalues, eigenvectors, SVD, and Principal Component Analysis"]
      },
      {
        title: "Module 4: Probability & Statistics for CS",
        duration: "3 Weeks",
        topics: ["Sample spaces, conditional probability, and Bayes' Rule", "Discrete & continuous random variables (Bernoulli, Normal, Poisson)", "Expectation, variance, covariance, and correlation", "Law of Large Numbers & Central Limit Theorem in algorithms"]
      }
    ],
    careerRoles: [
      { role: "Algorithm Engineer", avgSalary: "$150,000 - $220,000", companies: ["Jane Street", "Citadel", "DeepMind", "NVIDIA"] },
      { role: "Cryptography Specialist", avgSalary: "$140,000 - $205,000", companies: ["Ethereum Foundation", "Chainlink", "Signal", "NSA"] }
    ],
    featuredCourses: [
      { id: "math-101", title: "Discrete Mathematics for CS & GATE Exam", instructor: "Prof. Ananya Rao", rating: 4.96, reviews: 2900, price: "$69", level: "All Levels", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is this relevant for coding interviews?", a: "Yes, discrete math and probability form the foundation of dynamic programming, graph algorithms, and competitive programming." }
    ]
  },
  "mobile-development": {
    slug: "mobile-development",
    title: "Mobile Development",
    shortTitle: "React Native, Flutter & iOS/Android",
    tagline: "Build high-performance, fluid mobile applications for iOS and Android with modern frameworks.",
    heroImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "34,200",
    coursesCount: 22,
    avgRating: 4.88,
    durationWeeks: "14-18 weeks",
    level: "All Levels",
    overview: "Craft production-ready iOS and Android mobile apps. Learn cross-platform app engineering with React Native & Flutter, native Swift and Kotlin fundamentals, device hardware APIs (camera, GPS, biometrics), push notifications, and App Store publishing.",
    modules: [
      {
        title: "Module 1: Cross-Platform React Native Foundations",
        duration: "4 Weeks",
        topics: ["React Native architecture, JSX, Flexbox layout, and styling", "Navigation patterns: tabs, stacks, and drawer menus", "State management with Redux Toolkit and Zustand", "Touch handling, gestures, and smooth animations (Reanimated)"]
      },
      {
        title: "Module 2: Native Device Integrations",
        duration: "4 Weeks",
        topics: ["Camera, image picker, and file system access", "Geolocation, real-time maps, and route tracking", "Biometric authentication (FaceID, Fingerprint)", "Local offline persistence with SQLite and WatermelonDB"]
      },
      {
        title: "Module 3: Flutter & Dart Mobile Architecture",
        duration: "4 Weeks",
        topics: ["Dart language basics, async programming, and streams", "Flutter widget tree, Stateless vs Stateful widgets", "BLoC and Riverpod state management patterns", "Material 3 and Cupertino iOS design systems"]
      },
      {
        title: "Module 4: Performance, Testing & Store Deployment",
        duration: "4 Weeks",
        topics: ["Push notifications with Firebase Cloud Messaging (FCM)", "End-to-end mobile testing with Detox and Maestro", "CI/CD automated app builds with Fastlane", "App Store Connect & Google Play Console submission guidelines"]
      }
    ],
    careerRoles: [
      { role: "Mobile Application Developer", avgSalary: "$115,000 - $165,000", companies: ["Uber", "Airbnb", "Instagram", "Duolingo"] },
      { role: "React Native Specialist", avgSalary: "$120,000 - $170,000", companies: ["Shopify", "Coinbase", "Discord", "Tesla"] }
    ],
    featuredCourses: [
      { id: "mobile-101", title: "React Native & Expo: Complete Mobile App Developer", instructor: "Maximilian Schwarz", rating: 4.91, reviews: 2780, price: "$89", level: "All Levels", image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Do I need a Mac to develop iOS apps?", a: "With Expo and cloud build services (EAS), you can develop and test iOS apps on Windows or Linux, though a Mac is ultimately required for local Xcode compilation." }
    ]
  },
  "web-design": {
    slug: "web-design",
    title: "Web Design & UI/UX",
    shortTitle: "Figma, Design Systems & CSS",
    tagline: "Design intuitive user interfaces, cohesive design systems, and responsive aesthetic digital experiences.",
    heroImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "39,500",
    coursesCount: 18,
    avgRating: 4.9,
    durationWeeks: "10-14 weeks",
    level: "Beginner to Intermediate",
    overview: "Great software requires exceptional product design. Master Figma wireframing and prototyping, visual hierarchy, typography scales, color theory, accessible design (WCAG AAA), responsive CSS layouts, and modern design systems.",
    modules: [
      {
        title: "Module 1: User Experience (UX) & Product Strategy",
        duration: "3 Weeks",
        topics: ["User research, persona mapping, and empathy interviews", "Information architecture, site maps, and user flows", "Low-fidelity wireframing and interactive user testing", "UX copywriting and micro-interactions"]
      },
      {
        title: "Module 2: Figma Mastery & Interface Design",
        duration: "4 Weeks",
        topics: ["Figma auto-layout, constraints, and responsive frames", "Component variants, properties, and design token architecture", "Interactive prototyping, smart animates, and micro-interactions", "Design handoff to developers with inspect and tokens"]
      },
      {
        title: "Module 3: Design Systems & Component Libraries",
        duration: "3 Weeks",
        topics: ["Atomic design methodology (Atoms to Templates)", "Typography scales, line heights, and optical font choices", "Color systems, dark mode palettes, and semantic token naming", "Accessibility audits: contrast ratios, focus states, and screen readers"]
      },
      {
        title: "Module 4: Modern CSS & Design Engineering",
        duration: "3 Weeks",
        topics: ["CSS Grid, Flexbox, subgrid, and fluid typography", "Tailwind CSS architecture and custom design system configs", "CSS animations, keyframes, and scroll-driven effects", "Building real UI component kits in HTML & React"]
      }
    ],
    careerRoles: [
      { role: "Product Designer (UI/UX)", avgSalary: "$105,000 - $160,000", companies: ["Figma", "Stripe", "Linear", "Airbnb", "Vercel"] },
      { role: "Design Systems Engineer", avgSalary: "$130,000 - $180,000", companies: ["GitHub", "Shopify", "Atlassian", "Adobe"] }
    ],
    featuredCourses: [
      { id: "design-101", title: "Complete UI/UX Design Masterclass in Figma", instructor: "Hannah Davies", rating: 4.94, reviews: 3100, price: "$79", level: "Beginner", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is coding required for this track?", a: "No! You can follow the entire UX/UI design track using Figma alone, with optional CSS modules for design engineers." }
    ]
  },
  "web-development": {
    slug: "web-development",
    title: "Web Development",
    shortTitle: "Full-Stack React, Node & Next.js",
    tagline: "Build production-scale modern web applications with React, TypeScript, Next.js, Node.js, and databases.",
    heroImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    enrolledCount: "68,900",
    coursesCount: 36,
    avgRating: 4.94,
    durationWeeks: "16-24 weeks",
    level: "All Levels",
    overview: "The most comprehensive full-stack web development curriculum available. Build modern single-page applications and server-rendered portals with React 19, TypeScript, Next.js App Router, Tailwind CSS, Node.js, Express, PostgreSQL, and Supabase.",
    modules: [
      {
        title: "Module 1: Modern Frontend with React & TypeScript",
        duration: "5 Weeks",
        topics: ["TypeScript types, generics, and strict interfaces", "React 19 hooks, state management, and custom hooks", "Component architecture, memoization, and rendering optimization", "Tailwind CSS v4 & accessible headless UI components"]
      },
      {
        title: "Module 2: Full-Stack Next.js & Server Components",
        duration: "5 Weeks",
        topics: ["Next.js App Router, Server Components & Server Actions", "Dynamic routing, parallel routes, and intercepted routes", "Static Site Generation (SSG), ISR, and Edge streaming", "SEO optimization, OpenGraph cards, and Core Web Vitals"]
      },
      {
        title: "Module 3: Backend APIs & Database Architecture",
        duration: "5 Weeks",
        topics: ["RESTful API architecture with Express & Node.js", "PostgreSQL database design, indexing, and Prisma ORM", "Authentication: JWT, OAuth2, session cookies, and Supabase Auth", "File uploads, Amazon S3 storage, and background queues"]
      },
      {
        title: "Module 4: Production Deployment & Scale",
        duration: "4 Weeks",
        topics: ["Deploying full-stack apps to Vercel and Railway", "Redis caching, rate limiting, and session stores", "Payment gateway integration with Stripe checkout and webhooks", "End-to-end testing with Playwright and Vitest"]
      }
    ],
    careerRoles: [
      { role: "Full Stack Engineer", avgSalary: "$120,000 - $175,000", companies: ["Vercel", "Stripe", "Supabase", "Meta", "Amazon"] },
      { role: "Frontend Developer", avgSalary: "$105,000 - $155,000", companies: ["GitHub", "Slack", "Pinterest", "Linear"] },
      { role: "Backend Engineer", avgSalary: "$125,000 - $180,000", companies: ["Twilio", "Cloudflare", "Datadog", "DoorDash"] }
    ],
    featuredCourses: [
      { id: "web-101", title: "Complete Full-Stack Next.js & React Developer Bootcamp", instructor: "Jonas Schmedtmann", rating: 4.96, reviews: 4280, price: "$99", level: "All Levels", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" },
      { id: "web-102", title: "TypeScript Pro: Advanced Patterns & System Architecture", instructor: "Matt Pocock", rating: 4.95, reviews: 2310, price: "$89", level: "Intermediate", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Will I build real full-stack web applications?", a: "Yes! You will construct 5 real-world applications including an e-commerce platform with Stripe payments and a real-time collaborative workspace." }
    ]
  }
};

