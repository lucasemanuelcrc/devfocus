'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePiPProps {
  timeLeft: number;
  maxTime: number;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  isRunning: boolean;
}

const COLORS = {
  focus: '#06b6d4',
  shortBreak: '#10b981',
  longBreak: '#8b5cf6',
  bg: '#020617',
  text: '#e2e8f0',
};

export function usePiP({ timeLeft, maxTime, mode, isRunning }: UsePiPProps) {
  const [isPiPActive, setIsPiPActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Desenha no canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const size = 512;
    if (canvas.width !== size) canvas.width = size;
    if (canvas.height !== size) canvas.height = size;

    // 1. Fundo
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, size, size);

    // 2. Anel Fundo
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;
    const strokeWidth = 40;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    // 3. Anel Progresso
    const progress = 1 - timeLeft / maxTime;
    const startAngle = -0.5 * Math.PI;
    const endAngle = startAngle + progress * (2 * Math.PI);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = COLORS[mode];
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // 4. Texto
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formatTime(timeLeft), centerX, centerY);

    // 5. Status
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = isRunning ? COLORS[mode] : '#64748b';
    ctx.fillText(isRunning ? 'FOCUS' : 'PAUSADO', centerX, centerY + 100);
  }, [timeLeft, maxTime, mode, isRunning]);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.warn("Elemento de vídeo ou canvas não encontrado");
      return;
    }

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPActive(false);
      } else {
        // Se o stream ainda não foi criado, cria agora
        if (!video.srcObject) {
          const stream = canvas.captureStream(30);
          video.srcObject = stream;
        }

        // Aguarda metadados carregarem se necessário
        if (video.readyState < 1) { // HAVE_METADATA
            await new Promise((resolve) => {
                video.onloadedmetadata = () => resolve(true);
            });
        }

        // Toca o vídeo (requisito para PiP)
        await video.play();

        // Solicita o PiP
        await video.requestPictureInPicture();
        setIsPiPActive(true);
      }
    } catch (error) {
      console.error('Erro PiP:', error);
      setIsPiPActive(false);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLeave = () => setIsPiPActive(false);
    video.addEventListener('leavepictureinpicture', onLeave);
    return () => video.removeEventListener('leavepictureinpicture', onLeave);
  }, []);

  return {
    togglePiP,
    isPiPActive,
    canvasRef,
    videoRef,
  };
}