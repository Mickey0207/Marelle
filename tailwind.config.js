/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主要品牌色彩 - 精確色彩規範
        'primary-bg': '#EFEAE4',     // 背景主色調
        'primary-text': '#666666',   // 字體顏色
        'primary-button': '#CC824D', // 按鈕背景色調
        'button-text': '#FFFFFF',    // 按鈕文字顏色
        
        // Lo-Fi 風格色彩
        lofi: {
          50: '#fdfcf9',
          100: '#EFEAE4', // 使用主要背景色
          200: '#f5f1e8',
          300: '#ede6d3',
          400: '#e2d5b7',
          500: '#d4c19a',
          600: '#c4aa7d',
          700: '#b39660',
          800: '#9d8048',
          900: '#8a6d3a',
        },
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d2c7',
          300: '#9eb0a0',
          400: '#758d78',
          500: '#5a735d',
          600: '#475c49',
          700: '#3a4a3c',
          800: '#303d32',
          900: '#293329',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfbf6',
          200: '#fbf6ed',
          300: '#f8efdd',
          400: '#f3e4c7',
          500: '#edd6a8',
          600: '#e4c485',
          700: '#d9af5f',
          800: '#cd9540',
          900: '#b8832b',
        },
        // 按鈕色系 - 基於 #CC824D
        button: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f2d8bf',
          300: '#e8be93',
          400: '#dda065',
          500: '#CC824D', // 主要按鈕色
          600: '#b86c37',
          700: '#a05829',
          800: '#864a26',
          900: '#703f24',
        },
      },
      fontFamily: {
        'chinese': ['"Noto Sans TC"', 'sans-serif'],
        'serif': ['"Noto Serif TC"', 'serif'],
      },
      backgroundImage: {
        'gradient-lofi': 'linear-gradient(135deg, #EFEAE4 0%, #f5f1e8 100%)',
        'gradient-sage': 'linear-gradient(135deg, #f6f7f6 0%, #e3e7e3 100%)',
        'gradient-primary': 'linear-gradient(135deg, #EFEAE4 0%, #fdfcf9 100%)',
      },
      boxShadow: {
        'soft': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'soft-hover': '0 8px 30px 0 rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}