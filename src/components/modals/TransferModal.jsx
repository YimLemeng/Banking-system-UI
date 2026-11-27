import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRightLeft, AlertCircle, Loader2 } from 'lucide-react';
import { accountService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';

export default function TransferModal({ isOpen, onClose, accounts = [], onSuccess }) {
  const { t, lang } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const [sourceAccountNumber, setSourceAccountNumber] = useState('');
  const [targetAccountNumber, setTargetAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Inter-account Transfer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSourceAccountNumber('');
      setTargetAccountNumber('');
      setAmount('');
      setDescription('Inter-account Transfer');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSourceAccountNumber('');
    setTargetAccountNumber('');
    setAmount('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sourceAccountNumber || !targetAccountNumber) {
      setError(lang === 'kh' ? 'សូមបញ្ចូលទាំងលេខគណនីប្រភព និងគោលដៅ' : 'Please provide both source and target account numbers');
      return;
    }
    if (sourceAccountNumber === targetAccountNumber) {
      setError(lang === 'kh' ? 'គណនីផ្ញើ និងគណនីទទួលមិនអាចដូចគ្នាទេ' : 'Source and target account numbers cannot be the same');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(lang === 'kh' ? 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង $0.00' : 'Amount must be greater than $0.00');
      return;
    }

    setError('');

    await withLoading(
      lang === 'kh' ? `កំពុងផ្ទេរប្រាក់ $${numAmount.toLocaleString()} ពី ${sourceAccountNumber} ទៅ ${targetAccountNumber}...` : `Processing Funds Transfer of $${numAmount.toLocaleString()} to ${targetAccountNumber}...`,
      async () => {
        try {
          await accountService.transfer({
            sourceAccountNumber,
            targetAccountNumber,
            amount: numAmount,
            description: description || 'Inter-account Transfer',
          });
          onSuccess(`Successfully transferred $${numAmount.toLocaleString()} from ${sourceAccountNumber} to ${targetAccountNumber}`);
          onClose();
        } catch (err) {
          setError(err.response?.data?.message || err.message || (lang === 'kh' ? 'ការផ្ទេរប្រាក់មិនជោគជ័យ' : 'Transfer failed'));
        }
      },
      600
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-lg classic-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3">
            <div className="classic-header-icon">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base tracking-wide">{t.transferModalTitle || 'Transfer Funds'}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant Clearing Ledger • Official Transfer Order</p>
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

          {/* Source Account */}
          <div>
            <label className="classic-label">
              {t.sourceAccount} <span className="text-[#dd4b39]">*</span>
              <span className="text-[11px] text-slate-500 ml-1.5 font-normal normal-case">
                ({lang === 'kh' ? 'គណនីកាត់ប្រាក់ចេញ' : 'Account to debit from'})
              </span>
            </label>
            <input
              type="text"
              list="sourceList"
              value={sourceAccountNumber}
              onChange={(e) => setSourceAccountNumber(e.target.value)}
              placeholder="e.g. ACC-892401"
              required
              className="classic-input font-mono"
            />
            <datalist id="sourceList">
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                </option>
              ))}
            </datalist>
          </div>

          {/* Target Account */}
          <div>
            <label className="classic-label">
              {t.targetAccount} <span className="text-[#dd4b39]">*</span>
              <span className="text-[11px] text-slate-500 ml-1.5 font-normal normal-case">
                ({lang === 'kh' ? 'គណនីទទួលប្រាក់' : 'Account to credit to'})
              </span>
            </label>
            <input
              type="text"
              list="targetList"
              value={targetAccountNumber}
              onChange={(e) => setTargetAccountNumber(e.target.value)}
              placeholder="e.g. ACC-892402"
              required
              className="classic-input font-mono"
            />
            <datalist id="targetList">
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountNumber} - {acc.customerName}
                </option>
              ))}
            </datalist>
          </div>

          {/* Amount */}
          <div>
            <label className="classic-label">
              {t.amount} <span className="text-[#dd4b39]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250.00"
                required
                className="classic-input pl-7 font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="classic-label">
              {t.description}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Invoice payment, personal transfer"
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
              className="classic-btn-primary"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? t.processing : (t.confirm || 'Confirm Transfer')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
