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
  currentOperation = 'DEPOSIT',
  onOperationChange,
  initialOperation = 'DEPOSIT',
  initialSourceAccount = '',
  initialTargetAccount = '',
  onRefresh
}) {
  const { t, user, lang, isAdmin } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const [activeOp, setActiveOp] = useState(currentOperation || initialOperation || 'DEPOSIT');

  useEffect(() => {
    if (currentOperation) {
      setActiveOp(currentOperation);
    }
  }, [currentOperation]);

  const handleOpSwitch = (op) => {
    setActiveOp(op);
    if (onOperationChange) {
      onOperationChange(op);
    }
  };

  // 3 Distinct Form States
  const [depositTarget, setDepositTarget] = useState(
    initialOperation === 'DEPOSIT' ? (initialTargetAccount || initialSourceAccount || '') : ''
  );
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMemo, setDepositMemo] = useState('');
  const [depositError, setDepositError] = useState('');

  const [withdrawSource, setWithdrawSource] = useState(
    initialOperation === 'WITHDRAW' ? (initialSourceAccount || initialTargetAccount || '') : ''
  );
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMemo, setWithdrawMemo] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  const [transferSource, setTransferSource] = useState(
    initialOperation === 'TRANSFER' ? (initialSourceAccount || '') : ''
  );
  const [transferTarget, setTransferTarget] = useState(
    initialOperation === 'TRANSFER' ? (initialTargetAccount || '') : ''
  );
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMemo, setTransferMemo] = useState('');
  const [transferError, setTransferError] = useState('');

  const [submittingType, setSubmittingType] = useState(null); // 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | null
  const [lastReceipt, setLastReceipt] = useState(null);

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

  const sourceAccObj = accounts.find(a => a.accountNumber === (lastReceipt?.sourceAccount || withdrawSource || transferSource));
  const targetAccObj = accounts.find(a => a.accountNumber === (lastReceipt?.targetAccount || depositTarget || transferTarget));

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
    setDepositTarget('');
    setDepositAmount('');
    setDepositMemo('');
    setDepositError('');

    setWithdrawSource('');
    setWithdrawAmount('');
    setWithdrawMemo('');
    setWithdrawError('');

    setTransferSource('');
    setTransferTarget('');
    setTransferAmount('');
    setTransferMemo('');
    setTransferError('');

    setLastReceipt(null);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (initialOperation === 'DEPOSIT') {
      if (initialTargetAccount) setDepositTarget(initialTargetAccount);
      else if (initialSourceAccount) setDepositTarget(initialSourceAccount);
    } else if (initialOperation === 'WITHDRAW') {
      if (initialSourceAccount) setWithdrawSource(initialSourceAccount);
      else if (initialTargetAccount) setWithdrawSource(initialTargetAccount);
    } else if (initialOperation === 'TRANSFER') {
      if (initialSourceAccount) setTransferSource(initialSourceAccount);
      if (initialTargetAccount) setTransferTarget(initialTargetAccount);
    }
  }, [initialOperation, initialSourceAccount, initialTargetAccount]);

  const quickDepositAmounts = [20, 50, 100, 500, 1000];
  const quickWithdrawAmounts = [20, 50, 100, 500, 1000];
  const quickTransferAmounts = [50, 100, 200, 500];

  // 1. Handle Cash Deposit Execution
  const handleDeposit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(depositAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setDepositError(lang === 'kh' ? 'សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ' : 'Please enter a valid amount');
      return;
    }
    if (!depositTarget) {
      setDepositError(lang === 'kh' ? 'សូមជ្រើសរើស ឬបញ្ចូលគណនីទទួលប្រាក់' : 'Please enter target account number');
      return;
    }

    setDepositError('');
    setSubmittingType('DEPOSIT');

    await withLoading(
      lang === 'kh' ? 'កំពុងដំណើរការដាក់ប្រាក់ចូលគណនី...' : 'Executing Cash Deposit...',
      async () => {
        try {
          const refId = `TX-${Math.floor(10000000 + Math.random() * 90000000)}`;
          await accountService.deposit(depositTarget, {
            amount: numAmount,
            description: depositMemo || 'Teller Cash Deposit'
          });

          const receipt = {
            refId,
            type: 'DEPOSIT',
            targetAccount: depositTarget,
            amount: numAmount,
            teller: user?.username || 'admin',
            timestamp: new Date().toISOString(),
            status: 'SUCCESS',
            description: depositMemo || 'Over-The-Counter Cash Deposit'
          };

          setLastReceipt(receipt);
          saveSlipToHistory(receipt);
          setDepositAmount('');
          setDepositMemo('');
          onSuccess?.(`Deposited $${numAmount.toLocaleString()} into ${depositTarget}`);

          setTimeout(() => {
            document.getElementById('teller-slip-preview')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || (lang === 'kh' ? 'ប្រតិបត្តិការបរាជ័យលើ Server' : 'Transaction failed on server');
          setDepositError(errMsg);
        } finally {
          setSubmittingType(null);
        }
      },
      650,
      lang === 'kh' ? 'ប្រព័ន្ធធនាគារស្នូលកំពុងកត់ត្រាចូល Ledger...' : 'Core banking ledger settling transaction. Please wait a moment...'
    );
  };

  // 2. Handle Cash Withdrawal Execution
  const handleWithdraw = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(withdrawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setWithdrawError(lang === 'kh' ? 'សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ' : 'Please enter a valid amount');
      return;
    }
    if (!withdrawSource) {
      setWithdrawError(lang === 'kh' ? 'សូមជ្រើសរើស ឬបញ្ចូលគណនីដកប្រាក់' : 'Please enter source account number');
      return;
    }

    setWithdrawError('');
    setSubmittingType('WITHDRAW');

    await withLoading(
      lang === 'kh' ? 'កំពុងដំណើរការដកប្រាក់ពីគណនី...' : 'Executing Cash Withdrawal...',
      async () => {
        try {
          const refId = `TX-${Math.floor(10000000 + Math.random() * 90000000)}`;
          await accountService.withdraw(withdrawSource, {
            amount: numAmount,
            description: withdrawMemo || 'Teller Cash Withdrawal'
          });

          const receipt = {
            refId,
            type: 'WITHDRAW',
            sourceAccount: withdrawSource,
            amount: numAmount,
            teller: user?.username || 'admin',
            timestamp: new Date().toISOString(),
            status: 'SUCCESS',
            description: withdrawMemo || 'Over-The-Counter Cash Withdrawal'
          };

          setLastReceipt(receipt);
          saveSlipToHistory(receipt);
          setWithdrawAmount('');
          setWithdrawMemo('');
          onSuccess?.(`Withdrew $${numAmount.toLocaleString()} from ${withdrawSource}`);

          setTimeout(() => {
            document.getElementById('teller-slip-preview')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || (lang === 'kh' ? 'ប្រតិបត្តិការបរាជ័យលើ Server' : 'Transaction failed on server');
          setWithdrawError(errMsg);
        } finally {
          setSubmittingType(null);
        }
      },
      650,
      lang === 'kh' ? 'ប្រព័ន្ធធនាគារស្នូលកំពុងផ្ទៀងផ្ទាត់ និងកត់ត្រាចូល Ledger...' : 'Core banking ledger settling transaction. Please wait a moment...'
    );
  };

  // 3. Handle Account Transfer Execution
  const handleTransfer = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(transferAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setTransferError(lang === 'kh' ? 'សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ' : 'Please enter a valid amount');
      return;
    }
    if (!transferSource || !transferTarget) {
      setTransferError(lang === 'kh' ? 'សូមបញ្ចូលទាំងគណនីប្រភព និងគណនីគោលដៅ' : 'Both source and target accounts are required');
      return;
    }
    if (transferSource === transferTarget) {
      setTransferError(lang === 'kh' ? 'គណនីប្រភព និងគណនីគោលដៅត្រូវតែខុសគ្នា' : 'Source and target accounts must be different');
      return;
    }

    setTransferError('');
    setSubmittingType('TRANSFER');

    await withLoading(
      lang === 'kh' ? 'កំពុងដំណើរការផ្ទេរប្រាក់រវាងគណនី...' : 'Executing Account Transfer...',
      async () => {
        try {
          const refId = `TX-${Math.floor(10000000 + Math.random() * 90000000)}`;
          await accountService.transfer({
            sourceAccountNumber: transferSource,
            targetAccountNumber: transferTarget,
            amount: numAmount,
            description: transferMemo || 'Teller Counter Transfer'
          });

          const receipt = {
            refId,
            type: 'TRANSFER',
            sourceAccount: transferSource,
            targetAccount: transferTarget,
            amount: numAmount,
            teller: user?.username || 'admin',
            timestamp: new Date().toISOString(),
            status: 'SUCCESS',
            description: transferMemo || 'Inter-Account Direct Funds Settlement'
          };

          setLastReceipt(receipt);
          saveSlipToHistory(receipt);
          setTransferAmount('');
          setTransferMemo('');
          onSuccess?.(`Transferred $${numAmount.toLocaleString()} from ${transferSource} to ${transferTarget}`);

          setTimeout(() => {
            document.getElementById('teller-slip-preview')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } catch (err) {
          const errMsg = err.response?.data?.message || err.message || (lang === 'kh' ? 'ប្រតិបត្តិការបរាជ័យលើ Server' : 'Transaction failed on server');
          setTransferError(errMsg);
        } finally {
          setSubmittingType(null);
        }
      },
      650,
      lang === 'kh' ? 'ប្រព័ន្ធធនាគារស្នូលកំពុងផ្ទៀងផ្ទាត់ និងកត់ត្រាចូល Ledger...' : 'Core banking ledger settling transaction. Please wait a moment...'
    );
  };

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. SCREEN ONLY VIEW (Hidden during print)                                */}
      {/* ========================================================================= */}
      <div className="screen-only-teller space-y-4 pb-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              {t.tellerCounter || 'Teller Counter (Cash & Pay)'}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded shadow-2xs transition-colors disabled:opacity-60 cursor-pointer self-start sm:self-auto"
            title="Refresh Ledger & Clear Forms"
          >
            <RotateCw className={`w-3.5 h-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>
              {refreshing
                ? (lang === 'kh' ? 'កំពុងទាញ...' : 'Refreshing...')
                : 'Refresh Counter'}
            </span>
          </button>
        </div>

        {/* ROW 1: Dedicated Active Form (2 Cols) + Live Teller Transaction Slip (1 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Active Operation Form (lg:col-span-2) */}
          <div className="lg:col-span-2">
            {activeOp === 'DEPOSIT' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {lang === 'kh' ? 'ដាក់ប្រាក់ (Cash Deposit)' : 'Cash Deposit Form'}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          {lang === 'kh' ? 'បញ្ចូលប្រាក់ចូលទៅក្នុងគណនីអតិថិជនភ្លាមៗជាមួយបង្កាន់ដៃផ្លូវការ' : 'Deposit funds directly into client account with audited teller slip.'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      CREDIT
                    </span>
                  </div>

                  {depositError && (
                    <div className="mb-4 p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{depositError}</span>
                    </div>
                  )}

                  <form id="teller-deposit-form" onSubmit={handleDeposit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t.targetAccount} (Credit) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        list="counterDepositTargetList"
                        required
                        value={depositTarget}
                        onChange={(e) => { setDepositTarget(e.target.value); setDepositError(''); }}
                        placeholder="Select or enter account..."
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                      />
                      <datalist id="counterDepositTargetList">
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.accountNumber}>
                            {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t.amount} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 font-bold text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={depositAmount}
                          onChange={(e) => { setDepositAmount(e.target.value); setDepositError(''); }}
                          placeholder="0.00"
                          className="w-full pl-7 pr-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-gray-400 mr-0.5">Quick:</span>
                        {quickDepositAmounts.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setDepositAmount(q.toString())}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition-colors cursor-pointer"
                          >
                            +${q}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t.description} / Memo
                      </label>
                      <input
                        type="text"
                        value={depositMemo}
                        onChange={(e) => setDepositMemo(e.target.value)}
                        placeholder="Deposit memo or remark..."
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>
                  </form>
                </div>

                <button
                  form="teller-deposit-form"
                  type="submit"
                  disabled={submittingType === 'DEPOSIT'}
                  className="mt-6 w-full py-2.5 rounded text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {submittingType === 'DEPOSIT' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>{lang === 'kh' ? 'កំពុងដាក់ប្រាក់...' : 'Depositing...'}</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownCircle className="w-3.5 h-3.5" />
                      <span>{lang === 'kh' ? 'អនុវត្តការដាក់ប្រាក់ (Execute Deposit)' : 'Execute Cash Deposit Now'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeOp === 'WITHDRAW' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="w-5 h-5 text-amber-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {lang === 'kh' ? 'ដកប្រាក់ (Cash Withdrawal)' : 'Cash Withdrawal Form'}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          {lang === 'kh' ? 'ដកប្រាក់ពីគណនីអតិថិជនជាមួយការត្រួតពិនិត្យសមតុល្យ & KYC' : 'Debit funds from client account with live balance verification.'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      DEBIT
                    </span>
                  </div>

                  {withdrawError && (
                    <div className="mb-4 p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{withdrawError}</span>
                    </div>
                  )}

                  <form id="teller-withdraw-form" onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t.sourceAccount} (Debit) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        list="counterWithdrawSourceList"
                        required
                        value={withdrawSource}
                        onChange={(e) => { setWithdrawSource(e.target.value); setWithdrawError(''); }}
                        placeholder="Select or enter account..."
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs"
                      />
                      <datalist id="counterWithdrawSourceList">
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.accountNumber}>
                            {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t.amount} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 font-bold text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={withdrawAmount}
                          onChange={(e) => { setWithdrawAmount(e.target.value); setWithdrawError(''); }}
                          placeholder="0.00"
                          className="w-full pl-7 pr-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-sm font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-gray-400 mr-0.5">Quick:</span>
                        {quickWithdrawAmounts.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setWithdrawAmount(q.toString())}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition-colors cursor-pointer"
                          >
                            +${q}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t.description} / Memo
                      </label>
                      <input
                        type="text"
                        value={withdrawMemo}
                        onChange={(e) => setWithdrawMemo(e.target.value)}
                        placeholder="Withdrawal memo..."
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs"
                      />
                    </div>
                  </form>
                </div>

                <button
                  form="teller-withdraw-form"
                  type="submit"
                  disabled={submittingType === 'WITHDRAW'}
                  className="mt-6 w-full py-2.5 rounded text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {submittingType === 'WITHDRAW' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>{lang === 'kh' ? 'កំពុងដកប្រាក់...' : 'Withdrawing...'}</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      <span>{lang === 'kh' ? 'អនុវត្តការដកប្រាក់ (Execute Withdraw)' : 'Execute Cash Withdrawal Now'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeOp === 'TRANSFER' && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {lang === 'kh' ? 'ផ្ទេរប្រាក់ (Account Transfer)' : 'Account Transfer Form'}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          {lang === 'kh' ? 'ផ្ទេរប្រាក់ភ្លាមៗរវាងគណនីក្នុងប្រព័ន្ធជាមួយការកាត់កងស្វ័យប្រវត្តិ' : 'Direct inter-account movement with real-time settlement.'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      INTERNAL
                    </span>
                  </div>

                  {transferError && (
                    <div className="mb-4 p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{transferError}</span>
                    </div>
                  )}

                  <form id="teller-transfer-form" onSubmit={handleTransfer} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          {t.sourceAccount} (Debit) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          list="counterTransferSourceList"
                          required
                          value={transferSource}
                          onChange={(e) => { setTransferSource(e.target.value); setTransferError(''); }}
                          placeholder="Source account..."
                          className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
                        />
                        <datalist id="counterTransferSourceList">
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.accountNumber}>
                              {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                            </option>
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          {t.targetAccount} (Credit) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          list="counterTransferTargetList"
                          required
                          value={transferTarget}
                          onChange={(e) => { setTransferTarget(e.target.value); setTransferError(''); }}
                          placeholder="Target account..."
                          className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
                        />
                        <datalist id="counterTransferTargetList">
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.accountNumber}>
                              {acc.accountNumber} - {acc.customerName} (${acc.balance?.toLocaleString()})
                            </option>
                          ))}
                        </datalist>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t.amount} <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 font-bold text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={transferAmount}
                          onChange={(e) => { setTransferAmount(e.target.value); setTransferError(''); }}
                          placeholder="0.00"
                          className="w-full pl-7 pr-3 py-2 rounded border border-gray-300 bg-white text-gray-800 font-mono text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-gray-400 mr-0.5">Quick:</span>
                        {quickTransferAmounts.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setTransferAmount(q.toString())}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition-colors cursor-pointer"
                          >
                            +${q}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {t.description} / Memo
                      </label>
                      <input
                        type="text"
                        value={transferMemo}
                        onChange={(e) => setTransferMemo(e.target.value)}
                        placeholder="Transfer description..."
                        className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    </div>
                  </form>
                </div>

                <button
                  form="teller-transfer-form"
                  type="submit"
                  disabled={submittingType === 'TRANSFER'}
                  className="mt-6 w-full py-2.5 rounded text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {submittingType === 'TRANSFER' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>{lang === 'kh' ? 'កំពុងផ្ទេរ...' : 'Transferring...'}</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>{lang === 'kh' ? 'អនុវត្តការផ្ទេរប្រាក់ (Execute Transfer)' : 'Execute Account Transfer Now'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right: Live Teller Receipt Slip Preview (lg:col-span-1) */}
          <div id="teller-slip-preview" className="lg:col-span-1 bg-white rounded-lg border border-gray-200 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-800 text-sm">Teller Transaction Slip</h3>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AUDITED
                </span>
              </div>

              {lastReceipt ? (
                <div className="mt-4 space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex justify-between text-gray-500 text-[11px]">
                      <span>Reference ID</span>
                      <span className="text-gray-900 font-bold">{lastReceipt.refId}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-[11px]">
                      <span>Operation</span>
                      <span className="text-emerald-600 font-bold">{lastReceipt.type}</span>
                    </div>
                    {lastReceipt.sourceAccount && (
                      <div className="flex justify-between text-gray-500 text-[11px]">
                        <span>Source Acc</span>
                        <span className="text-gray-900 font-medium">{lastReceipt.sourceAccount}</span>
                      </div>
                    )}
                    {lastReceipt.targetAccount && (
                      <div className="flex justify-between text-gray-500 text-[11px]">
                        <span>Target Acc</span>
                        <span className="text-gray-900 font-medium">{lastReceipt.targetAccount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500 text-[11px] pt-1.5 border-t border-gray-200">
                      <span className="font-semibold text-gray-700">Total Cleared</span>
                      <span className="text-emerald-600 font-bold text-sm">
                        ${lastReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-[10px] pt-1">
                      <span>Teller</span>
                      <span>{lastReceipt.teller}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>Timestamp</span>
                      <span>{new Date(lastReceipt.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-14 text-center text-gray-400 text-xs">
                  <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
                  <p className="font-medium text-gray-500">No recent transaction slip.</p>
                  <p className="text-[11px] text-gray-400 mt-1">Execute a counter operation to generate slip.</p>
                </div>
              )}
            </div>

            {lastReceipt && (
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Teller Slip (PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* ROW 2: Recent Counter Slips History Table (Full Width) */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <span>{lang === 'kh' ? 'ប្រវត្តិបង្កាន់ដៃប្រតិបត្តិការបេឡា' : 'Recent Counter Slips History'}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {slipHistory.length} {lang === 'kh' ? 'បង្កាន់ដៃ' : 'Slips'}
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  {lang === 'kh' 
                    ? 'បញ្ជីបង្កាន់ដៃដែលបានប្រតិបត្តិការនៅបញ្ជរ អាចមើលឡើងវិញ ឬបោះពុម្ពជាច្បាប់ចម្លងជូនភ្ញៀវ' 
                    : 'Audited log of counter transactions. View details or reprint official customer copy on demand.'}
                </p>
              </div>
            </div>

            {isAdmin && slipHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-gray-300 hover:border-rose-300 transition-colors self-start sm:self-auto cursor-pointer"
                title={lang === 'kh' ? 'សម្អាតប្រវត្តិបង្កាន់ដៃ' : 'Clear local slip history'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'kh' ? 'សម្អាតប្រវត្តិ' : 'Clear Slips'}</span>
              </button>
            )}
          </div>

          {slipHistory.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-gray-400" />
              <p className="text-xs font-medium text-gray-500">{lang === 'kh' ? 'មិនទាន់មានប្រវត្តិបង្កាន់ដៃនៅឡើយទេ' : 'No counter transaction slips recorded yet.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded mt-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-700 text-[11px] font-semibold bg-gray-50">
                    <th className="py-2.5 px-3">REF ID</th>
                    <th className="py-2.5 px-3">OPERATION</th>
                    <th className="py-2.5 px-3">ACCOUNTS</th>
                    <th className="py-2.5 px-3 text-right">AMOUNT</th>
                    <th className="py-2.5 px-3">TIME</th>
                    <th className="py-2.5 px-3">TELLER</th>
                    <th className="py-2.5 px-3 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {slipHistory.map((slip) => {
                    const isDeposit = slip.type === 'DEPOSIT';
                    const isWithdraw = slip.type === 'WITHDRAW';
                    const isTransfer = slip.type === 'TRANSFER';

                    return (
                      <tr key={slip.refId} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-gray-900">
                          {slip.refId}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono text-white ${
                            isDeposit ? 'bg-emerald-600' :
                            isWithdraw ? 'bg-amber-500' :
                            'bg-blue-600'
                          }`}>
                            {slip.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-gray-700">
                          {isDeposit && (
                            <span>{slip.targetAccount}</span>
                          )}
                          {isWithdraw && (
                            <span>{slip.sourceAccount}</span>
                          )}
                          {isTransfer && (
                            <span className="flex items-center gap-1">
                              <span>{slip.sourceAccount}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-blue-600 font-semibold">{slip.targetAccount}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">
                          ${(parseFloat(slip.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-gray-500 text-[11px] font-mono">
                          {new Date(slip.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3 text-gray-600 font-mono text-[11px]">
                          {slip.teller || 'admin'}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleViewSlip(slip)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 transition-colors cursor-pointer shadow-2xs"
                              title="View voucher preview"
                            >
                              <Eye className="w-3 h-3 text-blue-600" />
                              <span>{lang === 'kh' ? 'មើល' : 'View'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReprintSlip(slip)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-2xs"
                              title="Reprint Customer Copy"
                            >
                              <Printer className="w-3.5 h-3.5 text-white" />
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
                    {lastReceipt.description || 'Official Branch Counter Operation Settled'}
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
