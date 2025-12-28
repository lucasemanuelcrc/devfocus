'use client';
import { useState } from 'react';
import { SoundTrack } from '@/types';

const PLAYLISTS: SoundTrack[] = [
  { id: '1', title: 'Lofi Girl', url: 'https://www.youtube.com/embed/jfKfPfyJRdk' },
  { id: '2', title: 'Synthwave', url: 'https://www.youtube.com/embed/4xDzrJKXOOY' },
  { id: '3', title: 'Classical', url: 'https://www.youtube.com/embed/mIYzp5rcTvU' },
];

export default function SoundsCard() {
  const [currentTrack, setCurrentTrack] = useState<SoundTrack>(PLAYLISTS[0]);

  return (
    <div className="h-full bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Sons</h2>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider opacity-80">
            {currentTrack.title}
          </span>
        </div>
      </div>

      {/* Player Wrapper */}
      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl relative mb-5 group">
        <iframe
          src={`${currentTrack.url}?autoplay=0&controls=0&rel=0`}
          className="absolute top-0 left-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          allow="autoplay; encrypted-media"
          title="Audio Player"
        />
      </div>

      {/* Selector Clean */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {PLAYLISTS.map((track) => (
          <button
            key={track.id}
            onClick={() => setCurrentTrack(track)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${currentTrack.id === track.id
                ? 'bg-white/10 text-white border-white/10 shadow-sm'
                : 'bg-transparent text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-300'
              }`}
          >
            {track.title.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}