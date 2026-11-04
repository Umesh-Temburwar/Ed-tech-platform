// Resources Data: Cheatsheets, Code Challenges, Docs, Projects, Videos, Workspaces

export const cheatsheetsData = [
  {
    id: "git",
    title: "Git & GitHub Cheatsheet",
    category: "DevOps & Tools",
    description: "Essential commands for branch management, rebasing, stashing, and conflict resolution.",
    badge: "Most Popular",
    commands: [
      { cmd: "git checkout -b <branch>", desc: "Create and switch to a new branch" },
      { cmd: "git commit --amend --no-edit", desc: "Add staged files to the last commit without changing message" },
      { cmd: "git rebase -i HEAD~3", desc: "Interactively squash or reorder the last 3 commits" },
      { cmd: "git stash push -m 'wip'", desc: "Save uncommitted work to stash stack" },
      { cmd: "git reset --soft HEAD~1", desc: "Undo last commit while preserving staged changes" }
    ]
  },
  {
    id: "docker",
    title: "Docker & Containerization Cheatsheet",
    category: "DevOps",
    description: "Quick reference for building images, multi-container compose, volume inspection, and networking.",
    badge: "Essential",
    commands: [
      { cmd: "docker build -t app:v1 .", desc: "Build an image from Dockerfile in current directory" },
      { cmd: "docker run -d -p 8080:80 --name web app:v1", desc: "Run container detached with port mapping" },
      { cmd: "docker exec -it web /bin/sh", desc: "Open an interactive shell inside running container" },
      { cmd: "docker compose up -d --build", desc: "Build and start all services in background" },
      { cmd: "docker system prune -af --volumes", desc: "Remove all unused containers, networks, and images" }
    ]
  },
  {
    id: "sql",
    title: "SQL & Query Optimization Cheatsheet",
    category: "Databases",
    description: "Window functions, join patterns, CTE structures, and execution plan analysis.",
    badge: "High Demand",
    commands: [
      { cmd: "ROW_NUMBER() OVER (PARTITION BY cat ORDER BY val DESC)", desc: "Assign sequential row number per partition" },
      { cmd: "WITH summary AS (SELECT ...) SELECT * FROM summary", desc: "Common Table Expression (CTE) syntax" },
      { cmd: "EXPLAIN (ANALYZE, BUFFERS) SELECT ...", desc: "Inspect detailed query cost, execution time, and buffer hits" },
      { cmd: "CREATE INDEX CONCURRENTLY idx ON tbl (col)", desc: "Build index without locking table against writes" },
      { cmd: "COALESCE(val, 'default')", desc: "Return first non-null argument in list" }
    ]
  },
  {
    id: "python",
    title: "Python 3.12 Core Cheatsheet",
    category: "Programming",
    description: "Comprehensions, slicing syntax, dataclasses, typing, and standard library tricks.",
    badge: "Bestseller",
    commands: [
      { cmd: "[x**2 for x in nums if x % 2 == 0]", desc: "Filtered list comprehension" },
      { cmd: "sorted(data, key=lambda x: x['score'], reverse=True)", desc: "Sort list of dictionaries by key" },
      { cmd: "dict_a | dict_b", desc: "Merge two dictionaries (Python 3.9+)" },
      { cmd: "@dataclass(slots=True)", desc: "High-performance memory-optimized dataclass" },
      { cmd: "async with aiohttp.ClientSession() as s:", desc: "Asynchronous HTTP context manager" }
    ]
  },
  {
    id: "react",
    title: "React 19 & Hooks Cheatsheet",
    category: "Frontend",
    description: "Modern hooks reference, server actions, memoization rules, and context patterns.",
    badge: "Updated",
    commands: [
      { cmd: "const [state, formAction, isPending] = useActionState(fn, init)", desc: "React 19 Form Action Hook" },
      { cmd: "const value = use(MyPromiseOrContext)", desc: "Read promise or context with 'use' hook" },
      { cmd: "useCallback(() => fn(arg), [deps])", desc: "Memoize callback instance between renders" },
      { cmd: "useId()", desc: "Generate unique accessible HTML ID for form inputs" },
      { cmd: "useTransition()", desc: "Mark state updates as non-urgent transitions" }
    ]
  },
  {
    id: "linux",
    title: "Linux SysAdmin & Networking Cheatsheet",
    category: "Systems",
    description: "Core utilities for monitoring memory, tracking open ports, process trees, and disks.",
    badge: "Core Skill",
    commands: [
      { cmd: "ss -tulpn", desc: "List all listening TCP/UDP sockets with process PIDs" },
      { cmd: "htop / btop", desc: "Interactive real-time process and CPU core monitor" },
      { cmd: "journalctl -u my-service -f", desc: "Follow systemd logs for specific service" },
      { cmd: "df -h && du -sh *", desc: "Check mounted disk usage and directory sizes" },
      { cmd: "curl -Iv https://domain.com", desc: "Inspect TLS certificate chain and HTTP headers" }
    ]
  }
];

