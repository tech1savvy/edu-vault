import React from 'react';

const ThemeSwitcher = ({ toggleTheme }) => {
  return (
    <div className="theme-switcher">
      <button onClick={() => toggleTheme('light')}>Light</button>
      <button onClick={() => toggleTheme('dark')}>Dark</button>
      <button onClick={() => toggleTheme('blue')}>Green</button>
    </div>
  );
};

export default ThemeSwitcher;
