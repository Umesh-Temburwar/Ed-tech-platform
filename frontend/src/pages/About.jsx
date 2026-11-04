import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, BookOpen, TrendingUp, DollarSign, Award, Target, Eye, Laptop, Clock, ArrowRight } from 'lucide-react';

const About = () => {
  const { user } = useSelector((state) => state.profile);
  const isLoggedIn = !!user;

  const stats = [
    { label: 'Active Students', value: '15,000+', icon: Users },
    { label: 'Specialized Courses', value: '500+', icon: BookOpen },
    { label: 'Target Exam Success', value: '95%', icon: TrendingUp },
    { label: 'Average Placement Hike', value: '70%', icon: DollarSign }
  ];

  const pillars = [
    {
      title: 'Industry-Aligned Projects',
      desc: 'Rigorous assignments and hands-on laboratory exercises mirroring real engineering environments.',
      icon: Laptop
    },
    {
      title: 'Expert Faculty Guidance',
      desc: 'Structured curriculum designed and taught by senior computer science practitioners and researchers.',
      icon: Target
    },
    {
      title: 'Flexible Modular Pace',
      desc: 'Study systematically at your own pace with continuous revision schedules and lifelong reference.',
      icon: Clock
    },
    {
      title: 'Accredited Credentials',
      desc: 'Earn course completion certificates verified through digital platform verification tokens.',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-canvas text-text py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="bg-surface border border-border rounded-xl p-8 md:p-12 text-center space-y-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-surface-2 border border-border text-muted uppercase tracking-wider">
            About Our Academy
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-text tracking-tight max-w-3xl mx-auto">
            Practical Computer Science Education Built for Serious Aspirants
          </h1>
          <p className="text-sm md:text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Bridging academic theory with industrial software engineering standards. Our platform delivers thorough, distraction-free computer science curricula designed for mastery.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/explore-courses"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-hot text-white rounded-md text-xs font-semibold hover:bg-[#e5482a] transition-colors"
            >
              Explore Curriculum <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {!isLoggedIn && (
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-surface-2 border border-border text-text rounded-md text-xs font-semibold hover:bg-surface transition-colors"
              >
                Register as Student
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-surface border border-border rounded-xl p-5 text-center space-y-2">
                <Icon className="w-5 h-5 text-muted mx-auto" />
                <p className="text-2xl font-bold text-text">{stat.value}</p>
                <p className="text-xs text-muted uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-accent">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-text">Our Mission</h2>
            <p className="text-xs text-muted leading-relaxed">
              Academic syllabi frequently struggle to keep up with industry requirements. We solve this by establishing structured curricula focusing on computer systems architecture, algorithms, distributed computing, and full-stack engineering fundamentals.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-success">
              <Eye className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-text">Our Pedagogical Vision</h2>
            <p className="text-xs text-muted leading-relaxed">
              We envision an ecosystem where deep technical competencies are developed through rigorous deliberate practice, clean analytical assessments, and mentorship from seasoned software engineers.
            </p>
          </div>
        </div>

        {/* Why Study With Us */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-text">Core Learning Pillars</h2>
            <p className="text-xs text-muted">Architected for clarity, retention, and engineering rigor</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-surface border border-border rounded-xl p-5 space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-semibold text-text">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        {!isLoggedIn && (
          <div className="bg-surface border border-border rounded-xl p-8 text-center space-y-3">
            <h2 className="text-xl font-bold text-text">Begin Your Study Journey</h2>
            <p className="text-xs text-muted max-w-md mx-auto">
              Join thousands of engineering students mastering core CS concepts and competitive exam preparation.
            </p>
            <div className="pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-hot text-white rounded-md text-xs font-semibold hover:bg-[#e5482a] transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
