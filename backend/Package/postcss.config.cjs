const path = require('path')

module.exports = {
  plugins: {
    // 指向同層集中 tailwind 設定
    tailwindcss: { config: path.resolve(__dirname, 'tailwind.config.cjs') },
    autoprefixer: {}
  }
}
