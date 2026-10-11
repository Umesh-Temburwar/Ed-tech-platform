import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGraduationCap,
  FaTachometerAlt,
  FaChevronDown,
  FaRocket,
  FaBook,
  FaChartLine,
  FaBell,
  FaCog,
  FaTimes
} from 'react-icons/fa';

const FloatingDashboardButton = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show button after a small delay for smooth entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  // Don't show if user is not authenticated or on main dashboard page
  if (!token || !user || location.pathname === '/dashboard') {
    return null;
  }

  const quickActions = [
    {
      icon: FaRocket,
      label: 'Quick Start',
      path: '/dashboard/quick-start',
      color: 'text-blue-400',
      description: 'Get started quickly'
    },
    {
      icon: FaBook,
      label: 'My Courses',
      path: '/dashboard/enrolled-courses',
      color: 'text-green-400',
      description: 'View enrolled courses'
    },
    {
      icon: FaChartLine,
      label: 'Progress',
      path: '/dashboard/progress',
      color: 'text-purple-400',
      description: 'Track your progress'
    },
    {
      icon: FaBell,
      label: 'Notifications',
      path: '/dashboard/notifications',
      color: 'text-orange-400',
      description: 'View notifications'
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed right-6 z-50"
          style={{ bottom: 'max(24px, env(safe-area-inset-bottom))' }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className="relative">
            {/* Quick Actions Menu */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute bottom-20 right-0 bg-white dark:bg-richblack-800 border border-richblack-200 dark:border-richblack-700 rounded-2xl shadow-2xl p-4 min-w-[280px] backdrop-blur-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-richblack-200 dark:border-richblack-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-richblack-900 font-bold text-sm">
                          {user?.firstName?.[0] || user?.name?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-richblack-900 dark:text-richblack-5 text-sm font-semibold">
                          {user?.firstName || user?.name || 'User'}
                        </p>
                        <p className="text-richblack-600 dark:text-richblack-400 text-xs">
                          {user?.accountType || 'Student'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="p-1 hover:bg-richblack-100 dark:hover:bg-richblack-700 rounded-full transition-colors duration-200"
                    >
                      <FaTimes className="text-richblack-600 dark:text-richblack-400 text-sm" />
                    </button>
                  </div>

                  {/* Quick Actions Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {quickActions.map((action, index) => {
                      const IconComponent = action.icon;
                      return (
                        <motion.div
                          key={action.path}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                        >
                          <Link
                            to={action.path}
                            onClick={() => setIsExpanded(false)}
                            className="flex flex-col items-center p-3 rounded-xl hover:bg-richblack-50 dark:hover:bg-richblack-700 transition-all duration-200 group border border-transparent hover:border-richblack-200 dark:hover:border-richblack-600"
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200`}
                                 style={{ backgroundColor: `${action.color.replace('text-', '')}20` }}>
                              <IconComponent className={`text-xl ${action.color.replace('text-', 'text-')} group-hover:scale-110 transition-transform duration-200`} />
                            </div>
                            <span className="text-richblack-900 dark:text-richblack-200 text-xs font-medium text-center group-hover:text-richblack-700 dark:group-hover:text-richblack-5 transition-colors duration-200">
                              {action.label}
                            </span>
                            <span className="text-richblack-600 dark:text-richblack-500 text-xs text-center mt-1">
                              {action.description}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Full Dashboard Button */}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsExpanded(false)}
                    className="block w-full text-center py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-richblack-900 font-semibold rounded-xl transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaTachometerAlt className="inline mr-2" />
                    Open Full Dashboard
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Dashboard Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-richblack-900 font-bold rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                style={{
                  boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                
                {/* Icon Container */}
                <div className="relative z-10 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: isExpanded ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {isExpanded ? (
                      <FaTimes className="text-xl" />
                    ) : (
                      <FaGraduationCap className="text-xl group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </motion.div>
                </div>
                
                {/* Pulse Animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-ping opacity-20"></div>
                
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  3
                </div>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingDashboardButton;