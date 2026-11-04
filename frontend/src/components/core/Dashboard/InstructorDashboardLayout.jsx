import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import InstructorSidebar from './InstructorSidebar';
import DashboardNavbar from './DashboardNavbar';
import ErrorBoundary from '../../common/ErrorBoundary';
import { useOnboardingRedirect } from '../../onboarding/InstructorOnboarding';

/**
 * InstructorDashboardLayout
 *
 * Now uses useOnboardingRedirect to auto-redirect incomplete instructors!
 */
const InstructorDashboardLayout = () => {
  const location = useLocation();
  const { checking } = useOnboardingRedirect();

  if (checking) {
    return (
      <div className="flex h-screen bg-canvas text-text items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center">
            <svg className="w-5 h-5 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-muted text-sm font-medium">Checking your onboarding status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-canvas text-text overflow-hidden safe-top safe-bottom">
      {/* Sidebar */}
      <div className="hidden lg:block h-full shrink-0 border-r border-border bg-surface">
        <InstructorSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <div className="safe-top">
          <DashboardNavbar />
        </div>

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-canvas">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboardLayout;
