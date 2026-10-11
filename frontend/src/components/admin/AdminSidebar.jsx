import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../navbar/Logo";
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
      <div className="p-5 border-b border-white/[0.07] flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center min-w-0">
          <Logo />
        </Link>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors ml-2 shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Admin identity card ───────────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <div className="relative shrink-0">
            <img
              src={
                user?.image ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=b45309`
              }
              alt="Admin avatar"
              className="w-9 h-9 rounded-full object-cover border border-amber-500/30"
            />
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#080c14] shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{displayName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield className="w-2.5 h-2.5 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Administrator
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5"
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
              `group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-white border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-white border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? "text-amber-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span className="text-[13px] font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer: logout ────────────────────────────────────────────────── */}
      <div
        className="p-3 border-t border-white/[0.06] shrink-0"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
          <span className="text-[13px] font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function AdminSidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      {/* ── Desktop sidebar (fixed left, always visible at lg+) ────────── */}
      <aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-full bg-[#080c14]/95 backdrop-blur-xl border-r border-white/[0.07] overflow-hidden">
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
              className="lg:hidden fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.aside
              key="admin-sidebar-drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[110] w-[240px] bg-[#080c14]/98 backdrop-blur-xl border-r border-white/[0.07] overflow-hidden"
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
