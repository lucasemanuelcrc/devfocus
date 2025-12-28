'use client';

import { useState, KeyboardEvent, useRef } from 'react';
import { useGoals } from '@/hooks/useGoals';

export default function GoalsCard() {
  const { goals, addGoal, toggleGoal, removeGoal } = useGoals();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddGoal = () => {
    const success = addGoal(inputValue);
    if (success) {
      setInputValue('');
      setError(null);
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    } else {
      showError('A meta não pode estar vazia.');
    }
  };

  const showError = (msg: string) => {
    setError(msg);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => setError(null), 3000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddGoal();
  };

  const handleChange = (text: string) => {
    setInputValue(text);
    if (error) setError(null);
  };

  return (
    // ESTRUTURA FLEX VERTICAL
    // h-full: Preenche o wrapper (definido no page.tsx)
    // overflow-hidden: Garante que nada vaze das bordas arredondadas
    <div className="flex flex-col h-full bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm overflow-hidden">

      {/* ÁREA SUPERIOR (FIXA) 
          shrink-0: Garante que o input nunca diminua de tamanho, mesmo com pouco espaço.
      */}
      <div className="shrink-0 p-6 pb-2 bg-neutral-900 z-10 border-b border-transparent">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          Metas da Sessão
          <span className="text-xs font-normal text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
            {goals.filter(g => g.completed).length}/{goals.length}
          </span>
        </h2>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nova meta..."
              className={`w-full bg-neutral-950 border text-neutral-200 text-sm rounded-lg pl-4 pr-4 py-3 focus:outline-none transition-all placeholder:text-neutral-600
                ${error
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-neutral-800 focus:border-indigo-500/50'
                }`}
            />
          </div>
          <button
            onClick={handleAddGoal}
            className="px-4 bg-neutral-800 hover:bg-indigo-600 hover:text-white text-neutral-400 rounded-lg text-sm font-medium transition-colors min-w-[80px]"
          >
            Adicionar
          </button>
        </div>

        <div className="h-6 mt-1 flex items-center">
          {error && <span className="text-xs text-red-400 font-medium animate-pulse">⚠️ {error}</span>}
        </div>
      </div>

      {/* ÁREA DE LISTA (ROLÁVEL)
          flex-1: Ocupa todo o espaço restante do card.
          overflow-y-auto: Cria a barra de rolagem apenas aqui.
          min-h-0: Reforço para garantir o cálculo correto do flexbox.
      */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4 space-y-1 custom-scrollbar">
        {goals.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-neutral-800/50 rounded-xl opacity-60">
            <span className="text-2xl mb-2">🚀</span>
            <p className="text-sm text-neutral-400">Nenhuma meta definida</p>
          </div>
        ) : (
          <ul className="space-y-2 py-1">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="group flex items-center gap-3 p-3 rounded-xl bg-neutral-800/20 hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50 transition-all animate-fade-in"
              >
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0 ${goal.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-neutral-600 hover:border-indigo-400'
                    }`}
                >
                  {goal.completed && <span>✓</span>}
                </button>
                <span className={`flex-1 text-sm break-words ${goal.completed ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}>
                  {goal.text}
                </span>
                <button onClick={() => removeGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 px-2">
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}