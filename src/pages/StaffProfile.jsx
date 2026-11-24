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
  BadgeCheck 
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

      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      const errMsg = err.response?.data?.message || (lang === 'kh' ? 'ការផ្លាស់ប្តូរលេខសម្ងាត់បរាជ័យ។ សូមពិនិត្យលេខសម្ងាត់បច្ចុប្បន្នរបស់អ្នក។' : 'Failed to change password. Please check your current password.');
      setError(errMsg);
      if (onNotify) {
        onNotify(errMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.fullName || (user?.username ? user.username.toUpperCase() : 'Administrator');
  const roleName = (user?.role || '').replace('ROLE_', '').toUpperCase() || 'STAFF';
  const emailDisplay = user?.email || `${user?.username || 'admin'}@trustbank.com`;
  const phoneDisplay = user?.phoneNumber || '+855 (0) 23 999 888';
  const branchName = user?.branch || 'Head Office (Phnom Penh)';
  const terminalId = user?.terminalId || 'TB-0492';

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          {lang === 'kh' ? 'ប្រវត្តិរូប និងសុវត្ថិភាពបុគ្គលិក' : 'Staff Profile & Security'}
        </h1>
      </div>

      {/* Grid: Profile Card on left, Change Password on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Profile Card (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 relative overflow-hidden">
            {/* Profile Header Block */}
            <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100">
              <div className="relative mb-3">
                <div className={`w-18 h-18 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-xs border-2 border-white ${
                  isAdmin 
                    ? 'bg-blue-600' 
                    : 'bg-emerald-600'
                }`}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Online" />
              </div>

              <h2 className="text-base font-bold text-gray-800 tracking-wide">
                {displayName}
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                @{user?.username || 'admin'}
              </p>

              <div className="mt-2.5">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white ${
                  isAdmin ? 'bg-amber-500' : 'bg-blue-600'
                }`}>
                  <BadgeCheck className="w-3 h-3" />
                  <span>{roleName}</span>
                </span>
              </div>
            </div>

            {/* Details List */}
            <div className="pt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{lang === 'kh' ? 'អ៊ីមែល' : 'Email Address'}</span>
                </span>
                <span className="text-gray-800 font-medium font-mono text-[11px] truncate max-w-[180px]">
                  {emailDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{lang === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}</span>
                </span>
                <span className="text-gray-800 font-medium font-mono text-[11px]">
                  {phoneDisplay}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-gray-400" />
                  <span>{lang === 'kh' ? 'លេខស្ថានីយ' : 'Terminal ID'}</span>
                </span>
                <span className="text-blue-600 font-semibold font-mono text-[11px]">
                  #{terminalId}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>{lang === 'kh' ? 'សាខា' : 'Branch'}</span>
                </span>
                <span className="text-gray-800 font-medium truncate max-w-[170px]" title={branchName}>
                  {branchName}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'kh' ? 'សុវត្ថិភាព' : 'Security Level'}</span>
                </span>
                <span className="text-emerald-700 font-semibold">
                  {isAdmin ? 'Tier 1 • Admin Access' : 'Tier 2 • Teller Access'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form (7 Cols on Desktop) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 relative">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {lang === 'kh' ? 'ផ្លាស់ប្តូរលេខសម្ងាត់ថ្មី' : 'Change Security Password'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {lang === 'kh'
                    ? 'កំណត់លេខសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នកដើម្បីបង្កើនសុវត្ថិភាព'
                    : 'Update your officer account authentication key with high-entropy pass'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {lang === 'kh' ? 'លេខសម្ងាត់បច្ចុប្បន្ន' : 'Current Password'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 rounded-md bg-white border border-gray-300 text-gray-800 text-xs focus:outline-none focus:border-blue-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {lang === 'kh' ? 'លេខសម្ងាត់ថ្មី (យ៉ាងតិច ៦ តួអក្សរ)' : 'New Password (min 6 characters)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 rounded-md bg-white border border-gray-300 text-gray-800 text-xs focus:outline-none focus:border-blue-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {lang === 'kh' ? 'ផ្ទៀងផ្ទាត់លេខសម្ងាត់ថ្មី' : 'Confirm New Password'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 rounded-md bg-white border border-gray-300 text-gray-800 text-xs focus:outline-none focus:border-blue-500 font-mono transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === 'kh' ? 'កំពុងផ្លាស់ប្តូរលេខសម្ងាត់...' : 'Updating Password...'}</span>
                    </>
                  ) : (
                    <span>{lang === 'kh' ? 'ធ្វើបច្ចុប្បន្នភាពលេខសម្ងាត់' : 'Update Credentials'}</span>
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