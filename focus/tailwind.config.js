/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. Paleta de Cores FOCUS (Design System Navy Premium)
      colors: {
        focus: {
          base: '#0B1120',      // Fundo principal (Navy Profundo)
          surface: '#151E32',   // Fundo dos cards
          highlight: '#1E293B', // Bordas e efeitos de hover
        },
        brand: {
          primary: '#0EA5E9',   // Sky-500 (Ação Principal)
          secondary: '#10B981', // Emerald-500 (Sucesso/Conclusão)
          accent: '#6366F1',    // Indigo-500 (Destaques/Foco)
          muted: '#94A3B8',     // Texto secundário/Desabilitado
        }
      },

      // 2. Tipografia (Conectada ao layout.tsx via variável)
      fontFamily: {
        // Usa a variável --font-sans definida pelo next/font (Manrope)
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      // 3. Keyframes para Animações
      keyframes: {
        fadeInSlide: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px -5px var(--tw-shadow-color), 0 0 5px -2px var(--tw-shadow-color) inset'
          },
          '50%': {
            opacity: '0.85',
            boxShadow: '0 0 35px -5px var(--tw-shadow-color), 0 0 15px -2px var(--tw-shadow-color) inset'
          },
        }
      },

      // 4. Utilitários de Animação
      animation: {
        'fade-in': 'fadeInSlide 0.3s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Pulso suave de opacidade
        'breathing-glow': 'breathe 6s ease-in-out infinite', // Efeito de respiração do Timer
      },
    },
  },
  plugins: [],
}