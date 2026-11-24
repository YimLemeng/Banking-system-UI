import React from 'react';
import { ArrowUpRight, ArrowRight, ExternalLink } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  badge, 
  color = 'blue',
  onClickMore,
  footerText = 'More info'
}) {
  const colorConfigs = {
    blue: {
      bg: 'bg-[#007bff]',
      text: 'text-white',
      subtext: 'text-white/80',
      watermark: 'text-white/20',
      footerBg: 'bg-black/15 hover:bg-black/25',
      footerText: 'text-white/95',
    },
    green: {
      bg: 'bg-[#28a745]',
      text: 'text-white',
      subtext: 'text-white/80',
      watermark: 'text-white/20',
      footerBg: 'bg-black/15 hover:bg-black/25',
      footerText: 'text-white/95',
    },
    yellow: {
      bg: 'bg-[#ffc107]',
      text: 'text-gray-900',
      subtext: 'text-gray-800/80',
      watermark: 'text-black/15',
      footerBg: 'bg-black/10 hover:bg-black/20',
      footerText: 'text-gray-900',
    },
    red: {
      bg: 'bg-[#dc3545]',
      text: 'text-white',
      subtext: 'text-white/80',
      watermark: 'text-white/20',
      footerBg: 'bg-black/15 hover:bg-black/25',
      footerText: 'text-white/95',
    },
  };

  const cfg = colorConfigs[color] || colorConfigs.blue;

  return (
    <div className={`rounded-lg shadow-xs overflow-hidden relative ${cfg.bg} ${cfg.text} flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200 group`}>
      {/* Background Watermark Icon (AdminLTE 4 signature watermark) */}
      {Icon && (
        <div className={`absolute top-2 right-3 pointer-events-none transition-transform group-hover:scale-110 duration-300 ${cfg.watermark}`}>
          <Icon className="w-16 h-16 stroke-[1.2]" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 relative z-10">
        <div className="text-3xl font-extrabold tracking-tight font-sans drop-shadow-xs">
          {value}
        </div>
        <div className="text-sm font-medium mt-1 leading-snug drop-shadow-xs">
          {title}
        </div>
        {subtitle && (
          <div className={`text-[11px] font-medium mt-1.5 flex items-center gap-1.5 ${cfg.subtext}`}>
            {badge && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white/25 backdrop-blur-xs">
                {badge}
              </span>
            )}
            <span className="truncate">{subtitle}</span>
          </div>
        )}
      </div>

      {/* Footer Ribbon: More info -> */}
      <button
        type="button"
        onClick={onClickMore}
        className={`w-full py-1.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none border-t border-black/5 ${cfg.footerBg} ${cfg.footerText}`}
      >
        <span>{footerText}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
