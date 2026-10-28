import React from 'react';
import { 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function StaffProfile() {
  const { user, lang, t } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 pt-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {lang === 'kh' ? 'ប្រវត្តិរូប និងសុវត្ថិភាពបុគ្គលិក' : 'Staff Profile & Security'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'kh'
            ? 'ព័ត៌មានលម្អិតអំពីគណនីបុគ្គលិក កម្រិតសិទ្ធិប្រើប្រាស់ និងការគ្រប់គ្រងលេខសម្ងាត់'
            : 'Terminal officer identity details, role permissions, and credential management'}
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20 shrink-0">
            {user?.fullName?.[0] || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">
                {user?.fullName || 'System Administrator'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {user?.role?.replace('ROLE_', '') || 'SUPER_ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Officer ID: #OFFICER-0091 • {user?.username || 'admin'}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active Branch Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Credentials Card */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>{lang === 'kh' ? 'ការកំណត់សុវត្ថិភាពគណនី' : 'Security Credentials & Access'}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {lang === 'kh'
            ? 'លេខសម្ងាត់ត្រូវបានធ្វើបច្ចុប្បន្នភាពកាលពី ១២ ថ្ងៃមុន។ គណនីត្រូវបានការពារដោយ Multi-factor authentication។'
            : 'Password was last updated 12 days ago. Multi-factor authentication is active for this officer account.'}
        </p>
        <div className="pt-2">
          <button
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-700/80 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{lang === 'kh' ? 'ប្តូរលេខសម្ងាត់សុវត្ថិភាព' : 'Change Security Password'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
