import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserCheck, AlertCircle, Loader2, Check } from 'lucide-react';
import { customerService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLoading } from '../../context/LoadingContext';

export default function CreateCustomerModal({ isOpen, onClose, onSuccess }) {
  const { t, lang } = useAuth();
  const { theme } = useTheme();
  const { withLoading } = useLoading();

  const initialForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nationalIdOrPassport: '',
    address: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData(initialForm);
    setError('');
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    await withLoading(
      lang === 'kh' ? 'កំពុងចុះឈ្មោះអតិថិជន KYC ថ្មី...' : 'Registering KYC Customer Profile...',
      async () => {
        try {
          const res = await customerService.create(formData);
          onSuccess(`Customer profile for ${formData.firstName} ${formData.lastName} created!`, res.data);
          resetForm();
          onClose();
        } catch (err) {
          setError(err.response?.data?.message || err.message || (lang === 'kh' ? 'ការចុះឈ្មោះអតិថិជនមិនជោគជ័យ' : 'Failed to register customer'));
        }
      },
      600
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn" onClick={handleClose}>
      <div className="w-full max-w-lg classic-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="classic-header">
          <div className="flex items-center gap-3">
            <div className="classic-header-icon">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base tracking-wide">{t.newCustomerModalTitle || 'New Customer KYC Profile'}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">KYC Compliance & Regulatory Registry • Form KYC-01</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClose}
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
                placeholder="e.g. Sokha"
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
                placeholder="e.g. Chan"
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
              placeholder="sokha.chan@trustbank.com"
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
              placeholder="+85512888999"
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
              placeholder="e.g. KH-109283741 or P-9821425"
              className="classic-input font-mono uppercase"
            />
          </div>

          <div>
            <label className="classic-label">Residential Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street #271, Sangkat Boeung Tumpun, Phnom Penh"
              className="classic-input resize-none"
            />
          </div>

          <div className="classic-footer">
            <button
              type="button"
              onClick={handleClose}
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
              <span>{loading ? t.processing : 'Save Customer Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
