import TimerCard from '@/components/TimerCard';
import GoalsCard from '@/components/GoalsCard';
import SoundsCard from '@/components/SoundsCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 p-6 md:p-8 lg:p-12">
      <div className="w-full max-w-[1600px] h-full lg:h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        <section className="lg:col-span-8 h-[500px] lg:h-full">
          <TimerCard />
        </section>

        <aside className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">

          <div className="flex-1 min-h-0">
            <GoalsCard />
          </div>

          <div className="shrink-0">
            <SoundsCard />
          </div>

        </aside>

      </div>
    </main>
  );
}
