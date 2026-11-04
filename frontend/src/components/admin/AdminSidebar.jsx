import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../navbar/Logo";
import ThemeSwitcher from "../common/ThemeSwitcher";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  X,
  Shield,
} from "lucide-react";

// ── Admin sidebar navigation items ────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",   label: "Dashboard",   icon: LayoutDashboard, path: "/admin/dashboard"   },
  { id: "students",    label: "Students",    icon: GraduationCap,   path: "/admin/students"    },
  { id: "instructors", label: "Instructors", icon: Users,           path: "/admin/instructors" },
  { id: "courses",     label: "Courses",     icon: BookOpen,        path: "/admin/courses"     },
  { id: "enrollments", label: "Enrollments", icon: ClipboardList,   path: "/admin/enrollments" },
  { id: "payments",    label: "Payments",    icon: CreditCard,      path: "/admin/payments"    },
  { id: "reports",     label: "Reports",     icon: BarChart2,       path: "/admin/reports"     },
  { id: "settings",    label: "Settings",    icon: Settings,        path: "/admin/settings"    },
];

// ── Sidebar content (shared between desktop + mobile drawer) ──────────────────
function SidebarContent({ onClose }) {
  const { user }  = useSelector((s) => s.profile);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = async () => {
    const { performLogout } = await import("../../services/syncSupabaseSession");
    await performLogout(dispatch, navigate);
  };

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Admin";

  return (
    <div className="flex flex-col h-full">
      {/* ── Brand header ──────────────────────────────────────────────────── */}
      <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center min-w-0">
          <Logo />
        </Link>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted hover:text-text transition-colors ml-2 shrink-0 border border-border"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Admin identity card ───────────────────────────────────────────── */}
      <div className="px-3 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-2 border border-border">
          <div className="relative shrink-0">
            <img
              src={
                user?.image ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=b45309`
              }
              alt="Admin avatar"
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text truncate">{displayName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="w-2.5 h-2.5 text-warning" />
              <span className="text-[10px] font-bold text-warning uppercase tracking-wider">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5"
        aria-label="Admin navigation"
        style={{ paddingBottom: "max(4rem, calc(env(safe-area-inset-bottom) + 1rem))" }}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.id === "dashboard"}
            onClick={onClose}
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
                      isActive
                        ? "text-accent"
                        : "text-muted group-hover:text-text"
                    }`}
                  />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer: logout & theme ────────────────────────────────────────── */}
      <div
        className="p-3 border-t border-border shrink-0 flex items-center justify-between gap-2"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={handleLogout}
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-muted hover:bg-danger/10 hover:text-danger border border-transparent hover:border-danger/20 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
        <ThemeSwitcher size="sm" />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function AdminSidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      {/* ── Desktop sidebar (fixed left, always visible at lg+) ────────── */}
      <aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-full bg-surface border-r border-border overflow-hidden">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="admin-sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 z-[100] bg-black/60"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.aside
              key="admin-sidebar-drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[110] w-[240px] bg-surface border-r border-border overflow-hidden"
              aria-label="Admin mobile navigation"
            >
              <SidebarContent onClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
