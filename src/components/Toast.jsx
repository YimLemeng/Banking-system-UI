import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

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

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[300] transition-all duration-300 transform animate-fadeIn no-print pointer-events-auto">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border bg-white ${
        isSuccess 
          ? 'border-gray-200 border-l-4 border-l-emerald-500' 
          : 'border-gray-200 border-l-4 border-l-rose-500'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          )}
        </div>
        <div className="pr-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {isSuccess ? 'SYSTEM NOTIFICATION' : 'ALERT'}
          </div>
          <span className="text-xs font-semibold text-gray-800">{message}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>,
    document.body
  );
}
