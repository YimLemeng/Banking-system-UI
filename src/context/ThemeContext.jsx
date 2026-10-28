import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  sapphire: {
    id: 'sapphire',
    name: 'Royal Sapphire',
    nameKh: 'ត្បូងកណ្តៀងរាជវង្ស',
    primary: '#2563eb', // blue-600
    primaryLight: '#3b82f6', // blue-500
    primaryGlow: 'rgba(37, 99, 235, 0.25)',
    borderActive: 'border-blue-500/50',
    bgBadge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    buttonGrad: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500',
    accentText: 'text-blue-400',
  },
  emerald: {
    id: 'emerald',
    name: 'Imperial Emerald',
    nameKh: 'ត្បូងមរកតរាជវង្ស',
    primary: '#059669', // emerald-600
    primaryLight: '#10b981', // emerald-500
    primaryGlow: 'rgba(5, 150, 105, 0.25)',
    borderActive: 'border-emerald-500/50',
    bgBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    buttonGrad: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500',
    accentText: 'text-emerald-400',
  },
  gold: {
    id: 'gold',
    name: 'Imperial Gold',
    nameKh: 'មាសរាជវង្ស',
    primary: '#d97706', // amber-600
    primaryLight: '#f59e0b', // amber-500
    primaryGlow: 'rgba(217, 119, 6, 0.25)',
    borderActive: 'border-amber-500/50',
    bgBadge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    buttonGrad: 'from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500',
    accentText: 'text-amber-400',
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('trustbank_theme');
    if (saved === 'amethyst' || !THEMES[saved]) return 'sapphire';
    return saved;
  });

  useEffect(() => {
    localStorage.setItem('trustbank_theme', currentTheme);
  }, [currentTheme]);

  const theme = THEMES[currentTheme] || THEMES.sapphire;

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, theme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
