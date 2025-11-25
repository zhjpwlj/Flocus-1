import React from 'react';
import { Task, TimeEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, CheckCircle2, Flame, Calendar } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  timeEntries: TimeEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, timeEntries }) => {
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  
  // Calculate total time tracked today (mock logic for demo)
  const totalDuration = timeEntries.reduce((acc, curr) => acc + curr.duration, 0);
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  // Mock data for the chart
  const data = [
    { name: 'Mon', hours: 4.5 },
    { name: 'Tue', hours: 6.2 },
    { name: 'Wed', hours: 3.8 },
    { name: 'Thu', hours: 7.5 },
    { name: 'Fri', hours: 5.1 },
    { name: 'Sat', hours: 2.0 },
    { name: 'Sun', hours: 3.5 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Good Morning, Alex</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your productivity overview for today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Time Tracked</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
               <Clock size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{hours}h {minutes}m</div>
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <span>+12%</span> vs yesterday
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tasks Done</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
               <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedTasks}/{tasks.length}</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-3">
             <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(completedTasks/tasks.length)*100}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Focus Streak</span>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
               <Flame size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">5 Days</div>
          <div className="text-xs text-gray-500 mt-1">Keep it up!</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Upcoming Exam</span>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
               <Calendar size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white truncate">Calculus II</div>
          <div className="text-xs text-purple-600 mt-1 font-medium">In 3 days</div>
        </div>
      </div>

      {/* Main Content Area: Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Weekly Activity</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                 <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 3 ? '#6366f1' : '#cbd5e1'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Today's Priorities</h3>
           <div className="space-y-3">
             {tasks.slice(0, 4).map(task => (
               <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                    ${task.completed ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-gray-500'}`}>
                    {task.completed && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                      {task.title}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{task.project}</span>
                  </div>
               </div>
             ))}
             <button className="w-full py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
               View All Tasks
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
