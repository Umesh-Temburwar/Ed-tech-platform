// Comprehensive Data for all 14 Programming Languages
export const allLanguagesData = {
  "bash": {
    slug: "bash",
    name: "Bash & Shell Scripting",
    tagline: "The universal language of Linux servers, automation, CI/CD pipelines, and DevOps orchestration.",
    paradigm: "Scripting / Command-line",
    version: "Bash 5.2+",
    popularityRank: "#8 in Developer Survey",
    difficulty: "Beginner to Intermediate",
    heroImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1600&q=80",
    overview: "Bash (Bourne Again SHell) is the standard command-line interface and scripting language found on virtually every Linux distribution and macOS server worldwide. Mastering Bash enables developers to automate repetitive workflows, orchestrate cloud infrastructure, manipulate streams with regex, and manage production servers effortlessly.",
    codeSnippet: `#!/usr/bin/env bash
# Deploy & Health Check Automation Script
set -euo pipefail

APP_DIR="/var/www/edtech-api"
LOG_FILE="/var/log/deploy.log"

echo "[INFO] Starting deployment at $(date)" | tee -a "$LOG_FILE"

cd "$APP_DIR"
git pull origin main --quiet
npm install --production --silent

# Restart service safely
systemctl restart edtech-service
sleep 2

# Verify endpoint health status
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health)

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "[SUCCESS] Service deployed and healthy (Status: 200)" | tee -a "$LOG_FILE"
  exit 0
else
  echo "[ERROR] Health check failed with status $HTTP_STATUS!" | tee -a "$LOG_FILE"
  exit 1
fi`,
    roadmap: [
      { stage: "Stage 1: Terminal Fundamentals", topics: ["Navigation, file permissions (chmod/chown), globbing", "Standard streams (stdin, stdout, stderr), redirection and pipes", "Environment variables, PATH configuration, and shell profiles"] },
      { stage: "Stage 2: Scripting & Logic", topics: ["Variables, command substitution, arrays, and associative maps", "Conditional statements (if/elif/else, case), test operators [[ ]]", "Loops (for, while, until) and reading files line-by-line", "Functions, return codes, and positional parameters ($1, $@, $#)"] },
      { stage: "Stage 3: Text Processing & Regex", topics: ["Grep, sed (stream editor), and awk for log slicing", "Regular expressions: BRE vs ERE patterns", "JSON processing with jq in command lines", "Handling signals (trap) and exit handlers"] },
      { stage: "Stage 4: Production Automation", topics: ["Cron jobs, systemd timers, and automated backups", "Writing safe scripts with set -euo pipefail", "SSH key automation, rsync, and remote execution", "Integrating Bash inside Docker and GitHub Actions CI"] }
    ],
    projects: [
      { title: "Automated Database Backup & S3 Archiver", stack: "Bash, pg_dump, AWS CLI, GPG encryption", level: "Intermediate" },
      { title: "Linux Server Security Auditor & Alert Bot", stack: "Bash, UFW, Fail2ban, Slack Webhook", level: "Intermediate" },
      { title: "Zero-Downtime Deployment Orchestrator", stack: "Bash, Nginx, Systemd, Curl, Git", level: "Advanced" }
    ],
    careerRoles: [
      { role: "DevOps Engineer", avgSalary: "$130,000 - $185,000", companies: ["AWS", "GitHub", "Cloudflare", "DigitalOcean"] },
      { role: "Linux Systems Administrator", avgSalary: "$90,000 - $135,000", companies: ["Red Hat", "Canonical", "Banks", "Universities"] }
    ],
    courses: [
      { id: "bash-1", title: "Linux Command Line & Bash Scripting Mastery", instructor: "Jason Cannon", rating: 4.93, reviews: 2410, price: "$59", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Can I run Bash on Windows?", a: "Yes, via WSL2 (Windows Subsystem for Linux) or Git Bash, both of which provide a complete Linux environment on Windows." }
    ]
  },
  "c++": {
    slug: "c++",
    name: "C++ Programming",
    tagline: "The high-performance language of game engines, operating systems, browsers, and low-latency trading.",
    paradigm: "Multi-paradigm (OOP, Procedural, Generic)",
    version: "C++20 / C++23",
    popularityRank: "#4 in TIOBE Index",
    difficulty: "Advanced",
    heroImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
    overview: "C++ provides unmatched hardware control combined with zero-cost abstractions. It powers modern operating systems, AAA game engines like Unreal Engine 5, web browsers (Chromium/V8), scientific supercomputing, and ultra-low-latency financial trading systems.",
    codeSnippet: `#include <iostream>
#include <vector>
#include <algorithm>
#include <memory>

class StudentRecord {
private:
    std::string name;
    double score;
public:
    StudentRecord(std::string n, double s) : name(std::move(n)), score(s) {}

    [[nodiscard]] double getScore() const noexcept { return score; }
    [[nodiscard]] const std::string& getName() const noexcept { return name; }
};

int main() {
    std::vector<StudentRecord> students = {
        {"Alex", 94.5}, {"Sophia", 98.2}, {"Liam", 88.0}
    };

    // Modern C++20 lambda sort by score descending
    std::ranges::sort(students, [](const auto& a, const auto& b) {
        return a.getScore() > b.getScore();
    });

    std::cout << "Top Student: " << students.front().getName() 
              << " (" << students.front().getScore() << "%)\\n";
    return 0;
}`,
    roadmap: [
      { stage: "Stage 1: Core Syntax & Memory Basics", topics: ["Pointers, references, addresses, and pointer arithmetic", "Stack vs Heap memory allocations, malloc vs new", "Arrays, C-style strings, and std::string", "Functions, pass-by-reference vs value, and recursion"] },
      { stage: "Stage 2: Modern Object-Oriented Programming", topics: ["Classes, constructors, destructors, and Rule of 3/5/0", "Operator overloading, copy & move semantics", "Inheritance, virtual functions, and vtable polymorphism", "Const correctness, namespaces, and explicit constructors"] },
      { stage: "Stage 3: STL & Generic Programming", topics: ["Standard Template Library: vector, map, unordered_map, set", "Templates, typename, template specialization, and Concepts (C++20)", "Iterators, algorithms (<ranges>, <algorithm>), and lambdas", "Smart pointers: std::unique_ptr, std::shared_ptr, std::weak_ptr"] },
      { stage: "Stage 4: Advanced Systems & Concurrency", topics: ["Multithreading: std::thread, std::mutex, condition_variable, std::jthread", "Lock-free programming, atomic variables, and memory orders", "RAII design patterns and custom memory allocators", "Profiling with Valgrind, GDB, and address sanitizers"] }
    ],
    projects: [
      { title: "High-Performance In-Memory Key-Value Store", stack: "Modern C++20, TCP Sockets, Multithreading, LRU Cache", level: "Advanced" },
      { title: "2D Physics Simulation Engine", stack: "C++, SDL2, Custom Collision Detection, Vectors", level: "Intermediate" },
      { title: "Custom Memory Allocator & Pool", stack: "C++, Pointer arithmetic, Memory alignment, OS mmap", level: "Advanced" }
    ],
    careerRoles: [
      { role: "C++ Systems Engineer", avgSalary: "$150,000 - $225,000", companies: ["Apple", "NVIDIA", "Intel", "Adobe"] },
      { role: "Quantitative Developer", avgSalary: "$180,000 - $350,000", companies: ["Jane Street", "Citadel", "Two Sigma", "Hudson River Trading"] },
      { role: "Game Engine Developer", avgSalary: "$110,000 - $175,000", companies: ["Epic Games", "Ubisoft", "Rockstar Games"] }
    ],
    courses: [
      { id: "cpp-1", title: "Modern C++: From Fundamentals to C++20 Mastery", instructor: "Prof. Michael Dawson", rating: 4.95, reviews: 3120, price: "$89", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is C++ still relevant in 2026?", a: "Yes! High-performance systems, AI inference runtimes (TensorRT, ONNX), browsers, game engines, and low-latency trading run overwhelmingly on C++." }
    ]
  },
  "csharp": {
    slug: "csharp",
    name: "C# & .NET",
    tagline: "The elegant, cross-platform powerhouse for cloud enterprise APIs, desktop apps, and Unity games.",
    paradigm: "Object-Oriented / Functional",
    version: "C# 12 / .NET 8+",
    popularityRank: "#5 in TIOBE Index",
    difficulty: "Beginner to Intermediate",
    heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    overview: "Engineered by Microsoft, C# is one of the most productive, well-designed modern languages. With the cross-platform .NET runtime, C# excels at lightning-fast microservices, cloud applications on Azure, enterprise software, and game development via Unity.",
    codeSnippet: `using System;
using System.Collections.Generic;
using System.Linq;

namespace EdTech.Catalog
{
    public record Course(string Id, string Title, double Rating, decimal Price);

    public class Program
    {
        public static void Main()
        {
            var courses = new List<Course>
            {
                new("C1", "C# Enterprise Microservices", 4.9, 89.99m),
                new("C2", "Unity 3D Game Development", 4.85, 79.99m),
                new("C3", "ASP.NET Core Web API", 4.95, 94.99m)
            };

            // LINQ query expression
            var topRated = courses
                .Where(c => c.Rating >= 4.9)
                .OrderByDescending(c => c.Rating);

            foreach (var course in topRated)
            {
                Console.WriteLine($"★ {course.Title} - \${course.Price}");
            }
        }
    }
}`,
    roadmap: [
      { stage: "Stage 1: C# Fundamentals", topics: ["Data types, records, structs, and nullable reference types", "Control flow, pattern matching (switch expressions)", "Object-Oriented Programming: classes, interfaces, abstract methods", "Exception handling and IDisposable pattern"] },
      { stage: "Stage 2: Advanced Language Features & LINQ", topics: ["Delegates, Func, Action, and Lambda expressions", "Language Integrated Query (LINQ) method & query syntax", "Generics, collections, and custom enumerators (yield return)", "Asynchronous programming with async/await and Tasks"] },
      { stage: "Stage 3: ASP.NET Core & Web APIs", topics: ["Dependency Injection, middleware pipeline, and routing", "RESTful Web APIs and Minimal APIs in .NET 8", "Entity Framework Core (EF Core), migrations & LINQ to SQL", "JWT Authentication and Identity management"] },
      { stage: "Stage 4: Cloud Architecture & Testing", topics: ["Microservices architecture with RabbitMQ & gRPC", "Unit testing with xUnit, Moq, and FluentAssertions", "Containerizing .NET apps with Docker & deploying to Azure", "Performance profiling with BenchmarkDotNet"] }
    ],
    projects: [
      { title: "Enterprise E-Commerce Microservices", stack: "ASP.NET Core, EF Core, PostgreSQL, Docker, RabbitMQ", level: "Advanced" },
      { title: "Real-Time Collaboration Hub", stack: "C#, SignalR, Blazor WebAssembly, Redis", level: "Intermediate" },
      { title: "3D RPG Game Prototype", stack: "C#, Unity Engine, NavMesh, State Machines", level: "Intermediate" }
    ],
    careerRoles: [
      { role: ".NET Full Stack Developer", avgSalary: "$115,000 - $165,000", companies: ["Microsoft", "Accenture", "Barclays", "Healthcare Systems"] },
      { role: "Unity Game Developer", avgSalary: "$95,000 - $145,000", companies: ["Mobile Studios", "Indie Studios", "Simulation Firms"] }
    ],
    courses: [
      { id: "cs-1", title: "Complete C# & ASP.NET Core Web API Bootcamp", instructor: "Mosh Hamedani", rating: 4.94, reviews: 3890, price: "$85", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is C# Windows-only?", a: "Not anymore! Modern .NET (from .NET Core onward) is fully cross-platform and runs natively on Linux, macOS, and Docker containers." }
    ]
  },
  "go": {
    slug: "go",
    name: "Go (Golang)",
    tagline: "The language of cloud infrastructure, Kubernetes, Docker, and high-concurrency microservices.",
    paradigm: "Concurrent / Imperative / Procedural",
    version: "Go 1.22+",
    popularityRank: "#7 in Developer Demand",
    difficulty: "Beginner to Intermediate",
    heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    overview: "Designed at Google by Ken Thompson and Rob Pike, Go delivers simplicity, blistering compilation speed, and effortless concurrency with Goroutines and Channels. It powers the backbone of the cloud: Docker, Kubernetes, Terraform, and Prometheus.",
    codeSnippet: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type HealthResponse struct {
	Status    string \`json:"status"\`
	Timestamp string \`json:"timestamp"\`
	Goroutines int   \`json:"active_threads"\`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	resp := HealthResponse{
		Status:    "healthy",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Goroutines: 4,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func main() {
	http.HandleFunc("/health", healthHandler)
	fmt.Println("🚀 Go Microservice listening on :8080")
	http.ListenAndServe(":8080", nil)
}`,
    roadmap: [
      { stage: "Stage 1: Go Syntax & Idioms", topics: ["Variables, explicit types, constants, and zero values", "Pointers (no pointer arithmetic), structs, and methods", "Slices, arrays, maps, and memory capacity reallocation", "Error handling as values (if err != nil)"] },
      { stage: "Stage 2: Interfaces & Composition", topics: ["Implicit interfaces, duck typing, and empty interface (any)", "Type assertions, type switches, and struct embedding", "Standard library: io, os, bufio, strings, and testing", "JSON serialization, tags, and custom marshalers"] },
      { stage: "Stage 3: Concurrency Mastery", topics: ["Goroutines lightweight threads (2KB stack)", "Channels: buffered vs unbuffered, directional channels", "Select statement, timeouts, and channel closing idioms", "Sync package: Mutex, RWMutex, WaitGroup, and Once"] },
      { stage: "Stage 4: Production Microservices & Tooling", topics: ["Building REST APIs with Chi, Gin, or Fiber", "Context package: cancellations, deadlines, and tracing", "gRPC and Protocol Buffers for fast internal RPC", "Profiling with pprof, race detector, and benchcmp"] }
    ],
    projects: [
      { title: "High-Throughput Distributed Rate Limiter", stack: "Go, Redis, Token Bucket, Docker", level: "Advanced" },
      { title: "Custom Reverse Proxy & Load Balancer", stack: "Go, net/http, Round Robin, Health Checks", level: "Intermediate" },
      { title: "CLI Tool with Cobra & Bubbletea", stack: "Go, Cobra, TUI Components, Git API", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Backend / Cloud Engineer", avgSalary: "$140,000 - $195,000", companies: ["Google", "Uber", "Twitch", "HashiCorp", "Docker"] },
      { role: "Infrastructure Systems Engineer", avgSalary: "$145,000 - $205,000", companies: ["Cloudflare", "DigitalOcean", "Kubernetes SIGs"] }
    ],
    courses: [
      { id: "go-1", title: "Go: The Complete Developer's Guide (Golang)", instructor: "Stephen Grider", rating: 4.92, reviews: 2980, price: "$89", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Why is Go preferred for cloud services?", a: "Because Go compiles down to a single standalone binary with near-instant startup times and minimal memory footprint, making it ideal for containerized microservices." }
    ]
  },
  "html-css": {
    slug: "html-css",
    name: "HTML5 & Modern CSS",
    tagline: "The foundational building blocks of the World Wide Web, responsive layout, and visual typography.",
    paradigm: "Markup / Declarative Styling",
    version: "HTML5 / CSS3 / CSS4 specs",
    popularityRank: "#1 in Web Technologies",
    difficulty: "Beginner",
    heroImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
    overview: "Every single webpage on earth is built on HTML and CSS. Modern HTML5 introduces semantic tagging, accessibility primitives, and rich media, while modern CSS offers CSS Grid, Flexbox, subgrid, container queries, custom properties, and hardware-accelerated animations.",
    codeSnippet: `<!-- Semantic Card Component -->
<article class="course-card">
  <div class="badge">Bestseller</div>
  <img src="python-bootcamp.jpg" alt="Python Masterclass Course Banner" loading="lazy" />
  <div class="content">
    <h3>Complete Python 3 Masterclass</h3>
    <p>Zero to hero programming with practical real-world exercises.</p>
    <div class="footer">
      <span class="price">$49.99</span>
      <button type="button" class="btn-enroll">Enroll Now</button>
    </div>
  </div>
</article>

<style>
  .course-card {
    display: grid;
    grid-template-rows: auto 1fr;
    border-radius: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    overflow: hidden;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .course-card:hover {
    transform: translateY(-2px);
  }
</style>`,
    roadmap: [
      { stage: "Stage 1: Semantic HTML5 & Accessibility", topics: ["Semantic tags: header, nav, main, section, article, footer", "Forms: input types, labels, validation attributes, accessible forms", "Media: picture, source, video, audio, and SVG graphics", "ARIA roles, attributes, screen reader accessibility (WCAG)"] },
      { stage: "Stage 2: CSS Box Model & Selectors", topics: ["Box model: margin, border, padding, and content width", "CSS specificity hierarchy and cascade resolution", "Typography: fluid clamp(), font-display, letter spacing", "Color spaces: hex, rgb, hsl, oklch, and custom properties (variables)"] },
      { stage: "Stage 3: Flexbox, Grid & Responsive Layouts", topics: ["Flexbox: axis alignment, flex-grow, flex-shrink, flex-wrap", "CSS Grid: grid-template-columns, areas, auto-fill/fit, minmax()", "Mobile-first media queries and responsive breakpoints", "Container queries (@container) and subgrid layouts"] },
      { stage: "Stage 4: Animations & Modern CSS Architecture", topics: ["CSS transitions, timing functions (cubic-bezier), and transforms", "Keyframe animations, scroll-driven animations (@keyframes)", "Tailwind CSS utility-first workflow and theme tokens", "BEM naming methodology vs CSS Modules"] }
    ],
    projects: [
      { title: "Pixel-Perfect SaaS Landing Page", stack: "HTML5, Modern CSS, Grid, Flexbox, Dark Mode", level: "Beginner" },
      { title: "Accessible Component Library (Buttons, Modals, Forms)", stack: "Semantic HTML5, ARIA, CSS Tokens, Micro-interactions", level: "Intermediate" },
      { title: "Interactive Interactive Magazine Layout", stack: "CSS Grid, Subgrid, View Transitions, Typography", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Frontend Developer", avgSalary: "$90,000 - $140,000", companies: ["Creative Agencies", "Startups", "Enterprises"] },
      { role: "Web Designer / UI Developer", avgSalary: "$85,000 - $130,000", companies: ["Design Studios", "Tech Brands"] }
    ],
    courses: [
      { id: "html-1", title: "Modern HTML & CSS from the Beginning", instructor: "Brad Traversy", rating: 4.95, reviews: 4500, price: "$49", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Do I need to learn HTML/CSS before JavaScript or React?", a: "Yes! A solid grasp of HTML semantics and CSS layouts makes learning React and frontend frameworks 10x easier." }
    ]
  },
  "java": {
    slug: "java",
    name: "Java",
    tagline: "The battle-tested enterprise titan powering Fortune 500 backends, Spring Boot, and Android.",
    paradigm: "Object-Oriented / Class-based",
    version: "Java 21 LTS+",
    popularityRank: "#3 in TIOBE Index",
    difficulty: "Intermediate",
    heroImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    overview: "With 'write once, run anywhere' portability, Java runs the world's most mission-critical enterprise systems, banking ledgers, big data engines (Hadoop/Spark), and cloud microservices powered by the modern Spring Boot 3 framework.",
    codeSnippet: `package com.edtech.service;

import java.util.List;
import java.util.stream.Collectors;

public class CourseAnalytics {

    public record Course(String id, String title, int students, double rating) {}

    public static void main(String[] args) {
        List<Course> courses = List.of(
            new Course("J1", "Spring Boot Enterprise APIs", 12400, 4.9),
            new Course("J2", "Java Concurrency & Virtual Threads", 8500, 4.95),
            new Course("J3", "Data Structures in Java", 21000, 4.8)
        );

        // Modern Java Streams API (Java 21)
        List<String> topCourses = courses.stream()
            .filter(c -> c.rating() >= 4.9)
            .map(c -> c.title() + " (" + c.students() + " learners)")
            .collect(Collectors.toList());

        topCourses.forEach(System.out::println);
    }
}`,
    roadmap: [
      { stage: "Stage 1: Core Java & OOP", topics: ["JVM, JDK, JRE architecture and bytecode execution", "Data types, wrapper classes, operators, and loops", "OOP: Encapsulation, Inheritance, Polymorphism, Abstraction", "String pool, immutability, StringBuilder, and regex"] },
      { stage: "Stage 2: Collections & Modern Java (8 to 21)", topics: ["Java Collections Framework: List, Set, Map, Queue", "Generics, type erasure, and bounded wildcards", "Lambdas, Functional Interfaces, and Stream API", "Records, Sealed Classes, Pattern Matching, and Switch expressions"] },
      { stage: "Stage 3: Multithreading & Virtual Threads", topics: ["Thread lifecycle, Runnable, Callable, and Future", "Synchronization, volatile, atomic classes, and locks", "ExecutorService, thread pools, and ForkJoinPool", "Virtual Threads (Project Loom) in Java 21 for millions of threads"] },
      { stage: "Stage 4: Spring Boot 3 & Microservices", topics: ["Spring Core, Inversion of Control (IoC), and Dependency Injection", "Building REST APIs with Spring MVC & Spring Data JPA", "Hibernate ORM, entity relations, and caching", "Spring Security with JWT, Docker, and Kafka integration"] }
    ],
    projects: [
      { title: "Enterprise Banking Microservices Architecture", stack: "Java 21, Spring Boot 3, PostgreSQL, Kafka, Docker", level: "Advanced" },
      { title: "High-Throughput Web Crawler with Virtual Threads", stack: "Java 21, Virtual Threads, Jsoup, Redis", level: "Intermediate" },
      { title: "University Management System with REST & JPA", stack: "Java, Spring Boot, Spring Security, MySQL", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Java Backend Engineer", avgSalary: "$120,000 - $175,000", companies: ["Amazon", "Goldman Sachs", "Oracle", "LinkedIn", "eBay"] },
      { role: "Enterprise Software Architect", avgSalary: "$150,000 - $220,000", companies: ["JPMorgan Chase", "IBM", "Walmart Tech"] }
    ],
    courses: [
      { id: "java-1", title: "Java 21 Masterclass: Comprehensive OOP to Spring Boot", instructor: "Tim Buchalka", rating: 4.94, reviews: 4900, price: "$95", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is Java fast enough for modern applications?", a: "Yes, modern OpenJDK with HotSpot JIT compiler and Project Loom virtual threads outperforms most interpreted languages by orders of magnitude." }
    ]
  },
  "javascript": {
    slug: "javascript",
    name: "JavaScript",
    tagline: "The language of the web, powering frontend browsers, Node.js servers, mobile apps, and IoT devices.",
    paradigm: "Multi-paradigm (Event-driven, Functional, Prototype-based)",
    version: "ECMAScript 2024+",
    popularityRank: "#1 Most Used Language",
    difficulty: "Beginner to Intermediate",
    heroImage: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=1600&q=80",
    overview: "JavaScript is the undisputed king of web programming. From powering dynamic client-side interactions in modern browsers to lightning-fast event-driven backends with Node.js and full-stack frameworks like Next.js, learning JavaScript unlocks every corner of software development.",
    codeSnippet: `// Asynchronous API Fetch with Modern ES2024
async function fetchTopCourses(category = "computer-science") {
  try {
    const response = await fetch(\`https://api.edtech.org/v1/courses?cat=\${category}\`);
    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    
    const { data: courses } = await response.json();
    
    // Transform and filter top rated courses
    return courses
      .filter(course => course.rating >= 4.8)
      .map(({ id, title, rating, instructor }) => ({
        id,
        title,
        badge: rating >= 4.9 ? "Top Pick" : "Highly Rated",
        instructor: instructor.name
      }));
  } catch (err) {
    console.error("Failed to load courses:", err.message);
    return [];
  }
}`,
    roadmap: [
      { stage: "Stage 1: Core Syntax & Data Types", topics: ["let/const, primitives, reference types, type coercion", "Functions: arrow functions, default parameters, rest/spread", "Array methods: map, filter, reduce, find, some, every", "Objects, destructuring, optional chaining (?.), nullish coalescing (??)"] },
      { stage: "Stage 2: Asynchronous JS & Event Loop", topics: ["The Event Loop, Call Stack, Microtasks & Macrotasks", "Promises: chaining, Promise.all, Promise.race, Promise.allSettled", "Async/await, error handling with try/catch", "Web APIs: Fetch, localStorage, sessionStorage, and IndexedDB"] },
      { stage: "Stage 3: Advanced JS & Functional Programming", topics: ["Closures, lexical scoping, and currying", "Prototypal inheritance, __proto__, and class syntax", "The 'this' keyword, bind, call, and apply", "Modules (ESM vs CommonJS), generators, and iterators"] },
      { stage: "Stage 4: Full-Stack Node.js & Tooling", topics: ["Node.js runtime, fs, path, and http core modules", "Building REST APIs with Express or Fastify", "Package management: npm, pnpm, and yarn lockfiles", "Testing with Vitest/Jest and linting with ESLint/Prettier"] }
    ],
    projects: [
      { title: "Real-Time Collaborative Code Editor", stack: "JavaScript, Node.js, WebSockets, Monaco Editor", level: "Advanced" },
      { title: "Interactive Kanban Project Board", stack: "Vanilla JS, Drag and Drop API, LocalStorage", level: "Intermediate" },
      { title: "RESTful E-Commerce Backend API", stack: "Node.js, Express, PostgreSQL, JWT Authentication", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Frontend Developer", avgSalary: "$105,000 - $155,000", companies: ["Vercel", "Meta", "Netflix", "Shopify", "Airbnb"] },
      { role: "Full Stack JavaScript Engineer", avgSalary: "$120,000 - $175,000", companies: ["GitHub", "Stripe", "Uber", "Spotify"] }
    ],
    courses: [
      { id: "js-1", title: "The Complete JavaScript Course: From Zero to Expert", instructor: "Jonas Schmedtmann", rating: 4.96, reviews: 5200, price: "$89", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Should I learn JavaScript before TypeScript?", a: "Yes, TypeScript is a typed superset of JavaScript, so understanding core JS concepts is essential." }
    ]
  },
  "kotlin": {
    slug: "kotlin",
    name: "Kotlin",
    tagline: "Google's premier language for Android app development, server-side microservices, and multiplatform.",
    paradigm: "Object-Oriented / Functional",
    version: "Kotlin 2.0+",
    popularityRank: "#1 for Android Development",
    difficulty: "Intermediate",
    heroImage: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=1600&q=80",
    overview: "Officially endorsed by Google as the preferred language for Android, Kotlin is modern, concise, and 100% interoperable with Java. It eliminates NullPointerExceptions with built-in null safety and features first-class Coroutines for asynchronous concurrency.",
    codeSnippet: `package com.edtech.model

import kotlinx.coroutines.*

data class Course(val id: String, val title: String, val rating: Double)

class CourseRepository {
    // Suspending function for asynchronous non-blocking fetch
    suspend fun getTopCourses(): List<Course> = withContext(Dispatchers.IO) {
        delay(200) // Simulate network latency
        listOf(
            Course("K1", "Android Jetpack Compose Masterclass", 4.9),
            Course("K2", "Kotlin Multiplatform (KMP) Mobile", 4.95),
            Course("K3", "Server-Side Kotlin with Ktor", 4.88)
        )
    }
}

fun main() = runBlocking {
    val repo = CourseRepository()
    val courses = repo.getTopCourses()
    courses.filter { it.rating >= 4.9 }.forEach {
        println("★ \${it.title}")
    }
}`,
    roadmap: [
      { stage: "Stage 1: Kotlin Core & Null Safety", topics: ["val vs var, smart casts, string templates", "Null safety: nullable types (?), safe call (?.), Elvis operator (?:)", "Data classes, sealed classes, and enum classes", "Control flow: when expressions, ranges, and loops"] },
      { stage: "Stage 2: Functions & Functional Programming", topics: ["Higher-order functions, lambdas, and inline functions", "Extension functions and extension properties", "Scope functions: let, run, apply, also, with", "Collections: filter, map, flatMap, associate, groupBy"] },
      { stage: "Stage 3: Coroutines & Asynchronous Programming", topics: ["Coroutines basics: launch, async, await, and Job", "Dispatchers: Main, IO, Default, and Unconfined", "Structured concurrency, cancellation, and exception handling", "Kotlin Flows: cold flows, hot state flows (StateFlow, SharedFlow)"] },
      { stage: "Stage 4: Android & Jetpack Compose / KMP", topics: ["Jetpack Compose declarative UI architecture", "ViewModel, LiveData, State, and Navigation Compose", "Dependency injection with Hilt and Koin", "Kotlin Multiplatform (KMP) sharing code between iOS & Android"] }
    ],
    projects: [
      { title: "Full-Featured Jetpack Compose Android App", stack: "Kotlin, Jetpack Compose, Room Database, Retrofit, Hilt", level: "Advanced" },
      { title: "Kotlin Multiplatform Shared Logic App (iOS & Android)", stack: "Kotlin KMP, Compose Multiplatform, Ktor Client", level: "Advanced" },
      { title: "High-Performance Backend API with Ktor", stack: "Kotlin, Ktor, Exposed ORM, PostgreSQL", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Senior Android Developer", avgSalary: "$125,000 - $180,000", companies: ["Google", "Pinterest", "Duolingo", "Cash App", "Tinder"] },
      { role: "Mobile Architect", avgSalary: "$150,000 - $215,000", companies: ["Meta", "Uber", "Square"] }
    ],
    courses: [
      { id: "kotlin-1", title: "The Complete Android 14 & Kotlin Masterclass", instructor: "Denis Panjuta", rating: 4.92, reviews: 2780, price: "$89", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Can Kotlin be used for backend development?", a: "Yes, frameworks like Ktor and Spring Boot (with Kotlin support) are widely used for robust backend microservices." }
    ]
  },
  "php": {
    slug: "php",
    name: "PHP & Laravel",
    tagline: "The web workhorse powering over 75% of the web, WordPress, and the elegant Laravel framework.",
    paradigm: "Object-Oriented / Procedural",
    version: "PHP 8.3+",
    popularityRank: "#1 in Web CMS & CMS Backends",
    difficulty: "Beginner",
    heroImage: "https://images.unsplash.com/photo-1599507593499-a3f7f7d97f66?auto=format&fit=crop&w=1600&q=80",
    overview: "PHP powers over 75% of all CMS-backed websites, including WordPress, Wikipedia, and Slack's core systems. Modern PHP 8+ is fast (with JIT compilation), strictly typed, and features Laravel, which is universally acclaimed for its elegant developer ergonomics.",
    codeSnippet: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Course;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class CourseController extends Controller
{
    /**
     * Retrieve featured courses with ratings >= 4.8
     */
    public function featured(Request $request): JsonResponse
    {
        $courses = Course::query()
            ->where('rating', '>=', 4.8)
            ->with('instructor:id,name,avatar')
            ->orderByDesc('rating')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data'   => $courses
        ]);
    }
}`,
    roadmap: [
      { stage: "Stage 1: PHP 8 Fundamentals", topics: ["Variables, strict types, match expressions, and nullsafe operators", "Arrays: associative arrays, array destructuring, and array functions", "Functions, named arguments, and arrow functions", "Object-Oriented PHP: classes, readonly properties, traits, interfaces"] },
      { stage: "Stage 2: Database & Composer Ecosystem", topics: ["Composer dependency management and PSR standards (PSR-4, PSR-12)", "PDO secure database queries and prepared statements", "Session handling, cookies, and password hashing (bcrypt)", "RESTful APIs and JSON serialization"] },
      { stage: "Stage 3: The Laravel Framework", topics: ["Routing, Controllers, Middleware, and Blade templates", "Eloquent ORM: relationships, scopes, and migrations", "Form Request validation and API resource transformations", "Authentication with Laravel Breeze, Sanctum, or Jetstream"] },
      { stage: "Stage 4: Production Scale & Modern PHP", topics: ["Queues & Background jobs with Redis and Laravel Horizon", "Real-time WebSockets with Laravel Reverb or Pusher", "Automated testing with Pest PHP and PHPUnit", "Deployment with Docker, Laravel Forge, and PHP-FPM optimization"] }
    ],
    projects: [
      { title: "Modern SaaS Application with Subscription Billing", stack: "PHP 8.3, Laravel 11, Stripe, Tailwind CSS, PostgreSQL", level: "Advanced" },
      { title: "Headless CMS REST & GraphQL API", stack: "PHP, Laravel, Sanctum, Redis, Docker", level: "Intermediate" },
      { title: "Custom MVC Framework from Scratch", stack: "Modern PHP, Composer, PDO, Twig", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Full Stack Laravel Developer", avgSalary: "$95,000 - $145,000", companies: ["SaaS Startups", "Agencies", "Automattic", "Laravel Partners"] },
      { role: "PHP Backend Engineer", avgSalary: "$90,000 - $135,000", companies: ["E-Commerce Platforms", "Media Houses", "Enterprises"] }
    ],
    courses: [
      { id: "php-1", title: "PHP with Laravel for Beginners - Become a Master", instructor: "Edwin Diaz", rating: 4.89, reviews: 3100, price: "$79", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is PHP still a good choice today?", a: "Yes! Modern PHP 8 is fast, modern, and has one of the best developer ecosystems in existence via Laravel." }
    ]
  },
  "python": {
    slug: "python",
    name: "Python",
    tagline: "The world's most versatile language for AI, data science, web development, and automation.",
    paradigm: "Multi-paradigm (Object-Oriented, Imperative, Functional)",
    version: "Python 3.12+",
    popularityRank: "#1 in TIOBE & PYPL Index",
    difficulty: "Beginner",
    heroImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    overview: "Python's clean, readable syntax and enormous ecosystem make it the undisputed leader in Artificial Intelligence, Machine Learning, Data Science, and scientific computing. It is equally potent for web development with FastAPI and Django.",
    codeSnippet: `from dataclasses import dataclass
from typing import List

@dataclass
class Course:
    id: str
    title: str
    rating: float
    enrolled: int

courses: List[Course] = [
    Course("P1", "Complete Python 3 Bootcamp", 4.92, 45000),
    Course("P2", "FastAPI & Async Microservices", 4.88, 18500),
    Course("P3", "PyTorch Deep Learning Masterclass", 4.95, 32000),
]

# List comprehension filtering top courses
top_rated = [c for c in courses if c.rating >= 4.9]

for c in sorted(top_rated, key=lambda x: x.enrolled, reverse=True):
    print(f"★ {c.title}: {c.enrolled:,} students (Rating: {c.rating})")`,
    roadmap: [
      { stage: "Stage 1: Python Fundamentals", topics: ["Data types, strings, lists, tuples, dicts, and sets", "Control flow, list/dict comprehensions, and generators", "Functions, *args, **kwargs, decorators, and lambdas", "File I/O, context managers (with statement), and error handling"] },
      { stage: "Stage 2: OOP & Data Engineering", topics: ["Classes, magic dunder methods (__init__, __repr__, __call__)", "Dataclasses, type hinting, and Pydantic data validation", "NumPy array operations and vectorized calculations", "Pandas DataFrames for data cleaning, aggregation & merging"] },
      { stage: "Stage 3: Web Frameworks & APIs", topics: ["FastAPI: async endpoints, automatic OpenAPI/Swagger docs", "Django: ORM, admin dashboard, auth, and template engine", "SQLAlchemy and Alembic database migrations", "Asyncio event loops, tasks, and non-blocking I/O"] },
      { stage: "Stage 4: AI & Production Engineering", topics: ["Machine Learning with Scikit-Learn and PyTorch", "Building RAG pipelines with LangChain and LlamaIndex", "Packaging with Poetry/uv, pytest testing, and Docker", "Deploying Python applications to cloud platforms"] }
    ],
    projects: [
      { title: "AI-Powered PDF Question-Answering System", stack: "Python, LangChain, OpenAI API, ChromaDB, Streamlit", level: "Intermediate" },
      { title: "High-Performance Async API with FastAPI", stack: "Python 3.12, FastAPI, PostgreSQL, Redis, Docker", level: "Intermediate" },
      { title: "Automated Financial Stock Tracker & Forecaster", stack: "Python, Pandas, Scikit-learn, Matplotlib, yfinance", level: "Beginner" }
    ],
    careerRoles: [
      { role: "Python Developer", avgSalary: "$115,000 - $165,000", companies: ["Google", "Netflix", "Spotify", "Dropbox", "Instagram"] },
      { role: "AI / Data Science Engineer", avgSalary: "$135,000 - $195,000", companies: ["OpenAI", "Meta", "Tesla", "Databricks"] }
    ],
    courses: [
      { id: "py-1", title: "Complete Python Developer in 2026: Zero to Mastery", instructor: "Andrei Neagoie", rating: 4.95, reviews: 5600, price: "$89", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is Python fast enough for large-scale backends?", a: "With modern async frameworks like FastAPI, Cython, and C-extensions, Python easily handles millions of concurrent requests." }
    ]
  },
  "r": {
    slug: "r",
    name: "R Programming",
    tagline: "The premier statistical computing language for data science, bioinformatics, and academic research.",
    paradigm: "Statistical / Functional / Vectorized",
    version: "R 4.4+",
    popularityRank: "#1 in Academic & Biostatistics",
    difficulty: "Beginner to Intermediate",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    overview: "R is purpose-built for statistical computation, data analysis, and publication-quality graphics. It is the language of choice for biostatisticians, pharmaceutical research, epidemiologists, econometricians, and data journalists worldwide.",
    codeSnippet: `# Tidyverse Data Analysis in R
library(dplyr)
library(ggplot2)

# Load student examination dataset
students <- data.frame(
  id = 1:5,
  name = c("Aarav", "Priya", "Carlos", "Emma", "Hassan"),
  score = c(88.5, 94.0, 79.5, 96.0, 91.5),
  track = c("CS", "AI", "CS", "Data", "AI")
)

# Pipe operator and group summary
summary_stats <- students %>%
  group_by(track) %>%
  summarise(
    avg_score = mean(score),
    count = n()
  ) %>%
  arrange(desc(avg_score))

print(summary_stats)`,
    roadmap: [
      { stage: "Stage 1: R Fundamentals & Vectors", topics: ["Vectors, matrices, data frames, lists, and factors", "Indexing, vector recycling rules, and logical subsets", "Control flow: if/else, for loops, and vectorized ifelse()", "Writing custom R functions and handling missing values (NA)"] },
      { stage: "Stage 2: The Tidyverse Ecosystem", topics: ["dplyr for data manipulation: filter, select, mutate, summarise", "tidyr for reshaping data: pivot_longer and pivot_wider", "readr and readxl for importing CSV, Excel, and SQL data", "purrr for functional programming and mapping"] },
      { stage: "Stage 3: Data Visualization with ggplot2", topics: ["Grammar of graphics: data, aesthetics (aes), and geoms", "Customizing themes, color scales, facets, and labels", "Publication-ready figure exports (PDF, PNG, SVG)", "Interactive charts with plotly and ggiraph"] },
      { stage: "Stage 4: Statistical Modeling & Shiny Apps", topics: ["Linear regression (lm), logistic regression (glm), ANOVA", "Hypothesis testing: t.test, chisq.test, p-values", "R Markdown and Quarto for reproducible research reports", "Building interactive web applications with R Shiny"] }
    ],
    projects: [
      { title: "Interactive COVID-19 Epidemiology Dashboard", stack: "R, Shiny, leaflet, ggplot2, tidyverse", level: "Intermediate" },
      { title: "Clinical Trial Survival Analysis Model", stack: "R, survival, survminer, Quarto", level: "Advanced" },
      { title: "Financial Market Volatility Analyzer", stack: "R, quantmod, TTR, ggplot2", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Biostatistician", avgSalary: "$100,000 - $155,000", companies: ["Pfizer", "Novartis", "CDC", "AstraZeneca"] },
      { role: "Quantitative Data Analyst", avgSalary: "$95,000 - $145,000", companies: ["Insurance Firms", "Research Institutes", "World Bank"] }
    ],
    courses: [
      { id: "r-1", title: "R Programming A-Z: R for Data Science with Real Exercises", instructor: "Kirill Eremenko", rating: 4.88, reviews: 2150, price: "$75", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Should I learn R or Python for Data Science?", a: "Python is best for general machine learning and web integration; R is unmatched for pure statistical modeling, biostatistics, and academic publication graphics." }
    ]
  },
  "ruby": {
    slug: "ruby",
    name: "Ruby & Rails",
    tagline: "Designed for programmer happiness, powering Silicon Valley unicorns with Ruby on Rails.",
    paradigm: "Pure Object-Oriented / Dynamic",
    version: "Ruby 3.3+",
    popularityRank: "#1 for Rapid Prototyping",
    difficulty: "Beginner",
    heroImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1600&q=80",
    overview: "Created by Yukihiro Matsumoto to maximize developer joy, Ruby is an elegant, expressive language. Coupled with Ruby on Rails, it powered the rocket-ship growth of GitHub, Shopify, Airbnb, Basecamp, and Stripe.",
    codeSnippet: `# Ruby on Rails Controller with Business Logic
class CoursesController < ApplicationController
  before_action :authenticate_user!, only: [:enroll]

  def index
    @courses = Course.where(published: true)
                     .order(rating: :desc)
                     .limit(10)
    
    render json: {
      status: :ok,
      data: @courses.map(&:summary)
    }
  end

  def enroll
    course = Course.find(params[:id])
    current_user.enrollments.create!(course: course)
    render json: { message: "Successfully enrolled in #{course.title}" }
  end
end`,
    roadmap: [
      { stage: "Stage 1: Ruby Language Syntax", topics: ["Everything is an object, method calls without parentheses", "Variables, symbols (:symbol), arrays, and hashes", "Blocks, procs, lambdas, and yield keyword", "Classes, inheritance, modules, and mixins"] },
      { stage: "Stage 2: Metaprogramming & Ruby Idioms", topics: ["method_missing, define_method, and dynamic dispatch", "Monkey patching, open classes, and safe extensions", "Gem dependency management and Bundler", "RSpec automated unit and integration testing"] },
      { stage: "Stage 3: Ruby on Rails 7 Fundamentals", topics: ["Convention over Configuration & MVC architecture", "ActiveRecord ORM: validations, callbacks, associations", "Routing, RESTful resources, controllers, and params", "ActionView templates, partials, and Hotwire (Turbo/Stimulus)"] },
      { stage: "Stage 4: Scaling & Modern Rails", topics: ["Background jobs with Sidekiq and Redis", "ActionCable for real-time WebSockets", "Deploying Rails applications with Docker, Kamal, and Heroku", "Building modern JSON APIs with Rails API mode"] }
    ],
    projects: [
      { title: "Complete Marketplace Platform with Stripe Connect", stack: "Ruby 3.3, Rails 7, Hotwire, PostgreSQL, Stripe", level: "Advanced" },
      { title: "Real-Time Chat & Discussion Forum", stack: "Ruby on Rails, ActionCable, Stimulus, Tailwind", level: "Intermediate" },
      { title: "API-Driven Project Management System", stack: "Ruby on Rails API, Sidekiq, Redis, JWT", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Senior Ruby on Rails Developer", avgSalary: "$120,000 - $175,000", companies: ["Shopify", "GitHub", "Basecamp", "Cookpad"] },
      { role: "Full Stack Engineer", avgSalary: "$115,000 - $165,000", companies: ["Startups", "Consultancies", "Fintechs"] }
    ],
    courses: [
      { id: "ruby-1", title: "The Complete Ruby on Rails Developer Course", instructor: "Rob Percival", rating: 4.9, reviews: 2890, price: "$85", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is Ruby on Rails still used by major companies?", a: "Yes, Shopify (one of the largest e-commerce platforms on Earth) runs entirely on a massive, highly optimized Rails codebase." }
    ]
  },
  "sql": {
    slug: "sql",
    name: "SQL & Relational Databases",
    tagline: "The universal language for querying, manipulating, and structuring relational database data.",
    paradigm: "Declarative Query Language",
    version: "ANSI SQL:2023",
    popularityRank: "#3 Most In-Demand Tech Skill",
    difficulty: "Beginner to Intermediate",
    heroImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1600&q=80",
    overview: "Structured Query Language (SQL) is the foundational skill required by software engineers, data scientists, and analysts alike. Master PostgreSQL, MySQL, SQLite, and cloud data warehouses like Snowflake and BigQuery.",
    codeSnippet: `-- Advanced Window Functions & Revenue Analysis
WITH MonthlyCourseMetrics AS (
    SELECT 
        c.category,
        c.title,
        COUNT(e.id) AS total_enrollments,
        SUM(e.amount_paid) AS total_revenue,
        ROW_NUMBER() OVER (
            PARTITION BY c.category 
            ORDER BY SUM(e.amount_paid) DESC
        ) AS rank_in_category
    FROM courses c
    INNER JOIN enrollments e ON c.id = e.course_id
    WHERE e.enrolled_at >= NOW() - INTERVAL '30 days'
    GROUP BY c.id, c.category, c.title
)
SELECT 
    category,
    title,
    total_enrollments,
    total_revenue
FROM MonthlyCourseMetrics
WHERE rank_in_category <= 3
ORDER BY category, rank_in_category;`,
    roadmap: [
      { stage: "Stage 1: Basic Queries & Filtering", topics: ["SELECT, FROM, WHERE, ORDER BY, and LIMIT", "Filtering operators: AND, OR, NOT, IN, BETWEEN, LIKE", "Aggregate functions: COUNT, SUM, AVG, MIN, MAX", "GROUP BY and HAVING clauses for group summaries"] },
      { stage: "Stage 2: Multi-Table Joins & Relationships", topics: ["INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN", "Self joins and cross joins", "Database normalization: 1NF, 2NF, 3NF, and BCNF", "Primary keys, foreign keys, and referential integrity constraints"] },
      { stage: "Stage 3: Advanced SQL & Analytics", topics: ["Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE()", "Lead/Lag navigation functions and running cumulative sums", "Common Table Expressions (CTEs) and Recursive CTEs", "Subqueries: correlated vs uncorrelated, EXISTS, and IN"] },
      { stage: "Stage 4: Optimization, Indexing & Administration", topics: ["B-Tree, Hash, and GIN indexes, covering indexes", "Reading and optimizing EXPLAIN ANALYZE execution plans", "Transactions, ACID properties, isolation levels, and row locking", "Partitioning large tables and sharding strategies"] }
    ],
    projects: [
      { title: "Enterprise Database Schema & Query Optimization", stack: "PostgreSQL 16, Index Tuning, Partitioning, CTEs", level: "Advanced" },
      { title: "Financial Transaction Ledger with ACID Compliance", stack: "SQL, Transactions, Constraints, Stored Procedures", level: "Intermediate" },
      { title: "E-Commerce Analytics Data Warehouse", stack: "Star Schema, Snowflake/BigQuery, ETL Queries", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "Database Administrator (DBA)", avgSalary: "$110,000 - $160,000", companies: ["Banks", "Cloud Providers", "Telecoms"] },
      { role: "Data Engineer / SQL Developer", avgSalary: "$125,000 - $175,000", companies: ["Amazon", "Uber", "Capital One", "Meta"] }
    ],
    courses: [
      { id: "sql-1", title: "The Complete SQL Bootcamp: Go from Zero to Hero", instructor: "Jose Portilla", rating: 4.95, reviews: 6200, price: "$69", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Which SQL database should I learn first?", a: "PostgreSQL is widely regarded as the most powerful, standard-compliant, and in-demand relational database in modern software engineering." }
    ]
  },
  "swift": {
    slug: "swift",
    name: "Swift & SwiftUI",
    tagline: "Apple's fast, modern language for building beautiful apps across iOS, iPadOS, macOS, and watchOS.",
    paradigm: "Multi-paradigm (Protocol-oriented, Functional, OOP)",
    version: "Swift 5.10 / Swift 6",
    popularityRank: "#1 in Apple Ecosystem",
    difficulty: "Intermediate",
    heroImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
    overview: "Crafted by Apple to replace Objective-C, Swift is fast, safe, and intuitive. Combined with the declarative SwiftUI framework, Swift enables developers to design fluid, native user experiences across iPhones, iPads, Macs, and Apple Vision Pro.",
    codeSnippet: `import SwiftUI

// Declarative SwiftUI Course Card
struct CourseCardView: View {
    let title: String
    let rating: Double
    let studentsCount: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Bestseller")
                    .font(.caption.bold())
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.blue.opacity(0.15))
                    .foregroundColor(.blue)
                    .clipShape(Capsule())
                Spacer()
                Label(String(format: "%.1f", rating), systemImage: "star.fill")
                    .foregroundColor(.orange)
                    .font(.subheadline.bold())
            }
            Text(title)
                .font(.headline)
                .lineLimit(2)
            Text("\(studentsCount) enrolled learners")
                .font(.footnote)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }
}`,
    roadmap: [
      { stage: "Stage 1: Swift Basics & Type Safety", topics: ["let vs var, type inference, tuples, and optionals", "Optional binding (if let, guard let) and nil-coalescing (??)", "Arrays, Dictionaries, and Sets collections", "Functions, argument labels, in-out parameters, and closures"] },
      { stage: "Stage 2: Protocol-Oriented Programming", topics: ["Structs (value types) vs Classes (reference types)", "Protocols, protocol inheritance, and protocol extensions", "Generics, type constraints, and associated types", "Error handling with do-try-catch and custom Error types"] },
      { stage: "Stage 3: SwiftUI Declarative UI", topics: ["Views, Modifiers, and View Hierarchy", "State management: @State, @Binding, @Observable, @Environment", "NavigationStack, TabView, and responsive Sheets", "Animations: withAnimation, spring transitions, and gestures"] },
      { stage: "Stage 4: Native iOS Architecture & Networking", topics: ["Async/await, Actors, and structured concurrency in Swift 6", "Networking with URLSession and Codable JSON parsing", "Local persistence with SwiftData and Core Data", "App Store Connect provisioning, TestFlight, and distribution"] }
    ],
    projects: [
      { title: "Native iOS Fitness & Habit Tracker", stack: "SwiftUI, SwiftData, HealthKit, WidgetKit", level: "Advanced" },
      { title: "Podcast Streaming & Offline Player", stack: "Swift, AVFoundation, URLSession, BackgroundTasks", level: "Intermediate" },
      { title: "Crypto Portfolio Tracker with Live Widgets", stack: "SwiftUI, REST API, Charts Framework, Combine", level: "Intermediate" }
    ],
    careerRoles: [
      { role: "iOS Developer", avgSalary: "$120,000 - $175,000", companies: ["Apple", "Uber", "Square", "Snap", "Spotify"] },
      { role: "Mobile Software Engineer", avgSalary: "$115,000 - $170,000", companies: ["Nike", "Lyft", "Robinhood", "Stripe"] }
    ],
    courses: [
      { id: "swift-1", title: "iOS 17 & SwiftUI Masterclass: Build 20+ Real Apps", instructor: "Dr. Angela Yu", rating: 4.96, reviews: 4800, price: "$95", image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=600&q=80" }
    ],
    faqs: [
      { q: "Is SwiftUI ready for production apps?", a: "Yes, Apple now recommends SwiftUI as the default framework for building all new iOS and macOS applications." }
    ]
  }
};

