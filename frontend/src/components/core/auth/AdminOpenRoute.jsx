import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * AdminOpenRoute — wraps the /admin/login page.
 *
 * Decision table (mirrors OpenRoute / PrivateRoute pattern):
 * ┌──────────────────┬──────────────────┬────────────────────────────────────────┐
 * │ authInitialized  │ user             │ Result                                 │
 * ├──────────────────┼──────────────────┼────────────────────────────────────────┤
 * │ false            │ any              │ Spinner — never redirect prematurely   │
 * │ true             │ null             │ Show children (login form)             │
 * │ true             │ Admin            │ Navigate to /admin/dashboard           │
 * │ true             │ other role       │ Navigate to /403                       │
 * └──────────────────┴──────────────────┴────────────────────────────────────────┘
 */

const Spinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#000814] gap-4">
    <div className="w-10 h-10 border-2 border-white/10 border-t-[#00B4D8] rounded-full animate-spin" />
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
      Checking session…
    </p>
  </div>
);

export default function AdminOpenRoute({ children }) {
  const { authInitialized } = useSelector((s) => s.auth);
  const { user }            = useSelector((s) => s.profile);

  // Auth not yet resolved — show spinner; never redirect prematurely
  if (!authInitialized) return <Spinner />;

  const role = String(user?.accountType || "").toLowerCase();

  // Already authenticated as admin → go straight to dashboard
  if (user && role === "admin") return <Navigate to="/admin/dashboard" replace />;

  // Authenticated but wrong role → forbidden
  if (user && role !== "admin") return <Navigate to="/403" replace />;

  // Not authenticated → show the login form
  return children;
}
