import React from 'react';
import { Calendar } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    // format as Uzbek locale or default
    return today.toLocaleDateString('uz-UZ', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Xayrli tong';
    if (hour < 18) return 'Xayrli kun';
    return 'Xayrli kech';
  };

  return (
    <header className="glass-navbar px-8 py-4 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h2 className="text-xl font-bold text-white mb-0.5">{title}</h2>
        <p className="text-xs text-gray-500 font-medium">{getGreeting()}, admin panelga xush kelibsiz</p>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/40 border border-gray-800/60 rounded-xl text-gray-400 text-xs font-semibold">
        <Calendar size={14} className="text-indigo-400" />
        <span>{getFormattedDate()}</span>
      </div>
    </header>
  );
};
