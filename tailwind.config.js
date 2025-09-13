/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // PlanMyWeekend brand colors (exact hex values)
        primary: '#9929EA',
        secondary: '#CC66DA', 
        background: '#000000',
        highlight: '#FAEB92',
        // Accessible variants for better contrast
        'primary-light': '#A855F7',
        'secondary-light': '#D1A7E1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      animation: {
        'splash-logo': 'splash-scale 900ms cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
        'splash-fade': 'splash-fade 600ms cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
        'slide-up': 'slide-up 800ms cubic-bezier(0.25, 0.8, 0.25, 1) forwards',
      },
      keyframes: {
        'splash-scale': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'splash-fade': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      transitionDuration: {
        '150': '150ms',
        '220': '220ms',
      },
      transitionTimingFunction: {
        'gentle': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      }
    },
  },
  plugins: [],
};