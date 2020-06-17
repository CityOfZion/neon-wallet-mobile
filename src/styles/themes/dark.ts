import {DefaultTheme, StyleConstants} from '~src/styles/styled-components'

const dark = {
  ...StyleConstants,

  title: 'dark',
  statusBarStyle: 'light-content',
  colors: {
    primary: '#4cffb3',
    secondary: '#0a84ff',
    tertiary: '#293036',

    // eslint-disable-next-line prettier/prettier
    background: [
      '#495158',
      '#283239',
      '#293036'
    ],
    // eslint-disable-next-line prettier/prettier
    text: [
      '#fff',
      '#333',
      '#8ba0a9',
    ],
  },
} as DefaultTheme

export default dark
