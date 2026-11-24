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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-2xs">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{t.transferModalTitle || 'Transfer Funds'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Instant Clearing Ledger</p>
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

          {/* Source Account */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t.sourceAccount} *
              <span className="text-[11px] text-gray-500 ml-1.5 font-normal">
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
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t.targetAccount} *
              <span className="text-[11px] text-gray-500 ml-1.5 font-normal">
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
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t.amount} *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400 font-bold text-xs">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250.00"
                required
                className="w-full pl-7 pr-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t.description}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Invoice payment, personal transfer"
              className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
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
              <span>{loading ? t.processing : (t.confirm || 'Confirm Transfer')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
