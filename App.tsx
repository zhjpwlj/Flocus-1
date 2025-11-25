import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import FocusTimer from './components/FocusTimer';
import ChatBot from './components/ChatBot';
import { AppModule, Task, TimeEntry } from './types';
import { Menu, MessageSquarePlus, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<AppModule>(AppModule.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock initial data
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete Calculus Assignment', completed: false, project: 'University' },
    { id: '2', title: 'Review History Notes', completed: true, project: 'University' },
    { id: '3', title: 'Buy Groceries', completed: false, project: 'Personal' },
    { id: '4', title: 'Prepare Presentation Slides', completed: false, project: 'Work' },
  ]);

  const [timeEntries] = useState<TimeEntry[]>([
    { id: '1', description: 'Study Session', startTime: 10000, endTime: 11000, duration: 3600, project: 'University' },
    { id: '2', description: 'Client Meeting', startTime: 12000, endTime: 13000, duration: 2500, project: 'Work' },
  ]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderModule = () => {
    switch (activeModule) {
      case AppModule.DASHBOARD:
        return <Dashboard tasks={tasks} timeEntries={timeEntries} />;
      case AppModule.TASKS:
        return <TaskList tasks={tasks} setTasks={setTasks} />;
      case AppModule.POMODORO:
        return <FocusTimer />;
      case AppModule.TIMER:
      case AppModule.JOURNAL:
      case AppModule.SOCIAL:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
             <div className="bg-indigo-50 dark:bg-slate-800 p-6 rounded-full mb-4">
                <span className="text-4xl">🚧</span>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Coming Soon</h2>
             <p className="text-gray-500 dark:text-gray-400 max-w-md">
               This module is part of the full FocusFlow suite and is currently under development.
             </p>
          </div>
        );
      default:
        return <Dashboard tasks={tasks} timeEntries={timeEntries} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        activeModule={activeModule} 
        onChangeModule={setActiveModule}
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white md:hidden">
              {activeModule.charAt(0) + activeModule.slice(1).toLowerCase()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm border border-indigo-200 dark:border-indigo-700">
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {renderModule()}
        </main>
      </div>

      {/* Chat Trigger & Component */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group flex items-center gap-2"
        >
          <MessageSquarePlus size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">
            Ask AI
          </span>
        </button>
      )}

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
