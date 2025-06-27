// tailwind.config.ts
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: 'class', // Enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['SF Mono', 'Fira Code', 'Roboto Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        'light-bg': '#f1f5f9',
        'dark-bg': '#020617',
        'heading-light': '#020617',
        'heading-dark': '#f8fafc',
        'text-light': '#475569',
        'text-dark': '#94a3b8',
        'subtle-text-light': '#64748b',
        'subtle-text-dark': '#475569',
        'link-light': '#4f46e5',
        'link-dark': '#a5b4fc',
        'card-bg-light': 'rgba(255, 255, 255, 0.6)',
        'card-bg-dark': 'rgba(15, 23, 42, 0.5)',
        'card-border-light': 'rgba(0, 0, 0, 0.1)',
        'card-border-dark': 'rgba(255, 255, 255, 0.1)',
        'glow-1': 'rgb(56 189 248)',
        'glow-2': 'rgb(167 139 250)',
        'gradient-1': '#8b5cf6',
        'gradient-2': '#3b82f6',
      },
      animation: {
        scroll: 'scroll 60s linear infinite',
      },
      keyframes: {
        scroll: {
          to: { transform: 'translate(calc(-50% - 1.25rem))' },
        },
      },
    },
  },
  plugins: [],
}

export default config