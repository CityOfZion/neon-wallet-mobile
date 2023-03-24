import { Dimensions, Platform } from 'react-native'

import { Theme } from '~src/enums/Theme'
/**
 * Application Configuration
 */
export class ApplicationConfig {
  readonly defaultTheme = Theme.DARK
  readonly defaultDataRefreshTimeInMilliseconds = 7000
  readonly headerHeight = 68
  readonly footerHeight = Platform.OS === 'ios' ? 105 : 80
  readonly footerOffset = 12

  readonly windowWidth = Dimensions.get('window').width
  readonly windowHeight = Dimensions.get('window').height
  readonly screenWidth = Dimensions.get('screen').width
  readonly screenHeight = Dimensions.get('screen').height

  readonly currencies = 'USD,EUR,BRL'
}

export const applicationConfig = new ApplicationConfig()
