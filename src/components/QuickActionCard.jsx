import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function QuickActionCard({ title, description, buttonText, icon: Icon, onClick, variant = 'primary' }) {
  const { theme } = useTheme();

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
            style={{ 
              backgroundColor: `${theme.primaryLight}18`, 
              color: theme.primaryLight,
              border: `1px solid ${theme.primaryLight}35`
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
              {title}
            </h4>
            <span className="text-[10px] text-emerald-400 font-medium">Instant Clearance</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400 leading-relaxed min-h-[36px]">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md group-hover:shadow-blue-500/20"
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
