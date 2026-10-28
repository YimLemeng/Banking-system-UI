import React, { useState } from 'react';
import { 
  Users2, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CreditCard,
  FileText,
  Edit3,
  Eye,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';

export default function CustomerKYC({ 
  customers = [], 
  onOpenCreateCustomer, 
  onOpenCreateAccount,
  onOpenEditCustomer,
  onOpenViewCustomer,
  onRefresh
}) {
  const { t, lang } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const [searchTerm, setSearchTerm] = useState('');
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

  const handleView = async (cust) => {
    await withLoading(
      lang === 'kh' ? 'កំពុងទាញយកព័ត៌មានអតិថិជន...' : 'Loading Customer KYC & Profiles...',
      async () => {
        await new Promise(r => setTimeout(r, 200));
      },
      300
    );
    if (onOpenViewCustomer) {
      onOpenViewCustomer(cust);
    }
  };

  const handleEdit = async (cust) => {
    await withLoading(
      lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យកែប្រែ...' : 'Loading Client Profile for Edit...',
      async () => {
        await new Promise(r => setTimeout(r, 200));
      },
      300
    );
    if (onOpenEditCustomer) {
      onOpenEditCustomer(cust);
    }
  };

  const handleOpenAccount = async (cust) => {
    await withLoading(
      lang === 'kh' ? 'កំពុងរៀបចំទម្រង់បើកគណនី...' : 'Preparing Account Creation...',
      async () => {
        await new Promise(r => setTimeout(r, 200));
      },
      300
    );
    if (onOpenCreateAccount) {
      onOpenCreateAccount(cust);
    }
  };

  const filtered = customers.filter(c => {
    const full = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const query = searchTerm.toLowerCase();
    return full.includes(query) || 
      c.email?.toLowerCase().includes(query) || 
      c.phoneNumber?.includes(query) ||
      c.nationalIdOrPassport?.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t.customerKYC}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'kh'
              ? 'ព័ត៌មានលម្អិតអត្តសញ្ញាណអតិថិជន ការផ្ទៀងផ្ទាត់ច្បាប់ និងកំណត់ត្រាទំនាក់ទំនង'
              : 'Client identification profiles, regulatory verification, and contact records'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefreshClick}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all shadow-sm active:scale-95 disabled:opacity-75"
            title="Refresh Customer KYC Profiles"
          >
            <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? (lang === 'kh' ? 'កំពុងទាញយក...' : 'Refreshing...') : (lang === 'kh' ? 'ទាញទិន្នន័យថ្មី' : 'Refresh KYC')}</span>
          </button>

          <button
            onClick={onOpenCreateCustomer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
            }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.newCustomerModalTitle}</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search client by name, email, or phone number..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> verified profiles
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cust) => (
          <div key={cust.id} className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">
                      {cust.firstName} {cust.lastName}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      #{cust.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      KYC VERIFIED
                    </span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                  {cust.firstName?.[0]}{cust.lastName?.[0]}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                  <span className="truncate">{cust.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span className="font-mono">{cust.phoneNumber}</span>
                </div>
                {cust.nationalIdOrPassport && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300">
                      ID: {cust.nationalIdOrPassport}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span className="truncate">{cust.address || 'Phnom Penh, Cambodia'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Active Client
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleView(cust)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 hover:text-blue-100 border border-blue-500/40 transition-all shadow-sm active:scale-95"
                  title="View Customer Profile"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEdit(cust)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all shadow-sm active:scale-95"
                  title="Update Client Profile"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update</span>
                </button>
                <button
                  onClick={() => handleOpenAccount(cust)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-700/80 transition-all active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>+ Open Account</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
