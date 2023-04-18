/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      keyframes: {
        tickerh: {
         '0%': { transform: 'translate3d(100%, 0, 0)' },
         '100%': { transform: 'translate3d(-250%, 0, 0)' }
        }
      },
      animation: {
        'tickerh': 'tickerh linear 45s infinite'
      },
      colors: {
        high: {
          DEFAULT: 'rgba(255, 255, 255, 0.87)'
        },
        medium: {
          DEFAULT: 'rgba(255, 255, 255, 0.6)'
        },
        disabled: {
          DEFAULT: 'rgba(255, 255, 255, 0.38)'
        },
        black: {
          DEFAULT: '#121212'
        },
        green: {
          light: '#80e27e',
          DEFAULT: '#4CAF50',
          dark: '#087f23'
        },
        primary: {
          light: '#80e27e',
          DEFAULT: '#4CAF50',
          dark: '#087F23'
        }
      },
      fontFamily: {
        fira: ['"Fira Code"', 'monospace']
      }
    },
  },
  plugins: [],
}
