import React from 'react';
import { Landmark } from 'lucide-react';

export const BankLogo = ({ size = 44, className = '', rounded = true, shadow = true }) => {
  const borderRadius = rounded ? Math.round(size * 0.28) : 0;
  const iconSize = Math.round(size * 0.54);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius,
        background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #2563eb 100%)',
        boxShadow: shadow ? '0 10px 25px -3px rgba(37, 99, 235, 0.45), 0 0 16px rgba(99, 102, 241, 0.35)' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        border: '1.5px solid rgba(255, 255, 255, 0.28)',
        boxSizing: 'border-box',
      }}
    >
      <Landmark 
        size={iconSize} 
        className="text-white" 
        strokeWidth={2.3}
        style={{ filter: 'drop-shadow(0px 2px 4px rgba(15, 23, 42, 0.4))' }}
      />
    </div>
  );
};
