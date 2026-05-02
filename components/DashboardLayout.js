'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiChevronLeft, FiRefreshCw } from 'react-icons/fi';
import Logo from './Logo';

export default function DashboardLayout({ children, tabs, accentColor = 'primary', title, subtitle, badge, lottieSlot, onRefresh }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const colorMap = {
    primary: { bg: 'bg-primary-500', text: 'text-primary-400', border: 'border-primary-500/30', activeBg: 'bg-primary-500/10', glow: 'from-primary-500/10 to-primary-500/5' },
    teal: { bg: 'bg-teal-500', text: 'text-teal-400', border: 'border-teal-500/30', activeBg: 'bg-teal-500/10', glow: 'from-teal-500/10 to-teal-500/5' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/30', activeBg: 'bg-purple-500/10', glow: 'from-purple-500/10 to-purple-500/5' },
  };
  const colors = colorMap[accentColor] || colorMap.primary;

  return (
    <div className="min-h-screen bg-[#060a14] flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0a0f1c] border-r border-white/5`}>
        {/* Logo Area */}
        <div className={`h-20 flex items-center ${sidebarOpen ? 'px-6 justify-between' : 'px-0 justify-center'} border-b border-white/5`}>
          <Link href="/" className="flex items-center gap-2">
            <Logo className={`${sidebarOpen ? 'w-9 h-9' : 'w-10 h-10'}`} />
            {sidebarOpen && <span className="text-lg font-bold font-display">RE<span className="text-gradient">FLEX</span></span>}
          </Link>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
              <FiChevronLeft className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all z-50">
              <FiChevronLeft className="rotate-180 text-xs" />
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className={`${sidebarOpen ? 'px-5 py-6' : 'px-2 py-4'} border-b border-white/5`}>
          <div className={`flex ${sidebarOpen ? 'items-center gap-3' : 'flex-col items-center gap-2'}`}>
            <div className={`${sidebarOpen ? 'w-10 h-10' : 'w-10 h-10'} rounded-full overflow-hidden bg-white/5 border ${colors.border} flex items-center justify-center shrink-0`}>
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <span className={`text-sm font-bold ${colors.text}`}>{user?.name?.charAt(0)}</span>}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${colors.text}`}>{badge || user?.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Lottie Animation */}
        {sidebarOpen && lottieSlot && (
          <div className="px-5 py-4 border-b border-white/5">
            <div className="w-full h-28 flex items-center justify-center">
              {lottieSlot}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.active;
            return (
              <button
                key={tab.id}
                onClick={tab.onClick}
                className={`w-full flex items-center gap-3 rounded-xl transition-all duration-200 group relative ${
                  sidebarOpen ? 'px-4 py-3' : 'px-0 py-3 justify-center'
                } ${isActive ? `${colors.activeBg} ${colors.text}` : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
              >
                {isActive && <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${colors.bg}`} />}
                <Icon className={`text-lg shrink-0 ${isActive ? colors.text : 'group-hover:text-gray-300'}`} />
                {sidebarOpen && <span className="text-sm font-medium truncate">{tab.label}</span>}
                {sidebarOpen && tab.badge > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">{tab.badge}</span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-3 px-2 py-1 rounded-md bg-dark-800 text-white text-xs font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-white/10 z-50">
                    {tab.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`${sidebarOpen ? 'px-5' : 'px-3'} py-4 border-t border-white/5`}>
          <button onClick={logout} className={`w-full flex items-center gap-3 ${sidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all`}>
            <FiLogOut className="text-lg" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0f1c]/95 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
            <FiMenu className="text-xl" />
          </button>
          <div className="min-w-0 overflow-hidden">
            <span className="text-sm font-bold text-white whitespace-nowrap">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full overflow-hidden bg-white/5 border ${colors.border} flex items-center justify-center`}>
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <span className={`text-xs font-bold ${colors.text}`}>{user?.name?.charAt(0)}</span>}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/60 z-50" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="lg:hidden fixed top-0 left-0 h-screen w-72 bg-[#0a0f1c] border-r border-white/5 z-50 flex flex-col">
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                  <Logo className="w-8 h-8" />
                  <span className="text-base font-bold font-display">RE<span className="text-gradient">FLEX</span></span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                  <FiX />
                </button>
              </div>

              <div className="px-5 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full overflow-hidden bg-white/5 border ${colors.border} flex items-center justify-center`}>
                    {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <span className={`text-sm font-bold ${colors.text}`}>{user?.name?.charAt(0)}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user?.name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${colors.text}`}>{badge || user?.role}</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => { tab.onClick(); setMobileOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${tab.active ? `${colors.activeBg} ${colors.text}` : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                      <Icon className="text-lg" />
                      <span className="text-sm font-medium">{tab.label}</span>
                      {tab.badge > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-black flex items-center justify-center">{tab.badge}</span>}
                    </button>
                  );
                })}
              </nav>

              <div className="px-5 py-4 border-t border-white/5">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <FiLogOut className="text-lg" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} overflow-x-hidden`}>
        <div className="min-h-screen pt-20 lg:pt-8 pb-12 px-4 lg:px-8 w-full max-w-[100vw]">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
            <div className="min-w-0 overflow-hidden pr-2">
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${colors.text} mb-1 truncate`}>{subtitle}</p>
              <div className="text-2xl lg:text-3xl font-bold font-display text-white truncate">{title}</div>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className={`p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 ${colors.text} transition-all active:scale-95 group shadow-lg shadow-black/20`}
                title="Refresh Data"
              >
                <FiRefreshCw className="text-lg group-active:rotate-180 transition-transform duration-500" />
              </button>
            )}
          </motion.div>

          {children}
        </div>
      </main>
    </div>
  );
}
