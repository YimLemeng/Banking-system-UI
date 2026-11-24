import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  UserPlus, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  ArrowRightLeft, 
  RotateCw, 
  Download, 
  FileCode, 
  Printer 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TablePagination from '../components/TablePagination';
import OfficialReportPrint from '../components/OfficialReportPrint';

export default function CustomerAccounts({ 
  accounts = [], 
  onOpenDeposit, 
  onOpenWithdraw, 
  onOpenTransfer, 
  onOpenCreateAccount,
  onRefresh
}) {
  const { lang, t } = useAuth();
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleRefreshClick = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = accounts.filter(acc => {
    const matchesSearch = 
      acc.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || acc.accountType === filterType;

    return matchesSearch && matchesType;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["#,Account Number,Customer Name,Type,Balance,Status,Date"]
      .concat(filtered.map((a, i) => `${i+1},"${a.accountNumber}","${a.customerName || ''}",${a.accountType},${a.balance},${a.status || 'ACTIVE'},${a.createdAt || ''}`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_accounts_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `customer_accounts_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* 1. SCREEN VIEW (Visible on web app, hidden when printing) */}
      <div className="screen-only-report space-y-4 pb-8">
      {/* AdminLTE 4 Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          {t.customerAccounts}
        </h1>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefresh && (
            <button
              type="button"
              onClick={handleRefreshClick}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded shadow-2xs transition-colors disabled:opacity-60 cursor-pointer"
              title="Refresh Accounts"
            >
              <RotateCw className={`w-3.5 h-3.5 text-blue-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? (lang === 'kh' ? 'កំពុងទាញ...' : 'Refreshing...') : 'Refresh'}</span>
            </button>
          )}
          {onOpenCreateAccount && (
            <button
              type="button"
              onClick={onOpenCreateAccount}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-2xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t.openAccount || 'New Account'}</span>
            </button>
          )}
        </div>
      </div>

      {/* AdminLTE 4 Data Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-3.5">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-gray-800">
              {lang === 'kh' ? 'បញ្ជីគណនីអតិថិជនសកម្ម' : 'Customer Accounts Ledger'}
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              ({filtered.length} total entries)
            </span>
          </div>

          {/* Right: Filter rows... Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter rows..."
              className="pl-8 pr-3 py-1 text-xs rounded border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 w-52 sm:w-64"
            />
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded shadow-2xs transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-gray-500" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-gray-500" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Pill Switcher */}
            <div className="flex items-center bg-gray-100 border border-gray-200 rounded p-0.5 text-xs font-medium">
              {['ALL', 'SAVINGS', 'CHECKING'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-0.5 rounded transition-all ${
                    filterType === type
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-semibold">
                <th className="py-2.5 px-3 w-12">
                  <div className="flex items-center justify-between">
                    <span>#</span>
                    <span className="text-[10px] text-gray-400">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center justify-between">
                    <span>Name</span>
                    <span className="text-[10px] text-gray-400">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center justify-between">
                    <span>Account Number</span>
                    <span className="text-[10px] text-gray-400">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center justify-between">
                    <span>Type</span>
                    <span className="text-[10px] text-gray-400">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>Balance</span>
                    <span className="text-[10px] text-gray-400">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>Status</span>
                    <span className="text-[10px] text-gray-400">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center justify-between">
                    <span>Joined</span>
                    <span className="text-[10px] text-gray-400">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-gray-100 text-gray-700 font-normal">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400">
                    No matching accounts found.
                  </td>
                </tr>
              ) : (
                paginated.map((acc, index) => (
                  <tr key={acc.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-gray-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-gray-900">
                      {acc.customerName || `Customer #${acc.customerId}`}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-blue-600">
                      {acc.accountNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.accountType === 'SAVINGS' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-gray-900">
                      ${(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white ${
                        acc.status === 'LOCKED'
                          ? 'bg-[#6c757d]'
                          : 'bg-[#28a745]'
                      }`}>
                        {acc.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">
                      {acc.createdAt ? new Date(acc.createdAt).toISOString().slice(0, 10) : '2024-03-12'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDeposit && onOpenDeposit(acc.accountNumber)}
                          className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] border border-emerald-200 transition-colors"
                        >
                          + Dep
                        </button>
                        <button
                          onClick={() => onOpenWithdraw && onOpenWithdraw(acc.accountNumber)}
                          className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px] border border-amber-200 transition-colors"
                        >
                          - With
                        </button>
                        <button
                          onClick={() => onOpenTransfer && onOpenTransfer(acc.accountNumber)}
                          className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] border border-blue-200 transition-colors"
                        >
                          Transfer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Data Table Footer: Active Pagination */}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filtered.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>

    {/* 2. OFFICIAL BANK LEDGER REPORT (PRINT / PDF ONLY VIEW) */}
    <OfficialReportPrint
      reportTitleKh="របាយការណ៍បញ្ជីគណនីប្រាក់បញ្ញើ និងទុនបម្រុងអតិថិជន"
      reportTitleEn="OFFICIAL CUSTOMER DEPOSITORY ACCOUNTS LEDGER REPORT"
      reportRef={`ACC-RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0492`}
      summaryCards={[
        { label: 'Total Client Accounts', value: accounts.length, subtext: 'Commercial Accounts Active' },
        { 
          label: 'Total Depository Balance', 
          value: `$${accounts.reduce((s, a) => s + (parseFloat(a.balance) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
          subtext: 'NBC Reserve Backed' 
        },
        { label: 'Savings Accounts', value: accounts.filter(a => a.accountType === 'SAVINGS').length, subtext: 'Standard Interest Bearing' },
        { label: 'Checking Accounts', value: accounts.filter(a => a.accountType === 'CHECKING').length, subtext: 'Transactional Vault' },
      ]}
      columns={[
        { header: '#', width: '30px', align: 'center', render: (_, i) => i + 1 },
        { header: 'Account Holder / ម្ចាស់គណនី', render: (a) => a.customerName || `Customer #${a.customerId}` },
        { header: 'Account Number / លេខគណនី', width: '130px', render: (a) => <span className="font-mono font-bold text-blue-900">{a.accountNumber}</span> },
        { header: 'Type / ប្រភេទ', align: 'center', width: '80px', render: (a) => a.accountType },
        { header: 'Current Balance ($)', align: 'right', width: '120px', render: (a) => (
          <span className="font-mono font-extrabold text-slate-900">
            ${(a.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        )},
        { header: 'Status', align: 'center', width: '70px', render: (a) => (
          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${a.status === 'LOCKED' ? 'border-rose-600 text-rose-800 bg-rose-50' : 'border-emerald-600 text-emerald-800 bg-emerald-50'}`}>
            {a.status === 'LOCKED' ? 'Locked' : 'Active'}
          </span>
        )},
        { header: 'Opened Date', width: '80px', align: 'center', render: (a) => a.createdAt ? new Date(a.createdAt).toISOString().slice(0, 10) : '2024-03-12' },
      ]}
      data={filtered}
    />
  </div>
  );
}