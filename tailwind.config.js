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
          DEFAULT: '#A91D3A', // ChickenTinders red
          dark: '#8B1538',
          light: '#C72C4A',
        },
        secondary: {
          DEFAULT: '#FFB800', // Golden yellow
          dark: '#E6A500',
          light: '#FFC933',
        },
        accent: {
          DEFAULT: '#FF6B35', // Warm orange
          dark: '#E55A2B',
          light: '#FF8C5C',
        },
        success: '#4CAF50', // Fresh green
        warning: '#FF8C42', // Warm orange
        background: '#FFF5E1', // Cream background
        surface: '#FFFFFF',
        dark: '#2C0A0A', // Deep brown
        textDark: '#2C0A0A', // Deep brown
        textMuted: '#6B4423',
        textLight: '#9B7653',
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
