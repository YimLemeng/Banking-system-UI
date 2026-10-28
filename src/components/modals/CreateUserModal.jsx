import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  UserPlus, 
  Lock, 
  Phone, 
  Mail, 
  User, 
  Loader2, 
  ChevronDown,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function CreateUserModal({ isOpen, onClose, onUserCreated }) {
  const { lang } = useAuth();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    phoneNumber: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    branch: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        phoneNumber: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        branch: '',
      });
      setError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.role) {
      setError(lang === 'kh' ? 'សូមជ្រើសរើសតួនាទី (Role & Permissions)' : 'Please select a role & permissions');
      return;
    }

    if (!formData.branch) {
      setError(lang === 'kh' ? 'សូមជ្រើសរើសសាខា (Branch Assignment)' : 'Please select a branch assignment');
      return;
    }

    if (formData.password.length < 6) {
      setError(lang === 'kh' ? 'លេខសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ ខ្ទង់' : 'Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(lang === 'kh' ? 'លេខសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ' : 'Password and Confirm Password do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register({
        phoneNumber: formData.phoneNumber,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role === 'ADMIN' ? 'ROLE_ADMIN' : 'ROLE_TELLER',
      });

      if (onUserCreated) {
        onUserCreated(res.data, lang === 'kh' ? `បានបង្កើតអ្នកប្រើប្រាស់ "${formData.username}" ដោយជោគជ័យ!` : `User "${formData.username}" created successfully!`);
      }
      onClose();
    } catch (err) {
      console.error('Backend register error:', err);
      const msg = err.response?.data?.message || err.message || (lang === 'kh' ? 'ការបង្កើតអ្នកប្រើប្រាស់មិនជោគជ័យ' : 'Failed to register user');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-[#0a101f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header - Clean, No Token, No Swagger URLs */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {lang === 'kh' ? 'បង្កើតគណនីអ្នកប្រើប្រាស់' : 'Create System User'}
              </h3>
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
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. teller.dara"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'kh' ? 'លេខទូរស័ព្ទ *' : 'Phone Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="e.g. 012888777"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'kh' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="dara.chan@trustbank.com"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'kh' ? 'តួនាទី & សិទ្ធិប្រើប្រាស់ *' : 'Role & Permissions *'}
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`appearance-none w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-xs focus:outline-none focus:border-blue-500 cursor-pointer transition-colors shadow-sm ${
                      !formData.role ? 'text-slate-400' : 'text-white'
                    }`}
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">Select...</option>
                    <option value="TELLER" className="bg-slate-900 text-white">TELLER (Cash & Operations)</option>
                    <option value="ADMIN" className="bg-slate-900 text-white">ADMIN (Full Security Access)</option>
                    <option value="COMPLIANCE" className="bg-slate-900 text-white">COMPLIANCE OFFICER</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {lang === 'kh' ? 'សាខាបម្រើការងារ *' : 'Branch Assignment *'}
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className={`appearance-none w-full pl-3.5 pr-9 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-xs focus:outline-none focus:border-blue-500 cursor-pointer transition-colors shadow-sm ${
                      !formData.branch ? 'text-slate-400' : 'text-white'
                    }`}
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">Select...</option>
                    <option value="Head Office (Phnom Penh)" className="bg-slate-900 text-white">Head Office (Phnom Penh)</option>
                    <option value="Tuol Kouk Branch" className="bg-slate-900 text-white">Tuol Kouk Branch</option>
                    <option value="BKK1 Branch" className="bg-slate-900 text-white">BKK1 Branch</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <ChevronDown className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password with Visibility Toggle Eyes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password * (Min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-blue-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-blue-400" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {lang === 'kh' ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer disabled:opacity-75"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === 'kh' ? 'កំពុងបង្កើតគណនី...' : 'Creating User...'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{lang === 'kh' ? 'បង្កើតអ្នកប្រើប្រាស់' : 'Create User'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
