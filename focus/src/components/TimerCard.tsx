'use client';
import { useFocusTimer } from '@/hooks/useFocusTimer';
import { TimerMode } from '@/types';

export default function TimerCard() {
  const { formattedTime, isActive, mode, config, toggleTimer, resetTimer, changeMode } = useFocusTimer();

  // Cores mais sofisticadas e menos saturadas
  const getAccentColor = () => {
    if (mode === 'shortBreak') return 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]';
    if (mode === 'longBreak') return 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]';
    return 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]'; // Foco principal: Branco puro com glow
  };

  return (
    // CARD VISUAL: Fundo semi-transparente (Slate-900/80) com borda sutil
    <div className="relative h-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500">

      {/* BRANDING: "FOCUS" no topo, elegante e espaçado */}
      <div className="absolute top-8 left-0 right-0 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-[0.3em] text-white/5 pointer-events-none select-none uppercase">
          Focus
        </h1>
      </div>

      {/* Tabs / Modo Selector - Estilo "Pill" flutuante */}
      <div className="flex gap-1 mb-16 bg-black/20 p-1.5 rounded-full border border-white/5 backdrop-blur-sm relative z-10">
        {(Object.keys(config) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${mode === m
                ? 'bg-white/10 text-white shadow-lg border border-white/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
          >
            {config[m].label}
          </button>
        ))}
      </div>

      {/* Timer Display - Fonte tabular para evitar "pulo" dos números */}
      <div className={`text-[8rem] md:text-[10rem] leading-none font-medium tabular-nums tracking-tighter transition-all duration-300 mb-16 select-none font-mono ${getAccentColor()}`}>
        {formattedTime}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 relative z-10">
        <button
          onClick={toggleTimer}
          className={`px-12 py-5 text-base font-bold uppercase tracking-widest rounded-2xl transition-all duration-300 active:scale-95 flex items-center gap-3
            ${isActive
              ? 'bg-slate-800 text-white border border-white/10 hover:bg-slate-700'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 border border-transparent hover:scale-105'
            }`}
        >
          {isActive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Pausar
            </>
          ) : (
            'Iniciar'
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-5 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10"
          aria-label="Reiniciar"
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