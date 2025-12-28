'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFocusStats } from '@/hooks/useFocusStats';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { usePiP } from '@/hooks/usePiP';
import { Maximize2, Minimize2, PictureInPicture2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Tipos e Configurações
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODES = {
  focus: { label: 'Deep Focus', minutes: 25, color: 'cyan', hex: '#06b6d4' },
  shortBreak: { label: 'Descanso Curto', minutes: 5, color: 'emerald', hex: '#10b981' },
  longBreak: { label: 'Descanso Longo', minutes: 15, color: 'violet', hex: '#8b5cf6' },
};

const QUOTES = [
  "Foque em uma coisa de cada vez.",
  "Sessão de foco profundo.",
  "Sem distrações agora.",
  "Construa o seu futuro agora.",
  "Silencie o ruído, amplie o foco.",
  "Um passo de cada vez.",
];

interface TimerCardProps {
  isZenMode?: boolean;
  onToggleZen?: () => void;
}

export default function TimerCard({ isZenMode = false, onToggleZen }: TimerCardProps) {
  // --- ESTADO ---
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [isCompleted, setIsCompleted] = useState(false);

  // --- HOOKS ---
  const { registerSession } = useFocusStats();
  const { playClick, playSwitch, playDone } = useSoundEffects();
  const { togglePiP, isPiPActive, canvasRef, videoRef } = usePiP({
    timeLeft,
    maxTime: MODES[mode].minutes * 60,
    mode,
    isRunning,
  });

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('focus_timer_mode', mode);
      localStorage.setItem('focus_timer_time', timeLeft.toString());
    }
  }, [mode, timeLeft, isLoaded]);

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, [mode]);

  const getNextMode = () => {
    if (mode === 'focus') return MODES.shortBreak;
    return MODES.focus;
  };
  const nextMode = getNextMode();

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

  // --- ACTIONS ---
  const switchMode = useCallback((newMode: TimerMode) => {
    playSwitch();
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [playSwitch]);

  const toggleTimer = useCallback(() => {
    playClick();
    setIsRunning((prev) => !prev);
    setIsCompleted(false);
  }, [playClick]);

  const resetTimer = useCallback(() => {
    playSwitch();
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(MODES[mode].minutes * 60);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, [mode, playSwitch]);

  // --- ATALHOS DE TECLADO ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!isLoaded) return;

      switch (e.code) {
        case 'Space':
          if (e.target instanceof HTMLButtonElement) return;
          e.preventDefault();
          toggleTimer();
          break;
        case 'KeyR':
          resetTimer();
          break;
        case 'KeyM':
          const nextKey = mode === 'focus' ? 'shortBreak' : 'focus';
          switchMode(nextKey);
          break;
        case 'KeyZ':
          if (onToggleZen) {
            playClick();
            onToggleZen();
          }
          break;
        case 'KeyP':
          togglePiP();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, toggleTimer, resetTimer, switchMode, onToggleZen, isLoaded, playClick, togglePiP]);

  // --- EFEITO DO TIMER ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      playDone();
      setTimeout(() => setIsCompleted(false), 4000);
      if (mode === 'focus') {
        registerSession();
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, registerSession, playDone]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    const icon = isCompleted ? '🎉' : (isRunning ? '🟢' : '⏸️');
    document.title = `${icon} ${timeStr} - FOCUS`;
  }, [timeLeft, isRunning, isCompleted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalTime = MODES[mode].minutes * 60;
  const circumference = 283;
  const strokeDashoffset = circumference - (timeLeft / totalTime) * circumference;

  return (
    <motion.div 
      layout
      transition={{
        layout: { type: "spring", stiffness: 100, damping: 25 },
        duration: 0.8,
        repeat: isCompleted ? 4 : 0,
        repeatType: "reverse"
      }}
      animate={isCompleted ? {
        boxShadow: [
          "0 0 0px rgba(0,0,0,0)",
          `0 0 50px ${MODES[mode].hex}80`,
          "0 0 0px rgba(0,0,0,0)"
        ],
        borderColor: [
          "rgba(30, 41, 59, 0.6)",
          MODES[mode].hex,
          "rgba(30, 41, 59, 0.6)"
        ]
      } : {
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        borderColor: "rgba(30, 41, 59, 0.6)"
      }}
      className={`
        relative h-full flex flex-col justify-between items-center py-8 px-6 sm:px-10
        rounded-[40px]
        bg-slate-950 
        border
        overflow-hidden
        group
      `}
    >
      {/* Background FX */}
      <div className={`absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b ${theme.gradient} to-transparent opacity-25 pointer-events-none transition-all duration-1000`} />

      {/* --- CORREÇÃO AQUI ---
         Canvas e Vídeo invisíveis mas RENDERIZADOS para o PiP funcionar 
      */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 opacity-0 pointer-events-none -z-50" />
      <video ref={videoRef} className="absolute top-0 left-0 opacity-0 pointer-events-none -z-50" muted autoPlay playsInline />

      {!isLoaded ? (
        // --- SKELETON ---
        <div className="w-full h-full flex flex-col justify-between items-center animate-pulse z-20">
          <div className="w-full flex flex-col items-center gap-6 pt-2">
             <div className="flex flex-col items-center gap-3">
               <div className="h-8 w-40 bg-slate-800/50 rounded-lg" />
               <div className="h-1 w-12 bg-slate-800/30 rounded-full" />
             </div>
             <div className="h-10 w-full max-w-[280px] bg-slate-800/40 rounded-2xl" />
             <div className="flex flex-col items-center gap-2 mt-2">
                <div className="h-3 w-32 bg-slate-800/40 rounded" />
                <div className="h-2 w-24 bg-slate-800/30 rounded" />
             </div>
          </div>
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-800/30 flex items-center justify-center">
             <div className="h-20 w-40 bg-slate-800/50 rounded-xl" />
          </div>
          <div className="flex flex-col items-center gap-4 pb-4">
             <div className="w-20 h-20 rounded-full bg-slate-800/50" />
             <div className="h-3 w-16 bg-slate-800/30 rounded" />
          </div>
        </div>
      ) : (
        // --- UI REAL ---
        <>
          {/* BOTÕES DE CONTROLE SUPERIOR (ZEN e PiP) */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
            
            <button
              onClick={togglePiP}
              className={`
                p-2 rounded-full transition-all duration-300 group/pip
                ${isPiPActive 
                  ? 'text-cyan-400 bg-cyan-900/20' 
                  : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'}
              `}
              title={isPiPActive ? "Fechar Mini Player (P)" : "Abrir Mini Player (P)"}
            >
              <PictureInPicture2 className={`w-5 h-5 ${isPiPActive ? 'opacity-100' : 'opacity-50 group-hover/pip:opacity-100'}`} />
            </button>

            {onToggleZen && (
              <button
                onClick={onToggleZen}
                className="p-2 rounded-full text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all duration-300 group/zen"
                title="Modo Zen (Atalho: Z)"
              >
                {isZenMode ? (
                  <Minimize2 className="w-5 h-5 opacity-50 group-hover/zen:opacity-100" />
                ) : (
                  <Maximize2 className="w-5 h-5 opacity-50 group-hover/zen:opacity-100" />
                )}
              </button>
            )}
          </div>

          <div className="z-10 w-full flex flex-col items-center gap-6 pt-2 shrink-0">
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
                  title={m === 'focus' ? 'Atalho: M' : ''}
                >
                  {MODES[m].label}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-200 drop-shadow-sm">
                Sessão Atual: <span className={`transition-colors duration-300 ${theme.text}`}>{MODES[mode].label} · {MODES[mode].minutes} min</span>
              </p>
              <p className="text-[9px] font-semibold tracking-wider uppercase text-slate-500">
                Próximo: {nextMode.label} · {nextMode.minutes} min
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center w-full relative py-4">
            <div className={`
              relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center rounded-full 
              transition-all duration-1000
              ${isRunning ? `animate-breathing-glow ${theme.glow}` : ''}
              ${isCompleted ? 'scale-110' : ''}
            `}>
              <svg className="w-full h-full absolute transform -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" fill="transparent" className="text-slate-800/60" />
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

              <div className="z-10 flex flex-col items-center justify-center transform translate-y-1">
                <span className={`text-7xl sm:text-8xl font-medium tracking-tighter tabular-nums select-none drop-shadow-xl font-sans transition-colors duration-300 ${isCompleted ? theme.text : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mt-2 opacity-80 transition-colors duration-500 ${theme.text}`}>
                  {isCompleted ? 'CONCLUÍDO' : (isRunning ? 'Em fluxo' : 'Pausado')}
                </span>
              </div>
            </div>
          </div>

          <div className={`
            z-10 mt-2 mb-4 w-full px-8 text-center shrink-0
            transition-all duration-1000 ease-in-out
            ${isRunning || isCompleted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          `}>
            <p className="text-[11px] text-slate-400 font-medium tracking-wider leading-relaxed select-none">
              {quote}
            </p>
          </div>

          <div className="z-10 w-full flex flex-col items-center justify-center gap-4 pb-4 shrink-0">
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
              title={isRunning ? "Pausar (Espaço)" : "Iniciar (Espaço)"}
            >
              {isCompleted ? (
                 <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                 isRunning ? (
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                 ) : (
                  <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                 )
              )}
            </button>

            <button
              onClick={resetTimer}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors"
              title="Atalho: R"
            >
              Reiniciar
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}