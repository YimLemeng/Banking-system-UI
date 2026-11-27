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
    { id: 'overview', label: t.overview || 'Dashboard', icon: LayoutGrid, badge: lang === 'kh' ? 'សំខាន់' : 'Main' },
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
      className={`bg-[#222d32] text-[#b8c7ce] border-r border-[#1a2226] flex flex-col justify-between shrink-0 h-full select-none transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Brand Banner */}
      <div className="h-14 border-b border-[#317399] px-3.5 flex items-center gap-2.5 shrink-0 bg-[#367fa9]">
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
      <div className="p-2.5 space-y-3 overflow-y-auto overflow-x-hidden flex-1">
        {/* Filter menu... Search Input */}
        {!isCollapsed && (
          <div className="relative mb-2">
            <input
              type="text"
              value={filterMenu}
              onChange={(e) => setFilterMenu(e.target.value)}
              placeholder={lang === 'kh' ? 'ស្វែងរកម៉ឺនុយ...' : 'Filter menu...'}
              className="w-full bg-[#374850] text-white placeholder-[#8aa4af] text-xs rounded-[2px] pl-2.5 pr-7 py-1.5 border border-transparent focus:border-[#3c8dbc] focus:outline-none transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#8aa4af] absolute right-2.5 top-2 pointer-events-none" />
          </div>
        )}

        {/* Section 1: TELLER OPERATIONS */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#4b646f] bg-[#1a2226] px-2.5 py-1.5 mb-1 truncate">
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
                      className={`w-full flex items-center rounded-[2px] text-xs transition-all group cursor-pointer ${
                        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                      } ${
                        isCounterActive
                          ? 'bg-[#1e282c] text-white font-semibold border-l-[3px] border-[#3c8dbc]'
                          : 'border-l-[3px] border-transparent text-[#b8c7ce] hover:text-white hover:bg-[#1e282c] font-normal'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                          isCounterActive ? 'text-[#3c8dbc]' : 'text-[#8aa4af] group-hover:text-white'
                        }`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronRight className={`w-3.5 h-3.5 text-[#8aa4af] transition-transform duration-200 ${
                          counterOpen ? 'rotate-90 text-white' : 'group-hover:translate-x-0.5'
                        }`} />
                      )}
                    </button>

                    {/* Sub-items (Treeview dropdown) */}
                    {!isCollapsed && counterOpen && (
                      <div className="pt-1 pb-0.5 space-y-0.5 bg-[#1a2226]/60 animate-fadeIn">
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
                              className={`w-full flex items-center gap-2.5 pl-7 pr-3 py-1.5 rounded-[2px] text-xs transition-colors cursor-pointer bg-transparent focus:outline-none focus:ring-0 select-none ${
                                isSubActive
                                  ? 'text-white font-semibold'
                                  : 'text-[#8aa4af] hover:text-white'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                                isSubActive ? 'bg-[#3c8dbc]' : 'border border-[#8aa4af]'
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
                  className={`w-full flex items-center rounded-[2px] text-xs transition-all group cursor-pointer ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-[#1e282c] text-white font-semibold border-l-[3px] border-[#3c8dbc]'
                      : 'border-l-[3px] border-transparent text-[#b8c7ce] hover:text-white hover:bg-[#1e282c] font-normal'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-[#3c8dbc]' : 'text-[#8aa4af] group-hover:text-white'
                    }`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded-[2px] text-[10px] font-semibold bg-[#00a65a] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: BRANCH MANAGEMENT */}
        <div className="space-y-0.5 pt-2">
          {!isCollapsed && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#4b646f] bg-[#1a2226] px-2.5 py-1.5 mb-1 truncate">
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
                  className={`w-full flex items-center rounded-[2px] text-xs transition-all group cursor-pointer ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-[#1e282c] text-white font-semibold border-l-[3px] border-[#3c8dbc]'
                      : 'border-l-[3px] border-transparent text-[#b8c7ce] hover:text-white hover:bg-[#1e282c] font-normal'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-[#3c8dbc]' : 'text-[#8aa4af] group-hover:text-white'
                    }`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded-[2px] text-[10px] font-semibold bg-[#00a65a] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer: Logout */}
      <div className="p-2.5 border-t border-[#1a2226] bg-[#1a2226]">
        <button
          onClick={handleLogoutClick}
          title={t.logout || 'Logout'}
          className={`w-full flex items-center rounded-[2px] text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-[#1e282c] transition-colors group cursor-pointer ${
            isCollapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
          }`}
        >
          <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-300 transition-transform shrink-0" />
          {!isCollapsed && <span>{t.logout || 'Logout'}</span>}
        </button>
      </div>
    </aside>
  );
}
