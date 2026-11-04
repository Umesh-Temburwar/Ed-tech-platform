import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaCode, FaRobot, FaCloud, FaUserTie, FaProjectDiagram, FaUserGraduate, FaBriefcase,
  FaArrowRight, FaLaptopCode, FaDatabase, FaServer, FaBrain, FaLayerGroup, FaCheckCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";
import CoursesSection from "../components/core/HomePage/CoursesSection";
import Students from "./Students";
import About from "./About";
import Contact from "./Contact";

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
    <div className="min-h-screen bg-[#000814] text-richblack-5 font-inter overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* SECTION 1 – HERO SECTION (Video Removed, Full HD CSE Lab Visual Added) */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 px-4 md:px-8 lg:px-20 overflow-hidden bg-gradient-to-b from-[#001d3d]/40 via-[#000814] to-[#000814]">
        {/* Ambient Subtle Gradients */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10 w-full">
          {/* Left Column: Headline & Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-left"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Computer Science & Engineering Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] tracking-tight text-white">
              Master Modern <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
                Computer Science
              </span>
            </h1>
            
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Accelerate your engineering journey with structured curriculum in Algorithms, Systems Architecture, Full-Stack Development, and Artificial Intelligence.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup">
                <button className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]">
                  Start Learning Free
                </button>
              </Link>
              <Link to="/course-catalog">
                <button className="px-8 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all">
                  Explore Courses
                </button>
              </Link>
            </div>
            
            {/* Quick Metrics */}
            <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <p className="text-2xl font-black text-white">50K+</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Learners</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">70+</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">CSE Courses</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4.9/5</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Full HD CSE Hero Showcase Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-white/[0.02] group">
              <div className="aspect-[4/3] w-full relative overflow-hidden">
                <img 
                  src={cseEducationShowcase[0].image} 
                  alt="Computer Science Students in High-Tech Lab" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/30 to-transparent"></div>
              </div>

              {/* Overlay Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
                  <FaLaptopCode className="text-xs" /> CSE Collaborative Engineering
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Real-world Software Development & Lab Work
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
                  Modern, interactive learning environment equipped with industry-standard development workflows.
                </p>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2 shadow-lg">
                <FaCheckCircle className="text-emerald-400 text-sm" /> 100% Practical Labs
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 – 5 FULL HD CSE EDUCATION DISCIPLINE SHOWCASE */}
      <section className="py-20 px-4 md:px-8 lg:px-20 bg-[#001224]/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Comprehensive Curriculum
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              5 Pillars of Computer Science & Engineering
            </h2>
            <p className="text-slate-400 text-base mt-3">
              Explore the core computer science disciplines designed to prepare you for top-tier software engineering and research roles.
            </p>
          </div>

          {/* Interactive Discipline Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {cseEducationShowcase.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedShowcase(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedShowcase === idx
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <span>{item.badge}</span>
              </button>
            ))}
          </div>

          {/* Active Discipline Spotlight Feature (Full HD Image + Detailed Overview) */}
          <motion.div 
            key={selectedShowcase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 mb-16 shadow-2xl"
          >
            <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-lg relative group">
              <img 
                src={cseEducationShowcase[selectedShowcase].image} 
                alt={cseEducationShowcase[selectedShowcase].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300">
                Full HD CSE Resource
              </div>
            </div>

            <div className="lg:col-span-5 text-left space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {cseEducationShowcase[selectedShowcase].badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {cseEducationShowcase[selectedShowcase].title}
              </h3>
              <p className="text-sm font-semibold text-slate-300">
                {cseEducationShowcase[selectedShowcase].subtitle}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                {cseEducationShowcase[selectedShowcase].description}
              </p>
              
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Key Core Topics</p>
                <div className="flex flex-wrap gap-2">
                  {cseEducationShowcase[selectedShowcase].tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link to="/explore-courses">
                  <button className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                    View Related Courses <FaArrowRight className="text-xs" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 5-Image Grid Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {cseEducationShowcase.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => setSelectedShowcase(idx)}
                className={`rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 text-left bg-white/[0.02] flex flex-col ${
                  selectedShowcase === idx
                    ? "border-blue-500 ring-2 ring-blue-500/20"
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-sm">
                    {item.badge}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-400 mt-3 inline-block">
                    Explore track &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 – WHY CHOOSE US */}
      <section className="py-24 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-16 tracking-tight text-white"
          >
            Why Choose Us?
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] transition-all duration-300 text-left group hover:border-blue-500/30"
              >
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-105 transition-transform border border-white/10 text-blue-400">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">{feature.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 – COURSES CATALOG SECTION */}
      <CoursesSection />

      {/* SECTION 5 – CAREER TRANSFORMATION (Video Removed, Full HD CSE Lab Visual Added) */}
      <section className="py-16 px-4 md:px-8 lg:px-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative group">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center relative border border-white/15 shadow-2xl"
          >
            {/* Left Media (Full HD CSE Photo replacing former Video) */}
            <div className="w-full lg:w-5/12 h-[280px] lg:h-[380px] relative overflow-hidden">
              <img 
                src={cseEducationShowcase[4].image}
                alt="Student Engaged in Advanced Computing & AI Engineering"
                className="w-full h-full object-cover object-center brightness-[0.95] group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-blue-900/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/60 hidden lg:block"></div>
            </div>
            
            {/* Right Text Content */}
            <div className="w-full lg:w-7/12 p-8 lg:p-12 text-white z-10 relative flex flex-col justify-center text-left">
              <div className="inline-block px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-5 tracking-widest uppercase self-start">
                Career Transformation
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
                Start Your Computer Science Career Today
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                Build practical programming mastery with industry-grade labs, rigorous code reviews, and production capstone projects.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/signup">
                  <button className="flex items-center gap-3 bg-white text-slate-900 px-7 py-3 rounded-xl font-bold text-sm sm:text-base hover:bg-slate-100 transition-all shadow-lg active:scale-95">
                    Apply Now 
                    <FaArrowRight className="text-xs" />
                  </button>
                </Link>
                <Link to="/explore-courses">
                  <button className="px-7 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm sm:text-base transition-all">
                    Browse All Tracks
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
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
