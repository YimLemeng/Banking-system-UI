import React, { useState } from 'react';
import { 
  Users2, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  FileText, 
  Edit3, 
  Eye, 
  RotateCw,
  Download,
  FileCode,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TablePagination from '../components/TablePagination';
import OfficialReportPrint from '../components/OfficialReportPrint';

export default function CustomerKYC({ 
  customers = [], 
  onOpenCreateCustomer, 
  onOpenCreateAccount,
  onOpenEditCustomer,
  onOpenViewCustomer,
  onRefresh
}) {
  const { t, lang } = useAuth();
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
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

  const handleView = (cust) => {
    if (onOpenViewCustomer) {
      onOpenViewCustomer(cust);
    }
  };

  const handleEdit = (cust) => {
    if (onOpenEditCustomer) {
      onOpenEditCustomer(cust);
    }
  };

  const handleOpenAccount = (cust) => {
    if (onOpenCreateAccount) {
      onOpenCreateAccount(cust);
    }
  };

  const filtered = customers.filter(c => {
    const full = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
    const query = searchTerm.toLowerCase();
    return full.includes(query) || 
      c.email?.toLowerCase().includes(query) || 
      c.phoneNumber?.includes(query) ||
      c.nationalIdOrPassport?.toLowerCase().includes(query) ||
      c.address?.toLowerCase().includes(query);
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      ["#,First Name,Last Name,Email,Phone,National ID,Address,Status"]
      .concat(filtered.map((c, i) => `${i+1},"${c.firstName || ''}","${c.lastName || ''}","${c.email || ''}","${c.phoneNumber || ''}","${c.nationalIdOrPassport || ''}","${c.address || ''}","${c.status || 'Active'}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_kyc_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `customers_kyc_${new Date().toISOString().slice(0,10)}.json`);
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
          {t.customerKYC}
        </h1>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefresh && (
            <button
              type="button"
              onClick={handleRefreshClick}
              disabled={refreshing}
              className="classic-btn-secondary flex items-center gap-1.5 py-1.5 px-3 disabled:opacity-60"
              title="Refresh KYC Ledger"
            >
              <RotateCw className={`w-3.5 h-3.5 text-slate-800 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? (lang === 'kh' ? 'កំពុងទាញ...' : 'Refreshing...') : (lang === 'kh' ? 'ផ្ទុកឡើងវិញ' : 'Refresh')}</span>
            </button>
          )}
          {onOpenCreateCustomer && (
            <button
              type="button"
              onClick={onOpenCreateCustomer}
              className="classic-btn-primary py-1.5 px-3"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.registerCustomer || (lang === 'kh' ? 'អតិថិជនថ្មី' : 'New Customer')}</span>
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
              {lang === 'kh' ? 'អតិថិជន និងទម្រង់ KYC' : 'Customer Profiles'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'kh' ? `(សរុប ${filtered.length} ធាតុ)` : `(${filtered.length} total entries)`}
            </span>
          </div>

          {/* Right: Filter rows... Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'kh' ? 'ស្វែងរកក្នុងតារាង...' : 'Filter rows...'}
              className="classic-input pl-8 pr-3 py-1 w-52 sm:w-64"
            />
          </div>
        </div>

        <div className="p-5 space-y-3.5">
        {/* Action Toolbar: Export CSV, Export JSON, Print & Customer Actions */}
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
                    <span>{lang === 'kh' ? 'ឈ្មោះ' : 'Name'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'អ៊ីមែល និងទូរស័ព្ទ' : 'Email & Contact'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'អត្តសញ្ញាណប័ណ្ណ / លិខិតឆ្លងដែន' : 'National ID / Passport'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'អាសយដ្ឋាន' : 'Address'}</span>
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
                    <span>{lang === 'kh' ? 'ថ្ងៃចុះឈ្មោះ' : 'Joined'}</span>
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
                    No matching customer profiles found.
                  </td>
                </tr>
              ) : (
                paginated.map((cust, index) => (
                  <tr key={cust.id}>
                    {/* Index */}
                    <td className="font-mono text-slate-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    {/* Customer Name + Avatar */}
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {cust.firstName?.[0]}{cust.lastName?.[0]}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {cust.firstName} {cust.lastName}
                        </span>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="text-slate-600 font-mono text-[11px]">
                      <div>{cust.email || 'N/A'}</div>
                      <div className="text-slate-400">{cust.phoneNumber || ''}</div>
                    </td>

                    {/* National ID / Passport */}
                    <td className="font-mono text-slate-700 text-[11px]">
                      {cust.nationalIdOrPassport || 'N/A'}
                    </td>

                    {/* Address */}
                    <td className="text-slate-600 truncate max-w-[160px]">
                      {cust.address || 'Phnom Penh, Cambodia'}
                    </td>

                    {/* Status Badge */}
                    <td className="text-center">
                      <span className={
                        cust.status === 'SUSPENDED' 
                          ? 'erp-status-muted' 
                          : cust.status === 'INVITED' 
                          ? 'erp-status-info' 
                          : 'erp-status-active'
                      }>
                        {lang === 'kh'
                          ? (cust.status === 'SUSPENDED' ? 'ផ្អាក' : cust.status === 'INVITED' ? 'បានអញ្ជើញ' : 'សកម្ម')
                          : (cust.status || 'Active')}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="text-slate-500 font-mono text-[11px]">
                      {cust.createdAt ? new Date(cust.createdAt).toISOString().slice(0, 10) : '2024-03-12'}
                    </td>

                    {/* Actions (View, Edit, Open Account) */}
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleView(cust)}
                          title={lang === 'kh' ? 'មើលប្រវត្តិរូប' : 'View Profile'}
                          className="erp-btn-view"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{lang === 'kh' ? 'មើល' : 'View'}</span>
                        </button>
                        <button
                          onClick={() => handleEdit(cust)}
                          title={lang === 'kh' ? 'កែប្រែ' : 'Edit Customer'}
                          className="erp-btn-edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenAccount(cust)}
                          title={lang === 'kh' ? 'បើកគណនី' : 'Open Account'}
                          className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] border border-emerald-200 transition-colors cursor-pointer"
                        >
                          {lang === 'kh' ? '+ បើកគណនី' : '+ Account'}
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
      reportTitleKh="របាយការណ៍ផ្ទៀងផ្ទាត់អត្តសញ្ញាណអតិថិជន KYC"
      reportTitleEn="OFFICIAL CUSTOMER KYC & IDENTIFICATION LEDGER REPORT"
      reportRef={`KYC-RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0492`}
      summaryCards={[
        { label: 'Total Clients', value: customers.length, subtext: 'Registered Client Profiles' },
        { label: 'Active KYC', value: customers.filter(c => c.status !== 'SUSPENDED').length, subtext: 'Full Operational Status' },
        { label: 'Suspended', value: customers.filter(c => c.status === 'SUSPENDED').length, subtext: 'Regulatory Hold' },
        { label: 'Audit Standard', value: '100% NBC Verified', subtext: 'Prakas #0492 Compliance' },
      ]}
      columns={[
        { header: '#', width: '30px', align: 'center', render: (_, i) => i + 1 },
        { header: 'Full Name / ឈ្មោះអតិថិជន', render: (c) => `${c.firstName || ''} ${c.lastName || ''}` },
        { header: 'Email Address', accessor: 'email' },
        { header: 'Phone Number', accessor: 'phoneNumber' },
        { header: 'National ID / Passport', accessor: 'nationalIdOrPassport' },
        { header: 'Address / អាសយដ្ឋាន', render: (c) => c.address || 'Phnom Penh, Cambodia' },
        { header: 'Status', align: 'center', width: '70px', render: (c) => (
          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${c.status === 'SUSPENDED' ? 'border-rose-600 text-rose-800 bg-rose-50' : 'border-emerald-600 text-emerald-800 bg-emerald-50'}`}>
            {c.status || 'Active'}
          </span>
        )},
        { header: 'Joined Date', width: '80px', align: 'center', render: (c) => c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : '2024-03-12' },
      ]}
      data={filtered}
    />
  </div>
  );
}