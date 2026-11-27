import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowDownCircle, AlertCircle, Loader2 } from 'lucide-react';
import { accountService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';

export default function DepositModal({ isOpen, onClose, accounts = [], onSuccess }) {
  const { t, lang } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAccountNumber('');
      setAmount('');
      setDescription('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(lang === 'kh' ? 'សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ' : 'Please enter a valid amount');
      return;
    }

    if (!accountNumber) {
      setError(lang === 'kh' ? 'សូមជ្រើសរើស ឬបញ្ចូលលេខគណនី' : 'Please specify an account number');
      return;
    }

    setError('');

    await withLoading(
      lang === 'kh' ? `កំពុងបញ្ចូលសាច់ប្រាក់ $${numAmount.toLocaleString()} ទៅគណនី ${accountNumber}...` : `Processing Cash Deposit of $${numAmount.toLocaleString()} to ${accountNumber}...`,
      async () => {
        try {
          await accountService.deposit(accountNumber, {
            amount: numAmount,
            description: description || 'Counter Cash Deposit',
          });
          onSuccess(`Successfully deposited $${numAmount.toLocaleString()} to ${accountNumber}`);
          onClose();
        } catch (err) {
          setError(err.response?.data?.message || err.message || (lang === 'kh' ? 'ការដាក់ប្រាក់មិនជោគជ័យ' : 'Deposit failed'));
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
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base tracking-wide">{t.depositModalTitle || 'Deposit Funds'}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Cash Vault Clearance • Official Voucher</p>
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
              list="accountListDeposit"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. ACC-892401"
              required
              className="classic-input font-mono"
            />
            <datalist id="accountListDeposit">
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                </option>
              ))}
            </datalist>
          </div>

          <div>
            <label className="classic-label">
              Deposit Amount (USD) <span className="text-[#dd4b39]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                required
                className="classic-input pl-7 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="classic-label">
              Description / Memo
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Counter deposit by client"
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
              className="classic-btn-deposit"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? t.processing : (t.confirm || 'Confirm Deposit')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
