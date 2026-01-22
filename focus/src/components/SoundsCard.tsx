'use client';

import { useState, useEffect } from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SoundTrack {
  id: string;
  title: string;
  url: string;
}

const PLAYLISTS: SoundTrack[] = [
  { id: '1', title: 'Coding', url: 'https://www.youtube.com/embed/tXB7odE1HuA?si=vNyvfECHXaRQagLa' },
  { id: '2', title: 'Flow', url: 'https://www.youtube.com/embed/R3wto4Uy-Fg?si=580VuUiLhye67shi' },
  { id: '3', title: 'Break', url: 'https://www.youtube.com/embed/0w80F8FffQ4?si=-ks7deV7iKGjOTBU' },
];

export default function SoundsCard() {
  const { colors } = useThemeColors();
  const [currentTrack, setCurrentTrack] = useState<SoundTrack>(PLAYLISTS[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    const savedTrackId = localStorage.getItem('focus_sound_track_id');
    if (savedTrackId) {
      const foundTrack = PLAYLISTS.find(t => t.id === savedTrackId);
      if (foundTrack) setCurrentTrack(foundTrack);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('focus_sound_track_id', currentTrack.id);
    }
  }, [currentTrack, isLoaded]);

  return (
    <div className="h-full flex flex-col bg-slate-950 border border-slate-800/50 rounded-[32px] shadow-xl shadow-black/20 overflow-hidden relative p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h2 className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${colors.accent}`}>
          Focus Music
        </h2>

        {/* Indicador de Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800/50">
          <span className={`relative flex h-2 w-2`}>
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.buttonBg}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.buttonBg}`}></span>
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate max-w-[80px]">
            {currentTrack.title}
          </span>
        </div>
      </div>

      {/* PLAYER WRAPPER */}
      <div className="w-full relative group mb-5 shadow-2xl shadow-black/50 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <div className="aspect-video w-full">
          <iframe
            src={`${currentTrack.url}?autoplay=0&controls=0&rel=0&modestbranding=1`}
            className="w-full h-full opacity-100"
            allow="autoplay; encrypted-media"
            title="Audio Player"
            loading="lazy"
          />
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {PLAYLISTS.map((track) => {
          const isActive = currentTrack.id === track.id;
          return (
            <button
              key={track.id}
              onClick={() => setCurrentTrack(track)}
              className={`
                flex-shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border
                ${isActive
                  ? `bg-slate-800 text-white ${colors.accent.replace('text', 'border')}`
                  : 'bg-transparent text-slate-500 border-slate-800 hover:bg-slate-900 hover:text-slate-300 hover:border-slate-700'
                }
              `}
            >
              {track.title.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}