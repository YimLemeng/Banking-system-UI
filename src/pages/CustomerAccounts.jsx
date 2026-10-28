import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  UserPlus, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function CustomerAccounts({ 
  accounts = [], 
  onOpenDeposit, 
  onOpenWithdraw, 
  onOpenTransfer, 
  onOpenCreateAccount,
  onRefresh
}) {
  const { lang, t } = useAuth();
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshClick = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = accounts.filter(acc => {
    const matchesSearch = 
      acc.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || acc.accountType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t.customerAccounts}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'kh' 
              ? 'សៀវភៅបញ្ជីមេនៃគណនីចរន្ត និងគណនីសន្សំរបស់អតិថិជនសាខាទាំងអស់' 
              : 'Complete master ledger of checking & savings accounts across all branch clients'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onRefresh && (
            <button
              onClick={handleRefreshClick}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 transition-all shadow-sm active:scale-95 disabled:opacity-75"
              title="Refresh Accounts Ledger"
            >
              <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? (lang === 'kh' ? 'កំពុងទាញយក...' : 'Refreshing...') : (lang === 'kh' ? 'ទាញទិន្នន័យថ្មី' : 'Refresh Ledger')}</span>
            </button>
          )}

          <button
            onClick={onOpenCreateAccount}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
            }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.openAccount}</span>
          </button>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by account number (e.g. ACC-892401) or client..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl p-0.5 text-xs">
            {['ALL', 'SAVINGS', 'CHECKING'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === type 
                    ? 'bg-blue-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">{t.accountNumber}</th>
                <th className="py-3.5 px-4">{t.clientName}</th>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">{t.type}</th>
                <th className="py-3.5 px-4 text-right">{t.balance}</th>
                <th className="py-3.5 px-4 text-center">{t.status}</th>
                <th className="py-3.5 px-4">{t.createdAt}</th>
                <th className="py-3.5 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">
                    No matching accounts found.
                  </td>
                </tr>
              ) : (
                filtered.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                      {acc.accountNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-semibold">
                      {acc.customerName || `Client #${acc.customerId}`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      #{acc.customerId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        acc.accountType === 'SAVINGS' 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                      ${(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {acc.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : '2026-10-25'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDeposit && onOpenDeposit(acc.accountNumber)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] border border-emerald-500/20"
                        >
                          + Dep
                        </button>
                        <button
                          onClick={() => onOpenWithdraw && onOpenWithdraw(acc.accountNumber)}
                          className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-[11px] border border-amber-500/20"
                        >
                          - With
                        </button>
                        <button
                          onClick={() => onOpenTransfer && onOpenTransfer(acc.accountNumber)}
                          className="px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-[11px] border border-blue-500/20"
                        >
                          Transfer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
