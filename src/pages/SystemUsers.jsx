import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Building, 
  RotateCw,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';
import ViewUserModal from '../components/modals/ViewUserModal';
import CreateUserModal from '../components/modals/CreateUserModal';
import TablePagination from '../components/TablePagination';
import OfficialReportPrint from '../components/OfficialReportPrint';
import { userService } from '../services/api';

export default function SystemUsers({ onRefresh }) {
  const { user, lang, t, isAdmin } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      const data = res.data;
      if (Array.isArray(data)) {
        setUsersList(data);
      }
    } catch (err) {
      console.warn('Could not fetch users from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefreshClick = async () => {
    await withLoading(
      lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យអ្នកប្រើប្រាស់ប្រព័ន្ធ...' : 'Refreshing System Users Directory...',
      async () => {
        if (onRefresh) await onRefresh();
        await fetchUsers();
      },
      500,
      lang === 'kh' ? 'សូមរង់ចាំមួយភ្លែត ប្រព័ន្ធកំពុងធ្វើបច្ចុប្បន្នភាពទិន្នន័យពី Server...' : 'Please wait while the system updates users directory...'
    );
  };

  const filtered = usersList.filter(u => {
    const fullName = (u.fullName || u.username || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) ||
      (u.username || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query) ||
      (u.role || '').toLowerCase().includes(query);
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* 1. SCREEN VIEW (Visible on web app, hidden when printing) */}
      <div className="screen-only-report space-y-4 pb-8">
      {/* Classic Heritage Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="classic-page-title">
          {t.systemUsers}
        </h1>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={loading}
            className="classic-btn-secondary flex items-center gap-1.5 py-1.5 px-3 disabled:opacity-60"
            title="Refresh Users"
          >
            <RotateCw className={`w-3.5 h-3.5 text-slate-800 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? (lang === 'kh' ? 'កំពុងទាញ...' : 'Refreshing...') : (lang === 'kh' ? 'ធ្វើបច្ចុប្បន្នភាព' : 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* Classic Heritage Data Table Card */}
      <div className="classic-table-card">
        {/* Card Header: Users on left, Filter rows on right */}
        <div className="classic-table-header">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-800 tracking-wide">
              {lang === 'kh' ? 'អ្នកប្រើប្រាស់ប្រព័ន្ធ' : 'Users'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              ({filtered.length} {lang === 'kh' ? 'មន្ត្រីសកម្ម' : 'live staff entries'})
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
                    <span>{lang === 'kh' ? 'អ៊ីមែល' : 'Email'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th>
                  <div className="flex items-center justify-between gap-1">
                    <span>{lang === 'kh' ? 'តួនាទី' : 'Role'}</span>
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
                    <span>{lang === 'kh' ? 'ថ្ងៃចូលបម្រើការ' : 'Joined'}</span>
                    <span className="text-[10px] text-slate-400">↑↓</span>
                  </div>
                </th>
                <th className="text-right">{lang === 'kh' ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    {loading ? 'Loading system users...' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                paginated.map((usr, index) => (
                  <tr key={usr.id}>
                    <td className="font-mono text-slate-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {(usr.fullName || usr.username || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {usr.fullName || usr.username}
                        </span>
                      </div>
                    </td>
                    <td className="text-slate-600 font-mono text-[11px]">
                      {usr.email || `${usr.username}@trustbank.com`}
                    </td>
                    <td className="text-slate-700">
                      {usr.role ? String(usr.role).replace('ROLE_', '') : 'Admin'}
                    </td>
                    <td className="text-center">
                      <span className={
                        usr.status === 'SUSPENDED' 
                          ? 'erp-status-muted' 
                          : usr.status === 'INVITED' 
                          ? 'erp-status-info' 
                          : 'erp-status-active'
                      }>
                        {lang === 'kh'
                          ? (usr.status === 'SUSPENDED' ? 'ផ្អាក' : usr.status === 'INVITED' ? 'បានអញ្ជើញ' : 'សកម្ម')
                          : (usr.status || 'Active')}
                      </span>
                    </td>
                    <td className="text-slate-500 font-mono text-[11px]">
                      {usr.createdAt ? new Date(usr.createdAt).toISOString().slice(0, 10) : '2024-03-12'}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(usr);
                          setShowViewModal(true);
                        }}
                        className="erp-btn-view"
                        title={lang === 'kh' ? 'មើលព័ត៌មានលម្អិត' : 'View Staff Details'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{lang === 'kh' ? 'មើល' : 'View'}</span>
                      </button>
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

      {/* View User Modal */}
      <ViewUserModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserCreated={fetchUsers}
      />
    </div>

    {/* 2. OFFICIAL BANK LEDGER REPORT (PRINT / PDF ONLY VIEW) */}
    <OfficialReportPrint
      reportTitleKh="បញ្ជីឈ្មោះមន្ត្រីធនាគារ និងអ្នកប្រើប្រាស់ប្រព័ន្ធស្នូល"
      reportTitleEn="OFFICIAL SYSTEM OFFICERS & USER ACCESS LEDGER REPORT"
      reportRef={`USR-RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-0492`}
      summaryCards={[
        { label: 'Total Bank Staff', value: usersList.length, subtext: 'Registered Terminal Officers' },
        { label: 'Active Access', value: usersList.filter(u => u.status !== 'SUSPENDED').length, subtext: 'Operational Staff' },
        { label: 'Administrators', value: usersList.filter(u => String(u.role).includes('ADMIN')).length, subtext: 'Security & Root Access' },
        { label: 'Security Standard', value: 'RBAC Level 4', subtext: '256-Bit Authentication' },
      ]}
      columns={[
        { header: '#', width: '30px', align: 'center', render: (_, i) => i + 1 },
        { header: 'Full Name / ឈ្មោះមន្ត្រីធនាគារ', render: (u) => u.fullName || u.username },
        { header: 'Officer ID / Username', accessor: 'username' },
        { header: 'Official Email', render: (u) => u.email || `${u.username}@trustbank.com` },
        { header: 'Role / តួនាទី', render: (u) => String(u.role || 'USER').replace('ROLE_', '') },
        { header: 'Status', align: 'center', width: '70px', render: (u) => (
          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${u.status === 'SUSPENDED' ? 'border-rose-600 text-rose-800 bg-rose-50' : 'border-emerald-600 text-emerald-800 bg-emerald-50'}`}>
            {u.status || 'Active'}
          </span>
        )},
        { header: 'Created Date', width: '80px', align: 'center', render: (u) => u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : '2024-03-12' },
      ]}
      data={filtered}
    />
  </div>
  );
}