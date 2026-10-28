import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoadingOverlay({ 
  show = false, 
  title = '', 
  message = '' 
}) {
  const { lang } = useAuth();
  const { theme } = useTheme();

  if (!show) return null;

  const defaultTitle = lang === 'kh' ? 'កំពុងដំណើរការទិន្នន័យ...' : 'Loading Request...';
  const defaultMessage = lang === 'kh' 
    ? 'សូមរង់ចាំមួយភ្លែត ប្រព័ន្ធកំពុងដំណើរការសំណើរបស់អ្នក។' 
    : 'Please wait while the request is processing.';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#0b1325]/95 border border-slate-700/70 p-8 shadow-2xl shadow-black/80 text-center relative overflow-hidden transform transition-all duration-300 scale-100">
        {/* Ambient Top Glow */}
        <div 
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full opacity-25 blur-2xl pointer-events-none"
          style={{ backgroundColor: theme.primaryLight }}
        />

        {/* Circular Gradient Spinner matching screenshot */}
        <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          {/* Subtle outer track */}
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-800/80" />
          {/* Spinning glowing indicator */}
          <div className="w-14 h-14 rounded-full border-[3.5px] border-transparent border-t-emerald-400 border-r-emerald-500/80 animate-spin drop-shadow-[0_0_12px_rgba(52,211,153,0.55)]" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
          {title || defaultTitle}
        </h3>

        {/* Subtitle / Message */}
        <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-normal">
          {message || defaultMessage}
        </p>
      </div>
    </div>
  );
}
