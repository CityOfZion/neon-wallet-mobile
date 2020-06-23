import {DefaultTheme, StyleConstants} from '~src/styles/styled-components'

const light = {
  ...StyleConstants,

  title: 'light',
  statusBarStyle: 'dark-content',
  colors: {
    primary: '#293036',
    secondary: '#0a84ff',
    tertiary: '#4cffb3',

    // eslint-disable-next-line prettier/prettier
    background: [
      '#ddd',
      '#bbb',
      '#ccc',
      '#899fa8',
      '#979797',
    ],
    // eslint-disable-next-line prettier/prettier
    text: [
      '#333',
      '#fff',
      '#8ba0a9',
      '#767f86',
    ],
  },
} as DefaultTheme

export default light
