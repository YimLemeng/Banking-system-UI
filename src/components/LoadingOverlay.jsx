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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-sm rounded-2xl bg-white border border-gray-200 p-7 shadow-2xl text-center relative overflow-hidden transform transition-all duration-200 scale-100">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600" />

        {/* Clean dual-ring spinner */}
        <div className="relative w-14 h-14 mx-auto mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
          <div className="w-14 h-14 rounded-full border-[3px] border-transparent border-t-blue-600 border-r-emerald-500 animate-spin" />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug">
          {title || defaultTitle}
        </h3>

        {/* Subtitle / Message */}
        <p className="text-xs text-gray-500 mt-2 leading-relaxed font-normal">
          {message || defaultMessage}
        </p>
      </div>
    </div>
  );
}
