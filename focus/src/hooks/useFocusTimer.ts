import { useState, useEffect, useCallback } from 'react';
import { TimerMode } from '@/types';

const CONFIG = {
  focus: { time: 25 * 60, label: 'Foco Profundo' },
  shortBreak: { time: 5 * 60, label: 'Pausa Curta' },
  longBreak: { time: 15 * 60, label: 'Pausa Longa' },
};

export function useFocusTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(CONFIG.focus.time);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(CONFIG[mode].time);
  }, [mode]);

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(CONFIG[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isActive,
    mode,
    config: CONFIG,
    toggleTimer,
    resetTimer,
    changeMode
  };
}