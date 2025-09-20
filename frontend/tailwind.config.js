/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcf8',
          100: '#faf7f0',
          200: '#f4ede1',
          300: '#ebe0d2',
          400: '#dfd0c0',
          500: '#d2bfad',
          600: '#c2a898',
          700: '#ae9088',
          800: '#8e746c',
          900: '#6f5a54',
        },
        apricot: {
          50: '#fef7f3',
          100: '#fdede7',
          200: '#fad8cc',
          300: '#f6bca6',
          400: '#f19580',
          500: '#eb7962',
          600: '#dc5b42',
          700: '#c74a37',
          800: '#a53f32',
          900: '#85372e',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}