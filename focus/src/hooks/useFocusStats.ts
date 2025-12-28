'use client';

import { useState, useEffect } from 'react';

// Chave do LocalStorage
const STORAGE_KEY = 'focus_stats_data';

interface FocusStats {
  streak: number;
  sessionsToday: number;
  lastSessionDate: string | null;
}

export function useFocusStats() {
  const [stats, setStats] = useState<FocusStats>({
    streak: 0,
    sessionsToday: 0,
    lastSessionDate: null,
  });

  // Carregar dados ao iniciar
  useEffect(() => {
    const loadStats = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: FocusStats = JSON.parse(saved);
        checkDailyReset(parsed);
      }
    };

    loadStats();

    // Ouvir mudanças de outras abas/janelas
    window.addEventListener('storage', loadStats);
    // Ouvir evento customizado
    window.addEventListener('focus-session-completed', loadStats);

    return () => {
      window.removeEventListener('storage', loadStats);
      window.removeEventListener('focus-session-completed', loadStats);
    };
  }, []);

  // Verifica se o dia mudou para resetar o contador diário
  const checkDailyReset = (currentStats: FocusStats) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Se a última data salva não for hoje, reseta sessionsToday
    if (currentStats.lastSessionDate !== today) {
      setStats({
        ...currentStats,
        sessionsToday: 0, // Novo dia, zero sessões
      });
    } else {
      setStats(currentStats);
    }
  };

  // Função para registrar uma nova sessão completada (Sem parâmetros)
  const registerSession = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats.lastSessionDate;
    
    let newStreak = stats.streak;
    
    if (lastDate === today) {
      // Já fez hoje, mantém o streak
      newStreak = stats.streak;
    } else if (lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayString) {
        // Fez ontem, aumenta streak
        newStreak += 1;
      } else {
        // Quebrou a sequência, reseta para 1
        newStreak = 1;
      }
    } else {
      // Primeira vez
      newStreak = 1;
    }

    const currentSessions = stats.lastSessionDate === today ? stats.sessionsToday : 0;

    const newStats: FocusStats = {
      streak: newStreak,
      sessionsToday: currentSessions + 1,
      lastSessionDate: today,
    };

    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    
    // Dispara evento
    window.dispatchEvent(new Event('focus-session-completed'));
  };

  return {
    streak: stats.streak,
    sessionsToday: stats.sessionsToday,
    registerSession,
  };
}