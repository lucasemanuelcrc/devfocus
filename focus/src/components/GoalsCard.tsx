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
      showError('Digite uma meta válida');
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
    // CARD: Fundo Slate Escuro com borda fina
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">

      {/* HEADER: Fundo levemente diferenciado para separar áreas */}
      <div className="shrink-0 p-6 bg-black/20 border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">
            Metas
          </h2>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/50">
            {goals.filter(g => g.completed).length} / {goals.length}
          </span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Adicionar nova tarefa..."
              className={`w-full bg-slate-950/50 text-slate-200 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none transition-all placeholder:text-slate-600
                ${error
                  ? 'border border-red-500/30 focus:border-red-500/50'
                  : 'border border-white/5 focus:border-cyan-500/30 group-hover:border-white/10'
                }`}
            />
            <button
              onClick={handleAddGoal}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-400 rounded-lg text-xs font-bold transition-all uppercase tracking-wide"
            >
              Add
            </button>
          </div>
        </div>

        <div className="h-4 mt-1">
          {error && <span className="text-[10px] text-red-400 font-medium animate-pulse tracking-wide">{error}</span>}
        </div>
      </div>

      {/* LISTA */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-2 custom-scrollbar">
        {goals.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <span className="text-xl">✨</span>
            </div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Lista vazia</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {goals.map((goal) => (
              <li
                key={goal.id}
                className="group flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/5 transition-all animate-fade-in"
              >
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${goal.completed
                      ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                      : 'border-slate-600 bg-transparent hover:border-cyan-400'
                    }`}
                >
                  {goal.completed && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}
                </button>
                <span className={`flex-1 text-sm font-medium transition-all ${goal.completed ? 'text-slate-600 line-through decoration-slate-700' : 'text-slate-300'}`}>
                  {goal.text}
                </span>
                <button onClick={() => removeGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-colors px-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}