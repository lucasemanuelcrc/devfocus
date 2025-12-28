'use client';

import { useState, useEffect } from 'react';

// Tipos e Configurações
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODES = {
  focus: { label: 'Deep Focus', minutes: 25, color: 'cyan' },
  shortBreak: { label: 'Descanso Curto', minutes: 5, color: 'emerald' },
  longBreak: { label: 'Descanso Longo', minutes: 15, color: 'violet' },
};

export default function TimerCard() {
  // --- ESTADO ---
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTÊNCIA (NOVO) ---
  useEffect(() => {
    // Carregar
    const savedMode = localStorage.getItem('focus_timer_mode') as TimerMode;
    const savedTime = localStorage.getItem('focus_timer_time');

    if (savedMode && MODES[savedMode]) {
      setMode(savedMode);
    }
    if (savedTime) {
      const parsedTime = parseInt(savedTime, 10);
      if (!isNaN(parsedTime)) setTimeLeft(parsedTime);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Salvar
    if (isLoaded) {
      localStorage.setItem('focus_timer_mode', mode);
      localStorage.setItem('focus_timer_time', timeLeft.toString());
      // Nota: Não salvamos 'isRunning' para evitar que o timer inicie sozinho no refresh
    }
  }, [mode, timeLeft, isLoaded]);

  // --- MAPA DE CORES ---
  const theme = {
    focus: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500',
      ring: 'text-cyan-500',
      glow: 'shadow-cyan-500/40',
      gradient: 'from-cyan-900/20',
    },
    shortBreak: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      ring: 'text-emerald-500',
      glow: 'shadow-emerald-500/40',
      gradient: 'from-emerald-900/20',
    },
    longBreak: {
      text: 'text-violet-400',
      bg: 'bg-violet-600',
      ring: 'text-violet-600',
      glow: 'shadow-violet-500/40',
      gradient: 'from-violet-900/20',
    },
  }[mode];

  // --- EFEITOS ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.title = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} - FOCUS`;
  }, [timeLeft]);

  // --- HANDLERS ---
  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].minutes * 60);
  };

  // Cálculos visuais SVG
  const totalTime = MODES[mode].minutes * 60;
  const circumference = 283;
  const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    // CARD PRINCIPAL
    <div className={`
      relative h-full flex flex-col justify-between items-center py-8 px-6 sm:px-10
      rounded-[40px]
      bg-slate-950 
      border border-slate-800/60
      shadow-2xl shadow-black/50
      overflow-hidden
      group
    `}>

      {/* BACKGROUND FX */}
      <div className={`absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b ${theme.gradient} to-transparent opacity-25 pointer-events-none transition-all duration-1000`} />

      {/* HEADER */}
      <div className="z-10 w-full flex flex-col items-center gap-6 pt-2">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-500 uppercase select-none pl-2 transition-all duration-500">
            FOCUS
          </h1>
          <div className={`w-12 h-0.5 rounded-full transition-colors duration-700 ${isRunning ? theme.bg : 'bg-slate-800'}`} />
        </div>

        <div className="flex p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner overflow-x-auto max-w-full scrollbar-hide">
          {(Object.keys(MODES) as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`
                px-4 py-2 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-all duration-300 whitespace-nowrap
                ${mode === m
                  ? `${theme.bg} text-white shadow-lg scale-100`
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 scale-95'}
              `}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: Timer */}
      <div className="flex-1 flex items-center justify-center w-full relative">
        <div className={`
          relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center rounded-full 
          transition-all duration-1000
          ${isRunning ? `animate-breathing-glow ${theme.glow}` : ''}
        `}>
          <svg className="w-full h-full absolute transform -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="transparent"
              className="text-slate-800/60"
            />
            <circle
              cx="50" cy="50" r="45"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ease-linear ${theme.ring}`}
            />
          </svg>

          <div className="z-10 flex flex-col items-center justify-center transform translate-y-2">
            <span className="text-7xl sm:text-8xl font-medium tracking-tighter text-white tabular-nums select-none drop-shadow-xl font-sans">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mt-2 opacity-80 transition-colors duration-500 ${theme.text}`}>
              {isRunning ? 'Em fluxo' : 'Pausado'}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER: Controles */}
      <div className="z-10 w-full flex flex-col items-center justify-center gap-4 pb-4">
        <button
          onClick={toggleTimer}
          className={`
            w-20 h-20 rounded-full 
            flex items-center justify-center
            text-white shadow-2xl 
            transition-all duration-300 ease-out
            hover:scale-110 active:scale-95
            ${theme.bg}
            ring-4 ring-slate-950 ring-offset-2 ring-offset-slate-900/50
          `}
          title={isRunning ? "Pausar" : "Iniciar"}
        >
          {isRunning ? (
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}