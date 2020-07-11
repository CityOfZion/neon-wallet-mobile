/**
 * Theme Configuration
 */
import {Theme} from '~src/enums/Theme'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'

export class LightTheme extends ApplicationTheme {
  readonly id = Theme.LIGHT

  readonly title = 'light'

  readonly statusBarStyle = 'dark-content'

  readonly colors = {
    primary: '#293036',
    secondary: '#0a84ff',
    tertiary: '#4cffb3',
    quaternary: '#58717b',

    background: [
      '#ddd',
      '#bbb',
      '#ccc',
      '#899fa8',
      '#979797',
      '#888',
      '#b4b4b4',
      '#e1e1e1',
      '#4cffb3',
    ],

    text: [
      '#333',
      '#fff',
      '#8ba0a9',
      '#767f86',
      '#bebebe',
      '#41474b',
      '#899fa8',
      '#8f9b9d',
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
