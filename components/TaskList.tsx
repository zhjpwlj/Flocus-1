import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Search, Filter, MoreHorizontal, Check, Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      project: 'General'
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your academic and personal goals.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search tasks..." 
               className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
             />
           </div>
           <button className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700">
             <Filter size={18} className="text-gray-600 dark:text-gray-300" />
           </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-slate-800">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`pb-3 text-sm font-medium capitalize relative ${
              filter === f 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {f}
            {filter === f && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder-gray-400"
            />
            <button 
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </form>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {filteredTasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <Check size={48} className="mb-2 opacity-20" />
              <p>No tasks found.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className="group flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border transition-colors flex items-center justify-center
                      ${task.completed 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'border-gray-300 dark:border-gray-500 hover:border-indigo-500'
                      }`}
                  >
                    {task.completed && <Check size={14} className="text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`truncate text-sm ${task.completed ? 'text-gray-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
                      <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide">
                        {task.project}
                      </span>
                    </p>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
