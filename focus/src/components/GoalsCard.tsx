'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useGoals } from '@/hooks/useGoals';

export default function GoalsCard() {
  const { goals, addGoal, toggleGoal, removeGoal } = useGoals();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Referência para limpar timeout de erro se o usuário digitar rápido
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddGoal = () => {
    // Tentativa de adicionar via hook
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
    if (e.key === 'Enter') {
      handleAddGoal();
    }
  };

  // Limpa o erro assim que o usuário começa a digitar novamente
  const handleChange = (text: string) => {
    setInputValue(text);
    if (error) setError(null);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm overflow-hidden">
      
      {/* Cabeçalho e Input */}
      <div className="p-6 pb-2 bg-neutral-900 z-10">
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
              placeholder="O que vamos concluir agora?"
              className={`w-full bg-neutral-950 border text-neutral-200 text-sm rounded-lg pl-4 pr-4 py-3 focus:outline-none transition-all placeholder:text-neutral-600
                ${error 
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                  : 'border-neutral-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20'
                }`}
            />
          </div>
          <button 
            onClick={handleAddGoal}
            className="px-4 py-2 bg-neutral-800 hover:bg-indigo-600 hover:text-white text-neutral-400 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center min-w-[80px]"
          >
            Adicionar
          </button>
        </div>

        {/* Feedback de Erro com altura fixa para evitar layout shift excessivo */}
        <div className="h-6 mt-1 flex items-center">
          {error && (
            <span className="text-xs text-red-400 font-medium animate-pulse flex items-center gap-1">
              ⚠️ {error}
            </span>
          )}
        </div>
      </div>

      {/* Lista de Metas */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
        {goals.length === 0 ? (
          // Estado Vazio
          <div className="h-40 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-neutral-800/50 rounded-xl mt-2">
            <span className="text-2xl mb-2 opacity-50">🚀</span>
            <p className="text-sm text-neutral-400 font-medium">Nenhuma meta definida</p>
            <p className="text-xs text-neutral-600 mt-1">Adicione uma tarefa pequena para<br/>manter o ritmo do foco.</p>
          </div>
        ) : (
          // Lista Real
          <ul className="space-y-2">
            {goals.map((goal) => (
              <li 
                key={goal.id} 
                className="group flex items-center gap-3 p-3 rounded-xl bg-neutral-800/20 hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50 transition-all animate-fade-in"
              >
                {/* Checkbox Customizado */}
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
                    goal.completed 
                      ? 'bg-indigo-500 border-indigo-500 text-white' 
                      : 'border-neutral-600 hover:border-indigo-400 bg-transparent'
                  }`}
                  aria-label={goal.completed ? "Desmarcar meta" : "Marcar meta como concluída"}
                >
                  {goal.completed && (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Texto da Meta */}
                <span 
                  className={`flex-1 text-sm transition-all duration-300 break-words ${
                    goal.completed 
                      ? 'text-neutral-500 line-through decoration-neutral-600' 
                      : 'text-neutral-200'
                  }`}
                >
                  {goal.text}
                </span>

                {/* Botão de Remover */}
                <button
                  onClick={() => removeGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Remover meta"
                  aria-label="Remover meta"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}