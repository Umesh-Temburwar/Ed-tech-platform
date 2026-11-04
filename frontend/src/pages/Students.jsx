import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, Clock, CheckCircle2, Award, ArrowRight, BookOpen, Star, Sparkles, TrendingUp } from 'lucide-react';

const Students = () => {
  const { user } = useSelector((state) => state.profile);
  const isLoggedIn = !!user;
  const userRole = user?.accountType?.toLowerCase() || 'guest';

  const stats = [
    { label: 'Active Learners', value: '150K+', icon: Users },
    { label: 'Avg Daily Study', value: '3.4 Hrs', icon: Clock },
    { label: 'Courses Completed', value: '85K+', icon: CheckCircle2 },
    { label: 'Certificates Awarded', value: '60K+', icon: Award }
  ];

  const successStories = [
    {
      name: 'Arjun Reddy',
      course: 'Algorithms & Full-Stack Systems',
      role: 'Software Engineer @ Amazon',
      img: 'https://api.dicebear.com/5.x/initials/svg?seed=AR',
      text: 'Transitioning into core software engineering was seamless thanks to the structured test harness and algorithmic problem breakdowns.'
    },
    {
      name: 'Priya Das',
      course: 'Distributed Systems & Data Pipelines',
      role: 'Data Engineer @ Google',
      img: 'https://api.dicebear.com/5.x/initials/svg?seed=PD',
      text: 'The curriculum depth is identical to production engineering workflows. The focus on code quality and debugging built true confidence.'
    },
    {
      name: 'Rahul Verma',
      course: 'Operating Systems & Architecture',
      role: 'Systems Programmer @ Cloud Startup',
      img: 'https://api.dicebear.com/5.x/initials/svg?seed=RV',
      text: 'Understanding low-level memory layout, concurrency primitives, and kernel scheduling completely changed how I write code.'
    }
  ];

  const learningPaths = [
    {
      title: 'Systems & Full-Stack Engineering',
      students: '45K+ enrolled',
      level: 'Beginner to Advanced',
      duration: '6 Months',
      skills: ['TypeScript', 'Node.js', 'System Architecture', 'PostgreSQL', 'Docker']
    },
    {
      title: 'Algorithms, Data Structures & Complexity',
      students: '38K+ enrolled',
      level: 'Intermediate to Advanced',
      duration: '4 Months',
      skills: ['Graph Theory', 'Dynamic Programming', 'Trees', 'Memory Optimization', 'C++']
    },
    {
      title: 'AI, Neural Networks & Machine Learning',
      students: '32K+ enrolled',
      level: 'Intermediate',
      duration: '5 Months',
      skills: ['PyTorch', 'Transformers', 'Vector Databases', 'Python', 'MLOps']
    }
  ];

  return (
    <div className="min-h-screen bg-canvas text-text py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 border border-border text-muted uppercase tracking-wider">
            Academic Community
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-text tracking-tight">
            Learn Alongside Serious Engineers & Aspirants
          </h1>
          <p className="text-muted text-sm sm:text-base leading-relaxed">
            From university undergraduates to experienced software engineers, explore our global cohort advancing computational mastery.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {!isLoggedIn && (
              <Link to="/signup">
                <button className="btn-primary py-2.5 px-6 text-sm">
                  Join the Community
                </button>
              </Link>
            )}
            <Link to="/explore-courses">
              <button className="btn-secondary py-2.5 px-6 text-sm">
                Explore Curriculum
              </button>
            </Link>
          </div>
        </section>

        {/* Platform Metrics Bar */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-surface border border-border rounded-xl p-5 text-center shadow-sm hover:border-border/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-accent mx-auto mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-text tracking-tight">{stat.value}</h3>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            );
          })}
        </section>

        {/* Peer Success Stories */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
              Verified Alumni Outcomes
            </span>
            <h2 className="text-2xl font-bold text-text tracking-tight">
              Alumni Experiences & Case Studies
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, idx) => (
              <div
                key={idx}
                className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-border/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={story.img} 
                      alt={story.name} 
                      className="w-10 h-10 rounded-full border border-border object-cover" 
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-text">{story.name}</h4>
                      <p className="text-[11px] text-muted">{story.course}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted leading-relaxed italic">
                    "{story.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-border mt-5">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Outcome</span>
                  <p className="text-xs font-semibold text-text mt-0.5">{story.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Structured Learning Tracks */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
              Academic Roadmaps
            </span>
            <h2 className="text-2xl font-bold text-text tracking-tight">
              Standardized Curriculum Pathways
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path, idx) => (
              <div
                key={idx}
                className="bg-surface border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-border/80 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-text">{path.title}</h3>
                    <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 shrink-0">
                      {path.duration}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted mb-4 pb-4 border-b border-border">
                    <p className="flex justify-between">
                      <span>Cohort Size</span>
                      <span className="font-medium text-text">{path.students}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Target Level</span>
                      <span className="font-medium text-text">{path.level}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-2">Syllabus Competencies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {path.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="text-[11px] font-medium bg-surface-2 border border-border text-text px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-5">
                  <Link to="/explore-courses">
                    <button className="w-full btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <span>View Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center shadow-sm">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              Ready to Accelerate Your Learning?
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Enroll today and get immediate access to lecture archives, test suites, and interactive discussion forums.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link to="/signup">
                <button className="btn-primary py-2.5 px-6 text-xs font-semibold">
                  Get Started Free
                </button>
              </Link>
              <Link to="/explore-courses">
                <button className="btn-secondary py-2.5 px-6 text-xs font-semibold">
                  Browse All Courses
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Students;
