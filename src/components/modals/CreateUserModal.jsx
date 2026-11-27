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
  const { lang, t } = useAuth();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-xl classic-modal flex flex-col max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3">
            <div className="classic-header-icon">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base tracking-wide">
                {lang === 'kh' ? 'បង្កើតគណនីអ្នកប្រើប្រាស់' : 'Create System User'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Core System Access & Permission Management</p>
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
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="classic-error">
              <AlertCircle className="w-4 h-4 text-[#dd4b39] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="classic-label">
                  Username <span className="text-[#dd4b39]">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. teller.dara"
                    className="classic-input pl-8 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="classic-label">
                  {lang === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone Number'} <span className="text-[#dd4b39]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="e.g. 012888777"
                    className="classic-input pl-8 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="classic-label">
                {lang === 'kh' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="dara.chan@trustbank.com"
                  className="classic-input pl-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="classic-label">
                  {lang === 'kh' ? 'តួនាទី & សិទ្ធិប្រើប្រាស់' : 'Role & Permissions'} <span className="text-[#dd4b39]">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="classic-input appearance-none pr-8 cursor-pointer"
                  >
                    <option value="" disabled>Select...</option>
                    <option value="TELLER">TELLER (Cash & Operations)</option>
                    <option value="ADMIN">ADMIN (Full Security Access)</option>
                    <option value="COMPLIANCE">COMPLIANCE OFFICER</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <label className="classic-label">
                  {lang === 'kh' ? 'សាខាបម្រើការងារ' : 'Branch Assignment'} <span className="text-[#dd4b39]">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="classic-input appearance-none pr-8 cursor-pointer"
                  >
                    <option value="" disabled>Select...</option>
                    <option value="Head Office (Phnom Penh)">Head Office (Phnom Penh)</option>
                    <option value="Tuol Kouk Branch">Tuol Kouk Branch</option>
                    <option value="BKK1 Branch">BKK1 Branch</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-500">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="classic-label">
                  Password (Min 6 chars) <span className="text-[#dd4b39]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="classic-input pl-8 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 text-slate-800" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="classic-label">
                  Confirm Password <span className="text-[#dd4b39]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="classic-input pl-8 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 text-slate-800" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="classic-footer">
              <button
                type="button"
                onClick={onClose}
                className="classic-btn-secondary"
              >
                {lang === 'kh' ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="classic-btn-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'kh' ? 'កំពុងបង្កើតគណនី...' : 'Creating User...'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
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
