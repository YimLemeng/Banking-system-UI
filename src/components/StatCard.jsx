import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function StatCard({ title, value, subtitle, icon: Icon, badge, color = 'blue' }) {
  const { theme } = useTheme();

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
      {/* Background radial highlight */}
      <div 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: theme.primaryLight }}
      />

      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
          style={{ 
            backgroundColor: `${theme.primaryLight}15`, 
            color: theme.primaryLight,
            border: `1px solid ${theme.primaryLight}30` 
          }}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-extrabold text-white tracking-tight mono-number">
          {value}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs">
          {badge && (
            <span className="flex items-center gap-0.5 text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" />
              {badge}
            </span>
          )}
          <span className="text-slate-400 text-[11px] truncate">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
