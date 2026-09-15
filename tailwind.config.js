/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bali: {
          terracotta: '#C05621',
          terradark: '#9C4221',
          gold: '#D4AF37',
          goldlight: '#F3E5AB',
          bamboo: '#2F5D44',
          bamboolight: '#E2EBE4',
          sand: '#FBF9F5',
          slate: '#0F172A',
          pertared: '#E31837',
          pertablue: '#0054A6',
          pertanavy: '#0A2540',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
