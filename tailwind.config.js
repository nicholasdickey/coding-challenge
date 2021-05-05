module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        card: {
          dark: '#000200',
          DEFAULT: '#097234',
          medium: '#097436',
          light: '#0a863e',
        },
        yellowish: {
          DEFAULT: '#efce4b',
        },
      },
      spacing: {
        '12': '12%',
        '16': '16%',
        '22': '22%',
        '28': '28%',
        '32': '32%',
        '36': '36%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
