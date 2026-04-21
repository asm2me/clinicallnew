'use client';

import { useEffect, useState } from 'react';

type Theme = 'default' | 'ocean';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('default');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedDark = localStorage.getItem('darkMode');

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }

    if (savedDark === 'true') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove('default', 'ocean');
    
    // Add new theme class
    document.documentElement.classList.add(newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Theme:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleThemeChange('default')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              theme === 'default'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            title="Lagoon Theme"
          >
            🌊 Lagoon
          </button>
          <button
            onClick={() => handleThemeChange('ocean')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              theme === 'ocean'
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            title="Sunset Theme"
          >
            🌇 Sunset
          </button>
        </div>
      </div>

      <div className="w-px h-8 bg-border" />

      <button
        onClick={handleDarkModeToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isDark
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDark ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}
