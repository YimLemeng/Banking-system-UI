import React, { useState, useEffect } from 'react';
import { 
  CircleDollarSign, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowRightLeft, 
  Receipt, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  RotateCw,
  Building2,
  ShieldCheck,
  Loader2,
  History,
  Eye,
  Trash2
} from 'lucide-react';
import { accountService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';

export default function TellerCounter({ 
  accounts = [], 
  onSuccess,
  initialOperation = 'DEPOSIT',
  initialSourceAccount = '',
  initialTargetAccount = '',
  onRefresh
}) {
  const { t, user, lang, isAdmin } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();
  const [refreshing, setRefreshing] = useState(false);

  const [operationType, setOperationType] = useState(initialOperation || 'DEPOSIT'); // DEPOSIT, WITHDRAW, TRANSFER
  const [sourceAccount, setSourceAccount] = useState(initialSourceAccount || '');
  const [targetAccount, setTargetAccount] = useState(initialTargetAccount || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [error, setError] = useState('');

  // Teller Slips History (Audit Trail & Customer Reprinting) - Real database operations
  const [slipHistory, setSlipHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('trustbank_teller_slip_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const saveSlipToHistory = (newSlip) => {
    setSlipHistory((prev) => {
      const updated = [newSlip, ...prev.filter(s => s.refId !== newSlip.refId)].slice(0, 50);
      try {
        localStorage.setItem('trustbank_teller_slip_history', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleReprintSlip = (slip) => {
    setLastReceipt({ ...slip, isReprint: true });
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleViewSlip = (slip) => {
    setLastReceipt({ ...slip, isReprint: false });
    const previewEl = document.getElementById('teller-slip-preview');
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    if (!isAdmin) {
      alert(lang === 'kh' ? 'សិទ្ធិត្រូវបានបដិសេធ! មានតែ Admin ប៉ុណ្ណោះដែលអាចសម្អាតប្រវត្តិបង្កាន់ដៃបាន។' : 'Access Denied! Only Administrators can clear slip history.');
      return;
    }
    const confirmMsg = lang === 'kh'
      ? 'តើអ្នកប្រាកដជាចង់សម្អាតប្រវត្តិបង្កាន់ដៃទាំងអស់មែនទេ?'
      : 'Are you sure you want to clear all slip history?';
    if (window.confirm(confirmMsg)) {
      setSlipHistory([]);
      localStorage.removeItem('trustbank_teller_slip_history');
    }
  };

  const sourceAccObj = accounts.find(a => a.accountNumber === (lastReceipt?.sourceAccount || sourceAccount));
  const targetAccObj = accounts.find(a => a.accountNumber === (lastReceipt?.targetAccount || targetAccount));

  const getAmountInWords = (amt) => {
    const num = Math.floor(amt);
    const cents = Math.round((amt - num) * 100);
    const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    
    function convert(n) {
      if (n === 0) return '';
      if (n < 20) return ones[n] + ' ';
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '') + ' ';
      if (n < 1000) return ones[Math.floor(n / 100)] + ' HUNDRED ' + (n % 100 !== 0 ? convert(n % 100) : '');
      if (n < 1000000) return convert(Math.floor(n / 1000)) + 'THOUSAND ' + (n % 1000 !== 0 ? convert(n % 1000) : '');
      return convert(Math.floor(n / 1000000)) + 'MILLION ' + (n % 1000000 !== 0 ? convert(n % 1000000) : '');
    }

    const wordPart = num === 0 ? 'ZERO' : convert(num).trim();
    const centsPart = cents > 0 ? ` AND ${cents}/100` : '';
    return `${wordPart}${centsPart} US DOLLARS ONLY`;
  };

  const handleRefreshClick = async () => {
    setRefreshing(true);
    setSourceAccount('');
    setTargetAccount('');
    setAmount('');
    setDescription('');
    setError('');
    setLastReceipt(null);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (initialOperation) {
      setOperationType(initialOperation);
    }
  }, [initialOperation]);

  useEffect(() => {
    if (initialSourceAccount !== undefined) {
      setSourceAccount(initialSourceAccount);
    }
  }, [initialSourceAccount]);

  useEffect(() => {
    if (initialTargetAccount !== undefined) {
      setTargetAccount(initialTargetAccount);
    }
  }, [initialTargetAccount]);

  const quickAmounts = [20, 50, 100, 200, 500, 1000, 5000];

  const handleExecute = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError(lang === 'kh' ? 'សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ' : 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    const opTitles = {
      DEPOSIT: lang === 'kh' ? 'កំពុងដំណើរការដាក់ប្រាក់ចូលគណនី...' : 'Executing Cash Deposit...',
      WITHDRAW: lang === 'kh' ? 'កំពុងដំណើរការដកប្រាក់ពីគណនី...' : 'Executing Cash Withdrawal...',
      TRANSFER: lang === 'kh' ? 'កំពុងដំណើរការផ្ទេរប្រាក់រវាងគណនី...' : 'Executing Account Transfer...',
    };

    const opMessage = lang === 'kh'
      ? 'ប្រព័ន្ធធនាគារស្នូលកំពុងផ្ទៀងផ្ទាត់ និងកត់ត្រាចូល Ledger សូមរង់ចាំមួយភ្លែត...'
      : 'Core banking ledger settling transaction. Please wait a moment...';

    await withLoading(
      opTitles[operationType] || 'Executing Transaction...',
      async () => {
        try {
          let refId = `TX-${Math.floor(10000000 + Math.random() * 90000000)}`;

          if (operationType === 'DEPOSIT') {
            if (!targetAccount) throw new Error('Target account number is required');
            await accountService.deposit(targetAccount, { amount: numAmount, description: description || 'Teller Cash Deposit' });
            const receipt = {
              refId,
              type: 'DEPOSIT',
              targetAccount,
              amount: numAmount,
              teller: user?.username || 'admin',
              timestamp: new Date().toISOString(),
              status: 'SUCCESS',
              description: description || 'Over-The-Counter Cash Deposit'
            };
            setLastReceipt(receipt);
            saveSlipToHistory(receipt);
            onSuccess(`Deposited $${numAmount.toLocaleString()} into ${targetAccount}`);
          } else if (operationType === 'WITHDRAW') {
            if (!sourceAccount) throw new Error('Source account number is required');
            await accountService.withdraw(sourceAccount, { amount: numAmount, description: description || 'Teller Cash Withdrawal' });
            const receipt = {
              refId,
              type: 'WITHDRAW',
              sourceAccount,
              amount: numAmount,
              teller: user?.username || 'admin',
              timestamp: new Date().toISOString(),
              status: 'SUCCESS',
              description: description || 'Over-The-Counter Cash Withdrawal'
            };
            setLastReceipt(receipt);
            saveSlipToHistory(receipt);
            onSuccess(`Withdrew $${numAmount.toLocaleString()} from ${sourceAccount}`);
          } else {
            if (!sourceAccount || !targetAccount) throw new Error('Both source and target accounts are required');
            if (sourceAccount === targetAccount) throw new Error('Source and target accounts must be different');
            await accountService.transfer({
              sourceAccountNumber: sourceAccount,
              targetAccountNumber: targetAccount,
              amount: numAmount,
              description: description || 'Teller Counter Transfer'
            });
            const receipt = {
              refId,
              type: 'TRANSFER',
              sourceAccount,
              targetAccount,
              amount: numAmount,
              teller: user?.username || 'admin',
              timestamp: new Date().toISOString(),
              status: 'SUCCESS',
              description: description || 'Inter-Account Direct Funds Settlement'
            };
            setLastReceipt(receipt);
            saveSlipToHistory(receipt);
            onSuccess(`Transferred $${numAmount.toLocaleString()} from ${sourceAccount} to ${targetAccount}`);
          }
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || (lang === 'kh' ? 'ប្រតិបត្តិការបរាជ័យលើ Server' : 'Transaction failed on server');
          setError(errMsg);
        } finally {
          setLoading(false);
        }
      },
      650,
      opMessage
    );
  };

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. SCREEN ONLY VIEW (Hidden during print)                                */}
      {/* ========================================================================= */}
      <div className="screen-only-teller space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {t.tellerCounter}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'kh'
              ? 'ការគ្រប់គ្រងសាច់ប្រាក់រហ័ស ប្រតិបត្តិការដាក់ប្រាក់ ដកប្រាក់ និងផ្ទេរប្រាក់ផ្ទៃក្នុងធនាគារ'
              : 'High-speed cash handling, teller deposits, withdrawals, and inter-account clearing'}
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-75"
            title="Refresh Ledger & Clear Form"
          >
            <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>
              {refreshing
                ? (lang === 'kh' ? 'កំពុងទាញយក...' : 'Refreshing...')
                : (lang === 'kh' ? 'ទាញទិន្នន័យ & សម្អាត' : 'Refresh Counter')}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Counter Form */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-5">
          {/* Operation Selector */}
          <div className="grid grid-cols-3 gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'DEPOSIT', label: t.cashDeposit, icon: ArrowDownCircle, color: 'text-emerald-400' },
              { id: 'WITHDRAW', label: t.cashWithdraw, icon: ArrowUpCircle, color: 'text-amber-400' },
              { id: 'TRANSFER', label: t.accountTransfer, icon: ArrowRightLeft, color: 'text-blue-400' },
            ].map((op) => {
              const Icon = op.icon;
              const isSelected = operationType === op.id;
              return (
                <button
                  key={op.id}
                  onClick={() => { setOperationType(op.id); setError(''); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? op.color : ''}`} />
                  <span>{op.label}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleExecute} className="space-y-4">
            {/* Source Account (For Withdraw and Transfer) */}
            {(operationType === 'WITHDRAW' || operationType === 'TRANSFER') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.sourceAccount} (Debit) *
                </label>
                <input
                  type="text"
                  list="counterSourceList"
                  required
                  value={sourceAccount}
                  onChange={(e) => setSourceAccount(e.target.value)}
                  placeholder="Select or enter account..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
                <datalist id="counterSourceList">
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                    </option>
                  ))}
                </datalist>
              </div>
            )}

            {/* Target Account (For Deposit and Transfer) */}
            {(operationType === 'DEPOSIT' || operationType === 'TRANSFER') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.targetAccount} (Credit) *
                </label>
                <input
                  type="text"
                  list="counterTargetList"
                  required
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  placeholder="Select or enter account..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
                <datalist id="counterTargetList">
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                    </option>
                  ))}
                </datalist>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.amount} *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 mr-1">Quick:</span>
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                  >
                    +${q}
                  </button>
                ))}
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.description}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Teller counter memo..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-80 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{lang === 'kh' ? 'កំពុងដំណើរការប្រតិបត្តិការ...' : 'Processing Transaction...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {lang === 'kh'
                      ? (operationType === 'DEPOSIT'
                          ? 'អនុវត្តការដាក់ប្រាក់ឥឡូវនេះ (Execute DEPOSIT)'
                          : operationType === 'WITHDRAW'
                          ? 'អនុវត្តការដកប្រាក់ឥឡូវនេះ (Execute WITHDRAW)'
                          : 'អនុវត្តការផ្ទេរប្រាក់ឥឡូវនេះ (Execute TRANSFER)')
                      : `Execute ${operationType} Now`}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Teller Receipt Slip */}
        <div id="teller-slip-preview" className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Teller Transaction Slip</h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                AUDITED
              </span>
            </div>

            {lastReceipt ? (
              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Reference ID</span>
                    <span className="text-white font-bold">{lastReceipt.refId}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Operation</span>
                    <span className="text-emerald-400 font-bold">{lastReceipt.type}</span>
                  </div>
                  {lastReceipt.sourceAccount && (
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Source Acc</span>
                      <span className="text-white">{lastReceipt.sourceAccount}</span>
                    </div>
                  )}
                  {lastReceipt.targetAccount && (
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Target Acc</span>
                      <span className="text-white">{lastReceipt.targetAccount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                    <span>Total Cleared</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      ${lastReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Teller</span>
                    <span>{lastReceipt.teller}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Timestamp</span>
                    <span>{new Date(lastReceipt.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                <p>No recent transaction slip.</p>
                <p className="text-[11px] text-slate-400 mt-1">Execute a counter operation to generate slip.</p>
              </div>
            )}
          </div>

          {lastReceipt && (
            <button
              onClick={() => window.print()}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Teller Slip (PDF)</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1.1 RECENT COUNTER SLIPS HISTORY (AUDIT & CUSTOMER REPRINTING)            */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
              <History className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{lang === 'kh' ? 'ប្រវត្តិបង្កាន់ដៃប្រតិបត្តិការបេឡា' : 'Recent Counter Slips History'}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {slipHistory.length} {lang === 'kh' ? 'បង្កាន់ដៃ' : 'Slips'}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'kh' 
                  ? 'បញ្ជីបង្កាន់ដៃដែលបានប្រតិបត្តិការនៅបញ្ជរ អាចមើលឡើងវិញ ឬបោះពុម្ពជាច្បាប់ចម្លង (Customer Reprint Copy) ជូនភ្ញៀវ' 
                  : 'Audited log of counter transactions. View details or reprint official customer copy on demand.'}
              </p>
            </div>
          </div>

          {isAdmin && slipHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/50 transition-all self-start sm:self-auto cursor-pointer"
              title={lang === 'kh' ? 'សម្អាតប្រវត្តិបង្កាន់ដៃ (សម្រាប់តែ Admin)' : 'Clear local slip history (Admin Only)'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'kh' ? 'សម្អាតប្រវត្តិ' : 'Clear Slips'}</span>
            </button>
          )}
        </div>

        {slipHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-xs">{lang === 'kh' ? 'មិនទាន់មានប្រវត្តិបង្កាន់ដៃនៅឡើយទេ' : 'No counter transaction slips recorded yet.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold bg-slate-900/40">
                  <th className="py-2.5 px-3">លេខកូដយោង / REF ID</th>
                  <th className="py-2.5 px-3">ប្រតិបត្តិការ / OP</th>
                  <th className="py-2.5 px-3">គណនី / ACCOUNTS</th>
                  <th className="py-2.5 px-3 text-right">ចំនួនទឹកប្រាក់ / AMOUNT</th>
                  <th className="py-2.5 px-3">កាលបរិច្ឆេទ / TIME</th>
                  <th className="py-2.5 px-3">បេឡាករ / TELLER</th>
                  <th className="py-2.5 px-3 text-center">សកម្មភាព / ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {slipHistory.map((slip) => {
                  const isDeposit = slip.type === 'DEPOSIT';
                  const isWithdraw = slip.type === 'WITHDRAW';
                  const isTransfer = slip.type === 'TRANSFER';

                  return (
                    <tr key={slip.refId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-200">
                        {slip.refId}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          isDeposit ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                          isWithdraw ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}>
                          {slip.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {isDeposit && (
                          <span>{slip.targetAccount}</span>
                        )}
                        {isWithdraw && (
                          <span>{slip.sourceAccount}</span>
                        )}
                        {isTransfer && (
                          <span className="flex items-center gap-1">
                            <span>{slip.sourceAccount}</span>
                            <span className="text-slate-500">→</span>
                            <span className="text-blue-400">{slip.targetAccount}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                        ${(parseFloat(slip.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">
                        {new Date(slip.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                        {slip.teller || 'admin'}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleViewSlip(slip)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
                            title="View voucher preview"
                          >
                            <Eye className="w-3 h-3 text-blue-400" />
                            <span>{lang === 'kh' ? 'មើល' : 'View'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReprintSlip(slip)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-600/90 hover:bg-blue-500 text-white border border-blue-500 transition-all cursor-pointer shadow-sm active:scale-95"
                            title="Reprint Customer Copy"
                          >
                            <Printer className="w-3 h-3 text-white" />
                            <span>{lang === 'kh' ? 'Print ឡើងវិញ' : 'Reprint'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

      {/* ========================================================================= */}
      {/* 2. OFFICIAL BANK TELLER TRANSACTION VOUCHER (PRINT ONLY - HIGH CLASS)    */}
      {/* ========================================================================= */}
      {lastReceipt && (() => {
        const voucherInfo = (() => {
          switch (lastReceipt.type) {
            case 'DEPOSIT':
              return {
                en: 'CASH DEPOSIT RECEIPT',
                kh: 'បង្កាន់ដៃទទួលប្រាក់',
              };
            case 'WITHDRAW':
              return {
                en: 'CASH WITHDRAWAL VOUCHER',
                kh: 'បង្កាន់ដៃបើកប្រាក់',
              };
            case 'TRANSFER':
              return {
                en: 'FUNDS TRANSFER RECEIPT',
                kh: 'បង្កាន់ដៃផ្ទេរប្រាក់',
              };
            default:
              return {
                en: 'TRANSACTION RECEIPT',
                kh: 'បង្កាន់ដៃប្រតិបត្តិការ',
              };
          }
        })();

        return (
          <div className="official-teller-slip-print font-sans text-slate-900 bg-white">
            {/* Bank Official Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                {/* Prestigious Neoclassical Bank Crest */}
                <div className="w-14 h-14 shrink-0 flex items-center justify-center mt-0.5">
                  <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" fill="#0f2b48" stroke="#d97706" strokeWidth="2.5" />
                    <circle cx="32" cy="32" r="26" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="2 2" />
                    {/* Neoclassical Pediment (Roof) */}
                    <path d="M32 13L17 22H47L32 13Z" fill="#f59e0b" />
                    <rect x="15" y="22" width="34" height="2.5" rx="0.5" fill="#f8fafc" />
                    {/* Neoclassical Architectural Columns */}
                    <rect x="19" y="26" width="3.5" height="15" rx="1" fill="#f8fafc" />
                    <rect x="25.5" y="26" width="3.5" height="15" rx="1" fill="#f8fafc" />
                    <rect x="35" y="26" width="3.5" height="15" rx="1" fill="#f8fafc" />
                    <rect x="41.5" y="26" width="3.5" height="15" rx="1" fill="#f8fafc" />
                    {/* Center Star */}
                    <circle cx="32" cy="33.5" r="2.5" fill="#f59e0b" />
                    {/* Base / Steps */}
                    <rect x="16" y="42" width="32" height="2" fill="#f8fafc" />
                    <rect x="14" y="45" width="36" height="3" rx="0.8" fill="#f59e0b" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-950 leading-snug tracking-normal font-khmer">
                    ធនាគារ ត្រាស់ ប៊ែង ភីអិលស៊ី
                  </div>
                  <div className="text-sm font-extrabold text-[#0f2b48] tracking-widest mt-0.5 font-sans">
                    TRUST BANK PLC.
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                    អាជ្ញាប័ណ្ណពីធនាគារជាតិនៃកម្ពុជា • License No. NBC/B-2024-089
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">
                    សាខាការិយាល័យកណ្តាល រាជធានីភ្នំពេញ • Phnom Penh Head Office
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-slate-950 tracking-normal font-khmer leading-snug">
                  {voucherInfo.kh}
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-700 uppercase tracking-wider font-sans mt-0.5">
                  {voucherInfo.en}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-bold">
                  <ShieldCheck className={`w-3.5 h-3.5 ${lastReceipt.isReprint ? 'text-amber-600' : 'text-blue-600'}`} />
                  <span className={lastReceipt.isReprint ? 'text-amber-900 font-black' : 'text-slate-800'}>
                    {lastReceipt.isReprint 
                      ? 'ច្បាប់ចម្លងបោះពុម្ពឡើងវិញ • CUSTOMER REPRINT COPY' 
                      : 'ច្បាប់អតិថិជន • CUSTOMER COPY'}
                  </span>
                </div>
              </div>
            </div>

          {/* Reference & Metadata Ribbon */}
          <div className="grid grid-cols-4 gap-2 py-2.5 px-3.5 bg-slate-100/90 rounded-lg text-xs font-mono mb-4 border border-slate-300">
            <div>
              <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">លេខកូដយោង / Reference ID</span>
              <span className="font-bold text-slate-950 text-xs">{lastReceipt.refId}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">ប្រតិបត្តិការ / Operation</span>
              <span className="font-black text-blue-800 text-xs uppercase">{lastReceipt.type}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">កាលបរិច្ឆេទ / Date & Time</span>
              <span className="font-bold text-slate-950 text-[11px]">{new Date(lastReceipt.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">ស្ថានីយ & បេឡា / Terminal</span>
              <span className="font-bold text-slate-950 text-xs">#TB-0492 ({lastReceipt.teller || user?.username || 'admin'})</span>
            </div>
          </div>

          {/* Transaction Core Details Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden mb-4">
            <table className="w-full text-left text-xs border-collapse">
              <tbody>
                {lastReceipt.sourceAccount && (
                  <tr className="border-b border-slate-200">
                    <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700 w-1/3">
                      គណនីប្រភព / Source Account:
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-950">
                      {lastReceipt.sourceAccount}
                      {sourceAccObj && (
                        <span className="ml-2 font-sans font-semibold text-slate-700">
                          ({sourceAccObj.customerName} - {sourceAccObj.accountType})
                        </span>
                      )}
                    </td>
                  </tr>
                )}
                {lastReceipt.targetAccount && (
                  <tr className="border-b border-slate-200">
                    <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700 w-1/3">
                      គណនីគោលដៅ / Target Account:
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-950">
                      {lastReceipt.targetAccount}
                      {targetAccObj && (
                        <span className="ml-2 font-sans font-semibold text-slate-700">
                          ({targetAccObj.customerName} - {targetAccObj.accountType})
                        </span>
                      )}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700">
                    ប្រភេទសេវា / Service Type:
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">
                    {lastReceipt.type === 'DEPOSIT' && 'Over-The-Counter Cash Deposit (បង់ប្រាក់ផ្ទាល់នៅបញ្ជរបេឡា)'}
                    {lastReceipt.type === 'WITHDRAW' && 'Over-The-Counter Cash Withdrawal (ដកប្រាក់ផ្ទាល់នៅបញ្ជរបេឡា)'}
                    {lastReceipt.type === 'TRANSFER' && 'Inter-Account Direct Funds Settlement (ផ្ទេរប្រាក់ផ្ទៃក្នុងធនាគារ)'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700">
                    កំណត់សម្គាល់ / Description:
                  </td>
                  <td className="py-2.5 px-4 text-slate-800 font-medium">
                    {description || 'Official Branch Counter Operation Settled'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700">
                    មធ្យោបាយប្រតិបត្តិការ / Channel:
                  </td>
                  <td className="py-2.5 px-4 text-slate-800 font-mono text-[11px]">
                    Trust Bank Branch OTC Counter • Terminal Workstation #TB-0492
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Highlighted Total Amount Box */}
          <div className="border-2 border-slate-900 rounded-xl p-4 bg-slate-50 mb-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                ចំនួនទឹកប្រាក់ទូទាត់សរុប / TOTAL AMOUNT CLEARED:
              </div>
              <div className="text-[11px] font-mono text-slate-600 font-bold">
                CURRENCY: USD ($)
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <div className="font-mono text-xs font-bold text-slate-700 italic">
                {getAmountInWords(parseFloat(lastReceipt.amount) || 0)}
              </div>
              <div className="font-mono font-black text-3xl text-slate-950">
                ${(parseFloat(lastReceipt.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </div>
            </div>
          </div>

          {/* Dual Signatures Section + Footer Notice Pinned to Bottom */}
          <div className="print-bottom-section mt-auto pt-6">
            {/* Dual Signatures Section */}
            <div className="grid grid-cols-2 gap-12 pt-2 pb-6">
              {/* Customer Signature */}
              <div className="text-center">
                <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
                <div className="text-xs font-bold text-slate-950">ហត្ថលេខាអតិថិជន</div>
                <div className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Customer Signature</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Date: ...... / ...... / 2026</div>
              </div>

              {/* Teller Signature & Bank Official Seal */}
              <div className="text-center relative">
                {/* Circular Bank Stamp Watermark */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-2 border-blue-700/40 pointer-events-none flex flex-col items-center justify-center text-blue-700/60 rotate-[-12deg]">
                  <div className="text-[8px] font-black uppercase tracking-tight">TRUST BANK PLC.</div>
                  <div className="text-[7px] font-bold border-y border-blue-700/30 my-0.5 px-2">★ OFFICIAL STAMP ★</div>
                  <div className="text-[8px] font-black uppercase tracking-tight">TELLER COUNTER</div>
                  <div className="text-[6px] font-mono mt-0.5">PHNOM PENH</div>
                </div>

                <div className="h-16 border-b border-dashed border-slate-400 mb-2"></div>
                <div className="text-xs font-bold text-slate-950">ហត្ថលេខាបេឡាធនាគារ & ត្រាផ្លូវការ</div>
                <div className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Authorized Teller Signature & Stamp</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Officer ID: {lastReceipt.teller || user?.username || 'admin'}</div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="border-t border-slate-300 pt-3 text-center text-[9px] text-slate-500 leading-relaxed font-mono">
              <div>វិក្កយបត្រនេះត្រូវបានបង្កើតឡើងដោយប្រព័ន្ធស្វ័យប្រវត្តពី Core Banking Terminal #TB-0492។ គ្មានសុពលភាពប្រសិនបើមានការកែបន្លំ។</div>
              <div>Computer generated transaction voucher from TRUST BANK Core Terminal. Valid without manual alterations. Regulated by National Bank of Cambodia (NBC).</div>
              <div className="text-slate-400 mt-0.5">24/7 Hotline: +855 (0) 23 999 888 | www.trustbank.com.kh</div>
            </div>
          </div>
        </div>
      );
    })()}
  </div>
);
}
