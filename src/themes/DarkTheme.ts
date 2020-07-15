/**
 * Theme Configuration
 */
import {Theme} from '~src/enums/Theme'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

export class DarkTheme extends ApplicationTheme {
  readonly id = Theme.DARK

  readonly title = 'dark'

  readonly statusBarStyle = 'light-content'

  readonly colors = {
    primary: '#4cffb3',
    secondary: '#0a84ff',
    tertiary: '#293036',
    quaternary: '#58717b',

    background: [
      '#1E252A',
      '#283239',
      '#293036',
      '#899fa8',
      '#979797',
      '#41474b',
      '#495158',
      '#1f272e',
      '#2d3941',
      '#364046',
    ],

    text: [
      '#fff',
      '#333',
      '#8ba0a9',
      '#767f86',
      '#bebebe',
      '#41474b',
      '#899fa8',
      '#8f9b9d',
      '#9ba0a1',
      '#23272a',
    ],

    card: [
      '#00ddb4',
      '#22b1ff',
      '#7c4bfe',
      '#d355e7',
      '#fe872f',
      '#fedd5b',
      '#91abbc',
    ],
  }
}
