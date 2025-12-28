import TimerCard from '@/components/TimerCard';
import GoalsCard from '@/components/GoalsCard';
import SoundsCard from '@/components/SoundsCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 p-6 md:p-10 lg:px-12 lg:py-10 font-sans selection:bg-cyan-500/30">

      <div className="w-full max-w-[1600px] h-full lg:h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mx-auto">

        <section className="lg:col-span-8 h-[500px] lg:h-full relative z-10">
          <TimerCard />
        </section>

        <aside className="lg:col-span-4 flex flex-col gap-8 h-full min-h-0 relative z-10">

          <div className="flex-1 min-h-0 shadow-xl shadow-black/20 rounded-3xl">
            <GoalsCard />
          </div>

          <div className="shrink-0 shadow-xl shadow-black/20 rounded-3xl">
            <SoundsCard />
          </div>

        </aside>

      </div>
    </main>
  );
}
