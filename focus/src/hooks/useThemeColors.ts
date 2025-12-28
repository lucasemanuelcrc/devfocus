// Exemplo: Assumindo que você tem um hook que retorna o estado do timer
// import { useTimerState } from '@/store/timerStore';

// Tipos para os modos (ajuste conforme seu código real)
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface ThemePalette {
    accent: string;      // Cor principal (texto, bordas)
    bgAccent: string;    // Cor de fundo suave
    buttonBg: string;    // Cor vibrante para botões
    buttonHover: string;
    glowColor: string;   // Cor da sombra para o efeito "breathing"
    ringColor: string;   // Cor do anel de progresso
}

const themes: Record<TimerMode, ThemePalette> = {
    focus: {
        accent: 'text-cyan-400',
        bgAccent: 'bg-cyan-950/30',
        buttonBg: 'bg-cyan-500',
        buttonHover: 'hover:bg-cyan-400',
        glowColor: 'shadow-cyan-500/40', // Usado na animação de "respiração"
        ringColor: 'text-cyan-500',
    },
    shortBreak: {
        accent: 'text-emerald-400',
        bgAccent: 'bg-emerald-950/30',
        buttonBg: 'bg-emerald-500',
        buttonHover: 'hover:bg-emerald-400',
        glowColor: 'shadow-emerald-500/40',
        ringColor: 'text-emerald-500',
    },
    longBreak: {
        accent: 'text-violet-400',
        bgAccent: 'bg-violet-950/30',
        buttonBg: 'bg-violet-600',
        buttonHover: 'hover:bg-violet-500',
        glowColor: 'shadow-violet-500/40',
        ringColor: 'text-violet-600',
    },
};

// Hook para consumir as cores facilmente
export function useThemeColors() {
    // SUBSTITUA PELO SEU ESTADO REAL:
    // const { mode, isRunning } = useTimerState();
    // --- Mock para exemplo ---
    const mode: TimerMode = 'focus'; // Tente mudar para 'shortBreak' ou 'longBreak' para testar
    const isRunning = true; // Tente mudar para false para testar a pausa da animação
    // -------------------------

    const currentTheme = themes[mode];

    // Classe utilitária para o efeito de respiração
    const breathingAnimationClass = isRunning
        ? `animate-breathing-glow ${currentTheme.glowColor}`
        : '';

    return {
        mode,
        isRunning,
        colors: currentTheme,
        breathingAnimationClass,
    };
}