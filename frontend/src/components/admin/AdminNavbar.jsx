import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronRight, LogOut, Shield } from "lucide-react";

// ── Breadcrumb label map ───────────────────────────────────────────────────────
const BREADCRUMB_LABELS = {
  admin:       "Admin",
  dashboard:   "Dashboard",
  students:    "Students",
  instructors: "Instructors",
  courses:     "Courses",
  enrollments: "Enrollments",
  payments:    "Payments",
  reports:     "Reports",
  settings:    "Settings",
};

// Derive breadcrumbs from pathname (e.g. /admin/students/123 → Admin > Students > ...)
function useBreadcrumbs() {
  const { pathname } = useLocation();
  // strip leading slash and split
  const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);

  return segments.map((seg, i) => {
    const label = BREADCRUMB_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    const path  = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    return { label, path, isLast };
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminNavbar({ onMobileMenuOpen }) {
  const breadcrumbs = useBreadcrumbs();
  const { user }    = useSelector((s) => s.profile);
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "Admin";

  const handleLogout = async () => {
    setShowProfileMenu(false);
    const { performLogout } = await import("../../services/syncSupabaseSession");
    await performLogout(dispatch, navigate);
  };

  return (
    <header className="sticky top-0 z-[60] w-full bg-[#000814]/90 backdrop-blur-md border-b border-white/[0.06] shrink-0">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between gap-4">

        {/* ── LEFT: Mobile hamburger + breadcrumb ───────────────────────── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            id="admin-mobile-menu-btn"
            onClick={onMobileMenuOpen}
            className="lg:hidden w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
            aria-label="Open admin navigation"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            {breadcrumbs.map(({ label, path, isLast }, index) => (
              <React.Fragment key={path}>
                {index > 0 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                )}
                {isLast ? (
                  <span
                    className="text-sm font-semibold text-white truncate"
                    aria-current="page"
                  >
                    {label}
                  </span>
                ) : (
                  <Link
                    to={path}
                    className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors truncate shrink-0"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* ── RIGHT: Admin badge + profile ──────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Admin shield badge — desktop only */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Shield className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Admin
            </span>
          </div>

          {/* Profile button + dropdown */}
          <div className="relative">
            <button
              id="admin-profile-btn"
              onClick={() => setShowProfileMenu((v) => !v)}
              onBlur={() => setTimeout(() => setShowProfileMenu(false), 150)}
              className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] hover:border-amber-500/30 transition-all"
              aria-haspopup="true"
              aria-expanded={showProfileMenu}
              aria-label="Admin profile menu"
            >
              <img
                src={
                  user?.image ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=b45309`
                }
                alt="Admin avatar"
                className="w-7 h-7 rounded-full object-cover border border-amber-500/20"
              />
              <span className="hidden md:block text-xs font-semibold text-slate-300 max-w-[120px] truncate">
                {displayName}
              </span>
            </button>

            {/* Mini profile dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-2 w-52 bg-[#080c14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[120]"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-bold text-white truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                  </div>

                  {/* Actions */}
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all group"
                    >
                      <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      <span className="text-[13px] font-semibold">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
