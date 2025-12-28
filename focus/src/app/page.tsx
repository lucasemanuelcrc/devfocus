import TimerCard from '@/components/TimerCard';
import GoalsCard from '@/components/GoalsCard';
import SoundsCard from '@/components/SoundsCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 p-6 md:p-8 lg:p-12 flex items-center justify-center">
      
      {/* Container Principal: Limite de largura e grid */}
      <div className="w-full max-w-[1600px] h-full lg:h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Timer (Protagonista - ~66%) */}
        <section className="lg:col-span-8 h-[500px] lg:h-full">
          <TimerCard />
        </section>

        {/* Coluna Direita: Utilitários (~33%) */}
        <aside className="lg:col-span-4 flex flex-col gap-6 h-full">
          
          {/* Card Superior: Metas (Flexível) */}
          <div className="flex-1 min-h-[300px]">
            <GoalsCard />
          </div>
          
          {/* Card Inferior: Sons (Fixo pela proporção do vídeo + controles) */}
          <div className="h-auto shrink-0">
            <SoundsCard />
          </div>
          
        </aside>

      </div>
    </main>
  );
}