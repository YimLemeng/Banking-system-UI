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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-md classic-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3">
            <div className="classic-header-icon">
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base tracking-wide">{t.withdrawModalTitle || 'Withdraw Funds'}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Teller Security Clearance • Official Voucher</p>
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

          <div>
            <label className="classic-label">
              Select or Enter Account Number <span className="text-[#dd4b39]">*</span>
            </label>
            <input
              type="text"
              list="accountListWithdraw"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. ACC-892401"
              required
              className="classic-input font-mono"
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
            <label className="classic-label">
              Withdrawal Amount (USD) <span className="text-[#dd4b39]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50.00"
                required
                className="classic-input pl-7 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="classic-label">
              Description / Reason
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Teller ATM/Counter withdrawal"
              className="classic-input"
            />
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
              className="classic-btn-withdraw"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? t.processing : (t.confirm || 'Confirm Withdrawal')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
