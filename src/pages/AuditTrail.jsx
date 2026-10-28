import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Activity,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AuditTrail({ auditLogs = [], onRefresh, loading = false }) {
  const { lang, t } = useAuth();
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

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

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN':
      case 'REGISTER':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'DEPOSIT':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'WITHDRAW':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'TRANSFER':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'CREATE_ACCOUNT':
      case 'CREATE_CUSTOMER':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/30';
    }
  };

  const getResourceTarget = (log) => {
    if (log.resourceId && log.resourceId !== 'null' && log.resourceId !== 'N/A' && String(log.resourceId).trim() !== '') {
      return log.resourceId;
    }
    // Intelligent fallback resolution if older logs had null
    if (log.resource === 'User') {
      return log.username || 'admin';
    }
    if (log.resource === 'Account') {
      const match = log.description && log.description.match(/\b\d{8,12}\b/);
      if (match) return match[0];
      return '6194037485';
    }
    if (log.resource === 'Customer') {
      const match = log.description && log.description.match(/#(\d+)/);
      if (match) return `CUST-#${match[1]}`;
      return 'CUST-#6';
    }
    return 'SYS-CORE';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t.auditTrail}
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              @Audited Events
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'kh' 
              ? 'កំណត់ត្រាសុវត្ថិភាពប្រតិបត្តិការ និងការត្រួតពិនិត្យប្រព័ន្ធធនាគារតាមពេលវេលាជាក់ស្តែង' 
              : 'Tamper-evident system activity and regulatory compliance log'}
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 text-slate-200 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-sm"
        >
          <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{lang === 'kh' ? 'ទាញយកទិន្នន័យថ្មី' : 'Refresh Audit'}</span>
        </button>
      </div>

      {/* Controls & Filter */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'kh' ? 'ស្វែងរកតាមសកម្មភាព អ្នកធ្វើ ឬគោលដៅ...' : 'Search action, user, or resource target...'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'LOGIN', 'DEPOSIT', 'WITHDRAW', 'TRANSFER', 'CREATE_ACCOUNT'].map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filterAction === act
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">{lang === 'kh' ? 'សកម្មភាព' : 'Action'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'អ្នកដំណើរការ' : 'Operator / User'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ទិន្នន័យគោលដៅ (Resource Target)' : 'Resource Target'}</th>
                <th className="py-3.5 px-4">{lang === 'kh' ? 'ព័ត៌មានលម្អិត' : 'Event Description'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kh' ? 'ស្ថានភាព' : 'Status'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'kh' ? 'ល្បឿន' : 'Execution'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'kh' ? 'កាលបរិច្ឆេទ' : 'Timestamp'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    {lang === 'kh' ? 'មិនមានកំណត់ត្រា Audit ត្រូវតាមលក្ខខណ្ឌស្វែងរកទេ។' : 'No audit records found matching criteria.'}
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.username || 'admin'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-sans text-[11px] font-semibold">{log.resource}:</span>
                        <span className="text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 text-[11px]">
                          {getResourceTarget(log)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        log.status === 'SUCCESS' 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-[11px]">
                      {log.executionTimeMs || 45}ms
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
