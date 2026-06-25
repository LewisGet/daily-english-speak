import React from 'react';
import { LogoIcon, SunIcon, MoonIcon } from './Icons';

export const Header = ({ isLightMode, onToggleTheme }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon">
          <LogoIcon />
        </div>
        <div className="brand-title">SpeakLearn Partner</div>
      </div>
      <div className="header-controls">
        <button 
          className="btn-icon" 
          onClick={onToggleTheme} 
          aria-label="Toggle theme"
          title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {isLightMode ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
    </header>
  );
};
