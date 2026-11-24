import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, AlertCircle, ChevronDown, Lock, CheckCircle2, RefreshCw, Loader2, CreditCard } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-2xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{t.openAccountModalTitle || 'Open New Client Account'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Core Depository Onboarding</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Selection / Locked View */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">
                {lang === 'kh' ? 'អតិថិជនដែលត្រូវបើកគណនីជូន' : 'Selected Customer / Client'} *
              </label>
            </div>

            {selectedCustomer ? (
              /* Preselected / Strictly Locked Customer Card */
              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs shadow-2xs">
                    {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-200 text-gray-700 border border-gray-300 font-semibold">
                        #{selectedCustomer.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {selectedCustomer.phoneNumber} • {selectedCustomer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-2xs">
                  <Lock className="w-3 h-3 text-emerald-600" />
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
                  className="appearance-none w-full pl-3 pr-8 py-2 rounded border border-gray-300 bg-white text-gray-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value="">{lang === 'kh' ? '-- ជ្រើសរើសអតិថិជន --' : '-- Choose Customer --'}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.id} - {c.firstName} {c.lastName} ({c.phoneNumber})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t.type} *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {['SAVINGS', 'CHECKING'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setAccountType(type)}
                  className={`py-2 px-3 rounded text-xs font-semibold border transition-all cursor-pointer ${
                    accountType === type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {lang === 'kh' ? 'ប្រាក់តម្កល់ដំបូង (USD)' : 'Initial Deposit (USD)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 transition-colors shadow-2xs cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? t.processing : (t.confirm || 'Confirm')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
