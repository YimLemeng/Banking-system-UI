import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function QuickActionCard({ title, description, buttonText, icon: Icon, onClick, variant = 'primary' }) {
  const { theme } = useTheme();

  return (
    <div className="bg-white rounded-[3px] border border-[#d2d6de] border-t-[3px] border-t-[#3c8dbc] shadow-xs p-4 flex flex-col justify-between group hover:shadow-sm transition-shadow">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[2px] bg-[#ebf5fb] text-[#3c8dbc] border border-[#3c8dbc]/30 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#333333] text-sm group-hover:text-[#3c8dbc] transition-colors">
              {title}
            </h4>
            <span className="text-[10px] text-[#00a65a] font-semibold uppercase tracking-wider">Instant Clearance</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[32px]">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className="mt-3 w-full classic-btn-primary py-2"
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
