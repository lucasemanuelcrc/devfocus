'use client';

import { useEffect, useRef, useState } from 'react';
import type { TimerMode } from '@/types';

interface ThemePalette {
  accent: string;      // Cor principal (texto, bordas)
  bgAccent: string;    // Cor de fundo suave
  buttonBg: string;    // Cor vibrante para botões
  buttonHover: string;
  glowColor: string;   // Cor da sombra para o efeito "breathing"
  ringColor: string;   // Cor do anel de progresso
}

const themes: Record<TimerMode, ThemePalette> = {
  focus: {
    accent: 'text-cyan-400',
    bgAccent: 'bg-cyan-950/30',
    buttonBg: 'bg-cyan-500',
    buttonHover: 'hover:bg-cyan-400',
    glowColor: 'shadow-cyan-500/40',
    ringColor: 'text-cyan-500',
  },
  shortBreak: {
    accent: 'text-emerald-400',
    bgAccent: 'bg-emerald-950/30',
    buttonBg: 'bg-emerald-500',
    buttonHover: 'hover:bg-emerald-400',
    glowColor: 'shadow-emerald-500/40',
    ringColor: 'text-emerald-500',
  },
  longBreak: {
    accent: 'text-violet-400',
    bgAccent: 'bg-violet-950/30',
    buttonBg: 'bg-violet-600',
    buttonHover: 'hover:bg-violet-500',
    glowColor: 'shadow-violet-500/40',
    ringColor: 'text-violet-600',
  },
};

const STORAGE_KEYS = {
  mode: 'focus_timer_mode',
  time: 'focus_timer_time',
} as const;

const isTimerMode = (v: unknown): v is TimerMode =>
  v === 'focus' || v === 'shortBreak' || v === 'longBreak';

export function useThemeColors() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState(false);

  // Detecta "rodando" observando se o tempo salvo muda a cada segundo.
  // (Isso evita mexer no core do TimerCard e ainda dá um estado útil pra UI.)
  const lastTimeRef = useRef<number | null>(null);
  const stableTicksRef = useRef(0);

  useEffect(() => {
    const readMode = () => {
      const saved = localStorage.getItem(STORAGE_KEYS.mode);
      if (isTimerMode(saved)) setMode(saved);
    };

    const pollRunning = () => {
      const rawTime = localStorage.getItem(STORAGE_KEYS.time);
      const parsed = rawTime ? Number.parseInt(rawTime, 10) : Number.NaN;

      if (!Number.isFinite(parsed)) {
        stableTicksRef.current += 1;
        if (stableTicksRef.current >= 2) setIsRunning(false);
        return;
      }

      const last = lastTimeRef.current;

      if (last === null) {
        lastTimeRef.current = parsed;
        stableTicksRef.current = 0;
        setIsRunning(false);
        return;
      }

      if (parsed !== last) {
        lastTimeRef.current = parsed;
        stableTicksRef.current = 0;
        setIsRunning(true);
        return;
      }

      stableTicksRef.current += 1;
      if (stableTicksRef.current >= 2) setIsRunning(false);
    };

    // Inicial
    readMode();
    pollRunning();

    // Poll leve (1s) para sincronizar UI no mesmo tab
    const intervalId = window.setInterval(pollRunning, 1000);

    // Mudança de localStorage (outros tabs/janelas)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.mode) readMode();
    };

    // Re-sincroniza ao voltar pro tab
    const onFocus = () => {
      readMode();
      pollRunning();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const currentTheme = themes[mode];

  const breathingAnimationClass = isRunning
    ? `animate-breathing-glow ${currentTheme.glowColor}`
    : '';

  return {
    mode,
    isRunning,
    colors: currentTheme,
    breathingAnimationClass,
  };
}
