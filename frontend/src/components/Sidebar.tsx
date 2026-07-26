import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Home, 
  BookOpen, 
  CalendarRange, 
  CheckSquare, 
  LogOut,
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  user: any;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  onLogout,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/students', name: 'O\'quvchilar', icon: Users },
    { path: '/teachers', name: 'O\'qituvchilar', icon: UserSquare2 },
    { path: '/rooms', name: 'Xonalar', icon: Home },
    { path: '/courses', name: 'Kurslar & Guruhlar', icon: BookOpen },
    { path: '/schedule', name: 'Dars Jadvali', icon: CalendarRange },
    { path: '/attendance', name: 'Davomat', icon: CheckSquare },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4">
      <div>
        {/* Brand logo & mobile close button */}
        <div className="flex items-center justify-between px-3 py-4 mb-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white glow-primary">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide leading-tight m-0">EDU CRM</h1>
              <span className="text-xs text-indigo-400 font-medium">IT Park Academy</span>
            </div>
          </div>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & logout */}
      <div className="border-t border-gray-800/50 pt-4">
        <div className="flex items-center justify-between px-3 py-2 mb-3 bg-gray-800/20 rounded-xl border border-gray-800/40">
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.phone || '+998901234567'}</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            onLogout();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed on lg and larger) */}
      <aside className="hidden lg:flex w-64 glass-sidebar h-screen flex-col sticky top-0 z-30 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={`fixed top-0 bottom-0 left-0 w-72 glass-sidebar z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
