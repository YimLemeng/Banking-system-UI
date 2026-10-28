import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Globe2, 
  Palette, 
  Wifi, 
  WifiOff, 
  Bell, 
  ChevronDown,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  LogIn,
  KeyRound,
  Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header({ 
  isOnline = true, 
  sidebarCollapsed = false, 
  onToggleSidebar,
  onOpenProfile
}) {
  const { user, isAuthenticated, lang, setLang, t, isAdmin } = useAuth();
  const { currentTheme, setCurrentTheme, themes, theme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const getUserDisplayName = () => {
    if (!user) return lang === 'kh' ? 'អភិបាលប្រព័ន្ធ' : 'System Administrator';
    if (user.fullName && user.fullName.toLowerCase() !== 'teller' && user.fullName.toLowerCase() !== 'admin') {
      return user.fullName;
    }
    if (user.username === 'admin') {
      return lang === 'kh' ? 'អភិបាលប្រព័ន្ធ' : 'System Administrator';
    }
    if (user.username === 'teller') {
      return lang === 'kh' ? 'មន្ត្រីបេឡាការ' : 'Teller Officer';
    }
    return user.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Officer';
  };

  const getUserRoleName = () => {
    const rawRole = (user?.role || '').replace('ROLE_', '').toUpperCase();
    if (rawRole === 'ADMIN' || rawRole === 'SUPER_ADMIN') {
      return 'ADMIN';
    }
    if (rawRole === 'USER' || rawRole === 'TELLER' || user?.username === 'teller') {
      return 'TELLER';
    }
    return rawRole || 'STAFF';
  };

  const getRoleBadgeStyle = () => {
    const roleName = getUserRoleName();
    if (roleName === 'ADMIN') {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
    if (roleName === 'TELLER') {
      return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
    }
    return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
  };

  return (
    <header className="h-16 shrink-0 border-b border-slate-800/80 bg-[#080d1a]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Sidebar Toggle Button & Brand */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          title={sidebarCollapsed ? (lang === 'kh' ? 'បើក Sidebar' : 'Expand Sidebar') : (lang === 'kh' ? 'បិទ Sidebar' : 'Collapse Sidebar')}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all shadow-sm group active:scale-95"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white">
                {t.brandName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 hidden md:inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {t.terminalTitle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Theme Accent Switcher (Without Midnight Amethyst) */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors"
            title="Switch Theme Accent"
          >
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            <span className="capitalize hidden md:inline">{theme.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showThemeMenu && (
            <div 
              className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-fadeIn"
              onMouseLeave={() => setShowThemeMenu(false)}
            >
              <div className="text-[10px] font-semibold uppercase text-slate-400 px-2 py-1">
                Accent Themes
              </div>
              {Object.values(themes).map((th) => (
                <button
                  key={th.id}
                  onClick={() => {
                    setCurrentTheme(th.id);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    currentTheme === th.id 
                      ? 'bg-slate-800 text-white font-semibold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shadow-sm" 
                      style={{ backgroundColor: th.primaryLight }}
                    />
                    <span>{lang === 'kh' ? th.nameKh : th.name}</span>
                  </div>
                  {currentTheme === th.id && (
                    <span className="text-[10px] text-blue-400 font-bold">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Switcher (EN / ភាសាខ្មែរ) */}
        <div className="flex items-center bg-slate-900/90 border border-slate-700/70 rounded-lg p-0.5 text-xs font-medium">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded-md transition-all ${
              lang === 'en'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('kh')}
            className={`px-2 py-1 rounded-md transition-all ${
              lang === 'kh'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ភាសាខ្មែរ
          </button>
        </div>

        {/* User Profile Pill (Clickable to view Profile & Change Password) */}
        <button 
          type="button"
          onClick={onOpenProfile}
          title={lang === 'kh' ? 'មើលប្រវត្តិរូប និងផ្លាស់ប្តូរលេខសម្ងាត់' : 'View Profile & Change Password'}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-sm backdrop-blur-md select-none transition-all hover:border-slate-500 hover:bg-slate-800/80 cursor-pointer text-left group"
        >
          {/* Avatar with dynamic role gradient & online status */}
          <div className="relative">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md transition-transform group-hover:scale-105 ${
              isAdmin 
                ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-blue-500/20 border border-blue-400/30'
                : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-teal-500 shadow-emerald-500/20 border border-emerald-400/30'
            }`}>
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-white" />
              ) : (
                <UserCheck className="w-4 h-4 text-white" />
              )}
            </div>
            {/* Live Green Online Status Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080d1a]" />
          </div>

          <div className="text-left">
            <div className="text-xs font-bold text-slate-100 leading-tight group-hover:text-blue-400 transition-colors">
              {getUserDisplayName()}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full tracking-wider border flex items-center gap-1 ${getRoleBadgeStyle()}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                {getUserRoleName()}
              </span>
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}
