/**
 * Theme Configuration
 */
import { Theme } from '~src/enums/Theme'
import { ApplicationTheme } from '~src/themes/ApplicationTheme'

export class LightTheme extends ApplicationTheme {
  readonly id = Theme.LIGHT

  readonly title = 'light'

  readonly statusBarStyle = 'dark-content'

  readonly colors = {
    primary: '#293036',
    secondary: '#0a84ff',
    tertiary: '#4cffb3',
    quaternary: '#58717b',
    quinary: '#d355e7',

    success: '#4cffb3',
    danger: '#db5860',

    background: {
      0: '#ddd',
      1: '#bbb',
      2: '#ccc',
      3: '#899fa8',
      4: '#979797',
      5: '#888',
      6: '#b4b4b4',
      7: '#e1e1e1',
      8: '#4cffb3',
      9: '#c9bfb9',
      10: '#998e87',
      11: '#d5eaf5',
    },

    text: {
      0: '#333',
      1: '#fff',
      2: '#8ba0a9',
      3: '#767f86',
      4: '#bebebe',
      5: '#41474b',
      6: '#899fa8',
      7: '#8f9b9d',
      8: '#9ba0a1',
      9: '#23272a',
    },

    card: {
      0: '#00ddb4',
      1: '#22b1ff',
      2: '#7c4bfe',
      3: '#d355e7',
      4: '#fe872f',
      5: '#fedd5b',
      6: '#91abbc',
    },
  }
}
