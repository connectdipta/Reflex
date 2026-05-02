'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiGrid,
  FiUsers,
  FiMessageSquare,
  FiMail,
  FiLogIn,
  FiLogOut,
  FiLayout,
  FiActivity,
  FiAlertCircle,
} from 'react-icons/fi';
import Logo from './Logo';

const navLinks = [
  { href: '/#home', label: 'Home', icon: FiHome },
  { href: '/#about', label: 'About', icon: FiInfo },
  { href: '/#services', label: 'Services', icon: FiGrid },
  { href: '/#doctors', label: 'Psychiatrists', icon: FiUsers },
  { href: '/#testimonials', label: 'Testimonial', icon: FiMessageSquare },
  { href: '/#contact', label: 'Report Issue', icon: FiAlertCircle },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { isLoggedIn, isAdmin, isDoctor, user, logout } = useAuth();
  const dropdownRef = require('react').useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setActiveLink(window.location.hash ? `/${window.location.hash}` : pathname === '/' ? '/#home' : pathname);
    
    const handleHashChange = () => {
      setActiveLink(`/${window.location.hash}`);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="w-10 h-10 group-hover:shadow-glow-teal" />
            <span className="text-xl font-bold font-display">
              RE<span className="text-gradient">FLEX</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  activeLink === link.href ? 'text-primary-400 bg-primary-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-full ring-2 ring-white/5 group-hover:ring-primary-500/30 transition-all duration-300 overflow-hidden bg-dark-700 flex items-center justify-center border border-white/10">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-primary-400">{user?.name?.charAt(0)}</span>
                    )}
                  </div>
                  <span className="text-[13px] font-bold text-white uppercase tracking-widest hidden sm:block opacity-80 group-hover:opacity-100 transition-opacity">
                    {user?.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-dark-800/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-1"
                    >
                      <Link
                        href={isAdmin ? '/dashboard' : isDoctor ? '/dashboard/doctor' : '/dashboard/user'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <FiLayout className="text-primary-400" />
                        Dashboard
                      </Link>
                      <div className="h-px bg-white/10 my-1" />
                      <button
                        onClick={() => { logout(); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <FiLogOut />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 hover:border-primary-500/30 transition-all duration-200"
                >
                  <FiLogIn />
                  Login
                </Link>
                <Link href="/signup" className="gradient-btn text-sm !px-5 !py-2">
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {isMobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark-800/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setIsMobileOpen(false);
                      setActiveLink(link.href);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeLink === link.href ? 'text-primary-400 bg-primary-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={activeLink === link.href ? 'text-primary-400' : 'text-gray-400'} />
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center overflow-hidden border border-primary-500/30">
                        {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-sm font-bold text-primary-400">{user?.name?.charAt(0)}</span>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user?.role}</p>
                      </div>
                    </div>
                    <Link
                      href={isAdmin ? '/dashboard' : isDoctor ? '/dashboard/doctor' : '/dashboard/user'}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <FiLayout className="text-primary-400" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setIsMobileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <FiLogIn className="text-primary-400" />
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileOpen(false)}
                      className="block text-center gradient-btn w-full !py-3"
                    >
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
