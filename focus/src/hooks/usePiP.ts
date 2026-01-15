import { useState, useEffect, useRef } from 'react';

// Adicionamos '| "custom"' aqui para alinhar com o TimerCard
export type PiPMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

interface UsePiPProps {
  timeLeft: number;
  maxTime: number;
  mode: PiPMode;
  isRunning: boolean;
}

// Mapeamento de cores para o Canvas do PiP (Hex Codes oficiais do projeto)
const THEME_COLORS = {
  focus: '#06b6d4',      // Cyan-500
  shortBreak: '#10b981', // Emerald-500
  longBreak: '#8b5cf6',  // Violet-500
  custom: '#f59e0b',     // Amber-500 (NOVO: Cor do modo Livre)
};

export const usePiP = ({ timeLeft, maxTime, mode, isRunning }: UsePiPProps) => {
  const [isPiPActive, setIsPiPActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipWindowRef = useRef<Window | null>(null);

  // Função para desenhar o timer no Canvas (que será transmitido para o PiP)
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuração do Canvas
    const width = 500;
    const height = 500;
    canvas.width = width;
    canvas.height = height;

    // Limpa o fundo (Dark Slate)
    ctx.fillStyle = '#020617'; // slate-950
    ctx.fillRect(0, 0, width, height);

    // Cálculos do Círculo
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 200;
    const progress = timeLeft / maxTime;
    
    // Cor do Tema Atual
    const themeColor = THEME_COLORS[mode] || THEME_COLORS.focus;

    // 1. Círculo de Fundo (Cinza Escuro)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 25;
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.stroke();

    // 2. Círculo de Progresso (Colorido)
    const startAngle = -Math.PI / 2; // Começa no topo (12h)
    const endAngle = startAngle + (2 * Math.PI * progress);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false); // false = horário (decrescente visualmente ajustar se necessário)
    // Nota: Para "encher" o círculo, usamos false. Para "esvaziar", a lógica inverte. 
    // Vamos manter o padrão visual de "barra de vida"
    
    ctx.lineWidth = 25;
    ctx.lineCap = 'round';
    ctx.strokeStyle = themeColor;
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 30;
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow para o texto

    // 3. Texto do Tempo
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(timeString, centerX, centerY);

    // 4. Texto do Estado (Foco, Pausado, etc)
    ctx.fillStyle = themeColor;
    ctx.font = '500 40px sans-serif';
    ctx.fillText(isRunning ? 'EM ANDAMENTO' : 'PAUSADO', centerX, centerY + 100);
  };

  // Atualiza o canvas sempre que o tempo ou estado muda
  useEffect(() => {
    drawCanvas();
  }, [timeLeft, maxTime, mode, isRunning]);

  // Sincroniza o vídeo com o canvas (Stream)
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && !video.srcObject) {
      const stream = canvas.captureStream(30); // 30 FPS
      video.srcObject = stream;
      // Hack necessário para alguns navegadores manterem o stream ativo
      video.play().catch(() => {});
    }
  }, []);

  const togglePiP = async () => {
    if (document.pictureInPictureElement) {
      // Se já estiver ativo, sai
      await document.exitPictureInPicture();
      setIsPiPActive(false);
    } else if (videoRef.current) {
      try {
        // Tenta entrar no modo PiP
        await videoRef.current.requestPictureInPicture();
        setIsPiPActive(true);
      } catch (error) {
        console.error('Erro ao ativar PiP:', error);
      }
    }
  };

  // Detecta quando o usuário fecha o PiP pelo botão "X" da janela flutuante
  useEffect(() => {
    const video = videoRef.current;
    const onLeavePiP = () => setIsPiPActive(false);

    if (video) {
      video.addEventListener('leavepictureinpicture', onLeavePiP);
      return () => video.removeEventListener('leavepictureinpicture', onLeavePiP);
    }
  }, []);

  return { togglePiP, isPiPActive, canvasRef, videoRef };
};