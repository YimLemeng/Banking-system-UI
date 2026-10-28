import React, { useState } from 'react';
import { 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building2,
  Terminal,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  BadgeCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/api';

export default function StaffProfile({ onNotify }) {
  const { user, lang, isAdmin } = useAuth();
  const { theme } = useTheme();

  // Form Fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Submission Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError(lang === 'kh' ? 'សូមបំពេញព័ត៌មានគ្រប់ប្រអប់' : 'All password fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setError(lang === 'kh' ? 'លេខសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' : 'New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError(lang === 'kh' ? 'លេខសម្ងាត់ថ្មី និងផ្ទៀងផ្ទាត់លេខសម្ងាត់មិនត្រូវគ្នាទេ' : 'New password and confirm new password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError(lang === 'kh' ? 'លេខសម្ងាត់ថ្មីមិនអាចដូចលេខសម្ងាត់បច្ចុប្បន្នបានទេ' : 'New password cannot be the same as current password.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      const successMsg = res.data?.message || (lang === 'kh' ? 'បានផ្លាស់ប្តូរលេខសម្ងាត់ដោយជោគជ័យ!' : 'Password changed successfully!');
      setSuccess(successMsg);
      if (onNotify) {
        onNotify(successMsg, 'success');
      }

      // Reset form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Change password failed:', err);
      const errMsg = err.response?.data?.message || (lang === 'kh' ? 'បរាជ័យក្នុងការប្តូរលេខសម្ងាត់ សូមពិនិត្យលេខសម្ងាត់បច្ចុប្បន្ន' : 'Failed to change password. Please verify current password.');
      setError(errMsg);
      if (onNotify) {
        onNotify(errMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.fullName || (isAdmin ? 'System Administrator' : user?.username || 'Bank Officer');
  const roleName = isAdmin ? 'SYSTEM ADMINISTRATOR' : (user?.role?.replace('ROLE_', '') || 'BANK TELLER');
  const emailDisplay = user?.email || (user?.username === 'admin' ? 'admin@banking.com' : `${user?.username || 'officer'}@trustbank.kh`);
  const phoneDisplay = user?.phoneNumber || '012 345 678';
  const terminalId = isAdmin ? 'TB-0492' : 'TB-0104';
  const branchName = 'Head Office (Phnom Penh Main Branch)';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 pt-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <span>{lang === 'kh' ? 'ប្រវត្តិរូប និងសុវត្ថិភាពគណនី' : 'Staff Profile & Security'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'kh'
              ? 'គ្រប់គ្រងព័ត៌មានអត្តសញ្ញាណបុគ្គលិក កម្រិតសិទ្ធិប្រើប្រាស់ប្រព័ន្ធ និងផ្លាស់ប្តូរលេខសម្ងាត់សុវត្ថិភាព'
              : 'Officer identity profile, terminal privileges, and cryptographic credential management'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'kh' ? 'សម័យប្រតិបត្តិការកំពុងសកម្ម' : 'Active JWT Session'}</span>
          </span>
        </div>
      </div>

      {/* Grid: Profile Card on left/top, Change Password on right/bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Profile Card (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Profile Header Block */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800/80">
              <div className="relative mb-3">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl border ${
                  isAdmin 
                    ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 border-blue-400/40 shadow-blue-500/25'
                    : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 border-emerald-400/40 shadow-emerald-500/25'
                }`}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#090e1a] flex items-center justify-center shadow-md" title="Online">
                  <CheckCircle2 className="w-3 h-3 text-[#090e1a]" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-white tracking-wide">
                {displayName}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                @{user?.username || 'admin'}
              </p>

              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase border shadow-sm ${
                  isAdmin
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                }`}>
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>{roleName}</span>
                </span>
              </div>
            </div>

            {/* Details List */}
            <div className="pt-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'kh' ? 'អ៊ីមែល' : 'Email Address'}</span>
                </span>
                <span className="text-slate-200 font-medium font-mono text-[11px] truncate max-w-[180px]">
                  {emailDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}</span>
                </span>
                <span className="text-slate-200 font-medium font-mono text-[11px]">
                  {phoneDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'kh' ? 'លេខស្ថានីយ' : 'Terminal ID'}</span>
                </span>
                <span className="text-cyan-400 font-semibold font-mono text-[11px]">
                  #{terminalId}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'kh' ? 'សាខា' : 'Branch'}</span>
                </span>
                <span className="text-slate-200 font-medium truncate max-w-[170px]" title={branchName}>
                  {branchName}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'kh' ? 'សុវត្ថិភាព' : 'Security Level'}</span>
                </span>
                <span className="text-emerald-400 font-bold">
                  {isAdmin ? 'Tier 1 • Admin Access' : 'Tier 2 • Teller Access'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form (7 Cols on Desktop) */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800/80 shadow-2xl relative">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'kh' ? 'ផ្លាស់ប្តូរលេខសម្ងាត់ថ្មី' : 'Change Security Password'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'kh'
                    ? 'កំណត់លេខសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នកដើម្បីបង្កើនសុវត្ថិភាព'
                    : 'Update your officer account authentication key with high-entropy pass'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'kh' ? 'លេខសម្ងាត់បច្ចុប្បន្ន' : 'Current Password'} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'kh' ? 'លេខសម្ងាត់ថ្មី (យ៉ាងតិច ៦ តួអក្សរ)' : 'New Password (min 6 characters)'} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'kh' ? 'ផ្ទៀងផ្ទាត់លេខសម្ងាត់ថ្មី' : 'Confirm New Password'} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Checklist Helper */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] space-y-1.5">
                <div className="font-semibold text-slate-400">
                  {lang === 'kh' ? 'លក្ខខណ្ឌសុវត្ថិភាពលេខសម្ងាត់៖' : 'Password Security Rules:'}
                </div>
                <div className={`flex items-center gap-1.5 ${newPassword.length >= 6 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'kh' ? 'មានយ៉ាងតិច ៦ តួអក្សរ' : 'At least 6 characters in length'}</span>
                </div>
                <div className={`flex items-center gap-1.5 ${newPassword && confirmNewPassword && newPassword === confirmNewPassword ? 'text-emerald-400' : 'text-slate-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'kh' ? 'លេខសម្ងាត់ទាំងពីរដូចគ្នា' : 'New password and confirm match'}</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'kh' ? 'កំពុងធ្វើបច្ចុប្បន្នភាព...' : 'Updating Password...'}</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 transition-transform group-hover:rotate-45" />
                      <span>{lang === 'kh' ? 'ផ្លាស់ប្តូរលេខសម្ងាត់' : 'Save New Password'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
