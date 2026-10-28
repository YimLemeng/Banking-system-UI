import React from 'react';
import { 
  LayoutGrid, 
  ArrowLeftRight, 
  Wallet, 
  FileText, 
  Users2, 
  Users, 
  Shield, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed = false, 
  onLogout 
}) {
  const { t, lang, logout, isAdmin } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (activeTab === tabId) return;

    const titles = {
      overview: lang === 'kh' ? 'កំពុងទាញយកទិដ្ឋភាពទូទៅនៃសាខា...' : 'Loading Branch Overview & Metrics...',
      counter: lang === 'kh' ? 'កំពុងដំណើរការបញ្ជរបេឡា...' : 'Loading Teller Counter (Cash & Pay)...',
      accounts: lang === 'kh' ? 'កំពុងទាញយកគណនីអតិថិជន...' : 'Loading Customer Accounts...',
      statements: lang === 'kh' ? 'កំពុងទាញយករបាយការណ៍គណនី...' : 'Loading Account Statements...',
      kyc: lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យ KYC & អតិថិជន...' : 'Loading Customer KYC & Profiles...',
      users: lang === 'kh' ? 'កំពុងទាញយកអ្នកប្រើប្រាស់ប្រព័ន្ធ...' : 'Loading System Users...',
      audit: lang === 'kh' ? 'កំពុងទាញយកកំណត់ត្រាត្រួតពិនិត្យ (Audit)...' : 'Loading Audit Trail...',
      profile: lang === 'kh' ? 'កំពុងទាញយកប្រវត្តិរូបបុគ្គលិក...' : 'Loading Staff Profile & Security...',
    };

    withLoading(
      titles[tabId] || (lang === 'kh' ? 'កំពុងដំណើរការទិន្នន័យ...' : 'Loading Request...'),
      async () => {
        setActiveTab(tabId);
      },
      450
    );
  };

  const tellerOps = [
    { id: 'overview', label: t.overview || 'Branch Overview', icon: LayoutGrid },
    { id: 'counter', label: t.tellerCounter || 'Teller Counter (Cash & Pay)', icon: ArrowLeftRight },
    { id: 'accounts', label: t.customerAccounts || 'Customer Accounts', icon: Wallet },
    { id: 'statements', label: t.accountStatements || 'Account Statements', icon: FileText },
  ];

  const allBranchMgmt = [
    { id: 'kyc', label: t.customerKYC || 'Customer KYC & Moderation', icon: Users2 },
    { id: 'users', label: t.systemUsers || 'System Users', icon: Users, adminOnly: true },
    { id: 'audit', label: t.auditTrail || 'Audit Trail', icon: Shield, adminOnly: true },
  ];

  const branchMgmt = allBranchMgmt.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside 
      className={`border-r border-slate-800/80 bg-[#080d1a]/95 flex flex-col justify-between shrink-0 h-full select-none transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Nav Menu Body */}
      <div className="pt-4 px-3 space-y-4 overflow-y-auto overflow-x-hidden flex-1">
        {/* Section 1: TELLER OPERATIONS */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1 truncate">
              {t.tellerOps || 'TELLER OPERATIONS'}
            </div>
          )}
          <div className="space-y-1">
            {tellerOps.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all group ${
                    isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: BRANCH MANAGEMENT [STAFF] */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 py-1 mt-4 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 truncate">
                {t.branchMgmt || 'BRANCH MANAGEMENT'}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                {t.staffBadge || 'STAFF'}
              </span>
            </div>
          )}
          <div className="space-y-1">
            {branchMgmt.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all group ${
                    isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer: Logout */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={handleLogoutClick}
          title={t.logout || 'Logout'}
          className={`w-full flex items-center rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors group ${
            isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
          }`}
        >
          <LogOut className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          {!isCollapsed && <span>{t.logout || 'Logout'}</span>}
        </button>
      </div>
    </aside>
  );
}
