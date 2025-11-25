import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Timer, 
  Clock, 
  BookOpen, 
  Users, 
  Settings 
} from 'lucide-react';
import { AppModule } from '../types';

interface SidebarProps {
  activeModule: AppModule;
  onChangeModule: (module: AppModule) => void;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onChangeModule, isMobileMenuOpen, closeMobileMenu }) => {
  const navItems = [
    { id: AppModule.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppModule.TASKS, label: 'Tasks', icon: CheckSquare },
    { id: AppModule.TIMER, label: 'Time Tracker', icon: Timer },
    { id: AppModule.POMODORO, label: 'Focus Mode', icon: Clock },
    { id: AppModule.JOURNAL, label: 'Journal', icon: BookOpen },
    { id: AppModule.SOCIAL, label: 'Study Room', icon: Users },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-in-out
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:inset-auto md:block
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            F
          </div>
          FocusFlow
        </div>
      </div>
      
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChangeModule(item.id);
                closeMobileMenu();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800'
                }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Settings size={20} />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
