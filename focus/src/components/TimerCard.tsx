'use client';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { TimerMode } from '@/types';

export default function TimerCard() {
  const { formattedTime, isActive, mode, config, toggleTimer, resetTimer, changeMode } = useFocusTimer();

  // Cores dinâmicas baseadas no modo para feedback visual sutil
  const getAccentColor = () => {
    if (mode === 'shortBreak') return 'text-teal-400 border-teal-500/30';
    if (mode === 'longBreak') return 'text-blue-400 border-blue-500/30';
    return 'text-indigo-400 border-indigo-500/30';
  };

  const activeGlow = isActive ? 'shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)] border-indigo-500/50' : 'border-neutral-800';

  return (
    <div className={`h-full flex flex-col items-center justify-center bg-neutral-900 rounded-2xl border transition-all duration-500 p-8 ${activeGlow}`}>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-12 bg-neutral-950/50 p-1.5 rounded-xl border border-neutral-800/50">
        {(Object.keys(config) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === m 
                ? 'bg-neutral-800 text-white shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {config[m].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className={`text-[9rem] leading-none font-bold tabular-nums tracking-tighter transition-colors duration-300 mb-12 select-none ${getAccentColor().split(' ')[0]}`}>
        {formattedTime}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleTimer}
          className="px-10 py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-neutral-200 active:scale-95 transition-all shadow-lg shadow-white/5"
        >
          {isActive ? 'Pausar Foco' : 'Iniciar Foco'}
        </button>
        
        <button
          onClick={resetTimer}
          className="px-6 py-4 text-neutral-500 font-medium hover:text-white transition-colors"
          aria-label="Reiniciar Timer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" />
            <path d="M3 3v9h9" />
          </svg>
        </button>
      </div>
    </div>
  );
}