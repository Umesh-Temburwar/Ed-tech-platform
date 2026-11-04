import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, MessageCircle, Eye, Search, PlusCircle, ChevronRight, User } from 'lucide-react';
import { communityData } from '../../data/plansAndCommunityData';
import Footer from '../../components/common/Footer';

export default function ForumsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [threads, setThreads] = useState(communityData.forumThreads);

  const filtered = threads.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpvote = (id, e) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
  };

  return (
    <div className="min-h-screen bg-canvas text-text flex flex-col font-inter transition-colors duration-200">
      {/* Header */}
      <section className="border-b border-border bg-surface py-12 lg:py-16">
        <div className="w-11/12 max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-text font-medium">Community Forums</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
                Community Discussion & Engineering Forum
              </h1>
              <p className="text-base text-muted leading-relaxed">
                Connect with peer developers, share algorithmic breakthroughs, troubleshoot tricky bug stack traces, and discuss interview strategies.
              </p>
            </div>

            <button
              onClick={() => alert("Discussion modal opened! Share your question with the community.")}
              className="px-4 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-sm self-start sm:self-center"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start New Discussion</span>
            </button>
          </div>

          <div className="pt-2 max-w-md relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search discussions by topic or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md bg-surface-2 border border-border text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Threads List */}
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-12">
        <div className="space-y-4">
          {filtered.map(th => (
            <div 
              key={th.id}
              onClick={() => alert(`Opening discussion: "${th.title}"`)}
              className="p-5 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-sm cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                      {th.category}
                    </span>
                    <span className="text-xs text-muted">Active {th.lastActive}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-text hover:text-accent transition-colors">
                    {th.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-muted">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-text font-medium">{th.author}</span>
                    <span>•</span>
                    <span className="text-muted-dark">{th.authorRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={(e) => handleUpvote(th.id, e)}
                    className="p-2 sm:px-3 sm:py-2 rounded-md bg-surface-2 hover:bg-surface-3 border border-border flex items-center gap-1.5 text-xs font-bold text-text transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-accent" />
                    <span>{th.upvotes}</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{th.replies}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{th.views}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
                {th.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-surface-2 border border-border text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

