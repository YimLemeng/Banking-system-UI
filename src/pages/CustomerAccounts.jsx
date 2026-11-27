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
      {/* Classic Heritage Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="classic-page-title">
          {t.customerAccounts}
        </h1>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefresh && (
            <button
              type="button"
              onClick={handleRefreshClick}
              disabled={refreshing}
              className="classic-btn-secondary flex items-center gap-1.5 py-1.5 px-3 disabled:opacity-60"
              title="Refresh Accounts"
            >
              <RotateCw className={`w-3.5 h-3.5 text-slate-800 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? (lang === 'kh' ? 'កំពុងទាញ...' : 'Refreshing...') : (lang === 'kh' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Refresh')}</span>
            </button>
          )}
          {onOpenCreateAccount && (
            <button
              type="button"
              onClick={onOpenCreateAccount}
              className="classic-btn-primary py-1.5 px-3"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{lang === 'kh' ? 'បើកគណនីថ្មី' : (t.openAccount || 'New Account')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Classic Heritage Data Table Card */}
      <div className="classic-table-card">
        {/* Card Header */}
        <div className="classic-table-header">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-800 tracking-wide">
              {lang === 'kh' ? 'បញ្ជីគណនីអតិថិជនសកម្ម' : 'Customer Accounts Ledger'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              ({filtered.length} {lang === 'kh' ? 'កំណត់ត្រាសរុប' : 'total entries'})
            </span>
          </div>

          {/* Right: Filter rows... Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'kh' ? 'ស្វែងរកទិន្នន័យ...' : 'Filter rows...'}
              className="classic-input pl-8 pr-3 py-1 w-52 sm:w-64"
            />
          </div>
        </div>

        <div className="p-5 space-y-3.5">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="classic-toolbar-btn"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'kh' ? 'នាំចេញ CSV' : 'Export CSV'}</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="classic-toolbar-btn"
            >
              <FileCode className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'kh' ? 'នាំចេញ JSON' : 'Export JSON'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="classic-toolbar-btn"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'kh' ? 'បោះពុម្ព' : 'Print'}</span>
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
        <div className="erp-table-wrap">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-12">
                  <div className="flex items-center justify-between gap-1">
                    <span>#</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'ឈ្មោះ' : 'Name'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'លេខគណនី' : 'Account Number'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'ប្រភេទ' : 'Type'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span>{lang === 'kh' ? 'សមតុល្យ' : 'Balance'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'ថ្ងៃបើកគណនី' : 'Joined'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th className="text-right">{lang === 'kh' ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    No matching accounts found.
                  </td>
                </tr>
              ) : (
                paginated.map((acc, index) => (
                  <tr key={acc.id}>
                    <td className="font-mono text-slate-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="font-semibold text-slate-800">
                      {acc.customerName || `Customer #${acc.customerId}`}
                    </td>
                    <td className="font-mono font-medium text-blue-600">
                      {acc.accountNumber}
                    </td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.accountType === 'SAVINGS' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="text-right font-mono font-bold text-slate-900">
                      ${(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-center">
                      <span className={acc.status === 'LOCKED' ? 'erp-status-muted' : 'erp-status-active'}>
                        {lang === 'kh' ? (acc.status === 'LOCKED' ? 'ចាក់សោរ' : 'សកម្ម') : (acc.status || 'Active')}
                      </span>
                    </td>
                    <td className="text-slate-500 font-mono text-[11px]">
                      {acc.createdAt ? new Date(acc.createdAt).toISOString().slice(0, 10) : '2024-03-12'}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDeposit && onOpenDeposit(acc.accountNumber)}
                          className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] border border-emerald-200 transition-colors cursor-pointer"
                        >
                          {lang === 'kh' ? '+ ដាក់ប្រាក់' : '+ Dep'}
                        </button>
                        <button
                          onClick={() => onOpenWithdraw && onOpenWithdraw(acc.accountNumber)}
                          className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px] border border-amber-200 transition-colors cursor-pointer"
                        >
                          {lang === 'kh' ? '- ដកប្រាក់' : '- With'}
                        </button>
                        <button
                          onClick={() => onOpenTransfer && onOpenTransfer(acc.accountNumber)}
                          className="erp-btn-view"
                        >
                          {lang === 'kh' ? 'ផ្ទេរប្រាក់' : 'Transfer'}
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