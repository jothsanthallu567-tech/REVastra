import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    localStorage.setItem('revastra_theme', 'light');
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  const toggleTheme = () => {
    // Disabled toggle, force light theme
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
