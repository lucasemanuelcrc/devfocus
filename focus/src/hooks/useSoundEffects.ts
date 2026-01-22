'use client';

import { useCallback } from 'react';

export function useSoundEffects() {
  const playSound = useCallback((fileName: string, volume = 0.4) => {
    try {
      const audio = new Audio(`/sounds/${fileName}`);
      audio.volume = volume;
      audio.play().catch((err) => {
        // Ignora erros de autoplay (comum se o usuário ainda não interagiu com a página)
        // console.warn('Audio play failed', err);
      });
    } catch (e) {
      // Falha silenciosa para não quebrar a app se o arquivo faltar
    }
  }, []);

  const playClick = useCallback(() => playSound('click.mp3', 0.5), [playSound]);
  const playSwitch = useCallback(() => playSound('switch.mp3', 0.3), [playSound]);
  const playDone = useCallback(() => playSound('done.mp3', 0.6), [playSound]);

  return {
    playClick,
    playSwitch,
    playDone,
  };
}