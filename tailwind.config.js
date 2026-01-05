/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B2635', // Deep burgundy
          dark: '#6B1C29',
          light: '#A63D4C',
        },
        secondary: {
          DEFAULT: '#D4A574', // Warm gold
          dark: '#B8905F',
          light: '#E6C9A0',
        },
        accent: {
          DEFAULT: '#E8DCC4', // Warm cream
          dark: '#D4C4A8',
        },
        success: '#2D5F3F', // Forest green
        background: '#F8F6F1', // Warm white
        surface: '#FFFFFF',
        textDark: '#2A2421', // Rich charcoal
        textMuted: '#6B6460',
        textLight: '#9B9490',
      },
      maxWidth: {
        'app': '768px',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(42, 36, 33, 0.08)',
        'elevated': '0 8px 40px rgba(42, 36, 33, 0.12)',
        'card': '0 4px 24px rgba(42, 36, 33, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
