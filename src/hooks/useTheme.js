import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
};
