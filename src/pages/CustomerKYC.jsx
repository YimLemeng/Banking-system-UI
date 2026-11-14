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
  RotateCw,
  LayoutList,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // Default to Table List view

  const handleRefreshClick = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const handleView = (cust) => {
    if (onOpenViewCustomer) {
      onOpenViewCustomer(cust);
    }
  };

  const handleEdit = (cust) => {
    if (onOpenEditCustomer) {
      onOpenEditCustomer(cust);
    }
  };

  const handleOpenAccount = (cust) => {
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
      c.nationalIdOrPassport?.toLowerCase().includes(query) ||
      c.address?.toLowerCase().includes(query);
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

      {/* Search & View Mode Switcher */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'kh' ? 'ស្វែងរកអតិថិជនតាមឈ្មោះ អ៊ីមែល លេខទូរស័ព្ទ ឬ ID...' : 'Search client by name, email, phone, or ID...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 hidden md:block">
            {lang === 'kh' ? 'អតិថិជនសរុប៖' : 'Showing'} <span className="text-white font-bold">{filtered.length}</span> {lang === 'kh' ? 'នាក់' : 'profiles'}
          </div>

          {/* Table / Grid Switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>{lang === 'kh' ? 'តារាង (Table)' : 'Table List'}</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{lang === 'kh' ? 'ក្រឡា (Grid)' : 'Grid Cards'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table List or Grid Cards */}
      {viewMode === 'table' ? (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'អតិថិជន' : 'Client Profile'}</th>
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'អត្តសញ្ញាណប័ណ្ណ / លិខិតឆ្លងដែន' : 'National ID / Passport'}</th>
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'ព័ត៌មានទំនាក់ទំនង' : 'Contact Details'}</th>
                  <th className="py-3.5 px-4">{lang === 'kh' ? 'អាសយដ្ឋាន' : 'Address / City'}</th>
                  <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'ស្ថានភាព KYC' : 'KYC Status'}</th>
                  <th className="py-3.5 px-4 text-right">{lang === 'kh' ? 'សកម្មភាព' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-400">
                      {lang === 'kh' ? 'មិនមានអតិថិជនត្រូវគ្នានឹងការស្វែងរកឡើយ' : 'No matching customer profiles found.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-900/60 transition-colors group">
                      {/* Client Name + Avatar + ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700/40 to-indigo-600/40 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                            {cust.firstName?.[0]}{cust.lastName?.[0]}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                              {cust.firstName} {cust.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Client #{cust.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* National ID / Passport */}
                      <td className="py-3.5 px-4">
                        {cust.nationalIdOrPassport ? (
                          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700 text-indigo-300 inline-flex items-center gap-1.5 shadow-sm">
                            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>{cust.nationalIdOrPassport}</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">N/A</span>
                        )}
                      </td>

                      {/* Contact Info (Email & Phone) */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{cust.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{cust.phoneNumber}</span>
                          </div>
                        </div>
                      </td>

                      {/* Address / Location */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{cust.address || 'Phnom Penh, Cambodia'}</span>
                        </div>
                      </td>

                      {/* KYC Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          KYC VERIFIED
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleView(cust)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 hover:text-blue-100 border border-blue-500/30 transition-all shadow-sm active:scale-95"
                            title="View Customer Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleEdit(cust)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all shadow-sm active:scale-95"
                            title="Update Profile"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>
                          <button
                            onClick={() => handleOpenAccount(cust)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-700/80 transition-all active:scale-95"
                            title="Open Depository Account"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                            <span>+ Open Account</span>
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
      ) : (
        /* Customers Cards Grid */
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
      )}
    </div>
  );
}
