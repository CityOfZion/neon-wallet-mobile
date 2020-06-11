import {DefaultTheme, GenericTheme} from '~src/styles/styled-components'

const light = {
  ...GenericTheme,

  title: 'light',
  colors: {
    primary: '#293036',
    secondary: '#0a84ff',
    tertiary: '#4cffb3',

    background: '#ddd',
    text: [
      '#333',
      '#fff',
      '#8ba0a9'
    ],
  },
} as DefaultTheme

export default light
