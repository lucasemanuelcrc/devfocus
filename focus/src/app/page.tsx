'use client'; // Adicionado pois agora usamos useState na página

import { useState } from 'react';
import TimerCard from '@/components/TimerCard';
import GoalsCard from '@/components/GoalsCard';
import SoundsCard from '@/components/SoundsCard';
import StreakCard from '@/components/StreakCard';

export default function Home() {
  // Estado para controlar o Modo Zen
  const [isZenMode, setIsZenMode] = useState(false);

  const toggleZenMode = () => setIsZenMode(!isZenMode);

  return (
    <main className="min-h-screen bg-focus-base text-slate-200 p-6 md:p-8 lg:px-12 lg:py-10 font-sans selection:bg-brand-primary/30 flex items-center justify-center transition-all duration-500">

      <div className="w-full max-w-[1400px] h-full lg:h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mx-auto relative">

        {/* Área Principal: Timer */}
        {/* Se Zen, ocupa 12 colunas. Se Normal, ocupa 8. Transição suave. */}
        <section className={`
          h-[500px] lg:h-full relative z-10 flex flex-col transition-all duration-500 ease-in-out
          ${isZenMode ? 'lg:col-span-12' : 'lg:col-span-8'}
        `}>
          <div className="flex-1 w-full h-full">
            <TimerCard 
              isZenMode={isZenMode} 
              onToggleZen={toggleZenMode} 
            />
          </div>
        </section>

        {/* Sidebar: Ferramentas Secundárias */}
        {/* Se Zen, fica invisível e sem interação. */}
        <aside className={`
          flex flex-col gap-6 h-full min-h-0 relative z-10 transition-all duration-500 ease-in-out
          ${isZenMode 
            ? 'opacity-0 pointer-events-none lg:w-0 lg:col-span-0 overflow-hidden hidden lg:flex' 
            : 'opacity-100 lg:col-span-4'}
        `}>

          <div className="shrink-0 w-full">
            <StreakCard />
          </div>

          <div className="flex-1 min-h-0 w-full">
            <GoalsCard />
          </div>

          <div className="shrink-0 w-full h-auto">
            <SoundsCard />
          </div>

        </aside>

      </div>
    </main>
  );
}