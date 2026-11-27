import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  const { lang, t } = useAuth();
  const { theme } = useTheme();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1322]/60 backdrop-blur-[1px] animate-fadeIn select-none" onClick={onClose}>
      <div className="w-full max-w-sm classic-modal relative text-center" onClick={(e) => e.stopPropagation()}>
        <div className="h-1.5 bg-[#3c8dbc] border-b border-[#367fa9]" />
        <div className="p-6">
          {/* Close Icon Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-3.5 w-7 h-7 rounded-[2px] border border-[#d2d6de] hover:bg-[#f4f4f4] text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Warning Icon Badge */}
          <div className="w-12 h-12 rounded-[2px] bg-[#fdf2f2] border-2 border-[#b91c1c]/40 text-[#dd4b39] flex items-center justify-center mx-auto mb-3.5 shadow-inner">
            <LogOut className="w-6 h-6" />
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-800 tracking-wide">
            {lang === 'kh' ? 'តើអ្នកពិតជាចង់ចាកចេញមែនទេ?' : 'Confirm Terminal Logout?'}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-2 leading-relaxed px-2">
            {lang === 'kh'
              ? 'ការចាកចេញនឹងបិទសម័យប្រតិបត្តិការបច្ចុប្បន្នរបស់ស្ថានីយ៍ #TB-0492។ តើអ្នកចង់បន្តចាកចេញឥឡូវនេះឬ?'
              : 'You are about to sign out from Terminal #TB-0492 and end your active teller session.'}
          </p>

          {/* Action Buttons: Yes / No */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 pt-3 border-t border-[#d2d6de]">
            <button
              type="button"
              onClick={onClose}
              className="classic-btn-secondary w-full"
            >
              {lang === 'kh' ? 'ទេ (No)' : 'No, Cancel'}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="classic-btn-danger w-full"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'kh' ? 'បាទ/ចាស (Yes)' : 'Yes, Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
