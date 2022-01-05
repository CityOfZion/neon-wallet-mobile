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
    quinary: '#d355e7',

    success: '#4cffb3',
    danger: '#db5860',

    background: {
      0: '#1E252A',
      1: '#283239',
      2: '#293036',
      3: '#899fa8',
      4: '#979797',
      5: '#41474b',
      6: '#495158',
      7: '#1f272e',
      8: '#2d3941',
      9: '#364046',
      10: '#667178',
      11: '#d5eaf5',
      12: '#13191b',
      13: '#818d95',
      14: '#1a2026',
      15: '#282f35',
      16: '#27313a',
      17: '#333d46',
      18: '#161c22',
      19: '#2d353e',
      20: '#232a30',
    },

    text: {
      0: '#fff',
      1: '#333',
      2: '#8ba0a9',
      3: '#767f86',
      4: '#bebebe',
      5: '#41474b',
      6: '#899fa8',
      7: '#8f9b9d',
      8: '#9ba0a1',
      9: '#23272a',
      10: '#7d929a',
      11: '#899fa8',
      12: '#7b9098',
      13: '#1a2f34',
      14: '#869ca5',
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
