module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      card: {
        dark: '#000200',
        DEFAULT: '#097234',
        light: '#0a863e',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
