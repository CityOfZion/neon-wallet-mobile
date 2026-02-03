import type { Config } from 'tailwindcss'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors: {
      transparent: 'transparent',
      asphalt: {
        DEFAULT: '#1A2026',
      },
      neon: {
        DEFAULT: '#4CFFB3',
      },
      green: {
        DEFAULT: '#2EBE81',
        700: '#345048',
        100: '#00DDB4',
      },
      purple: {
        DEFAULT: '#9747FF',
      },
      pink: {
        DEFAULT: '#E75595',
        700: '#7D4B93',
      },
      blue: {
        DEFAULT: '#47BEFF',
      },
      orange: {
        DEFAULT: '#FE872F',
        700: '#D36A24',
      },
      yellow: {
        DEFAULT: '#FEC42F',
      },
      lemon: {
        DEFAULT: '#BCFF2D',
      },
      magenta: {
        DEFAULT: '#D355E7',
        700: '#7D4B93',
      },
      black: {
        DEFAULT: '#000000',
      },
      white: {
        DEFAULT: '#FFFFFF',
      },
      gray: {
        900: '#13191B',
        850: '#232a30',
        800: '#293139',
        750: '#364046',
        700: '#333D46',
        600: '#42525C',
        400: '#91abbc',
        300: '#818D95',
        200: '#C5D0D5',
        100: '#B0C0C8',
      },
    },
    extend: {
      borderWidth: {
        3: '3px',
      },
      fontFamily: {
        'sans-bold': ['sofiapro-bold'],
        'sans-medium': ['sofiapro-medium'],
        'sans-regular': ['sofiapro-regular'],
        'sans-italic': ['sofiapro-italic'],
        'sans-semibold': ['sofiapro-semibold'],
        'sans-light': ['sofiapro-light'],
      },
      backdropBlur: {
        md: '10px',
      },
      opacity: {
        15: '0.15',
      },
      maxWidth: {
        14: '3.5rem',
      },
      minWidth: {
        '1/2': '50%',
      },
      width: {
        28: '7rem',
        30: '7.5rem',
      },
      fontSize: {
        '1xs': ['0.625rem', '0.75rem'],
        '2xs': ['0.5rem', '0.625rem'],
        '1xl': ['1.375rem', '1.75rem'],
        lg: ['1.125rem', '1.5rem'],
      },
      spacing: {
        15: '3.75rem',
        0.75: '0.1875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
        4.5: '1.125rem',
      },
      lineHeight: {
        2: '0.625rem',
      },
    },
  },
  plugins: [],
} satisfies Config
