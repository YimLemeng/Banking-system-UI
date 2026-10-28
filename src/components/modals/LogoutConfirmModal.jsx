import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm }) {
  const { lang } = useAuth();
  const { theme } = useTheme();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl bg-[#0a101f] border border-slate-700/80 p-6 shadow-2xl shadow-black/80 relative overflow-hidden text-center" onClick={(e) => e.stopPropagation()}>
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />

        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/20">
          <LogOut className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white tracking-tight">
          {lang === 'kh' ? 'តើអ្នកពិតជាចង់ចាកចេញមែនទេ?' : 'Confirm Terminal Logout?'}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 mt-2 leading-relaxed px-2">
          {lang === 'kh'
            ? 'ការចាកចេញនឹងបិទសម័យប្រតិបត្តិការបច្ចុប្បន្នរបស់ស្ថានីយ៍ #TB-0492។ តើអ្នកចង់បន្តចាកចេញឥឡូវនេះឬ?'
            : 'You are about to sign out from Terminal #TB-0492 and end your active teller session.'}
        </p>

        {/* Action Buttons: Yes / No */}
        <div className="mt-6 grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-slate-600 transition-colors shadow-sm"
          >
            {lang === 'kh' ? 'ទេ (No)' : 'No, Cancel'}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 transition-all shadow-lg shadow-rose-600/30 active:scale-95 flex items-center justify-center gap-1.5"
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
