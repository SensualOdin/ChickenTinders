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
          DEFAULT: '#E53935',
          dark: '#C62828',
        },
        secondary: {
          DEFAULT: '#FFA726',
          flame: '#FB9E1A',
        },
        success: '#66BB6A',
        background: '#FAFAFA',
        textDark: '#1F1A1E',
      },
      maxWidth: {
        'app': '768px',
      },
    },
  },
  plugins: [],
}
