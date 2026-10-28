import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  User, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  Lock,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ViewUserModal({ isOpen, onClose, user: staffUser }) {
  const { lang } = useAuth();
  const { theme } = useTheme();

  if (!isOpen || !staffUser) return null;

  const roleLabels = {
    SUPER_ADMIN: { en: 'Super Administrator', kh: 'អ្នកគ្រប់គ្រងប្រព័ន្ធជាន់ខ្ពស់', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    ROLE_ADMIN: { en: 'System Administrator', kh: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    ADMIN: { en: 'System Administrator', kh: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    TELLER_SENIOR: { en: 'Senior Cash Teller', kh: 'បេឡាករជាន់ខ្ពស់', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    TELLER_JUNIOR: { en: 'Junior Cash Teller', kh: 'បេឡាករ', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
    ROLE_USER: { en: 'Teller Officer', kh: 'មន្ត្រីបេឡា', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    TELLER: { en: 'Teller Officer', kh: 'មន្ត្រីបេឡា', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    COMPLIANCE_OFFICER: { en: 'Compliance & Audit Officer', kh: 'មន្ត្រីត្រួតពិនិត្យអនុលោមភាព', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    COMPLIANCE: { en: 'Compliance Officer', kh: 'មន្ត្រីអនុលោមភាព', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  };

  const currentRole = roleLabels[staffUser.role] || {
    en: staffUser.role || 'Bank Staff',
    kh: staffUser.role || 'បុគ្គលិកធនាគារ',
    color: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#0a101f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-blue-500/20 border border-blue-400/30">
              {staffUser.fullName ? staffUser.fullName[0] : (staffUser.username?.[0]?.toUpperCase() || 'U')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {staffUser.fullName || staffUser.username}
                </h3>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${currentRole.color}`}>
                  {staffUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                @{staffUser.username} • Terminal Node: {staffUser.terminalId || '#TB-0492'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Identity & Role Badge Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                {lang === 'kh' ? 'តួនាទី & ភារកិច្ចផ្លូវការ' : 'Official Role & Title'}
              </div>
              <div className="text-sm font-bold text-white">
                {lang === 'kh' ? currentRole.kh : currentRole.en}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {staffUser.status || 'ACTIVE'}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Box 1: Location & Node */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>{lang === 'kh' ? 'សាខា & ស្ថានីយ' : 'Branch & Terminal Node'}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block">Branch Assignment:</span>
                  <span className="font-semibold text-slate-200">{staffUser.branch || 'Head Office (Phnom Penh)'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Workstation ID:</span>
                  <span className="font-mono font-bold text-blue-400">{staffUser.terminalId || 'TB-0492'}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Contact Details */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'kh' ? 'ទំនាក់ទំនង' : 'Contact Information'}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block">Corporate Email:</span>
                  <span className="font-mono text-slate-200">{staffUser.email || `${staffUser.username}@trustbank.com`}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Phone Extension:</span>
                  <span className="font-mono text-slate-200">{staffUser.phoneNumber || '+855 (0) 23 999 888'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Access Permissions */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'kh' ? 'សិទ្ធិប្រតិបត្តិការ & សុវត្ថិភាព' : 'Security Clearance & Permissions'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Core Banking Terminal Access</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Teller Cash Transactions</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Customer KYC Ledger Verification</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Audit Trail Logging Enabled</span>
              </div>
            </div>
          </div>

          {/* Last Activity Ribbon */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'kh' ? 'សកម្មភាពចុងក្រោយ' : 'Last Session Activity'}:</span>
              <span className="text-slate-200 font-bold">{staffUser.lastLogin || 'Just now'}</span>
            </div>
            <span className="text-emerald-400 font-bold">Authorized Session</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-end bg-slate-900/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-md active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
            }}
          >
            {lang === 'kh' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
