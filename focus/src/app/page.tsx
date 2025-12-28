import TimerCard from '@/components/TimerCard';
import GoalsCard from '@/components/GoalsCard';
import SoundsCard from '@/components/SoundsCard';
import StreakCard from '@/components/StreakCard'; // <--- Importe aqui

export default function Home() {
  return (
    <main className="min-h-screen bg-focus-base text-slate-200 p-6 md:p-8 lg:px-12 lg:py-10 font-sans selection:bg-brand-primary/30 flex items-center justify-center">

      <div className="w-full max-w-[1400px] h-full lg:h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mx-auto">

        {/* Área Principal: Timer */}
        <section className="lg:col-span-8 h-[500px] lg:h-full relative z-10 flex flex-col">
          <div className="flex-1 w-full h-full">
            <TimerCard />
          </div>
        </section>

        {/* Sidebar: Ferramentas Secundárias */}
        <aside className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0 relative z-10">

          {/* NOVO: Streak Card (Topo da Sidebar) */}
          <div className="shrink-0 w-full">
            <StreakCard />
          </div>

          {/* Bloco de Metas */}
          <div className="flex-1 min-h-0 w-full">
            <GoalsCard />
          </div>

          {/* Bloco de Sons */}
          <div className="shrink-0 w-full h-auto">
            <SoundsCard />
          </div>

        </aside>

      </div>
    </main>
  );
}