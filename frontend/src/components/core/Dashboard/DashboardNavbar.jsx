import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBell,
  FaSearch,
  FaGraduationCap,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaShoppingCart,
} from 'react-icons/fa';
import { useNotifications } from '../../../context/NotificationContext';
import NotificationDropdown from '../../../components/common/NotificationDropdown';
import ProfileDropdown from '../../common/ProfileDropdown';
import useOnClickOutside from '../../../hooks/useOnClickOutside';

// All 5 nav links — shown for BOTH Student and Instructor dashboards
const NAV_LINKS = [
  { id: 'home', name: 'Home', path: '/' },
  { id: 'explore-courses', name: 'Explore Courses', path: '/explore-courses' },
  { id: 'students', name: 'Students', path: '/students' },
  { id: 'about', name: 'About', path: '/about' },
  { id: 'contact', name: 'Contact', path: '/contact' },
];

const DashboardNavbar = () => {
  const { user } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);
  const { notifications, unreadCount } = useNotifications();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useOnClickOutside(notificationRef, () => setShowNotifications(false));
  useOnClickOutside(profileRef, () => setShowProfileMenu(false));

  const handleLogout = async () => {
    const { performLogout } = await import('../../../services/syncSupabaseSession');
    await performLogout(dispatch, navigate);
  };

  const dummyCourses = [
    { id: 1, title: 'Modern JavaScript Masterclass', path: '/courses/javascript-es6' },
    { id: 2, title: 'Python for Data Science', path: '/courses/data-science-python' },
    { id: 3, title: 'UI/UX Design Essentials', path: '/courses/ui-ux-design-figma' },
    { id: 4, title: 'React Development Bootcamp', path: '/courses/react-development' },
    { id: 5, title: 'Full-Stack Web Development', path: '/courses/nodejs-express' },
  ];

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchResults(
      q.length > 1
        ? dummyCourses.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()))
        : []
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path);

  return (
    <nav
      role="navigation"
      aria-label="Dashboard navigation"
      className="sticky top-0 z-[100] w-full bg-[#000814]/90 backdrop-blur-md border-b border-white/5"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* ── LEFT: Search ─────────────────────────────────────────── */}
        <div className="hidden md:flex items-center w-56 shrink-0 relative group">
          <form role="search" onSubmit={handleSearch} className="w-full relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors text-xs" />
            <input
              type="text"
              aria-label="Search courses"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
            />
          </form>

          {/* Search dropdown */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute top-full left-0 w-72 mt-2 bg-[#050d1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[110]"
              >
                {searchResults.map((course) => (
                  <Link
                    key={course.id}
                    to={course.path}
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover/item:bg-cyan-500 group-hover/item:text-white transition-all shrink-0">
                      <FaGraduationCap className="text-xs" />
                    </div>
                    <span className="text-sm text-slate-300 group-hover/item:text-white font-medium">{course.title}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CENTER: Nav Links ─────────────────────────────────────── */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {active && (
                  <motion.span
                    layoutId="dashboard-nav-active"
                    className="absolute inset-0 bg-white/10 border border-white/15 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* ── RIGHT: Icons + Profile ────────────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Cart (Students only, when not empty) */}
          {user?.accountType === 'Student' && cart.length > 0 && (
            <Link
              to="/cart"
              aria-label={`Cart with ${cart.length} items`}
              className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              <FaShoppingCart className="text-sm" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            </Link>
          )}

          {/* Notifications */}
          <div
            className="relative"
            ref={notificationRef}
            onMouseEnter={() => setShowNotifications(true)}
            onMouseLeave={() => setShowNotifications(false)}
          >
            <button
              aria-label="View notifications"
              aria-haspopup="true"
              aria-expanded={showNotifications}
              onClick={() => { setShowNotifications((v) => !v); setShowProfileMenu(false); }}
              className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              <FaBell className="text-sm" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
            />
          </div>

          {/* Profile */}
          <div
            className="relative"
            ref={profileRef}
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button
              aria-label="User profile menu"
              aria-haspopup="true"
              aria-expanded={showProfileMenu}
              onClick={() => { setShowProfileMenu((v) => !v); setShowNotifications(false); }}
              className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10">
                <img
                  src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <FaChevronDown
                className={`text-[9px] text-slate-500 mr-1 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}
              />
            </button>
            <ProfileDropdown
              isOpen={showProfileMenu}
              onClose={() => setShowProfileMenu(false)}
              user={user}
              handleLogout={handleLogout}
            />
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            {isMobileMenuOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-[#050d1a] border-t border-white/5"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-5">

              {/* Mobile Search */}
              <div className="relative">
                <form role="search" onSubmit={handleSearch} className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    type="text"
                    aria-label="Search courses"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50"
                  />
                </form>
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <div className="mt-2 bg-[#050d1a] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                      {searchResults.map((course) => (
                        <Link
                          key={course.id}
                          to={course.path}
                          onClick={() => { setSearchQuery(''); setSearchResults([]); setIsMobileMenuOpen(false); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0"
                        >
                          <FaGraduationCap className="text-cyan-400 text-xs shrink-0" />
                          <span className="text-sm text-slate-300">{course.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Nav Links */}
              <nav aria-label="Mobile navigation">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-all ${active
                              ? 'bg-white/10 text-white border border-white/10'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}

                  {/* Cart in mobile menu */}
                  {user?.accountType === 'Student' && cart.length > 0 && (
                    <li>
                      <Link
                        to="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${location.pathname === '/cart'
                            ? 'bg-white/10 text-white border border-white/10'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <FaShoppingCart className="text-sm" />
                        Cart ({cart.length})
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default DashboardNavbar;
