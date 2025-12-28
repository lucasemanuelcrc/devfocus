'use client';
import { useState } from 'react';
import { SoundTrack } from '@/types';

const PLAYLISTS: SoundTrack[] = [
  { id: '1', title: 'Lofi Girl - Relax & Study', url: 'https://www.youtube.com/embed/jfKfPfyJRdk' },
  { id: '2', title: 'Synthwave Radio', url: 'https://www.youtube.com/embed/4xDzrJKXOOY' },
  { id: '3', title: 'Deep Focus Ambient', url: 'https://www.youtube.com/embed/85P294-b7qg' },
];

export default function SoundsCard() {
  const [currentTrack, setCurrentTrack] = useState<SoundTrack>(PLAYLISTS[0]);

  return (
    <div className="h-full bg-neutral-900 rounded-2xl border border-neutral-800 p-6 flex flex-col shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Sons para Foco</h2>
        <span className="text-xs text-indigo-400 font-medium px-2 py-1 bg-indigo-500/10 rounded-full">
          {currentTrack.title}
        </span>
      </div>

      {/* Player Wrapper - Aspect Ratio 16:9 obrigatório */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-neutral-800 relative mb-4">
        <iframe
          src={`${currentTrack.url}?autoplay=0&controls=0&rel=0`}
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; encrypted-media"
          title="Audio Player"
        />
      </div>

      {/* Track Selector Compacto */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {PLAYLISTS.map((track) => (
          <button
            key={track.id}
            onClick={() => setCurrentTrack(track)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
              currentTrack.id === track.id
                ? 'bg-neutral-800 text-white border-neutral-700'
                : 'bg-transparent text-neutral-500 border-transparent hover:bg-neutral-800/50'
            }`}
          >
            {track.title.split('-')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}