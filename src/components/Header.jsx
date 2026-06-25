import React from 'react';
import { LogoIcon, SunIcon, MoonIcon, MenuIcon } from './Icons';

export const Header = ({ isLightMode, onToggleTheme, onToggleSidebar }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <button 
          className="btn-icon btn-menu-toggle" 
          onClick={onToggleSidebar}
          aria-label="Open study exercises"
          title="Open Exercises"
        >
          <MenuIcon />
        </button>
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

