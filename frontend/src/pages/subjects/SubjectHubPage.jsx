import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, Users, Star, Clock, CheckCircle2, ChevronRight, 
  Briefcase, DollarSign, HelpCircle, ArrowRight, ShieldCheck, 
  Terminal, Sparkles, Award
} from 'lucide-react';
import { allSubjectsData } from '../../data/allSubjectsData';
import Footer from '../../components/common/Footer';

export default function SubjectHubPage({ defaultSlug }) {
  const { subjectSlug } = useParams();
  const slug = defaultSlug || subjectSlug || 'computer-science';
  
  // Normalize 'ai' and 'al'
  const normalizedSlug = (slug === 'ai' || slug === 'al') ? 'al' : slug;
  const data = allSubjectsData[normalizedSlug] || allSubjectsData['computer-science'];

  const [activeTab, setActiveTab] = useState('curriculum');
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative border-b border-border bg-surface overflow-hidden py-14 lg:py-20">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img 
            src={data.heroImage} 
            alt={data.title}
            className="w-full h-full object-cover filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
        </div>

        <div className="w-11/12 max-w-6xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-4">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/full-catalog" className="hover:text-accent transition-colors">Subjects</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">{data.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/10 border border-accent/20 text-accent">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Professional Academy Curriculum</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text leading-tight">
                {data.title}
              </h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                {data.tagline}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <BookOpen className="w-3.5 h-3.5 text-accent" />
                    <span>Courses</span>
                  </div>
                  <div className="text-lg font-bold text-text mt-0.5">{data.coursesCount}+</div>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Users className="w-3.5 h-3.5 text-success" />
                    <span>Learners</span>
                  </div>
                  <div className="text-lg font-bold text-text mt-0.5">{data.enrolledCount}</div>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                    <span>Rating</span>
                  </div>
                  <div className="text-lg font-bold text-text mt-0.5">{data.avgRating} / 5.0</div>
                </div>

                <div className="p-3 rounded-lg bg-surface-2 border border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span>Timeline</span>
                  </div>
                  <div className="text-xs font-bold text-text mt-1">{data.durationWeeks}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link 
                  to="/signup"
                  className="px-5 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Start Learning Track</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/full-catalog"
                  className="px-5 py-2.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text text-sm font-medium transition-colors"
                >
                  Browse All Courses
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-xl border border-border overflow-hidden shadow-card bg-surface">
                <img 
                  src={data.heroImage} 
                  alt={data.title}
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="p-4 bg-surface border-t border-border flex items-center justify-between text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span>Verified Academic Syllabus</span>
                  </div>
                  <span className="font-mono text-text bg-surface-2 px-2 py-0.5 rounded border border-border">
                    {data.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-border">
        <div className="w-11/12 max-w-6xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 text-xs sm:text-sm font-medium">
          {[
            { id: 'curriculum', label: 'Structured Curriculum' },
            { id: 'courses', label: 'Featured Courses' },
            { id: 'careers', label: 'Career Outcomes & Salaries' },
            { id: 'faq', label: 'Frequently Asked Questions' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-accent text-white font-semibold' 
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text">Complete Learning Syllabus & Modules</h2>
              <p className="text-sm text-muted">
                Each module is carefully sequenced from foundational principles to advanced industrial engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.modules.map((mod, i) => (
                <div key={i} className="p-5 rounded-lg border border-border bg-surface hover:border-accent/40 transition-colors space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                      {mod.duration}
                    </span>
                    <span className="text-xs text-muted">Module 0{i + 1}</span>
                  </div>

                  <h3 className="text-base font-semibold text-text">{mod.title}</h3>

                  <ul className="space-y-2 pt-1">
                    {mod.topics.map((topic, tidx) => (
                      <li key={tidx} className="flex items-start gap-2 text-xs sm:text-sm text-muted">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text">Top-Rated {data.title} Courses</h2>
              <p className="text-sm text-muted">
                Explore hand-crafted practical courses taught by industry veterans and distinguished academics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.featuredCourses.map(course => (
                <div 
                  key={course.id} 
                  className="rounded-lg border border-border bg-surface overflow-hidden flex flex-col hover:border-accent/50 transition-colors shadow-sm group"
                >
                  <div className="relative h-44 overflow-hidden bg-surface-2">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface/90 backdrop-blur border border-border text-text">
                      {course.level}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h4 className="text-sm sm:text-base font-semibold text-text group-hover:text-accent transition-colors line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-xs text-muted">Instructor: {course.instructor}</p>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                        <span className="font-bold text-text">{course.rating}</span>
                        <span className="text-muted">({course.reviews})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text">{course.price}</span>
                        <Link 
                          to="/courses"
                          className="px-2.5 py-1 rounded bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Careers & Salary Tab */}
        {activeTab === 'careers' && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text">Industry Demand & Career Trajectory</h2>
              <p className="text-sm text-muted">
                Explore real salary benchmarks and leading tech companies actively hiring graduates in {data.title}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.careerRoles.map((role, idx) => (
                <div key={idx} className="p-5 rounded-lg border border-border bg-surface space-y-4">
                  <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <Briefcase className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text">{role.role}</h3>
                    <div className="text-sm font-semibold text-success flex items-center gap-1">
                      <DollarSign className="w-4 h-4 shrink-0" />
                      <span>{role.avgSalary}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-xs font-semibold text-muted uppercase tracking-wider">Top Hiring Companies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {role.companies.map((company, cidx) => (
                        <span key={cidx} className="text-xs px-2 py-0.5 rounded bg-surface-2 border border-border text-muted-dark">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-lg border border-border bg-surface-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-text">Need Personalized Career Mentorship?</h4>
                <p className="text-xs sm:text-sm text-muted">
                  Work directly with staff engineers from Google and Microsoft to tailor your resume and portfolio.
                </p>
              </div>

              <Link
                to="/career-services"
                className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold transition-colors shrink-0"
              >
                Explore Career Services
              </Link>
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-8 max-w-3xl">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text">Frequently Asked Questions</h2>
              <p className="text-sm text-muted">
                Got questions about the curriculum, hardware requirements, or certifications? We've got answers.
              </p>
            </div>

            <div className="space-y-3">
              {data.faqs.map((faq, fidx) => (
                <div 
                  key={fidx} 
                  className="rounded-lg border border-border bg-surface overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === fidx ? null : fidx)}
                    className="w-full p-4 text-left flex items-center justify-between text-sm sm:text-base font-medium text-text hover:text-accent transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-muted transition-transform ${openFaq === fidx ? 'rotate-90' : ''}`} />
                  </button>

                  {openFaq === fidx && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-muted border-t border-border/50 bg-surface-2/40 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