export const codeChallengesData = [
  {
    id: "ch-1",
    title: "LRU Cache Implementation",
    difficulty: "Medium",
    category: "Data Structures",
    acceptance: "68%",
    solvedCount: "14.2k",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for get and put operations.",
    tags: ["Hash Table", "Doubly Linked List", "System Design"]
  },
  {
    id: "ch-2",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Algorithms",
    acceptance: "48%",
    solvedCount: "8.9k",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    tags: ["Two Pointers", "Dynamic Programming", "Monotonic Stack"]
  },
  {
    id: "ch-3",
    title: "Merge K Sorted Linked Lists",
    difficulty: "Hard",
    category: "Data Structures",
    acceptance: "52%",
    solvedCount: "9.4k",
    description: "You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    tags: ["Heap", "Priority Queue", "Divide and Conquer"]
  },
  {
    id: "ch-4",
    title: "Two Sum & Hash Lookups",
    difficulty: "Easy",
    category: "Algorithms",
    acceptance: "89%",
    solvedCount: "42.1k",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    tags: ["Array", "Hash Table"]
  },
  {
    id: "ch-5",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    category: "Data Structures",
    acceptance: "65%",
    solvedCount: "12.7k",
    description: "A trie or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement insert, search, and startsWith.",
    tags: ["Tree", "Design", "String"]
  },
  {
    id: "ch-6",
    title: "Course Schedule & Cycle Detection",
    difficulty: "Medium",
    category: "Graph Theory",
    acceptance: "58%",
    solvedCount: "11.3k",
    description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Determine if you can finish all courses given prerequisite edges.",
    tags: ["Depth-First Search", "Breadth-First Search", "Topological Sort"]
  }
];

export const docsData = [
  {
    title: "Platform API Documentation",
    version: "v2.4.0 (Latest)",
    description: "Complete REST API reference, Supabase schema definitions, JWT authentication tokens, rate limits, and webhook event payloads.",
    endpointsCount: 42,
    categories: ["Authentication", "Courses & Curriculum", "Quizzes & Submissions", "Analytics & Webhooks"]
  },
  {
    title: "Interactive Code Runner SDK",
    version: "v1.8.0",
    description: "SDK and WebSocket API guide for embedding browser-based sandbox code execution environments into customized course lessons.",
    endpointsCount: 16,
    categories: ["Sandbox Provisioning", "STDIN / STDOUT Streaming", "Resource Limits & Timeouts"]
  },
  {
    title: "Course Authoring & Markdown Guide",
    version: "v3.1",
    description: "Style guide, KaTeX math formatting, executable code blocks, interactive quizzes, and video player embedding instructions for instructors.",
    endpointsCount: 28,
    categories: ["Lesson Markdown Specs", "KaTeX Syntax", "Interactive Widget Embeds"]
  }
];

