import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBell,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaInfo,
  FaUser,
  FaBook,
  FaCalendar,
  FaChartLine
} from 'react-icons/fa';
import {
  getUserNotifications,
  markNotificationAsRead as markAsReadApi,
  markAllNotificationsAsRead as markAllAsReadApi,
  deleteNotification as deleteNotificationApi,
} from '../../services/operations/notificationAPI';

const NotificationCenter = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load real notifications from API
  useEffect(() => {
    if (!user || !token) return;

    loadUserNotifications();
    
    // Set up polling for real-time updates every 60 seconds
    const interval = setInterval(() => {
      loadUserNotifications();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [user, token]);

  const loadUserNotifications = async () => {
    try {
      setLoading(true);
      const res = await getUserNotifications(token);
      if (res?.success && Array.isArray(res.data)) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.read && !n.is_read).length);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true, is_read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    await markAsReadApi(token, id);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true, is_read: true }))
    );
    setUnreadCount(0);
    await markAllAsReadApi(token);
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => {
      const filtered = prev.filter(n => n.id !== id);
      const unreadFiltered = filtered.filter(n => !n.read && !n.is_read);
      setUnreadCount(unreadFiltered.length);
      return filtered;
    });
    await deleteNotificationApi(token, id);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'enrollment': return FaUser;
      case 'course': return FaBook;
      case 'event': return FaCalendar;
      case 'analytics': return FaChartLine;
      case 'warning': return FaExclamationTriangle;
      case 'success': return FaCheck;
      default: return FaInfo;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-500 text-yellow-100';
      case 'success': return 'bg-green-500 text-green-100';
      case 'error': return 'bg-red-500 text-red-100';
      default: return 'bg-blue-500 text-blue-100';
    }
  };

  if (!user) return null;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-richblack-300 hover:text-richblack-5 transition-all duration-200 transform hover:scale-110"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-pink-200 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full w-80 bg-richblack-800 border border-richblack-700 rounded-lg shadow-2xl z-50 max-h-[450px] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-richblack-700 flex items-center justify-between bg-richblack-900/50">
                <h3 className="text-lg font-semibold text-richblack-5 flex items-center gap-2">
                  <FaBell className="text-yellow-50 text-sm" />
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-yellow-50 hover:text-yellow-100 transition-colors underline"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-richblack-400 hover:text-richblack-300 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {loading && notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-yellow-50 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-10 text-center text-richblack-400">
                    <div className="w-16 h-16 bg-richblack-700 rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                      <FaBell className="text-3xl" />
                    </div>
                    <p className="font-medium">All caught up!</p>
                    <p className="text-xs mt-1">No new notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const IconComponent = getIcon(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 border-b border-richblack-700 hover:bg-richblack-700/50 transition-colors cursor-pointer relative group ${
                          !notification.read ? 'bg-richblack-900/20' : ''
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg shrink-0 ${getColorClasses(notification.type)}`}>
                            <IconComponent className="text-sm" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm font-semibold truncate ${
                                !notification.read ? 'text-richblack-5' : 'text-richblack-200'
                              }`}>
                                {notification.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-richblack-500 hover:text-pink-200 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                              >
                                <FaTimes className="text-[10px]" />
                              </button>
                            </div>
                            <p className="text-xs text-richblack-400 mt-1 line-clamp-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-[10px] text-richblack-500 mt-2 font-medium">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-1.5 h-1.5 bg-yellow-50 rounded-full mt-2 shrink-0 animate-pulse"></div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-richblack-900/50 border-t border-richblack-700 text-center">
                <Link 
                  to="/dashboard/notifications" 
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-richblack-300 hover:text-yellow-50 transition-colors"
                >
                  View All Activity
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;