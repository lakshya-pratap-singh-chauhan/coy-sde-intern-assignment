import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coy: {
          ink: '#17121F',
          pink: '#FF3A7D',
          yellow: '#FFE45C',
          mint: '#BDF2D5',
          lilac: '#D9C8FF',
          gray: '#5C566A',
          backdrop: '#FFE9F1',
          like: '#0B7A3E',
          nope: '#B3123A',
          nopetint: '#FFC4CF',
        },
        cream: '#FFF7F3',
        ink: '#17121F',
        muted: '#5C566A',
        accent: '#FF3A7D',
        line: '#17121F',
        plum: '#3A1F4A',
      },
      boxShadow: {
        'hard-sm': '3px 3px 0 #17121F',
        hard: '5px 5px 0 #17121F',
        'hard-lg': '6px 6px 0 #17121F',
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
