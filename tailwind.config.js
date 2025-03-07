/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(255,0,0,0.8))' },
          '50%': { filter: 'drop-shadow(0 0 8px rgba(255,0,0,1))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 },
        },
        radiateFall: {
          '0%': { opacity: 1, transform: 'translate(0, 0) scale(1)' },
          '100%': { opacity: 0, transform: 'translate(var(--tx), var(--ty)) scale(0.5)' },
        },
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        pulseSlow: 'pulse 4s infinite',
        twinkle: 'twinkle 2s ease-in-out infinite',
        radiateFall: 'radiateFall 3s forwards'
      }
    }
  },
  plugins: [],
}