export const projectsData = [
  {
    id: "proj-1",
    title: "Real-Time Distributed Chat & Audio Space",
    category: "Full Stack",
    level: "Advanced",
    stars: "2.4k",
    forks: "410",
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=600&q=80",
    description: "End-to-end full stack web application featuring WebRTC audio channels, WebSockets text messaging, Redis pub/sub, and PostgreSQL message persistence.",
    tech: ["Next.js 14", "WebRTC", "Socket.io", "PostgreSQL", "Tailwind CSS"]
  },
  {
    id: "proj-2",
    title: "Autonomous AI Agent Workflow Orchestrator",
    category: "Artificial Intelligence",
    level: "Advanced",
    stars: "3.8k",
    forks: "690",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80",
    description: "Multi-agent autonomous framework utilizing Model Context Protocol (MCP) tooling to execute shell tasks, write code, and scrape web documentation.",
    tech: ["Python", "FastAPI", "LangChain", "ChromaDB", "Docker"]
  },
  {
    id: "proj-3",
    title: "Cloud Native Kubernetes GitOps Pipeline",
    category: "DevOps",
    level: "Intermediate",
    stars: "1.9k",
    forks: "280",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80",
    description: "Declarative infrastructure-as-code repository with Terraform AWS VPC, ArgoCD continuous delivery, Helm microservice charts, and Prometheus alerts.",
    tech: ["Terraform", "Kubernetes", "ArgoCD", "Helm", "Prometheus"]
  },
  {
    id: "proj-4",
    title: "High-Frequency Stock Market Order Book",
    category: "Systems & C++",
    level: "Advanced",
    stars: "4.1k",
    forks: "820",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    description: "Low-latency limit order book matching engine in C++20 with price-time priority, lock-free queues, and nanosecond execution benchmarks.",
    tech: ["C++20", "Lock-free Queues", "TCP Sockets", "Benchmarking"]
  }
];

export const videosData = [
  {
    id: "vid-1",
    title: "System Design: Designing WhatsApp & Telegram at 2 Billion Users",
    duration: "48:20",
    views: "182K",
    author: "Gaurav Sen",
    category: "System Design",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "vid-2",
    title: "Operating Systems Internals: How Virtual Memory & Page Tables Actually Work",
    duration: "36:15",
    views: "94K",
    author: "Dr. Vikram Sethi",
    category: "Computer Science",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "vid-3",
    title: "Demystifying Transformers & Attention Mechanism From Scratch in PyTorch",
    duration: "1:02:40",
    views: "215K",
    author: "Andrej Karpathy (Series)",
    category: "Artificial Intelligence",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "vid-4",
    title: "Next.js 15 Server Actions & Parallel Routes Deep Dive",
    duration: "42:10",
    views: "88K",
    author: "Lee Robinson",
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
  }
];

export const workspacesData = [
  {
    id: "ws-node",
    title: "Full-Stack Node.js & React Lab",
    desc: "Pre-configured Ubuntu container with Node.js 20, TypeScript, Tailwind CSS, SQLite, and live port forwarding.",
    memory: "2 GB RAM",
    cores: "2 vCPUs",
    launchTime: "~4s"
  },
  {
    id: "ws-python",
    title: "Python 3.12 AI & Data Science Lab",
    desc: "JupyterLab instance with PyTorch, NumPy, Pandas, Scikit-learn, Matplotlib, and CUDA acceleration support.",
    memory: "4 GB RAM",
    cores: "4 vCPUs",
    launchTime: "~6s"
  },
  {
    id: "ws-cpp",
    title: "C++20 Competitive Programming Sandbox",
    desc: "GCC 13, Clang 17, GDB debugger, AddressSanitizer, and preloaded LeetCode test harnesses.",
    memory: "1 GB RAM",
    cores: "2 vCPUs",
    launchTime: "~2s"
  },
  {
    id: "ws-cloud",
    title: "Cloud & Kubernetes Micro-Cluster",
    desc: "Single-node K3s Kubernetes cluster with kubectl, Helm, Terraform, and Docker-in-Docker enabled.",
    memory: "4 GB RAM",
    cores: "4 vCPUs",
    launchTime: "~8s"
  }
];

