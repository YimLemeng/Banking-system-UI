import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  Clock, 
  Building, 
  Lock,
  Copy,
  Check,
  RotateCw,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ViewUserModal from '../components/modals/ViewUserModal';
import { userService } from '../services/api';

export default function SystemUsers({ onRefresh }) {
  const { user, lang, t } = useAuth();
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);

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
    if (onRefresh) onRefresh();
    await fetchUsers();
  };

  const filtered = usersList.filter(u => 
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {lang === 'kh' ? 'អ្នកប្រើប្រាស់ប្រព័ន្ធ (System Users)' : 'System Users & Access Control'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'kh' 
              ? 'គ្រប់គ្រងគណនីបុគ្គលិកធនាគារ សិទ្ធិប្រើប្រាស់ និងស្ថានីយប្រតិបត្តិការ (ទិន្នន័យផ្ទាល់ពី Database)' 
              : 'Authorized banking personnel directory, role permissions, and terminal credentials (Live from Database)'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefreshClick}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 border border-slate-700/80 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            title="Refresh System Users"
          >
            <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{lang === 'kh' ? 'ទាញទិន្នន័យថ្មី' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search system user by name, username, or role..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> live database staff accounts
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role & Access</th>
                <th className="py-3.5 px-4">Branch Location</th>
                <th className="py-3.5 px-4">Terminal Node</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'សកម្មភាព' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    {loading ? (lang === 'kh' ? 'កំពុងទាញយកទិន្នន័យ User...' : 'Loading users from database...') : (lang === 'kh' ? 'មិនមានអ្នកប្រើប្រាស់' : 'No users found.')}
                  </td>
                </tr>
              ) : (
                filtered.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                          {(usr.fullName || usr.username || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{usr.fullName || usr.username}</div>
                          <div className="text-[11px] text-slate-400 font-mono">@{usr.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {usr.role ? String(usr.role).replace('ROLE_', '') : 'USER'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{usr.branch || 'Head Office (Phnom Penh)'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                      {usr.terminalId || `TB-${String(usr.id).padStart(4, '0')}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {usr.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {usr.lastLogin || (usr.updatedAt ? new Date(usr.updatedAt).toLocaleTimeString() : 'Active')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(usr);
                          setShowViewModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm active:scale-95"
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
      </div>

      {/* Modal to View Staff Details */}
      <ViewUserModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
}
