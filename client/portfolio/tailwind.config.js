/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F7FF',
          100: '#EBF0FE',
          500: '#4F46E5',
          600: '#4338CA',
          900: '#1E1B4B',
          accent: '#FF4A3F'
        },
        surface: {
          light: '#F8F9FA',
          border: '#EAEAEA',
          dark: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
