'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusStats } from '@/hooks/useFocusStats';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { usePiP } from '@/hooks/usePiP';
import { Maximize2, Minimize2, PictureInPicture2, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURAÇÃO E TIPOS ---
type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

// Adicionado o modo 'custom' mantendo os originais intactos
const MODES = {
  focus: { label: 'Deep Focus', minutes: 25, color: 'cyan', hex: '#06b6d4' },
  shortBreak: { label: 'Descanso Curto', minutes: 5, color: 'emerald', hex: '#10b981' },
  longBreak: { label: 'Descanso Longo', minutes: 15, color: 'violet', hex: '#8b5cf6' },
  custom: { label: 'Livre', minutes: 30, color: 'amber', hex: '#f59e0b' }, // Novo Modo
};

const QUOTES = [
  "Foque em uma coisa de cada vez.",
  "Sessão de foco profundo.",
  "Sem distrações agora.",
  "Construa o seu futuro agora.",
  "Silencie o ruído, amplie o foco.",
  "Um passo de cada vez.",
  "A disciplina é a liberdade.",
];

interface TimerCardProps {
  isZenMode?: boolean;
  onToggleZen?: () => void;
}

export default function TimerCard({ isZenMode = false, onToggleZen }: TimerCardProps) {
  // --- ESTADO ---
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
  const [customMinutes, setCustomMinutes] = useState(30); // Estado para o tempo personalizado
  const [isRunning, setIsRunning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [quote, setQuote] = useState(QUOTES[0]);
  const [isCompleted, setIsCompleted] = useState(false);

  // --- HOOKS ---
  const { registerSession } = useFocusStats();
  const { playClick, playSwitch, playDone } = useSoundEffects();
  
  // PiP Hook precisa saber o tempo máximo dinamicamente
  const maxTime = mode === 'custom' ? customMinutes * 60 : MODES[mode].minutes * 60;
  
  const { togglePiP, isPiPActive, canvasRef, videoRef } = usePiP({
    timeLeft,
    maxTime,
    mode,
    isRunning,
  });

  // --- PERSISTÊNCIA E INICIALIZAÇÃO ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedMode = localStorage.getItem('focus_timer_mode') as TimerMode;
      const savedTime = localStorage.getItem('focus_timer_time');
      const savedCustom = localStorage.getItem('focus_custom_minutes');

      // Restaura o tempo customizado salvo
      if (savedCustom) {
        setCustomMinutes(parseInt(savedCustom, 10));
      }

      if (savedMode && MODES[savedMode]) {
        setMode(savedMode);
      }
      
      if (savedTime) {
        const parsedTime = parseInt(savedTime, 10);
        if (!isNaN(parsedTime)) setTimeLeft(parsedTime);
      }

      // Validação de Streak (Mantida da Base Oficial)
      const lastDateIso = localStorage.getItem('focus-last-date');
      if (lastDateIso) {
        const lastDate = new Date(lastDateIso);
        const today = new Date();
        lastDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          localStorage.setItem('focus-streak', '0');
        }
      }

      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Salva estados
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('focus_timer_mode', mode);
      localStorage.setItem('focus_timer_time', timeLeft.toString());
      localStorage.setItem('focus_custom_minutes', customMinutes.toString());
    }
  }, [mode, timeLeft, customMinutes, isLoaded]);

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, [mode]);

  // --- TEMAS (Adicionado suporte ao modo Custom/Amber) ---
  const theme = {
    focus: {
      text: 'text-cyan-400', bg: 'bg-cyan-500', ring: 'text-cyan-500', glow: 'shadow-cyan-500/40', gradient: 'from-cyan-900/20',
    },
    shortBreak: {
      text: 'text-emerald-400', bg: 'bg-emerald-500', ring: 'text-emerald-500', glow: 'shadow-emerald-500/40', gradient: 'from-emerald-900/20',
    },
    longBreak: {
      text: 'text-violet-400', bg: 'bg-violet-600', ring: 'text-violet-600', glow: 'shadow-violet-500/40', gradient: 'from-violet-900/20',
    },
    custom: {
      text: 'text-amber-400', bg: 'bg-amber-500', ring: 'text-amber-500', glow: 'shadow-amber-500/40', gradient: 'from-amber-900/20',
    },
  }[mode];

  // --- ACTIONS ---
  const switchMode = useCallback((newMode: TimerMode) => {
    playSwitch();
    setMode(newMode);
    
    // Se for custom, usa o estado customMinutes, senão usa o fixo do MODES
    const newMinutes = newMode === 'custom' ? customMinutes : MODES[newMode].minutes;
    setTimeLeft(newMinutes * 60);
    
    setIsRunning(false);
    setIsCompleted(false);
  }, [playSwitch, customMinutes]);

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value, 10);
    setCustomMinutes(minutes);
    if (!isRunning) {
      setTimeLeft(minutes * 60);
    }
  };

  const toggleTimer = useCallback(() => {
    playClick();
    setIsRunning((prev) => !prev);
    setIsCompleted(false);
  }, [playClick]);

  const resetTimer = useCallback(() => {
    playSwitch();
    setIsRunning(false);
    setIsCompleted(false);
    const resetTime = mode === 'custom' ? customMinutes : MODES[mode].minutes;
    setTimeLeft(resetTime * 60);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, [mode, playSwitch, customMinutes]);

  // --- ATALHOS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (!isLoaded) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggleTimer();
          break;
        case 'KeyR':
          resetTimer();
          break;
        case 'KeyZ':
          if (onToggleZen) { playClick(); onToggleZen(); }
          break;
        case 'KeyP':
          togglePiP();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, resetTimer, onToggleZen, isLoaded, playClick, togglePiP]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      playDone();
      if (mode === 'focus' || mode === 'custom') {
        registerSession();
        localStorage.setItem('focus-last-date', new Date().toISOString());
      }
      setTimeout(() => setIsCompleted(false), 4000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, registerSession, playDone]);

  // Title Update
  useEffect(() => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const timeStr = `${m}:${s < 10 ? '0' : ''}${s}`;
    const icon = isCompleted ? '🎉' : (isRunning ? '🟢' : '⏸️');
    document.title = `${icon} ${timeStr} - FOCUS`;
  }, [timeLeft, isRunning, isCompleted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const circumference = 283;
  const strokeDashoffset = circumference - (timeLeft / maxTime) * circumference;

  return (
    <motion.div 
      layout
      transition={{ layout: { type: "spring", stiffness: 100, damping: 25 }, duration: 0.8 }}
      className={`relative h-full flex flex-col justify-between items-center py-8 px-6 sm:px-10 rounded-[40px] bg-slate-950 border overflow-hidden group ${isCompleted ? 'border-' + theme.bg.replace('bg-', '') : 'border-slate-800'}`}
      style={{ borderColor: isCompleted ? MODES[mode].hex : 'rgba(30, 41, 59, 0.6)' }}
    >
      {/* Background & Hidden PiP Elements */}
      <div className={`absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b ${theme.gradient} to-transparent opacity-25 pointer-events-none transition-all duration-1000`} />
      <canvas ref={canvasRef} className="absolute top-0 left-0 opacity-0 pointer-events-none -z-50" />
      <video ref={videoRef} className="absolute top-0 left-0 opacity-0 pointer-events-none -z-50" muted autoPlay playsInline />

      {!isLoaded ? (
        <div className="animate-pulse w-full h-full flex items-center justify-center"><div className="w-10 h-10 bg-slate-800 rounded-full"/></div>
      ) : (
        <>
          {/* Header Controls */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
            <button onClick={togglePiP} className={`p-2 rounded-full transition-all ${isPiPActive ? 'text-cyan-400 bg-cyan-900/20' : 'text-slate-600 hover:text-slate-300'}`}>
              <PictureInPicture2 className="w-5 h-5" />
            </button>
            {onToggleZen && (
              <button onClick={onToggleZen} className="p-2 rounded-full text-slate-600 hover:text-slate-300">
                {isZenMode ? <Minimize2 className="w-5 h-5"/> : <Maximize2 className="w-5 h-5"/>}
              </button>
            )}
          </div>

          {/* Top Section */}
          <div className="z-10 w-full flex flex-col items-center gap-6 pt-2 shrink-0">
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-500 uppercase select-none pl-2">
                FOCUS
              </h1>
              <div className={`w-12 h-0.5 rounded-full transition-colors duration-700 ${isRunning ? theme.bg : 'bg-slate-800'}`} />
            </div>

            {/* Mode Selector */}
            <div className="flex p-1.5 bg-slate-900/60 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner overflow-x-auto max-w-full scrollbar-hide">
              {(Object.keys(MODES) as TimerMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`
                    px-4 py-2 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-all duration-300 whitespace-nowrap
                    ${mode === m ? `${theme.bg} text-white shadow-lg scale-100` : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 scale-95'}
                  `}
                >
                  {MODES[m].label}
                </button>
              ))}
            </div>

            {/* SLIDER DE AJUSTE (Aparece apenas no modo CUSTOM e PAUSADO) */}
            <AnimatePresence>
              {mode === 'custom' && !isRunning && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col items-center gap-2 w-full max-w-[200px]"
                >
                  <div className="flex items-center gap-2 text-amber-500/80 text-[10px] font-bold uppercase tracking-wider">
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Ajustar Tempo: {customMinutes} min</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={customMinutes}
                    onChange={handleCustomTimeChange}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!isRunning && mode !== 'custom' && (
               <div className="flex flex-col items-center gap-1">
                 <p className="text-[10px] font-bold tracking-wider uppercase text-slate-200">
                   Sessão: <span className={theme.text}>{MODES[mode].label}</span>
                 </p>
               </div>
            )}
          </div>

          {/* Timer Circle */}
          <div className="flex-1 flex items-center justify-center w-full relative py-4">
            <div className={`relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center rounded-full transition-all duration-1000 ${isRunning ? `animate-breathing-glow ${theme.glow}` : ''} ${isCompleted ? 'scale-110' : ''}`}>
              <svg className="w-full h-full absolute transform -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" fill="transparent" className="text-slate-800/60" />
                <circle
                  cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2.5" fill="transparent"
                  strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  className={`transition-all duration-1000 ease-linear ${theme.ring}`}
                />
              </svg>

              <div className="z-10 flex flex-col items-center justify-center transform translate-y-1">
                <span className={`text-7xl sm:text-8xl font-medium tracking-tighter tabular-nums select-none drop-shadow-xl font-sans transition-colors duration-300 ${isCompleted ? theme.text : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mt-2 opacity-80 transition-colors duration-500 ${theme.text}`}>
                  {isCompleted ? 'CONCLUÍDO' : (isRunning ? 'EM ANDAMENTO' : (mode === 'custom' ? 'PERSONALIZADO' : 'PAUSADO'))}
                </span>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className={`z-10 mt-2 mb-4 w-full px-8 text-center shrink-0 transition-all duration-1000 ${isRunning || isCompleted ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            <p className="text-[11px] text-slate-400 font-medium tracking-wider leading-relaxed select-none">{quote}</p>
          </div>

          {/* Main Controls */}
          <div className="z-10 w-full flex flex-col items-center justify-center gap-4 pb-4 shrink-0">
            <button
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${theme.bg} ring-4 ring-slate-950 ring-offset-2 ring-offset-slate-900/50`}
            >
              {isRunning ? (
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              ) : (
                <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button onClick={resetTimer} className="text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-colors" title="Atalho: R">
              Reiniciar
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}