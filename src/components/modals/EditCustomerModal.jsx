import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Edit3, AlertCircle, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { customerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';

export default function EditCustomerModal({ isOpen, onClose, customer, onSuccess }) {
  const { t, lang } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nationalIdOrPassport: '',
    address: '',
    status: 'VERIFIED',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phoneNumber: customer.phoneNumber || '',
        nationalIdOrPassport: customer.nationalIdOrPassport || '',
        address: customer.address || '',
        status: customer.status || 'VERIFIED',
      });
      setError('');
    }
  }, [customer, isOpen]);

  if (!isOpen || !customer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    await withLoading(
      lang === 'kh' ? 'កំពុងកែប្រែទិន្នន័យអតិថិជន...' : 'Loading Customer KYC & Profiles...',
      async () => {
        try {
          const res = await customerService.update(customer.id, formData);
          const updated = res?.data || { ...customer, ...formData };
          onSuccess(`Customer profile for ${formData.firstName} ${formData.lastName} updated!`, updated);
          onClose();
        } catch (err) {
          setError(err.response?.data?.message || err.message || (lang === 'kh' ? 'ការកែប្រែព័ត៌មានអតិថិជនមិនជោគជ័យ' : 'Failed to update customer'));
        }
      },
      650
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-lg classic-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3">
            <div className="classic-header-icon">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base tracking-wide">
                  {lang === 'kh' ? 'កែប្រែព័ត៌មានអតិថិជន' : 'Update Customer Profile'}
                </h3>
                <span className="text-[10px] font-mono text-[#3c8dbc] bg-blue-50 px-2 py-0.5 rounded-[2px] border border-blue-200 font-semibold">
                  #{customer.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">KYC Compliance & Regulatory Record Update</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="classic-error">
              <AlertCircle className="w-4 h-4 text-[#dd4b39] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="classic-label">First Name <span className="text-[#dd4b39]">*</span></label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="classic-input"
              />
            </div>
            <div>
              <label className="classic-label">Last Name <span className="text-[#dd4b39]">*</span></label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="classic-input"
              />
            </div>
          </div>

          <div>
            <label className="classic-label">Email Address <span className="text-[#dd4b39]">*</span></label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="classic-input"
            />
          </div>

          <div>
            <label className="classic-label">Phone Number <span className="text-[#dd4b39]">*</span></label>
            <input
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="classic-input font-mono"
            />
          </div>

          <div>
            <label className="classic-label">National ID / Passport No. <span className="text-[#dd4b39]">*</span></label>
            <input
              type="text"
              required
              value={formData.nationalIdOrPassport}
              onChange={(e) => setFormData({ ...formData, nationalIdOrPassport: e.target.value })}
              className="classic-input font-mono uppercase"
            />
          </div>

          <div>
            <label className="classic-label">Residential Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="classic-input resize-none"
            />
          </div>

          <div className="classic-footer">
            <button
              type="button"
              onClick={onClose}
              className="classic-btn-secondary"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="classic-btn-primary"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{loading ? t.processing : (lang === 'kh' ? 'រក្សាទុកការកែប្រែ' : 'Update Profile')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
