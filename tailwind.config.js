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
        '2': '2%',
        '4': '4%',
        '6': '6%',
        '8': '8%',
        '10': '10%',
        '12': '12%',
        '14': '14%',
        '16': '16%',
        '18': '18%',
        '20': '20%',
        '22': '22%',
        '24': '24%',
        '26': '26%',
        '28': '28%',
        '30': '30%',
        '32': '32%',
        '36': '36%',
        '38': '38%',
        '39': '39%',
        '40': '40%',
        '42': '42%',
        '44': '44%',
        '50': '50%',
        '60': '60%',
        '600': '600px',
      },
    },
    fontFamily: {
      alpha: ['Alfa+Slab+One'],
      rock: ['Rockwell'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
