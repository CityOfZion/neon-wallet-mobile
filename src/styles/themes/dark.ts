import {DefaultTheme, StyleConstants} from '~src/styles/styled-components'

const dark = {
  ...StyleConstants,

  title: 'dark',
  colors: {
    primary: '#4cffb3',
    secondary: '#0a84ff',
    tertiary: '#293036',

    background: '#495158',
    text: ['#fff', '#333', '#8ba0a9'],
  },
} as DefaultTheme

export default dark
