import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type HomeNavbarProps = {
  onBrandClick: () => void;
  onLogout: () => void;
  onProfileClick?: () => void;
};

function HomeNavbar({ onBrandClick, onLogout, onProfileClick }: HomeNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/history', label: 'History', icon: '📋' },
    { path: '/impact', label: 'Impact', icon: '🌱' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <button
            type="button"
            onClick={onBrandClick}
            className="text-xl font-bold text-gradient-primary hover:opacity-80 transition-opacity"
          >
            🌾 BHARAT KRISHI SETU
          </button>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250
                  ${isActive(item.path)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-600 hover:bg-slate-800 hover:text-slate-100'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {onProfileClick && (
              <button
                type="button"
                onClick={onProfileClick}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-800 hover:text-slate-100 transition-all duration-250"
              >
                👤 Profile
              </button>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-250"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HomeNavbar;
