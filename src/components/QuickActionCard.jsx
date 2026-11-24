import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function QuickActionCard({ title, description, buttonText, icon: Icon, onClick, variant = 'primary' }) {
  const { theme } = useTheme();

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 flex flex-col justify-between group hover:shadow-sm transition-shadow">
      <div>
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{ 
              backgroundColor: `${theme.primaryLight}15`, 
              color: theme.primary,
              border: `1px solid ${theme.primaryLight}30`
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
              {title}
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold">Instant Clearance</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 leading-relaxed min-h-[32px]">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold text-white transition-all shadow-xs hover:opacity-95"
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
        }}
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
