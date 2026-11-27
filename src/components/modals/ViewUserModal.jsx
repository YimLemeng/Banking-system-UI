import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Mail, 
  Building,
  UserCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ViewUserModal({ isOpen, onClose, user: staffUser }) {
  const { lang, t } = useAuth();
  const { theme } = useTheme();

  if (!isOpen || !staffUser) return null;

  const roleLabels = {
    SUPER_ADMIN: { en: 'Super Administrator', kh: 'អ្នកគ្រប់គ្រងប្រព័ន្ធជាន់ខ្ពស់', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    ROLE_ADMIN: { en: 'System Administrator', kh: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    ADMIN: { en: 'System Administrator', kh: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    TELLER_SENIOR: { en: 'Senior Cash Teller', kh: 'បេឡាករជាន់ខ្ពស់', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    TELLER_JUNIOR: { en: 'Junior Cash Teller', kh: 'បេឡាករ', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    ROLE_USER: { en: 'Teller Officer', kh: 'មន្ត្រីបេឡា', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    TELLER: { en: 'Teller Officer', kh: 'មន្ត្រីបេឡា', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    COMPLIANCE_OFFICER: { en: 'Compliance & Audit Officer', kh: 'មន្ត្រីត្រួតពិនិត្យអនុលោមភាព', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    COMPLIANCE: { en: 'Compliance Officer', kh: 'មន្ត្រីអនុលោមភាព', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  const currentRole = roleLabels[staffUser.role] || {
    en: staffUser.role || 'Bank Staff',
    kh: staffUser.role || 'បុគ្គលិកធនាគារ',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl classic-modal flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-[2px] bg-[#3c8dbc] text-white font-extrabold flex items-center justify-center text-sm shadow-sm border border-[#367fa9]">
              {staffUser.fullName ? staffUser.fullName[0] : (staffUser.username?.[0]?.toUpperCase() || 'U')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base tracking-wide">
                  {staffUser.fullName || staffUser.username}
                </h3>
                <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-bold font-mono bg-blue-50 text-[#3c8dbc] border border-blue-200">
                  {staffUser.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                @{staffUser.username} • Terminal Node: {staffUser.terminalId || '#TB-0492'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="classic-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Identity & Role Badge Card */}
          <div className="classic-fieldset flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                {lang === 'kh' ? 'តួនាទី & ភារកិច្ចផ្លូវការ' : 'Official Role & Title'}
              </div>
              <div className="text-sm font-bold text-slate-800">
                {lang === 'kh' ? currentRole.kh : currentRole.en}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {staffUser.status || 'ACTIVE'}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Box 1: Location & Node */}
            <div className="classic-fieldset space-y-2.5">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                <Building className="w-3.5 h-3.5 text-slate-800" />
                <span>{lang === 'kh' ? 'សាខា & ស្ថានីយ' : 'Branch & Terminal Node'}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block">Branch Assignment:</span>
                  <span className="font-semibold text-[#1f2937]">{staffUser.branch || 'Head Office (Phnom Penh)'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Workstation ID:</span>
                  <span className="font-mono font-bold text-slate-800">{staffUser.terminalId || 'TB-0492'}</span>
                </div>
              </div>
            </div>

            {/* Box 2: Contact Details */}
            <div className="classic-fieldset space-y-2.5">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'kh' ? 'ទំនាក់ទំនង' : 'Contact Information'}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-slate-500 block">Corporate Email:</span>
                  <span className="font-mono text-[#1f2937]">{staffUser.email || `${staffUser.username}@trustbank.com`}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Phone Extension:</span>
                  <span className="font-mono text-[#1f2937]">{staffUser.phoneNumber || '+855 (0) 23 999 888'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#d2d6de] flex items-center justify-end bg-[#f7f9fb]">
          <button
            type="button"
            onClick={onClose}
            className="classic-btn-primary"
          >
            {lang === 'kh' ? 'បិទ' : 'Close'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
