import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  ArrowLeftRight, 
  Wallet, 
  FileText, 
  Users2, 
  Users, 
  Shield, 
  UserCheck,
  LogOut,
  ChevronRight,
  Search
} from 'lucide-react';
import { BankLogo } from './BankLogo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed = false, 
  onLogout,
  tellerOperation = 'DEPOSIT',
  onSelectTellerOp
}) {
  const { t, lang, logout, isAdmin } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();
  const [filterMenu, setFilterMenu] = useState('');
  const [counterOpen, setCounterOpen] = useState(activeTab === 'counter');

  useEffect(() => {
    if (activeTab === 'counter') {
      setCounterOpen(true);
    }
  }, [activeTab]);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const handleTabClick = (tabId) => {
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
      200
    );
  };

  const tellerOps = [
    { id: 'overview', label: t.overview || 'Dashboard', icon: LayoutGrid, badge: 'Main' },
    { id: 'counter', label: t.tellerCounter || 'Teller Counter', icon: ArrowLeftRight },
    { id: 'accounts', label: t.customerAccounts || 'Customer Accounts', icon: Wallet },
    { id: 'statements', label: t.accountStatements || 'Statements', icon: FileText },
  ];

  const allBranchMgmt = [
    { id: 'kyc', label: t.customerKYC || 'Customer KYC', icon: Users2 },
    { id: 'users', label: t.systemUsers || 'System Users', icon: Users, adminOnly: true },
    { id: 'audit', label: t.auditTrail || 'Audit Trail', icon: Shield, adminOnly: true },
    { id: 'profile', label: lang === 'kh' ? 'ប្រវត្តិរូប និងសុវត្ថិភាព' : 'Profile & Security', icon: UserCheck },
  ];

  const branchMgmt = allBranchMgmt.filter(item => !item.adminOnly || isAdmin);

  const filterText = filterMenu.toLowerCase().trim();
  const filteredTellerOps = tellerOps.filter(item => !filterText || item.label.toLowerCase().includes(filterText));
  const filteredBranchMgmt = branchMgmt.filter(item => !filterText || item.label.toLowerCase().includes(filterText));

  return (
    <aside 
      className={`bg-[#343a40] text-[#c2c7d0] border-r border-[#4b545c] flex flex-col justify-between shrink-0 h-full select-none transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Brand Banner */}
      <div className="h-14 border-b border-[#4b545c] px-3.5 flex items-center gap-2.5 shrink-0 bg-[#343a40]">
        <BankLogo size={32} shadow={false} />
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="font-extrabold text-white text-base tracking-wider truncate">
              {t.brandName || 'TRUST BANK'}
            </span>
          </div>
        )}
      </div>

      {/* Nav Menu Body */}
      <div className="p-3 space-y-3 overflow-y-auto overflow-x-hidden flex-1">
        {/* Filter menu... Search Input */}
        {!isCollapsed && (
          <div className="relative mb-2">
            <input
              type="text"
              value={filterMenu}
              onChange={(e) => setFilterMenu(e.target.value)}
              placeholder="Filter menu..."
              className="w-full bg-[#3f474e] text-slate-200 placeholder-[#8c949e] text-xs rounded-md pl-2.5 pr-7 py-1.5 border border-transparent focus:border-blue-500 focus:outline-none transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#8c949e] absolute right-2.5 top-2 pointer-events-none" />
          </div>
        )}

        {/* Section 1: TELLER OPERATIONS */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8c949e] px-2.5 py-1 mb-0.5 truncate">
              {t.tellerOps || 'TELLER OPERATIONS'}
            </div>
          )}
          <div className="space-y-1">
            {filteredTellerOps.map((item) => {
              const Icon = item.icon;

              if (item.id === 'counter') {
                const isCounterActive = activeTab === 'counter';
                const tellerSubItems = [
                  { op: 'DEPOSIT', label: lang === 'kh' ? 'ដាក់ប្រាក់សុទ្ធ' : 'Cash Deposit' },
                  { op: 'WITHDRAW', label: lang === 'kh' ? 'ដកប្រាក់សុទ្ធ' : 'Cash Withdrawal' },
                  { op: 'TRANSFER', label: lang === 'kh' ? 'ផ្ទេរប្រាក់' : 'Account Transfer' },
                ];

                return (
                  <div key="counter-treeview" className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (isCollapsed) {
                          handleTabClick('counter');
                        } else {
                          setCounterOpen(!counterOpen);
                        }
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center rounded-md text-xs transition-all group cursor-pointer ${
                        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                      } ${
                        isCounterActive
                          ? 'bg-white/10 text-white font-medium shadow-xs'
                          : 'text-[#c2c7d0] hover:text-white hover:bg-white/5 font-normal'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                          isCounterActive ? 'text-white' : 'text-[#c2c7d0] group-hover:text-white'
                        }`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight className={`w-3.5 h-3.5 text-[#8c949e] transition-transform duration-200 ${
                          counterOpen ? 'rotate-90 text-white' : 'group-hover:translate-x-0.5'
                        }`} />
                      )}
                    </button>

                    {/* Sub-items (Treeview dropdown) */}
                    {!isCollapsed && counterOpen && (
                      <div className="pt-1 pb-0.5 space-y-0.5 bg-transparent animate-fadeIn">
                        {tellerSubItems.map((sub) => {
                          const isSubActive = isCounterActive && tellerOperation === sub.op;
                          return (
                            <button
                              key={sub.op}
                              type="button"
                              onClick={() => {
                                if (onSelectTellerOp) {
                                  onSelectTellerOp(sub.op);
                                } else {
                                  setActiveTab('counter');
                                }
                              }}
                              className={`w-full flex items-center gap-2.5 pl-7 pr-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer bg-transparent focus:outline-none focus:ring-0 select-none ${
                                isSubActive
                                  ? 'text-white font-medium'
                                  : 'text-[#c2c7d0] hover:text-white'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                                isSubActive ? 'bg-white shadow-xs' : 'border border-[#8c949e]'
                              }`} />
                              <span className="truncate">{sub.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-md text-xs transition-all group cursor-pointer ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-white/10 text-white font-medium shadow-xs'
                      : 'text-[#c2c7d0] hover:text-white hover:bg-white/5 font-normal'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-[#c2c7d0] group-hover:text-white'
                    }`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-600 text-white">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3 h-3 text-[#8c949e] transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: BRANCH MANAGEMENT */}
        <div className="space-y-0.5 pt-2">
          {!isCollapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8c949e] px-2.5 py-1 mb-0.5 truncate">
              {t.branchMgmt || 'BRANCH MANAGEMENT'}
            </div>
          )}
          <div className="space-y-1">
            {filteredBranchMgmt.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-md text-xs transition-all group cursor-pointer ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-white/10 text-white font-medium shadow-xs'
                      : 'text-[#c2c7d0] hover:text-white hover:bg-white/5 font-normal'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-[#c2c7d0] group-hover:text-white'
                    }`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#28a745] text-white">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3 h-3 text-[#8c949e] transition-transform ${isActive ? 'rotate-90' : 'group-hover:translate-x-0.5'}`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer: Logout */}
      <div className="p-2.5 border-t border-[#4b545c] bg-[#343a40]">
        <button
          onClick={handleLogoutClick}
          title={t.logout || 'Logout'}
          className={`w-full flex items-center rounded-md text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-600/30 transition-colors group cursor-pointer ${
            isCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
          }`}
        >
          <LogOut className="w-4 h-4 text-rose-400 group-hover:text-white transition-transform shrink-0" />
          {!isCollapsed && <span>{t.logout || 'Logout'}</span>}
        </button>
      </div>
    </aside>
  );
}
