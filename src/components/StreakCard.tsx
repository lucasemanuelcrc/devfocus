'use client';

import { Flame, Zap } from 'lucide-react';
import { useFocusStats } from '@/hooks/useFocusStats';

export default function StreakCard() {
  // Conecta com a lógica real via Hook
  const { streak, sessionsToday } = useFocusStats();

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800/60 rounded-3xl p-5 flex items-center justify-between shadow-lg backdrop-blur-sm group hover:border-slate-700/80 transition-all duration-300">
      
      {/* Lado Esquerdo: Streak (Consistência) */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner relative overflow-hidden">
          <div className={`absolute inset-0 bg-cyan-500/10 transition-opacity duration-300 ${streak > 0 ? 'opacity-100' : 'opacity-0'}`} />
          <Flame 
            className={`w-6 h-6 transition-all duration-500 ${
              streak > 0 
                ? 'text-cyan-400 fill-cyan-400/20 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-pulse' 
                : 'text-slate-600'
            }`} 
          />
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            Consistência
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-200">
              {streak}
            </span>
            <span className="text-sm font-medium text-slate-400">
              dias seguidos
            </span>
          </div>
        </div>
      </div>

      {/* Divisor Vertical */}
      <div className="h-8 w-px bg-slate-800/50 mx-2" />

      {/* Lado Direito: Sessões Hoje */}
      <div className="flex flex-col items-end pr-1">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Zap className={`w-3.5 h-3.5 ${sessionsToday > 0 ? 'text-emerald-400' : 'text-slate-600'}`} />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Hoje
          </span>
        </div>
        <span className="text-lg font-bold text-slate-200 tabular-nums leading-none">
          {sessionsToday} <span className="text-xs font-medium text-slate-500">focos</span>
        </span>
      </div>

    </div>
  );
}