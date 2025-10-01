const path = require('path')
const r = (p) => p.replace(/\\/g, '/')

module.exports = {
  content: [
  r(path.resolve(__dirname, '../apps/web/index.html')),
  r(path.resolve(__dirname, '../apps/web/src/**/*.{js,ts,jsx,tsx}')),
  // 額外保險：掃描整個 web 目錄（含 Pages/components）
  r(path.resolve(__dirname, '../apps/web/**/*.{html,js,jsx,ts,tsx}')),
  ],
  safelist: [
    // 常用 utility 前綴（開發階段保險，避免 content 扫描落空）
    { pattern: /^(container|prose|sr-only|not-sr-only)$/ },
    { pattern: /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|space-[xy])-(\d+|px)$/ },
    { pattern: /^(w|h|min-w|min-h|max-w|max-h)-(\d+|px|full|screen|\[.+\])$/ },
    { pattern: /^(flex|grid|inline-flex|inline-grid)$/ },
    { pattern: /^(items|justify|content|self|place)-(start|end|center|between|around|evenly|stretch)$/ },
  { pattern: /^(text|bg|border|from|to|via|shadow|rounded|ring|outline|opacity|z|top|left|right|bottom|inset|overflow|transition|duration|ease)-/ },
  { pattern: /^(font|leading|tracking|whitespace|break|align|list|order|min|max)-/ },
  { pattern: /^(flex|items|justify|content|place|grid|col|row|gap)-/ },
  { pattern: /^(bg-gradient-to|from-|via-|to-)/ },
    { pattern: /^(hover|focus|active|disabled|first|last|odd|even|sm|md|lg|xl|2xl):/ },
    // 支援 bracket 類型色值
    { pattern: /(bg|text|border)-\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\]/ },
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#EFEAE4',
        'primary-text': '#666666',
        'primary-button': '#CC824D',
        'button-text': '#FFFFFF',
        lofi: { 50: '#fdfcf9', 100: '#EFEAE4', 200: '#f5f1e8', 300: '#ede6d3', 400: '#e2d5b7', 500: '#d4c19a', 600: '#c4aa7d', 700: '#b39660', 800: '#9d8048', 900: '#8a6d3a' },
        sage: { 50: '#f6f7f6', 100: '#e3e7e3', 200: '#c7d2c7', 300: '#9eb0a0', 400: '#758d78', 500: '#5a735d', 600: '#475c49', 700: '#3a4a3c', 800: '#303d32', 900: '#293329' },
        cream: { 50: '#fefdfb', 100: '#fdfbf6', 200: '#fbf6ed', 300: '#f8efdd', 400: '#f3e4c7', 500: '#edd6a8', 600: '#e4c485', 700: '#d9af5f', 800: '#cd9540', 900: '#b8832b' },
        button: { 50: '#fdf8f3', 100: '#f9ede0', 200: '#f2d8bf', 300: '#e8be93', 400: '#dda065', 500: '#CC824D', 600: '#b86c37', 700: '#a05829', 800: '#864a26', 900: '#703f24' }
      },
      fontFamily: {
        chinese: ['"Noto Sans TC"', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'serif']
      },
      backgroundImage: {
        'gradient-lofi': 'linear-gradient(135deg, #EFEAE4 0%, #f5f1e8 100%)',
        'gradient-sage': 'linear-gradient(135deg, #f6f7f6 0%, #e3e7e3 100%)',
        'gradient-primary': 'linear-gradient(135deg, #EFEAE4 0%, #fdfcf9 100%)'
      },
      boxShadow: {
        soft: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'soft-hover': '0 8px 30px 0 rgba(0, 0, 0, 0.1)'
      }
    }
  },
  plugins: []
}
