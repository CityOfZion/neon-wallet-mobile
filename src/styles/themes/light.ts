import {DefaultTheme, StyleConstants} from '~src/styles/styled-components'

const light = {
  ...StyleConstants,

  title: 'light',
  statusBarStyle: 'dark-content',
  colors: {
    primary: '#293036',
    secondary: '#0a84ff',
    tertiary: '#4cffb3',
    quaternary: '#58717b',

    // eslint-disable-next-line prettier/prettier
    background: [
      '#ddd',
      '#bbb',
      '#ccc',
      '#899fa8',
      '#979797',
      '#888',
      '#b4b4b4',
      '#e1e1e1',
    ],
    // eslint-disable-next-line prettier/prettier
    text: [
      '#333',
      '#fff',
      '#8ba0a9',
      '#767f86',
      '#bebebe',
      '#41474b',
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

export default light
