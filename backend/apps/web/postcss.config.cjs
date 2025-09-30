const path = require('path')

module.exports = {
  plugins: {
    tailwindcss: { config: path.resolve(__dirname, '../../Package/fronted/tailwind.config.cjs') },
    autoprefixer: {},
  }
}
