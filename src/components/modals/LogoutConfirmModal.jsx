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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn select-none" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl bg-white border border-gray-200 p-6 shadow-2xl relative overflow-hidden text-center" onClick={(e) => e.stopPropagation()}>
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
          <LogOut className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          {lang === 'kh' ? 'តើអ្នកពិតជាចង់ចាកចេញមែនទេ?' : 'Confirm Terminal Logout?'}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mt-2 leading-relaxed px-2">
          {lang === 'kh'
            ? 'ការចាកចេញនឹងបិទសម័យប្រតិបត្តិការបច្ចុប្បន្នរបស់ស្ថានីយ៍ #TB-0492។ តើអ្នកចង់បន្តចាកចេញឥឡូវនេះឬ?'
            : 'You are about to sign out from Terminal #TB-0492 and end your active teller session.'}
        </p>

        {/* Action Buttons: Yes / No */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 transition-colors shadow-2xs cursor-pointer"
          >
            {lang === 'kh' ? 'ទេ (No)' : 'No, Cancel'}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{lang === 'kh' ? 'បាទ/ចាស (Yes)' : 'Yes, Logout'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
