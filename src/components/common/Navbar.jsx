import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Menu,
  Bell,
  Coins,
  ChevronDown,
  LogOut,
  User,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

export function Navbar({ toggleSidebar }) {
  const { currentUser, currentRole, logout, switchRoleDemo } = useAuth();
  const { data, resetDemoData } = useData();
  const { t, language, changeLanguage, supportedLanguages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const unreadNotifs = data.notifications.filter((n) => !n.read);

  const handleRoleSwitch = (targetRole) => {
    switchRoleDemo(targetRole);
    setShowRoleMenu(false);
    const redirects = {
      'waste-giver': '/waste-giver/dashboard',
      'collector': '/collector/dashboard',
      'buyer': '/buyer/dashboard',
      'ngo': '/ngo/dashboard',
      'admin': '/admin/dashboard'
    };
    navigate(redirects[targetRole] || '/');
  };

  const handleResetData = () => {
    if (window.confirm('Reset demo data to initial seed state?')) {
      resetDemoData();
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search / Quick Traceability Jump */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('action_search')}
            className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-400 w-full text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                navigate(`/traceability?id=${encodeURIComponent(e.target.value)}`);
              }
            }}
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* About REVastra Link Button */}
        <NavLink
          to="/about"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>About REVastra</span>
        </NavLink>

        {/* Waste Giver Green Coins indicator */}
        {currentRole === 'waste-giver' && currentUser && (
          <NavLink
            to="/waste-giver/wallet"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-semibold"
          >
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{currentUser.greenCoinsBalance || 0} Coins</span>
          </NavLink>
        )}

        {/* ☀️/🌙 Dark vs Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-600" />
          )}
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-1 text-xs font-semibold border border-slate-800 uppercase"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{language}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                {t('lang_select')}
              </div>
              <div className="py-1 space-y-0.5 text-xs max-h-64 overflow-y-auto custom-scrollbar">
                {supportedLanguages?.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${language === lang.code ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span>{lang.name}</span>
                    {language === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>



        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900"></span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-slate-400">{data.notifications.length} total</span>
              </div>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {data.notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs">
                    <p className="font-semibold text-slate-200">{n.title}</p>
                    <p className="text-slate-400 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data button */}
        <button
          onClick={handleResetData}
          title="Reset Demo Data"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover"
            />
            <span className="hidden md:inline text-xs font-semibold text-slate-200">{currentUser?.name}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate(`/${currentRole}/profile`);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5" /> Profile Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    navigate('/role-selection');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
