'use client';

import { useState, useRef, useEffect } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';

// Interface para as metas
interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export default function GoalsCard() {
  const { colors } = useThemeColors();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Estado local
  const [goals, setGoals] = useState<Goal[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false); // Flag de controle

  // --- PERSISTÊNCIA (NOVO) ---
  // 1. Carregar dados ao montar
  useEffect(() => {
    const savedGoals = localStorage.getItem('focus_goals');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Erro ao carregar metas:', error);
      }
    }
    setIsLoaded(true); // Marca como carregado para liberar o salvamento
  }, []);

  // 2. Salvar dados quando 'goals' mudar (apenas se já tiver carregado)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('focus_goals', JSON.stringify(goals));
    }
  }, [goals, isLoaded]);

  // Auto-scroll para o fim da lista ao adicionar item
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [goals]);

  // Handlers (Lógica de Negócio Mantida)
  const addGoal = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };

    setGoals([...goals, newGoal]);
    setInputValue('');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g =>
      g.id === id ? { ...g, completed: !g.completed } : g
    ));
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // Cálculos de Progresso
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const progress = totalGoals === 0 ? 0 : (completedGoals / totalGoals) * 100;

  // Renderização (UI Mantida idêntica)
  return (
    <div className="h-full flex flex-col bg-slate-950 border border-slate-800/50 rounded-[32px] shadow-xl shadow-black/20 overflow-hidden relative">

      {/* HEADER */}
      <div className="p-6 pb-2 shrink-0 z-10 bg-slate-950/95 backdrop-blur-sm">
        <div className="flex justify-between items-end mb-3">
          <h2 className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${colors.accent}`}>
            Minhas Metas
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {completedGoals}/{totalGoals}
          </span>
        </div>
        {/* Barra de Progresso */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out ${colors.buttonBg}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* LISTA */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-focus"
      >
        {goals.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 opacity-50">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-xs font-medium">Nenhuma meta definida</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-transparent hover:border-slate-800 hover:bg-slate-900 transition-all duration-200"
            >
              <button
                onClick={() => toggleGoal(goal.id)}
                className={`
                  shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300
                  ${goal.completed
                    ? `${colors.buttonBg} border-transparent text-white`
                    : 'border-slate-700 text-transparent hover:border-slate-500'}
                `}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z" /></svg>
              </button>

              <span
                className={`flex-1 text-sm font-medium truncate transition-all duration-300 ${goal.completed ? 'text-slate-600 line-through' : 'text-slate-200'
                  }`}
              >
                {goal.text}
              </span>

              <button
                onClick={() => removeGoal(goal.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                title="Remover meta"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 pt-2 bg-slate-950/95 backdrop-blur-sm z-10 border-t border-slate-900">
        <form onSubmit={addGoal} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Adicionar nova meta..."
            className="w-full pl-4 pr-12 py-3 bg-slate-900 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`
              absolute right-2 p-1.5 rounded-lg text-white transition-all duration-200
              ${inputValue.trim()
                ? `${colors.buttonBg} hover:opacity-90 shadow-lg`
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
}