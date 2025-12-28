'use client';

import { useState, useEffect, useCallback } from 'react';

// Tipos e Configurações
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODES = {
  focus: { label: 'Foco Profundo', minutes: 25, color: 'cyan' },
  shortBreak: { label: 'Pausa Curta', minutes: 5, color: 'emerald' },
  longBreak: { label: 'Descanso Longo', minutes: 15, color: 'violet' },
};

export default function TimerCard() {
  // --- ESTADO (Lógica Funcional) ---
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  // --- MAPA DE CORES (Design System) ---
  // Mapeamos as cores baseadas no modo atual para as classes do Tailwind
  const theme = {
    focus: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500',
      ring: 'text-cyan-500',
      glow: 'shadow-cyan-500/40',
      border: 'border-cyan-500/20',
      gradient: 'from-cyan-900/20',
    },
    shortBreak: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      ring: 'text-emerald-500',
      glow: 'shadow-emerald-500/40',
      border: 'border-emerald-500/20',
      gradient: 'from-emerald-900/20',
    },
    longBreak: {
      text: 'text-violet-400',
      bg: 'bg-violet-600',
      ring: 'text-violet-600',
      glow: 'shadow-violet-500/40',
      border: 'border-violet-500/20',
      gradient: 'from-violet-900/20',
    },
  }[mode];

  // --- EFEITOS (Timer) ---

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Aqui você poderia tocar um som de alarme
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Atualizar título da aba do navegador
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

  // Cálculos visuais
  const totalTime = MODES[mode].minutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  // Circunferência do círculo (2 * PI * r). Para r=48%, aprox 301.
  // Vamos usar Dasharray fixo e calcular o offset.
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
      relative h-full flex flex-col justify-between items-center py-8 px-8 
      rounded-[32px] 
      bg-slate-950 
      border border-slate-800/50 
      shadow-2xl shadow-black/40
      overflow-hidden
      group
    `}>

      {/* BACKGROUND FX Dinâmico */}
      <div className={`absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b ${theme.gradient} to-transparent opacity-30 pointer-events-none transition-colors duration-1000`} />

      {/* HEADER: Seletor de Modos */}
      <div className="z-10 w-full flex flex-col items-center gap-4">
        <h2 className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">
          Focus Product
        </h2>

        {/* Menu de Modos (Restaurando as opções anteriores) */}
        <div className="flex gap-2 p-1 bg-slate-900/80 rounded-full border border-slate-800/50 backdrop-blur-sm">
          {(Object.keys(MODES) as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300
                ${mode === m
                  ? `${theme.bg} text-white shadow-lg`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
              `}
            >
              {MODES[m].label.split(' ')[0]} {/* Exibe apenas a primeira palavra para economizar espaço se necessário, ou remova o split */}
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: O Timer Visual */}
      <div className="flex-1 flex items-center justify-center w-full relative my-4">

        {/* Container do Círculo com Animação de "Respiração" apenas quando rodando */}
        <div className={`
          relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center rounded-full 
          transition-all duration-1000
          ${isRunning ? `animate-breathing-glow ${theme.glow}` : ''}
        `}>

          {/* SVG Ring */}
          <svg className="w-full h-full absolute transform -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
            {/* Trilha de fundo */}
            <circle
              cx="50" cy="50" r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              className="text-slate-800/80"
            />
            {/* Progresso Dinâmico */}
            <circle
              cx="50" cy="50" r="45"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-1000 ease-linear ${theme.ring}`}
            />
          </svg>

          {/* Display Digital */}
          <div className="z-10 flex flex-col items-center justify-center">
            <h1 className="text-7xl sm:text-8xl font-light font-sans tracking-tighter text-white tabular-nums select-none drop-shadow-lg">
              {formatTime(timeLeft)}
            </h1>
            <p className={`text-sm font-medium tracking-widest uppercase mt-4 transition-colors duration-500 ${theme.text}`}>
              {isRunning ? 'Em Andamento' : 'Pausado'}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER: Controles Principais */}
      <div className="z-10 w-full flex flex-col items-center gap-3 pb-2">
        <button
          onClick={toggleTimer}
          className={`
            w-48 py-4 rounded-2xl 
            text-lg font-bold tracking-wide text-white 
            shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95
            transition-all duration-300 ease-out
            flex items-center justify-center gap-3
            ${theme.bg}
            ring-1 ring-white/10 ring-inset
          `}
        >
          {isRunning ? (
            // Ícone de Pause
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            // Ícone de Play
            <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
          <span>{isRunning ? 'PAUSAR' : 'INICIAR'}</span>
        </button>

        {/* Botão Reset Discreto */}
        <button
          onClick={resetTimer}
          className="text-xs font-semibold text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors py-2"
        >
          Resetar Timer
        </button>
      </div>

    </div>
  );
}