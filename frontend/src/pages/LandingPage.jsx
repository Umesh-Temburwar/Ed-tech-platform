import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaCode, FaRobot, FaCloud, FaUserTie, FaProjectDiagram, FaUserGraduate, FaBriefcase,
  FaArrowRight, FaLaptopCode, FaDatabase, FaServer, FaBrain, FaLayerGroup, FaCheckCircle,
  FaTerminal, FaAward, FaBolt
} from "react-icons/fa";
import { 
  SiGoogle, 
  SiMicrosoft, 
  SiAmazon, 
  SiMeta, 
  SiUber, 
  SiNetflix, 
  SiStripe 
} from "react-icons/si";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import CoursesSection from "../components/core/HomePage/CoursesSection";
import Students from "./Students";
import About from "./About";
import Contact from "./Contact";
import signupImage from "../assets/Images/signup.webp";

// 5 Curated Full HD Computer Science & Engineering (CSE) Education Images
const cseEducationShowcase = [
  {
    id: 1,
    title: "Software Systems & Engineering Lab",
    subtitle: "Collaborative Full-Stack & System Design",
    description: "Hands-on engineering workshops building high-throughput production systems, scalable APIs, and microservice architectures.",
    tags: ["System Design", "Microservices", "Clean Architecture", "CI/CD"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80",
    badge: "Core Engineering"
  },
  {
    id: 2,
    title: "Algorithms & Computational Complexity",
    subtitle: "Data Structures & Advanced Problem Solving",
    description: "Deep-dive analysis of asymptotic efficiency, tree & graph algorithms, dynamic programming, and computational geometry.",
    tags: ["DSA Mastery", "Graph Theory", "Dynamic Programming", "Complexity"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80",
    badge: "Mathematical Foundations"
  },
  {
    id: 3,
    title: "Systems Architecture & OS Kernels",
    subtitle: "Low-Level Computing & Memory Management",
    description: "Understanding CPU pipelining, cache hierarchies, process scheduling, concurrency primitives, and kernel internals.",
    tags: ["Operating Systems", "Computer Architecture", "Linux Internals", "C/Rust"],
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80",
    badge: "Hardware & Systems"
  },
  {
    id: 4,
    title: "Dedicated Problem Solving & Coding Labs",
    subtitle: "Real-time Code Execution & Rigorous Debugging",
    description: "Intensive hands-on labs with real-time test harnesses, memory leak detection, and algorithmic benchmarking.",
    tags: ["Algorithms", "Unit Testing", "Debugging", "Code Quality"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80",
    badge: "Practical Mastery"
  },
  {
    id: 5,
    title: "Artificial Intelligence & Neural Computing",
    subtitle: "Deep Learning, LLMs & Data Pipelines",
    description: "Training neural networks, implementing transformer architectures, and building production-grade vector search and ML pipelines.",
    tags: ["Machine Learning", "PyTorch", "Computer Vision", "NLP & LLMs"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80",
    badge: "AI & Data Science"
  }
];

const alumniCompanies = [
  { name: "Google", icon: SiGoogle, color: "text-[#EA4335] group-hover:text-[#4285F4]" },
  { name: "Microsoft", icon: SiMicrosoft, color: "text-[#00A4EF] group-hover:text-[#0078D4]" },
  { name: "Amazon", icon: SiAmazon, color: "text-[#FF9900] group-hover:text-[#FF9900]" },
  { name: "Meta", icon: SiMeta, color: "text-[#0668E1] group-hover:text-[#0668E1]" },
  { name: "Uber", icon: SiUber, color: "text-text group-hover:text-accent" },
  { name: "Netflix", icon: SiNetflix, color: "text-[#E50914] group-hover:text-[#E50914]" },
  { name: "Stripe", icon: SiStripe, color: "text-[#635BFF] group-hover:text-[#635BFF]" },
];

export default function LandingPage() {
  const [selectedShowcase, setSelectedShowcase] = useState(0);

  const features = [
    {
      title: "Live Mentorship",
      desc: "Get direct guidance from industry experts through live interactive sessions.",
      icon: <FaUserTie />,
    },
    {
      title: "Real Industry Projects",
      desc: "Build your portfolio by working on production-level real-world projects.",
      icon: <FaProjectDiagram />,
    },
    {
      title: "Internship Assistance",
      desc: "Top performers get guaranteed internship referrals to partner tech startups.",
      icon: <FaUserGraduate />,
    },
    {
      title: "Job Placement Support",
      desc: "Resume building, mock interviews, and access to our exclusive job portal.",
      icon: <FaBriefcase />,
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-text font-inter overflow-x-hidden transition-colors duration-200">
      
      {/* SECTION 1 – HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 md:px-8 lg:px-16 overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto w-full flex flex-col space-y-14 relative z-10">
          
          {/* Top 2-Column Grid: Left Text | Right Circular Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
            {/* Left Column: Headline & Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-muted text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Computer Science & Engineering Platform
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-text">
                Master Modern <br />
                <span className="text-accent">
                  Computer Science
                </span>
              </h1>
              
              <p className="mt-5 text-sm sm:text-base text-muted max-w-xl leading-relaxed">
                Accelerate your engineering journey with structured curriculum in Algorithms, Systems Architecture, Full-Stack Development, and Artificial Intelligence.
              </p>
              
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/signup">
                  <button className="btn-primary py-3 px-6 text-sm">
                    Start Learning Free
                  </button>
                </Link>
                <Link to="/explore-courses">
                  <button className="btn-secondary py-3 px-6 text-sm">
                    Explore Courses
                  </button>
                </Link>
              </div>
              
              {/* Quick Metrics */}
              <div className="mt-10 pt-6 border-t border-border grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-text">50K+</p>
                  <p className="text-xs text-muted font-medium mt-0.5">Learners</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-text">70+</p>
                  <p className="text-xs text-muted font-medium mt-0.5">CSE Courses</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-text">4.9/5</p>
                  <p className="text-xs text-muted font-medium mt-0.5">Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Circular signup.webp with Animated Dot-Dot Orbit Circles & Floating Badges */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-6 relative flex items-center justify-center lg:justify-end py-6"
            >
              {/* Ambient Radial Backlight */}
              <div className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full bg-accent/20 dark:bg-accent/15 blur-3xl pointer-events-none -z-10" />

              {/* Floating Container */}
              <motion.div
                animate={{ y: [-7, 7, -7] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center"
              >
                {/* Outer Animated Dot-Dot Circle (Clockwise Rotation) */}
                <div 
                  className="absolute w-[310px] h-[310px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[420px] rounded-full border-2 border-dotted border-accent/60 dark:border-accent/40 pointer-events-none animate-spin"
                  style={{ animationDuration: '32s' }}
                >
                  {/* Orbiting Satellite Glowing Dot 1 */}
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)] border-2 border-surface" />
                  {/* Orbiting Satellite Glowing Dot 2 */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-success shadow-[0_0_10px_var(--success)] border-2 border-surface" />
                </div>

                {/* Inner Animated Dashed Circle (Counter-Clockwise Rotation) */}
                <div 
                  className="absolute w-[275px] h-[275px] sm:w-[335px] sm:h-[335px] lg:w-[370px] lg:h-[370px] rounded-full border border-dashed border-border pointer-events-none animate-spin"
                  style={{ animationDuration: '24s', animationDirection: 'reverse' }}
                >
                  {/* Orbiting Satellite Dot 3 */}
                  <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-warning shadow-[0_0_8px_var(--warning)] border border-surface" />
                </div>

                {/* Central Circular signup.webp Frame */}
                <div className="relative w-[230px] h-[230px] sm:w-[280px] sm:h-[280px] lg:w-[310px] lg:h-[310px] rounded-full p-2 bg-surface/90 backdrop-blur-md border-2 border-border shadow-2xl overflow-hidden group">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img 
                      src={signupImage} 
                      alt="Computer Science Scholar" 
                      className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-700 filter contrast-[1.03]"
                      loading="eager"
                    />
                    {/* Inner Circular Edge Rim */}
                    <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15 pointer-events-none" />
                  </div>
                </div>

                {/* Floating Chip 1: Top Left - Active Tech Stack */}
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute -top-3 -left-3 sm:top-1 sm:-left-6 z-20 px-3 py-1.5 rounded-xl bg-surface/95 backdrop-blur-md border border-border shadow-lg flex items-center gap-2 text-xs font-semibold text-text hover:border-accent/50 transition-colors whitespace-nowrap"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  <FaCode className="text-accent text-xs" />
                  <span>Full-Stack & Systems</span>
                </motion.div>

                {/* Floating Chip 2: Top Right - GATE & FAANG Ready */}
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-3 -right-3 sm:top-3 sm:-right-4 z-20 px-3 py-1.5 rounded-full bg-surface/95 backdrop-blur-md border border-border shadow-lg flex items-center gap-1.5 text-xs font-semibold text-text hover:border-accent/50 transition-colors whitespace-nowrap"
                >
                  <FaCheckCircle className="text-success text-xs" />
                  <span>GATE & FAANG Ready</span>
                </motion.div>

                {/* Floating Chip 3: Bottom Left - Scholars Count */}
                <motion.div
                  animate={{ y: [4, -4, 4] }}
                  transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  className="absolute -bottom-4 -left-3 sm:bottom-3 sm:-left-6 z-20 px-3 py-1.5 rounded-xl bg-surface/95 backdrop-blur-md border border-border shadow-xl flex items-center gap-2 text-xs text-text whitespace-nowrap"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                    <FaUserGraduate className="text-[11px]" />
                  </div>
                  <div>
                    <div className="font-bold text-text text-xs leading-tight">50,000+</div>
                    <div className="text-[9px] text-muted leading-tight">Enrolled Scholars</div>
                  </div>
                </motion.div>

                {/* Floating Chip 4: Bottom Right - Practical Labs */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                  className="absolute -bottom-4 -right-3 sm:bottom-2 sm:-right-4 z-20 px-3.5 py-2 rounded-xl bg-surface/95 backdrop-blur-md border border-border shadow-xl flex items-center gap-2.5 text-left hover:border-accent/50 transition-colors whitespace-nowrap"
                >
                  <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center text-accent">
                    <FaRobot className="text-xs" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text leading-tight">AI & Systems Lab</div>
                    <div className="text-[10px] text-muted font-medium leading-tight">Interactive Sandboxes</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Full-Width Strip: Alumni & Organization Trust Strip with Official Brand Logos */}
          <div className="w-full pt-10 border-t border-border">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted mb-5">
              Scholars building software at leading engineering organizations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
              {alumniCompanies.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div 
                    key={i}
                    className="group px-4 py-2 rounded-xl bg-surface-2 border border-border hover:border-accent/40 shadow-sm flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-muted hover:text-text transition-all duration-200 cursor-default"
                  >
                    <Icon className={`w-4 h-4 transition-colors ${c.color}`} />
                    <span>{c.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 – 5 FULL HD CSE EDUCATION DISCIPLINE SHOWCASE */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-surface-2/40 border-b border-border relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-2">
              Comprehensive Curriculum
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-text tracking-tight">
              5 Pillars of Computer Science & Engineering
            </h2>
            <p className="text-muted text-xs sm:text-sm mt-2 max-w-2xl mx-auto leading-relaxed">
              Explore the core computer science disciplines designed to prepare you for top-tier software engineering and research roles.
            </p>
          </div>

          {/* Interactive Discipline Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {cseEducationShowcase.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedShowcase(idx)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 border ${
                  selectedShowcase === idx
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "bg-surface text-muted hover:text-text hover:bg-surface-2 border-border"
                }`}
              >
                <span>{item.badge}</span>
              </button>
            ))}
          </div>

          {/* Active Discipline Spotlight Feature */}
          <motion.div 
            key={selectedShowcase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-12 shadow-sm"
          >
            <div className="lg:col-span-7 rounded-xl overflow-hidden aspect-video border border-border relative group">
              <img 
                src={cseEducationShowcase[selectedShowcase].image} 
                alt={cseEducationShowcase[selectedShowcase].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md border border-border text-[11px] font-semibold text-text shadow-sm">
                Full HD CSE Resource
              </div>
            </div>

            <div className="lg:col-span-5 text-left space-y-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent block">
                {cseEducationShowcase[selectedShowcase].badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
                {cseEducationShowcase[selectedShowcase].title}
              </h3>
              <p className="text-xs font-semibold text-text">
                {cseEducationShowcase[selectedShowcase].subtitle}
              </p>
              <p className="text-xs text-muted leading-relaxed">
                {cseEducationShowcase[selectedShowcase].description}
              </p>
              
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Key Core Topics</p>
                <div className="flex flex-wrap gap-1.5">
                  {cseEducationShowcase[selectedShowcase].tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2.5 py-1 rounded-md bg-surface-2 border border-border text-[11px] font-medium text-text">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <Link to="/explore-courses">
                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
                    View Related Courses <FaArrowRight className="text-[10px]" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 5-Image Grid Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {cseEducationShowcase.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => setSelectedShowcase(idx)}
                className={`rounded-xl overflow-hidden border cursor-pointer transition-colors text-left bg-surface flex flex-col ${
                  selectedShowcase === idx
                    ? "border-accent ring-2 ring-accent/20 shadow-sm"
                    : "border-border hover:border-border/80 hover:bg-surface-2"
                }`}
              >
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/75 text-white backdrop-blur-sm">
                    {item.badge}
                  </span>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-text line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-muted mt-0.5 line-clamp-2">{item.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-accent mt-2 inline-block">
                    Explore track &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 – WHY CHOOSE US */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-canvas border-b border-border">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-2">
            Why Our Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-12">
            Engineered for Serious Exam & Career Aspirants
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 bg-surface border border-border rounded-xl text-left shadow-sm hover:border-border/80 transition-colors"
              >
                <div className="w-10 h-10 bg-surface-2 border border-border rounded-lg flex items-center justify-center text-lg mb-4 text-accent">
                  {feature.icon}
                </div>
                <h4 className="text-sm font-semibold text-text mb-1">{feature.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 – COURSES CATALOG SECTION */}
      <CoursesSection />

      {/* SECTION 5 – CAREER TRANSFORMATION */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-canvas">
        <div className="max-w-5xl mx-auto">
          <div className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col lg:flex-row items-center shadow-sm">
            {/* Left Media */}
            <div className="w-full lg:w-5/12 h-[260px] lg:h-[320px] relative overflow-hidden">
              <img 
                src={cseEducationShowcase[4].image}
                alt="Student Engaged in Advanced Computing & AI Engineering"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            
            {/* Right Text Content */}
            <div className="w-full lg:w-7/12 p-8 lg:p-10 text-left">
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-2">
                Career Transformation
              </span>
              <h2 className="text-2xl font-bold text-text tracking-tight">
                Start Your Computer Science Career Today
              </h2>
              <p className="mt-2 text-xs text-muted leading-relaxed max-w-lg">
                Build practical programming mastery with industry-grade labs, rigorous code reviews, and production capstone projects.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/signup">
                  <button className="btn-primary py-2.5 px-5 text-xs font-semibold">
                    Apply Now
                  </button>
                </Link>
                <Link to="/explore-courses">
                  <button className="btn-secondary py-2.5 px-5 text-xs font-semibold">
                    Browse All Tracks
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Students />
      <About />
      <Contact />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
