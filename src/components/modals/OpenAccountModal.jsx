import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, AlertCircle, ChevronDown, Lock, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { accountService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';

export default function OpenAccountModal({ 
  isOpen, 
  onClose, 
  customers = [], 
  selectedCustomer = null,
  onSuccess 
}) {
  const { t, lang } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const [customerId, setCustomerId] = useState('');
  const [accountType, setAccountType] = useState('SAVINGS');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInitialDeposit('');
      setError('');
      if (selectedCustomer) {
        setCustomerId(selectedCustomer.id.toString());
      } else {
        setCustomerId('');
      }
    }
  }, [selectedCustomer, isOpen]);

  if (!isOpen) return null;

  // Active customer object (either from selectedCustomer or from dropdown customerId)
  const activeCustomer = selectedCustomer 
    ? selectedCustomer 
    : customers.find(c => c.id.toString() === customerId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      setError(lang === 'kh' ? 'សូមជ្រើសរើសអតិថិជនជាមុនសិន' : 'Please select or specify a Customer ID');
      return;
    }
    const numDeposit = parseFloat(initialDeposit) || 0;

    setError('');

    await withLoading(
      lang === 'kh' ? 'កំពុងបើកគណនីថ្មីជូនអតិថិជន...' : 'Opening New Client Account...',
      async () => {
        try {
          const res = await accountService.create({
            customerId: parseInt(customerId),
            accountType,
            initialDeposit: numDeposit,
          });
          const newAccNumber = res.data?.accountNumber || `ACC-${res.data?.id}`;
          onSuccess(`New ${accountType} account ${newAccNumber} created successfully!`, res.data);
          onClose();
        } catch (err) {
          setError(err.response?.data?.message || err.message || (lang === 'kh' ? 'ការបើកគណនីមិនជោគជ័យ' : 'Failed to create account'));
        }
      },
      600
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0a101f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t.openAccountModalTitle}</h3>
              <p className="text-xs text-slate-400">Core Depository Onboarding</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Selection / Locked View */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'kh' ? 'អតិថិជនដែលត្រូវបើកគណនីជូន' : 'Selected Customer / Client'} *
              </label>
            </div>

            {selectedCustomer ? (
              /* Preselected / Strictly Locked Customer Card */
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/25 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-xs shadow-sm">
                    {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        #{selectedCustomer.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedCustomer.phoneNumber} • {selectedCustomer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-sm">
                  <Lock className="w-3 h-3" />
                  <span>{lang === 'kh' ? 'ជាប់សោរ' : 'Locked'}</span>
                </div>
              </div>
            ) : (
              /* Dropdown for General Account Creation */
              <div className="relative">
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                  className="appearance-none w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value="">{lang === 'kh' ? '-- ជ្រើសរើសអតិថិជន --' : '-- Choose Customer --'}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      #{c.id} - {c.firstName} {c.lastName} ({c.phoneNumber})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <ChevronDown className="w-4 h-4 text-purple-400" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.type} *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['SAVINGS', 'CHECKING'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setAccountType(type)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    accountType === type
                      ? 'bg-purple-600/20 text-purple-300 border-purple-500 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {lang === 'kh' ? 'ប្រាក់តម្កល់ដំបូង (USD)' : 'Initial Deposit (USD)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-75"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? t.processing : t.confirm}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
