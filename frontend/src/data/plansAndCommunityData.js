// Plans, Community, and Career Building Comprehensive Data

export const plansData = {
  tiers: [
    {
      id: "free",
      name: "Community",
      badge: "Free Forever",
      priceMonthly: "$0",
      priceAnnual: "$0",
      period: "forever",
      description: "Essential access to open-source courses, public discussions, and community challenges.",
      features: [
        "Access to 50+ foundational CS courses",
        "Public coding challenges & leaderboard",
        "Community forum discussions & questions",
        "Standard web-based code editor",
        "Community Discord access"
      ],
      ctaText: "Start Learning Free",
      popular: false
    },
    {
      id: "pro",
      name: "Pro Learner",
      badge: "Most Popular",
      priceMonthly: "$29",
      priceAnnual: "$19",
      period: "per month",
      description: "Everything you need to master tech: full catalog, interactive cloud labs, and certificates.",
      features: [
        "Unlimited access to ALL 250+ courses & tracks",
        "Interactive cloud sandbox workspaces (GPU included)",
        "Verified course completion certificates",
        "Full solution explanations for 500+ interview questions",
        "Offline video downloads & mobile app sync",
        "Priority instructor Q&A turnaround (< 4 hours)"
      ],
      ctaText: "Upgrade to Pro",
      popular: true
    },
    {
      id: "team",
      name: "Team & Enterprise",
      badge: "For Organizations",
      priceMonthly: "$59",
      priceAnnual: "$45",
      period: "per seat / month",
      description: "Custom role-based learning tracks, manager analytics, SSO, and team licensing.",
      features: [
        "Everything in Pro Learner for every member",
        "Custom company learning paths & skill assessments",
        "Centralized billing & seat allocation console",
        "SAML Single Sign-On (Okta, Azure AD, Google)",
        "Detailed skill gap analytics & exportable CSV reports",
        "Dedicated customer success manager"
      ],
      ctaText: "Contact Enterprise Sales",
      popular: false
    }
  ],
  studentPerks: {
    discountPercent: "50% OFF",
    title: "Student Developer Pack & Education Discount",
    description: "Are you a student enrolled in high school, college, or university? Get full Pro access at half price with any verified .edu email or student ID card.",
    perks: [
      { title: "50% Lifetime Student Discount", desc: "Enjoy our full Pro catalog for only $9.50/month as long as you are actively enrolled." },
      { title: "Campus Ambassador Program", desc: "Lead local coding workshops, earn referral stipends, and receive exclusive swag and mentorship." },
      { title: "Free Resume & Portfolio Audits", desc: "Get direct 1-on-1 feedback from senior tech recruiters before internship season." },
      { title: "GATE & FAANG Prep Access", desc: "Curated mock question banks, past year papers, and speed-run algorithm cheat sheets." }
    ]
  },
  businessSolutions: {
    heroTitle: "Upskill Your Engineering Organization",
    heroDesc: "Drive technical velocity, reduce ramp-up time for new hires, and retain top engineering talent with curated, hands-on software development training.",
    stats: [
      { metric: "4.2x", label: "Faster onboarding ramp" },
      { metric: "94%", label: "Course completion rate" },
      { metric: "150+", label: "Fortune 500 engineering teams" }
    ],
    features: [
      { title: "Role-Based Skill Matrices", desc: "Benchmark your developers' proficiencies across distributed systems, cloud architectures, and AI engineering." },
      { title: "Hands-on Sandboxed Sandboxes", desc: "No local setup required. Engineers write, build, and deploy code in browser-based isolated containers." },
      { title: "Executive Analytics Dashboard", desc: "Track organizational learning velocity, team progress, and certification milestones in real time." }
    ]
  }
};

