import React from 'react';
import { Calendar, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenMobileMenu }) => {
  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('uz-UZ', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  return (
    <header className="glass-navbar px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle button */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-xl bg-gray-900/60 border border-gray-800/80 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-0.5">{title}</h2>
          <p className="text-xs text-gray-500 font-medium hidden sm:block">{getGreeting()}, admin panelga xush kelibsiz</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/40 border border-gray-800/60 rounded-xl text-gray-400 text-xs font-semibold">
        <Calendar size={14} className="text-indigo-400" />
        <span>{getFormattedDate()}</span>
      </div>
    </header>
  );
};
