import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../components/navbar/Logo";
import ThemeSwitcher from "../../common/ThemeSwitcher";
import {
  LayoutDashboard, BookOpen, PlusCircle, ClipboardList, HelpCircle,
  FileText, Users, MessageSquare, Video, Globe, BarChart2, DollarSign,
  Tag, Star, Bell, FolderOpen, Award, Share2, Settings,
  LogOut, ChevronRight, Menu, X, Shield, CalendarCheck, User
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard",        label: "Dashboard",        icon: LayoutDashboard, path: "/dashboard/instructor" },
  { id: "my-data",          label: "My Data",          icon: User,            path: "/instructor/setup" },
  { id: "instructor-info",  label: "Instructor Info",  icon: User,            path: "/dashboard/instructor/info" },
  { id: "create-course",    label: "Create Course",     icon: PlusCircle,      path: "/dashboard/instructor/add-course" },
  { id: "my-courses",       label: "My Courses",        icon: BookOpen,        path: "/dashboard/instructor/my-courses" },
  { id: "categories",       label: "Categories",        icon: Tag,             path: "/dashboard/instructor/categories" },
  { id: "course-builder",   label: "Course Builder",    icon: FileText,        path: "/dashboard/instructor/course-builder" },
  { id: "course-analytics", label: "Course Analytics",  icon: BarChart2,       path: "/dashboard/instructor/analytics" },
  { id: "students",         label: "Students",          icon: Users,           path: "/dashboard/instructor/student-progress" },
  { id: "enrollments",      label: "Enrollments",       icon: ClipboardList,   path: "/dashboard/instructor/enrollments" },
  { id: "assignments",      label: "Assignments",       icon: ClipboardList,   path: "/dashboard/instructor/assignments" },
  { id: "quizzes",          label: "Quizzes",           icon: HelpCircle,      path: "/dashboard/instructor/quizzes" },
  { id: "certificates",     label: "Certificates",      icon: Award,           path: "/dashboard/instructor/certificates" },
  { id: "live-classes",     label: "Live Classes",      icon: Video,           path: "/dashboard/instructor/live-classes" },
  { id: "messages",         label: "Messages",          icon: MessageSquare,   path: "/dashboard/instructor/messages" },
  { id: "community",        label: "Community",         icon: Users,           path: "/students" },
  { id: "discussion-management", label: "Discussion Management", icon: MessageSquare, path: "/dashboard/instructor/discussions" },
  { id: "revenue-earnings", label: "Revenue & Earnings", icon: DollarSign,     path: "/dashboard/instructor/earnings" },
  { id: "payouts",          label: "Payouts",           icon: DollarSign,      path: "/dashboard/instructor/payouts" },
  { id: "coupons-marketing", label: "Coupons & Marketing", icon: Tag,          path: "/dashboard/instructor/coupons" },
  { id: "affiliates",       label: "Affiliates",        icon: Share2,          path: "/dashboard/instructor/affiliate" },
  { id: "reports",          label: "Reports",           icon: BarChart2,       path: "/dashboard/instructor/reports" },
  { id: "downloads",        label: "Downloads",         icon: FolderOpen,      path: "/dashboard/instructor/downloads" },
  { id: "jobs-hiring",      label: "Jobs & Hiring",     icon: Users,           path: "/dashboard/instructor/jobs" },
  { id: "announcements",    label: "Announcements",     icon: Bell,            path: "/dashboard/instructor/announcements" },
  { id: "notifications",    label: "Notifications",     icon: Bell,            path: "/dashboard/instructor/notifications", badge: 3 },
  { id: "support-tickets",  label: "Support Tickets",   icon: HelpCircle,      path: "/dashboard/instructor/support" },
  { id: "reviews-ratings",  label: "Reviews & Ratings", icon: Star,            path: "/dashboard/instructor/reviews" },
  { id: "content-library",  label: "Content Library",   icon: FolderOpen,      path: "/dashboard/instructor/resources" },
  { id: "calendar",         label: "Calendar",          icon: CalendarCheck,   path: "/dashboard/instructor/calendar" },
  { id: "integrations",     label: "Integrations",      icon: Globe,           path: "/dashboard/instructor/integrations" },
  { id: "verification-kyc", label: "Verification & KYC", icon: Shield,          path: "/dashboard/instructor/verification" },
  { id: "subscription-billing", label: "Subscription & Billing", icon: DollarSign, path: "/dashboard/instructor/billing" },
  { id: "settings",         label: "Settings",          icon: Settings,        path: "/dashboard/instructor/settings" },
];

export default function InstructorSidebar() {
  const { user } = useSelector((state) => state.profile);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const { performLogout } = await import("../../../services/syncSupabaseSession");
    await performLogout(dispatch, navigate);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-2 ml-1">Instructor Portal</p>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-border">
          <img
            src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName || "I"}&backgroundColor=6366f1`}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text truncate">{user?.full_name || user?.firstName || "Instructor"}</p>
            <p className="text-[10px] text-muted truncate">{user?.email || ""}</p>
          </div>
          <div className="w-2 h-2 bg-success rounded-full shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 pb-20 space-y-0.5 custom-scrollbar" style={{ paddingBottom: 'max(5rem, calc(env(safe-area-inset-bottom) + 1.25rem))' }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.id === "dashboard"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-surface-2 text-text font-semibold border border-border"
                  : "text-muted hover:bg-surface-2 hover:text-text border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-2.5">
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-accent" : "text-muted group-hover:text-text"
                    }`}
                  />
                  <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 text-muted" />}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout & Theme */}
      <div className="p-3 border-t border-border flex items-center justify-between gap-2">
        <button
          onClick={handleLogout}
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-muted hover:bg-danger/10 hover:text-danger border border-transparent hover:border-danger/20 transition-colors"
        >
          <LogOut className="w-4 h-4 transition-transform" />
          <span>Logout</span>
        </button>
        <ThemeSwitcher size="sm" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-full bg-surface border-r border-border overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed right-6 z-[110] w-12 h-12 bg-accent text-white rounded-xl shadow-lg flex items-center justify-center border border-border"
        style={{ bottom: 'max(24px, env(safe-area-inset-bottom))' }}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-[100] bg-black/60"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[110] w-[240px] bg-surface border-r border-border overflow-hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted hover:text-text border border-border"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
