/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#000',
          secondary: '#0a0a0a',
          tertiary: '#111',
          card: '#0e0e0e',
          elevated: '#161616',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.10)',
          subtle: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.18)',
        },
        ink: {
          1: '#ffffff',
          2: '#cccccc',
          3: '#888888',
          4: '#666666',
          5: '#555555',
          6: '#444444',
        },
        chip: 'rgba(255,255,255,0.06)',
      },
      keyframes: {
        pulse2: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.15' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        pulse2: 'pulse2 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.25s ease forwards',
        slideIn: 'slideIn 0.2s ease forwards',
      },
    },
  },
  plugins: [],
}
