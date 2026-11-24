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
      {/* AdminLTE 4 Header with Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          {t.systemUsers}
        </h1>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded shadow-2xs transition-colors disabled:opacity-60 cursor-pointer"
            title="Refresh Users"
          >
            <RotateCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? (lang === 'kh' ? 'កំពុងទាញ...' : 'Refreshing...') : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* AdminLTE 4 Data Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-3.5">
        {/* Card Header: Users on left, Filter rows on right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-gray-800">
              Users
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              ({filtered.length} live staff entries)
            </span>
          </div>

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

        {/* Table exactly matching media_1795500605557_23ea6932.jpg */}
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
                    <span>Email</span>
                    <span className="text-[10px] text-gray-400">▲</span>
                  </div>
                </th>
                <th className="py-2.5 px-3">
                  <div className="flex items-center justify-between">
                    <span>Role</span>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    {loading ? 'Loading system users...' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                paginated.map((usr, index) => (
                  <tr key={usr.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-gray-500">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {(usr.fullName || usr.username || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">
                          {usr.fullName || usr.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 font-mono text-[11px]">
                      {usr.email || `${usr.username}@trustbank.com`}
                    </td>
                    <td className="py-2.5 px-3 text-gray-700">
                      {usr.role ? String(usr.role).replace('ROLE_', '') : 'Admin'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white ${
                        usr.status === 'SUSPENDED' 
                          ? 'bg-[#6c757d]' 
                          : usr.status === 'INVITED' 
                          ? 'bg-[#17a2b8]' 
                          : 'bg-[#28a745]'
                      }`}>
                        {usr.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">
                      {usr.createdAt ? new Date(usr.createdAt).toISOString().slice(0, 10) : '2024-03-12'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(usr);
                          setShowViewModal(true);
                        }}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Staff Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
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