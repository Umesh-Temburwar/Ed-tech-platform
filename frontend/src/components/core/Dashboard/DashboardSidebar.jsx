import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { sidebarLinks } from "../../../data/dashboard-links";
import {
  VscAccount,
  VscDashboard,
  VscVm,
  VscAdd,
  VscRocket,
  VscBook,
  VscGraph,
  VscLightbulb,
  VscBell,
  VscCalendar,
  VscTasklist,
  VscNote,
  VscPersonAdd,
  VscVerified,
  VscSymbolKeyword,
  VscComment,
  VscTrophy,
  VscSettingsGear,
  VscHistory,
  VscColorMode,
  VscChevronRight,
  VscMenu,
  VscClose
} from "react-icons/vsc";

const iconMap = {
  VscAccount,
  VscDashboard,
  VscVm,
  VscAdd,
  VscRocket,
  VscBook,
  VscGraph,
  VscLightbulb,
  VscBell,
  VscCalendar,
  VscTasklist,
  VscNote,
  VscPersonAdd,
  VscVerified,
  VscSymbolKeyword,
  VscComment,
  VscTrophy,
  VscSettingsGear,
  VscHistory,
  VscColorMode
};

const DashboardSidebar = () => {
  const { user } = useSelector((state) => state.profile);
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Filter links based on user type
  const filteredLinks = sidebarLinks.filter(link => {
    if (!link.type) return true; // Common links
    return link.type === user?.accountType;
  });

  const isActive = (path) => {
    return location.pathname === path;
  };

  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    collapsed: {
      width: 80,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      x: -10,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="fixed right-0 top-0 h-full bg-richblack-800 border-l border-richblack-700 z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-richblack-700">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <VscDashboard className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-richblack-5 font-semibold text-sm">
                  {user?.accountType === ACCOUNT_TYPE.STUDENT ? "Learning Hub" : "Dashboard"}
                </h3>
                <p className="text-richblack-400 text-xs">
                  {user?.firstName || "User"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-richblack-700 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.div
                key="menu"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <VscMenu className="text-richblack-300 text-lg" />
              </motion.div>
            ) : (
              <motion.div
                key="close"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <VscClose className="text-richblack-300 text-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Navigation Links */}
      <div className="py-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
        {filteredLinks.map((link, index) => {
          const IconComponent = iconMap[link.icon] || VscDashboard;
          const active = isActive(link.path);
          
          return (
            <motion.div
              key={link.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              className="relative px-2"
              onMouseEnter={() => setHoveredItem(link.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={link.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                  active
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "hover:bg-richblack-700 text-richblack-300 hover:text-richblack-5"
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Icon */}
                <div className="relative z-10">
                  <IconComponent 
                    className={`text-lg transition-transform duration-200 group-hover:scale-110 ${
                      active ? "text-white" : "text-richblack-300 group-hover:text-richblack-5"
                    }`} 
                  />
                </div>
                
                {/* Label */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 flex-1"
                    >
                      <span className={`font-medium text-sm ${
                        active ? "text-white" : "text-richblack-300 group-hover:text-richblack-5"
                      }`}>
                        {link.name}
                      </span>
                      {link.description && (
                        <p className={`text-xs mt-0.5 ${
                          active ? "text-white/80" : "text-richblack-400"
                        }`}>
                          {link.description}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Arrow indicator */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="relative z-10"
                    >
                      <VscChevronRight 
                        className={`text-sm transition-transform duration-200 ${
                          active 
                            ? "text-white transform translate-x-1" 
                            : "text-richblack-400 group-hover:text-richblack-300 group-hover:transform group-hover:translate-x-1"
                        }`} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
              
              {/* Tooltip for collapsed state */}
              <AnimatePresence>
                {isCollapsed && hoveredItem === link.id && (
                  <motion.div
                    variants={tooltipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 z-50"
                  >
                    <div className="bg-richblack-700 text-richblack-5 px-3 py-2 rounded-lg shadow-xl border border-richblack-600 whitespace-nowrap">
                      <p className="font-medium text-sm">{link.name}</p>
                      {link.description && (
                        <p className="text-xs text-richblack-400 mt-1">{link.description}</p>
                      )}
                      {/* Arrow */}
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2">
                        <div className="w-0 h-0 border-l-4 border-l-richblack-700 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-richblack-700 bg-richblack-800 safe-bottom">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <p className="text-richblack-400 text-xs">
                {user?.accountType === ACCOUNT_TYPE.STUDENT 
                  ? "Keep learning, keep growing! 🚀"
                  : "Manage your teaching journey 📚"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;