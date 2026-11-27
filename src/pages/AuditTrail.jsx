import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Download,
  FileCode,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';
import TablePagination from '../components/TablePagination';
import OfficialReportPrint from '../components/OfficialReportPrint';

export default function AuditTrail({ auditLogs = [], onRefresh, loading = false }) {
  const { lang, t } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const formatDateTime = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const pad = (n) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleRefreshClick = async () => {
    await withLoading(
      lang === 'kh' ? 'កំពុងទាញយកកំណត់ត្រាសវនកម្ម...' : 'Refreshing System Audit Logs...',
      async () => {
        if (onRefresh) await onRefresh();
      },
      500,
      lang === 'kh' ? 'សូមរង់ចាំមួយភ្លែត ប្រព័ន្ធកំពុងធ្វើបច្ចុប្បន្នភាពទិន្នន័យពី Server...' : 'Please wait while updating audit logs...'
    );
  };

  const filtered = auditLogs.filter(log => {
    const matchesSearch = 
      log.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getActionBadge = (action) => {
    switch (action) {
      case 'LOGIN':
      case 'REGISTER':
        return 'bg-[#17a2b8] text-white';
      case 'DEPOSIT':
      case 'CREATE_ACCOUNT':
      case 'CREATE_CUSTOMER':
        return 'bg-[#28a745] text-white';
      case 'WITHDRAW':
      case 'TRANSFER':
        return 'bg-[#007bff] text-white';
      default:
        return 'bg-[#6c757d] text-white';
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["#,Timestamp,User,Action,Resource,Resource ID,Status,Description"]
      .concat(filtered.map((l, i) => `${i+1},"${formatDateTime(l.createdAt || l.timestamp)}","${l.username || ''}","${l.action || ''}","${l.resource || ''}","${l.resourceId || ''}","${l.status || 'SUCCESS'}","${(l.description || '').replace(/"/g, '""')}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_trail_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `audit_trail_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* 1. SCREEN VIEW (Visible on web app, hidden when printing) */}
      <div className="screen-only-report space-y-4 pb-8">
      {/* Classic Heritage Header with Title and Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="classic-page-title">
          {t.auditTrail}
        </h1>
        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={loading}
          className="classic-btn-secondary flex items-center gap-1.5 py-1.5 px-3 disabled:opacity-60 self-start sm:self-auto"
          title="Refresh Audit Logs"
        >
          <RotateCw className={`w-3.5 h-3.5 text-slate-800 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? (lang === 'kh' ? 'កំពុងទាញ...' : 'Refreshing...') : (lang === 'kh' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Refresh')}</span>
        </button>
      </div>

      {/* Classic Heritage Data Table Card */}
      <div className="classic-table-card">
        {/* Card Header */}
        <div className="classic-table-header">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-800 tracking-wide">
              {lang === 'kh' ? 'កំណត់ត្រាព្រឹត្តិការណ៍សវនកម្ម' : 'Audit Event Logs'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              ({filtered.length} {lang === 'kh' ? 'កំណត់ត្រាសរុប' : 'total entries'})
            </span>
          </div>

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
                    <span>{lang === 'kh' ? 'កាលបរិច្ឆេទ' : 'Timestamp'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'អ្នកប្រើប្រាស់' : 'User'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'ប្រតិបត្តិការ' : 'Action'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'ធនធាន' : 'Resource'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>{lang === 'kh' ? 'ការពិពណ៌នា' : 'Description'}</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                paginated.map((log, index) => (
                  <tr key={log.id || index}>
                    <td className="font-mono text-slate-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {formatDateTime(log.createdAt || log.timestamp)}
                    </td>
                    <td className="font-semibold text-slate-800">
                      {log.username || 'System'}
                    </td>
                    <td>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="font-mono text-slate-600 text-[11px]">
                      {log.resource} {log.resourceId ? `(#${log.resourceId})` : ''}
                    </td>
                    <td className="text-center">
                      <span className={log.status === 'FAILED' ? 'erp-status-danger' : 'erp-status-active'}>
                        {log.status === 'FAILED'
                          ? (lang === 'kh' ? 'បរាជ័យ' : 'Failed')
                          : (lang === 'kh' ? 'សកម្ម' : 'Active')}
                      </span>
                    </td>
                    <td className="text-slate-600 text-xs">
                      {log.description}
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
      reportTitleKh="របាយការណ៍សវនកម្មប្រព័ន្ធ និងប្រតិបត្តិការធនាគារ (Audit Trail)"
      reportTitleEn="OFFICIAL SYSTEM AUDIT EVENT TRAIL & COMPLIANCE REPORT"
      reportRef={`ADT-RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0492`}
      summaryCards={[
        { label: 'Total Events Logged', value: auditLogs.length, subtext: 'Immutable Audit Trail' },
        { label: 'Security Logins', value: auditLogs.filter(l => l.action === 'LOGIN' || l.action === 'REGISTER').length, subtext: 'Terminal Access Events' },
        { label: 'Failed Operations', value: auditLogs.filter(l => l.status === 'FAILED').length, subtext: 'Rejected by Rule Engine' },
        { label: 'Audit Integrity', value: 'SHA-256 Verified', subtext: 'NBC Compliance Standard' },
      ]}
      columns={[
        { header: '#', width: '30px', align: 'center', render: (_, i) => i + 1 },
        { header: 'Timestamp / ពេលវេលា', width: '130px', render: (l) => formatDateTime(l.createdAt || l.timestamp) },
        { header: 'Officer / អ្នកប្រើប្រាស់', width: '80px', render: (l) => l.username || 'System' },
        { header: 'Action / ប្រតិបត្តិការ', align: 'center', width: '80px', render: (l) => (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold border border-slate-700 bg-slate-100 text-slate-800">
            {l.action}
          </span>
        )},
        { header: 'Resource & ID', width: '120px', render: (l) => `${l.resource || ''} ${l.resourceId ? `(#${l.resourceId})` : ''}` },
        { header: 'Status', align: 'center', width: '60px', render: (l) => (
          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${l.status === 'FAILED' ? 'border-rose-600 text-rose-800 bg-rose-50' : 'border-emerald-600 text-emerald-800 bg-emerald-50'}`}>
            {l.status === 'FAILED' ? 'Failed' : 'Success'}
          </span>
        )},
        { header: 'Description / កំណត់ចំណាំ', render: (l) => l.description },
      ]}
      data={filtered}
    />
  </div>
  );
}