export const communityData = {
  forumThreads: [
    {
      id: "th-1",
      title: "How to master Dynamic Programming: A step-by-step roadmap for interviews",
      category: "Algorithms",
      author: "Priya Sharma",
      authorRole: "Software Engineer @ Google",
      upvotes: 342,
      replies: 58,
      views: "4.2k",
      lastActive: "15m ago",
      tags: ["Dynamic Programming", "Interview Prep", "Algorithms"]
    },
    {
      id: "th-2",
      title: "Next.js 15 vs Remix in 2026: Real-world production benchmarks and caching gotchas",
      category: "Web Development",
      author: "Alex Rivera",
      authorRole: "Lead Architect",
      upvotes: 218,
      replies: 42,
      views: "3.1k",
      lastActive: "1h ago",
      tags: ["Next.js", "React", "Full Stack"]
    },
    {
      id: "th-3",
      title: "How I cracked GATE CSE with AIR 47 while working a full-time job",
      category: "Exam & Career",
      author: "Rohan Verma",
      authorRole: "GATE CSE Topper",
      upvotes: 512,
      replies: 89,
      views: "8.5k",
      lastActive: "3h ago",
      tags: ["GATE CSE", "Study Strategy", "Operating Systems"]
    },
    {
      id: "th-4",
      title: "Building an Autonomous Agent using the Model Context Protocol (MCP) in Python",
      category: "Artificial Intelligence",
      author: "Elena Rostova",
      authorRole: "AI Researcher",
      upvotes: 189,
      replies: 27,
      views: "2.8k",
      lastActive: "4h ago",
      tags: ["AI", "Agents", "Python", "LLMs"]
    }
  ],
  chapters: [
    { city: "Bengaluru, India", members: "4,820", eventsHosted: 36, leader: "Vikram Sethi", nextMeetup: "April 18, 2026 - Distributed Systems AMA" },
    { city: "San Francisco, USA", members: "3,950", eventsHosted: 28, leader: "Sarah Jenkins", nextMeetup: "April 22, 2026 - Generative AI Hack Night" },
    { city: "London, UK", members: "2,640", eventsHosted: 19, leader: "David Thorne", nextMeetup: "May 2, 2026 - Cloud Native & Kubernetes" },
    { city: "Berlin, Germany", members: "2,100", eventsHosted: 15, leader: "Lukas Weber", nextMeetup: "May 9, 2026 - Rust & Systems Engineering" },
    { city: "Singapore", members: "1,850", eventsHosted: 12, leader: "Mei-Ling Tan", nextMeetup: "May 15, 2026 - Full-Stack Tech Showcase" },
    { city: "Delhi NCR, India", members: "5,120", eventsHosted: 42, leader: "Ananya Rao", nextMeetup: "April 25, 2026 - GATE & FAANG Mock Blitz" }
  ],
  events: [
    {
      id: "ev-1",
      title: "Global 48-Hour Open Source AI Hackathon",
      date: "May 15-17, 2026",
      type: "Virtual / Global",
      prizes: "$25,000 in Prizes",
      participants: "1,240 Registered",
      description: "Build innovative multi-agent tools, developer productivity extensions, and educational AI assistants."
    },
    {
      id: "ev-2",
      title: "Live Masterclass: Systems Design of Low-Latency Matching Engines",
      date: "April 28, 2026 (6:00 PM IST)",
      type: "Live Stream Workshop",
      prizes: "Free Certificate",
      participants: "820 Registered",
      description: "Deep dive into C++20 memory layouts, lock-free queues, kernel bypass, and high-frequency order books."
    },
    {
      id: "ev-3",
      title: "FAANG Mock Interview Marathon & Live Resume Critiques",
      date: "May 5, 2026 (11:00 AM EST)",
      type: "Interactive Webinar",
      prizes: "1-on-1 Mentorship",
      participants: "1,450 Registered",
      description: "Live whiteboarding demonstrations, behavioral STAR strategy, and live candidate critiques with senior FAANG engineering hiring managers."
    }
  ]
};

