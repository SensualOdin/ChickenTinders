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
        // ChickenTinders brand colors
        burgundy: {
          DEFAULT: '#A91D3A',
          dark: '#8B1538',
        },
        coral: '#FF6B35',
        cream: {
          DEFAULT: '#FFF5E1',
          dark: '#F5EBE0',
        },
        gold: '#FFB800',
        charcoal: {
          DEFAULT: '#2C0A0A',
          light: '#4A4541',
        },
        sage: '#4CAF50',

        // Semantic colors mapped to brand palette
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
        error: '#EF4444', // Error red
        info: '#3B82F6', // Info blue
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
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', '-apple-system', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(42, 36, 33, 0.08)',
        'elevated': '0 8px 40px rgba(42, 36, 33, 0.12)',
        'card': '0 4px 24px rgba(42, 36, 33, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'card-swipe': 'cardSwipe 4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.2)' },
        },
        cardSwipe: {
          '0%, 15%': { transform: 'rotate(0deg) translateX(0)' },
          '20%': { transform: 'rotate(12deg) translateX(120px)', opacity: '0' },
          '21%': { transform: 'rotate(0deg) translateX(0)', opacity: '1' },
          '100%': { transform: 'rotate(0deg) translateX(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
