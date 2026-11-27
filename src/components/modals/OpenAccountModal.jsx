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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-md classic-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3">
            <div className="classic-header-icon">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base tracking-wide">{t.openAccountModalTitle || 'Open New Client Account'}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Core Depository Onboarding • Account Registry</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="classic-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="classic-error">
              <AlertCircle className="w-4 h-4 text-[#dd4b39] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Selection / Locked View */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="classic-label mb-0">
                {lang === 'kh' ? 'អតិថិជនដែលត្រូវបើកគណនីជូន' : 'Selected Customer / Client'} <span className="text-[#dd4b39]">*</span>
              </label>
            </div>

            {selectedCustomer ? (
              /* Preselected / Strictly Locked Customer Card */
              <div className="classic-fieldset p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[2px] bg-[#3c8dbc] text-white border-[#367fa9] flex items-center justify-center font-bold text-xs">
                    {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">
                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-[#f4f4f4] text-slate-700 border border-[#d2d6de] font-semibold">
                        #{selectedCustomer.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {selectedCustomer.phoneNumber} • {selectedCustomer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-[2px] bg-emerald-50 border border-emerald-200">
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
                  className="classic-input appearance-none pr-8 cursor-pointer"
                >
                  <option value="">{lang === 'kh' ? '-- ជ្រើសរើសអតិថិជន --' : '-- Choose Customer --'}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      #{c.id} - {c.firstName} {c.lastName} ({c.phoneNumber})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="classic-label">
              {t.type} <span className="text-[#dd4b39]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {['SAVINGS', 'CHECKING'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setAccountType(type)}
                  className={`py-2 px-3 rounded-[2px] text-xs font-bold border transition-all cursor-pointer ${
                    accountType === type
                      ? 'bg-[#3c8dbc] text-white border-[#367fa9] shadow-inner'
                      : 'bg-white text-slate-700 border-[#d2d6de] hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="classic-label">
              {lang === 'kh' ? 'ប្រាក់តម្កល់ដំបូង (USD)' : 'Initial Deposit (USD)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(e.target.value)}
                placeholder="0.00"
                className="classic-input pl-7 font-mono"
              />
            </div>
          </div>

          <div className="classic-footer">
            <button
              type="button"
              onClick={onClose}
              className="classic-btn-secondary"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="classic-btn-primary"
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
