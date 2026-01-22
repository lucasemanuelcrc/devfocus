// src/hooks/useGoals.ts
import { useState, useCallback } from 'react';
import { Goal } from '@/types';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = useCallback((text: string): boolean => {
    // Validação de lógica de negócio (não UI)
    if (!text.trim()) {
      return false;
    }

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
    };

    // Adiciona no topo da lista para visibilidade imediata
    setGoals((prev) => [newGoal, ...prev]);
    return true;
  }, []);

  const toggleGoal = useCallback((id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  }, []);

  const removeGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { goals, addGoal, toggleGoal, removeGoal };
}