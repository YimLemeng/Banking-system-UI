import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Menu 
} from 'lucide-react';
import { BankLogo } from './BankLogo';
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
    <header className="h-14 shrink-0 border-b border-gray-200 bg-white sticky top-0 z-40 px-3 sm:px-5 flex items-center justify-between shadow-xs select-none">
      {/* Left: Sidebar Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          title={sidebarCollapsed ? (lang === 'kh' ? 'បើក Sidebar' : 'Expand Sidebar') : (lang === 'kh' ? 'បិទ Sidebar' : 'Collapse Sidebar')}
          className="w-8 h-8 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
        >
          <Menu className="w-4 h-4 text-gray-700" />
        </button>

        {sidebarCollapsed ? (
          <div className="flex items-center gap-2 animate-fadeIn">
            <BankLogo size={28} shadow={false} />
            <span className="font-extrabold text-sm tracking-wide text-gray-800">
              TRUST BANK
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              {t.terminalTitle || 'TERMINAL'}
            </span>
          </div>
        )}
      </div>

      {/* Right Controls: Language & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher (EN / ភាសាខ្មែរ) */}
        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-md p-0.5 text-xs font-medium">
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('kh')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              lang === 'kh'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ខ្មែរ
          </button>
        </div>

        {/* User Profile Pill (AdminLTE 4 style: Avatar + Name) */}
        <button 
          type="button"
          onClick={onOpenProfile}
          title={lang === 'kh' ? 'មើលប្រវត្តិរូប និងផ្លាស់ប្តូរលេខសម្ងាត់' : 'View Profile & Change Password'}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 select-none transition-all cursor-pointer text-left group"
        >
          {/* Avatar circle */}
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow-xs overflow-hidden border border-gray-300">
              {isAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {getUserDisplayName()}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
