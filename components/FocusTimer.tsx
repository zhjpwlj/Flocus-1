import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Play sound here ideally
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case 'focus': setTimeLeft(25 * 60); break;
      case 'short-break': setTimeLeft(5 * 60); break;
      case 'long-break': setTimeLeft(15 * 60); break;
    }
  };

  const changeMode = (newMode: 'focus' | 'short-break' | 'long-break') => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case 'focus': setTimeLeft(25 * 60); break;
      case 'short-break': setTimeLeft(5 * 60); break;
      case 'long-break': setTimeLeft(15 * 60); break;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 100 - (timeLeft / (mode === 'focus' ? 1500 : mode === 'short-break' ? 300 : 900)) * 100;

  return (
    <div className="h-full flex items-center justify-center animate-in zoom-in duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 flex flex-col items-center">
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-slate-900 rounded-lg mb-8">
          {[
            { id: 'focus', label: 'Focus', icon: Brain },
            { id: 'short-break', label: 'Short Break', icon: Coffee },
            { id: 'long-break', label: 'Long Break', icon: Coffee },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => changeMode(m.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2
                ${mode === m.id 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              <m.icon size={14} />
              {m.label}
            </button>
          ))}
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
          {/* Circular Progress SVG */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-gray-200 dark:stroke-slate-700 fill-none"
              strokeWidth="8"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-indigo-600 dark:stroke-indigo-500 fill-none transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold text-slate-900 dark:text-white font-mono tracking-wider">
              {formatTime(timeLeft)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 mt-2 font-medium uppercase tracking-widest text-xs">
              {isActive ? 'Running' : 'Paused'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95
              ${isActive ? 'bg-orange-500 text-white' : 'bg-indigo-600 text-white'}`}
          >
            {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;
