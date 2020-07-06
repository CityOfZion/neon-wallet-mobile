import {DefaultTheme, StyleConstants} from '~src/styles/styled-components'

const dark = {
  ...StyleConstants,

  title: 'dark',
  statusBarStyle: 'light-content',
  colors: {
    primary: '#4cffb3',
    secondary: '#0a84ff',
    tertiary: '#293036',
    quaternary: '#58717b',

    // eslint-disable-next-line prettier/prettier
    background: [
      '#1E252A',
      '#283239',
      '#293036',
      '#899fa8',
      '#979797',
      '#41474b',
      '#495158',
      '#1f272e',
    ],
    // eslint-disable-next-line prettier/prettier
    text: [
      '#fff',
      '#333',
      '#8ba0a9',
      '#767f86',
      '#bebebe',
      '#41474b',
      '#899fa8',
      '#8f9b9d',
    ],
    // eslint-disable-next-line prettier/prettier
    card: [
      '#00ddb4',
      '#22b1ff',
      '#7c4bfe',
      '#d355e7',
      '#fe872f',
      '#fedd5b',
      '#91abbc',
    ],
  },
} as DefaultTheme

export default dark
