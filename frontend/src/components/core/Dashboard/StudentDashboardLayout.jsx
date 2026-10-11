import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import DashboardNavbar from './DashboardNavbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from '../../common/ErrorBoundary';

const StudentDashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#000814] safe-top safe-bottom overflow-hidden">
      {/* Sidebar - Fixed/Sticky on desktop */}
      <div className="hidden lg:block h-full shrink-0">
        <StudentSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardNavbar />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#000814]">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full min-w-0">
                  <ErrorBoundary>
                    <Outlet />
                  </ErrorBoundary>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
