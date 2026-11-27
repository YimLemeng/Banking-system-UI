import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ 
  isOnline = true, 
  sidebarCollapsed = false, 
  onToggleSidebar,
  onOpenProfile
}) {
  const { user, isAuthenticated, lang, setLang, t, isAdmin } = useAuth();

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

  return (
    <header className="h-14 shrink-0 border-b border-[#367fa9] bg-[#3c8dbc] text-white sticky top-0 z-40 px-3 sm:px-5 flex items-center justify-between shadow-xs select-none">
      {/* Left: Sidebar Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={sidebarCollapsed ? (lang === 'kh' ? 'បើក Sidebar' : 'Expand Sidebar') : (lang === 'kh' ? 'បិទ Sidebar' : 'Collapse Sidebar')}
          className="w-8 h-8 rounded-[2px] hover:bg-[#367fa9] text-white flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
        >
          <Menu className="w-4 h-4 text-white" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-[2px] bg-[#367fa9] text-white border border-white/25 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
            {t.terminalTitle || 'TERMINAL'}
          </span>
        </div>
      </div>

      {/* Right Controls: Language & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Single-Click Language Switcher */}
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
          title={lang === 'en' ? 'ប្តូរទៅភាសាខ្មែរ' : 'Switch to English'}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-semibold bg-[#367fa9] hover:bg-[#317399] text-white border border-white/25 transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          {lang === 'en' ? (
            <svg viewBox="0 0 60 30" className="w-4 h-3 rounded-[1px] shrink-0 border border-white/20" aria-hidden="true">
              <clipPath id="uk-clip">
                <rect width="60" height="30" />
              </clipPath>
              <g clipPath="url(#uk-clip)">
                <rect width="60" height="30" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 36 24" className="w-4 h-3 rounded-[1px] shrink-0 border border-white/20" aria-hidden="true">
              <rect width="36" height="24" fill="#032EA1" />
              <rect y="6" width="36" height="12" fill="#E00025" />
              <path
                d="M11 16h14v-1h-1v-2h-1.5v-2.5L21 9l-1 1.5h-1V8l-1-1.5L17 8v2.5h-1L15 9l-1.5 1.5V13H12v2h-1v1z"
                fill="#fff"
              />
            </svg>
          )}
          <span>{lang === 'en' ? 'EN' : 'ខ្មែរ'}</span>
        </button>

        {/* User Profile Pill */}
        <button 
          type="button"
          onClick={onOpenProfile}
          title={lang === 'kh' ? 'មើលប្រវត្តិរូប និងផ្លាស់ប្តូរលេខសម្ងាត់' : 'View Profile & Change Password'}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-[2px] hover:bg-[#367fa9] border border-transparent hover:border-white/20 select-none transition-all cursor-pointer text-left group shrink-0"
        >
          {/* Avatar badge (fixed 32x32 square, never squishes) */}
          <div className="relative w-8 h-8 shrink-0">
            <div className="w-8 h-8 rounded-[2px] bg-[#222d32] text-white font-bold text-xs flex items-center justify-center shadow-sm overflow-hidden border border-white/30">
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <UserCheck className="w-4 h-4 text-sky-300 shrink-0" />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#3c8dbc]" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="text-xs font-semibold text-white group-hover:text-white/90 transition-colors">
              {getUserDisplayName()}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
