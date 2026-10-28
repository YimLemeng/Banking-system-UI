import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X, Bell } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-20 right-6 z-[250] transition-all duration-300 transform animate-fadeIn no-print">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${
        isSuccess 
          ? 'bg-[#0b1426]/95 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50' 
          : 'bg-[#180d19]/95 text-rose-300 border-rose-500/40 shadow-rose-950/50'
      }`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
        }`}>
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
        </div>
        <div className="pr-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isSuccess ? 'SYSTEM NOTIFICATION' : 'ALERT'}
          </div>
          <span className="text-xs font-semibold text-slate-100">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-auto w-6 h-6 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