export const careerBuildingData = {
  careerPaths: [
    {
      id: "full-stack",
      title: "Full-Stack Web Architect",
      salary: "$125,000 - $185,000",
      weeks: "24 Weeks",
      level: "All Levels",
      description: "Master modern frontend user experiences with React 19, backend APIs with Node.js and Go, databases with PostgreSQL, and cloud deployments with Docker & AWS.",
      milestones: ["HTML/CSS/JS Core", "React & TypeScript", "Backend APIs & SQL", "Cloud & System Design"]
    },
    {
      id: "ai-engineer",
      title: "AI & Machine Learning Engineer",
      salary: "$145,000 - $215,000",
      weeks: "28 Weeks",
      level: "Intermediate",
      description: "Learn mathematical data science, neural architectures with PyTorch, large language models, prompt pipelines with LangChain, and enterprise model deployment.",
      milestones: ["Math & Python for ML", "Deep Learning Foundations", "Generative AI & LLMs", "Production MLOps"]
    },
    {
      id: "cloud-devops",
      title: "Cloud & DevOps Solutions Architect",
      salary: "$135,000 - $195,000",
      weeks: "20 Weeks",
      level: "Intermediate",
      description: "Orchestrate distributed infrastructure with Kubernetes, automate deployments with GitHub Actions and Terraform, and monitor multi-cloud systems.",
      milestones: ["Linux & Networking", "Docker & Kubernetes", "Terraform & AWS", "Observability & SRE"]
    },
    {
      id: "cybersecurity-analyst",
      title: "Cybersecurity & Ethical Hacking Specialist",
      salary: "$120,000 - $175,000",
      weeks: "22 Weeks",
      level: "Intermediate",
      description: "Master offensive penetration testing, defensive SOC analysis, web application security (OWASP Top 10), and digital forensics.",
      milestones: ["Networking & Cryptography", "Web Penetration Testing", "System Hardening", "Incident Response"]
    }
  ],
  careerServices: [
    { title: "1-on-1 Senior Tech Mentorship", desc: "Weekly dedicated video sessions with staff software engineers from Google, Amazon, Microsoft, and top startups.", badge: "High Impact" },
    { title: "ATS-Optimized Resume Review", desc: "Detailed line-by-line critique of your resume, GitHub projects, and LinkedIn profile to bypass automated screening filters.", badge: "Guaranteed" },
    { title: "Realistic Mock Technical Interviews", desc: "Simulated 60-minute technical coding and system design interviews with honest, actionable rubric scorecards.", badge: "Essential" },
    { title: "Direct Hiring Partner Referrals", desc: "Exclusive access to hiring partners actively seeking junior and mid-level developers from our academy.", badge: "Exclusive" }
  ],
  interviewPrep: {
    heroTitle: "Ace Your Next Tech Interview",
    categories: [
      { title: "Data Structures & Algorithms", questions: 250, topics: ["Arrays & Hashmaps", "Two Pointers", "Trees & Graphs", "Dynamic Programming"] },
      { title: "System Design & Architecture", questions: 60, topics: ["Rate Limiters", "URL Shortener", "Distributed Cache", "Payment Systems"] },
      { title: "Behavioral & Leadership Principles", questions: 45, topics: ["STAR Framework", "Conflict Resolution", "Engineering Tradeoffs", "Ownership"] },
      { title: "Language-Specific Deep Dives", questions: 120, topics: ["JavaScript Event Loop", "Python GIL & Memory", "Java JVM & GC", "C++ Pointers & STL"] }
    ]
  },
  professionalCert: {
    title: "Industry-Recognized Professional Certifications",
    desc: "Every certificate issued by our academy includes a unique cryptographic verification hash, verifiable on LinkedIn and backed by our Supabase database.",
    features: [
      "Unique shareable URL (e.g. edtech.org/verify/CERT-94821)",
      "One-click 'Add to LinkedIn' credential integration",
      "Rigorous proctored capstone project requirements",
      "Direct verification API for hiring teams and employers"
    ]
  },
  affiliates: {
    heroTitle: "Earn up to 40% Recurring Commission",
    desc: "Join our creator and educator affiliate program. Share elite computer science education with your audience and earn industry-leading revenue shares on every single subscription.",
    tiers: [
      { tier: "Creator", commission: "25%", minPayout: "$50", features: ["Custom affiliate tracking link", "Real-time clicks & conversions dashboard", "Monthly PayPal / Stripe payouts"] },
      { tier: "Pro Partner", commission: "35%", minPayout: "$100", features: ["Dedicated affiliate manager", "Exclusive audience discount codes", "Co-branded landing pages"] },
      { tier: "Elite Ambassador", commission: "40%", minPayout: "$200", features: ["Highest recurring tier", "Sponsorship for your meetups/videos", "Early beta product access"] }
    ]
  },
  betaContent: {
    heroTitle: "Beta Labs & Experimental Content",
    desc: "Get preview access to experimental course tracks, cutting-edge AI sandbox tools, and compiler features before they launch to the general public.",
    labs: [
      { id: "beta-1", title: "Rust for High-Performance Web Services (Beta)", status: "Active Testing", learners: "840 Beta Testers", badge: "v0.9 Early Access" },
      { id: "beta-2", title: "Model Context Protocol (MCP) Server Engineering", status: "Active Testing", learners: "620 Beta Testers", badge: "v0.8 Early Access" },
      { id: "beta-3", title: "Quantum Computing Algorithms with Qiskit", status: "Coming Soon", learners: "1,200 Waitlisted", badge: "Preview" }
    ]
  }
};

