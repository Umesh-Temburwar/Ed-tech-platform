import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../components/navbar/Logo";
import { 
  FaHome, 
  FaBook, 
  FaUser, 
  FaBell, 
  FaQuestionCircle, 
  FaChartLine,
  FaTrophy,
  FaChevronRight,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaCommentDots,
  FaStar,
  FaKeyboard,
  FaClipboardList,
  FaCalendarAlt,
  FaBookmark,
  FaMedal,
  FaUsers,
  FaFolderOpen,
  FaGift,
  FaCog,
  FaHistory
} from "react-icons/fa";

const baseSidebarLinks = [
  { id: "dashboard", label: "Dashboard", icon: FaHome, path: "/dashboard/my-profile" },
  { id: "my-learning", label: "My Learning", icon: FaBook, path: "/dashboard/enrolled-courses" },
  { id: "explore-courses", label: "Explore Courses", icon: FaBook, path: "/course-catalog" },
  { id: "learning-roadmaps", label: "Learning Roadmaps", icon: FaChartLine, path: "/dashboard/learning-path" },
  { id: "purchase-history", label: "My Purchases", icon: FaHistory, path: "/dashboard/purchase-history" },
  { id: "assignments", label: "Assignments", icon: FaClipboardList, path: "/dashboard/assignments" },
  { id: "quizzes", label: "Quizzes", icon: FaKeyboard, path: "/dashboard/quizzes" },
  { id: "certificates", label: "Certificates", icon: FaTrophy, path: "/dashboard/certificates" },
  { id: "achievements", label: "Achievements", icon: FaMedal, path: "/dashboard/achievements" },
  { id: "notes", label: "Notes", icon: FaBookmark, path: "/dashboard/notes" },
  { id: "messages", label: "Messages", icon: FaCommentDots, path: "/dashboard/messages" },
  { id: "live-classes", label: "Live Classes", icon: FaUsers, path: "/dashboard/live-classes" },
  { id: "leaderboard", label: "Leaderboard", icon: FaTrophy, path: "/dashboard/leaderboard" },
  { id: "interview-prep", label: "Interview Prep", icon: FaQuestionCircle, path: "/dashboard/interview-prep" },
  { id: "jobs-internships", label: "Jobs & Internships", icon: FaUser, path: "/dashboard/jobs" },
  { id: "resume-builder", label: "Resume Builder", icon: FaClipboardList, path: "/dashboard/resume" },
  { id: "analytics", label: "Analytics", icon: FaChartLine, path: "/dashboard/analytics" },
  { id: "support", label: "Support", icon: FaQuestionCircle, path: "/dashboard/support" },
  { id: "subscription-billing", label: "Subscription & Billing", icon: FaCog, path: "/dashboard/billing" },
  { id: "settings", label: "Settings", icon: FaCog, path: "/dashboard/settings" },
];


export default function StudentSidebar() {
  const { user } = useSelector((state) => state.profile);
  const sidebarLinks = baseSidebarLinks.filter((link) => !(link.id === 'explore-courses' && user?.accountType === 'Student'));
  const [isOpen, setIsOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const dropdownVariants = {
    closed: { 
      maxHeight: 0, 
      opacity: 0,
      y: -8,
      scaleY: 0.95,
      transition: { duration: 0.18, ease: "easeInOut", when: "afterChildren" }
    },
    open: { 
      maxHeight: "200px", 
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: { duration: 0.18, ease: "easeOut", staggerChildren: 0.05, when: "beforeChildren" }
    }
  };

  const subItemVariants = {
    closed: { x: -8, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed right-6 z-[110] w-12 h-12 bg-accent text-white rounded-xl shadow-lg flex items-center justify-center text-lg border border-border"
        style={{ bottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Container */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ 
          width: isOpen ? "260px" : "0px",
          x: isOpen ? 0 : -260,
          opacity: 1
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed lg:relative z-[100] h-full flex flex-col overflow-hidden bg-surface border-r border-border shrink-0"
      >
        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col h-full bg-surface">
          {/* Header/Logo */}
          <div className="p-5 border-b border-border">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>
            <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1.5">Student Portal</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar" style={{ paddingBottom: 'max(5rem, calc(env(safe-area-inset-bottom) + 1.25rem))' }}>
            {sidebarLinks.map((link) => (
              <div key={link.id} className="relative">
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-surface-2 text-text font-semibold border border-border"
                      : "text-muted hover:text-text hover:bg-surface-2"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <link.icon className="text-sm opacity-80" />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </div>
                  <FaChevronRight className="text-[8px] opacity-40" />
                </NavLink>
              </div>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 z-[90] bg-black/60"
          />
        )}
      </AnimatePresence>
    </>
  );
}
