import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(theme);
  }, [theme]);

  return { theme, toggleTheme };
};
