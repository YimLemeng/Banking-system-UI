import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowUpCircle, AlertCircle, Loader2 } from 'lucide-react';
import { accountService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';

export default function WithdrawModal({ isOpen, onClose, accounts = [], onSuccess }) {
  const { t, lang } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Counter Cash Withdrawal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAccountNumber('');
      setAmount('');
      setDescription('Counter Cash Withdrawal');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setAccountNumber('');
    setAmount('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountNumber) {
      setError(lang === 'kh' ? 'សូមជ្រើសរើស ឬបញ្ចូលលេខគណនី' : 'Please select or enter an account number');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(lang === 'kh' ? 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង $0.00' : 'Amount must be greater than $0.00');
      return;
    }

    setError('');

    await withLoading(
      lang === 'kh' ? `កំពុងដកប្រាក់ $${numAmount.toLocaleString()} ពីគណនី ${accountNumber}...` : `Processing Cash Withdrawal of $${numAmount.toLocaleString()} from ${accountNumber}...`,
      async () => {
        try {
          await accountService.withdraw(accountNumber, {
            amount: numAmount,
            description: description || 'Counter Cash Withdrawal',
          });
          onSuccess(`Successfully withdrew $${numAmount.toLocaleString()} from ${accountNumber}`);
          onClose();
        } catch (err) {
          setError(err.response?.data?.message || err.message || (lang === 'kh' ? 'ការដកប្រាក់មិនជោគជ័យ' : 'Withdrawal failed'));
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
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t.withdrawModalTitle}</h3>
              <p className="text-xs text-slate-400">Teller Security Clearance</p>
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select or Enter Account Number *
            </label>
            <input
              type="text"
              list="accountListWithdraw"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. ACC-892401"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
            <datalist id="accountListWithdraw">
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                </option>
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Withdrawal Amount (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50.00"
                required
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description / Reason
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Teller ATM/Counter withdrawal"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500"
            />
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-75"
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
