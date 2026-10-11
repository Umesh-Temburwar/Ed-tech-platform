import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

/**
 * AdminLayout
 *
 * Shell for all /admin/* routes. Pattern mirrors InstructorDashboardLayout:
 *   Desktop: fixed sidebar (240px) + flex-1 main content
 *   Mobile:  full-width main + sidebar as animated drawer (controlled here)
 *
 * Does NOT handle auth — that is enforced upstream by
 *   <PrivateRoute> + <RoleRoute allow={["Admin"]}> in App.js
 */
export default function AdminLayout() {
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#000814] overflow-hidden safe-top safe-bottom">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <AdminSidebar
        mobileOpen={mobileDrawerOpen}
        onMobileClose={() => setMobileDrawerOpen(false)}
      />

      {/* ── Main content area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top navbar */}
        <AdminNavbar
          onMobileMenuOpen={() => setMobileDrawerOpen(true)}
        />

        {/* Page content with route transition */}
        <main className="flex-1 overflow-y-auto bg-[#000814]">
          <div className="container mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 max-w-[1440px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
