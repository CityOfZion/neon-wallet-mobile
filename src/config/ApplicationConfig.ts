import { Dimensions, Platform, StatusBar } from 'react-native'

import { Theme } from '~src/enums/Theme'
/**
 * Application Configuration
 */
export class ApplicationConfig {
  readonly defaultTheme = Theme.DARK
  readonly defaultDataRefreshTimeInMilliseconds = 7000
  readonly headerHeight = Platform.OS === 'ios' ? 40 : 72 + (StatusBar.currentHeight ?? 0)
  readonly footerHeight = 66

  readonly windowWidth = Dimensions.get('window').width
  readonly windowHeight = Dimensions.get('window').height
  readonly screenWidth = Dimensions.get('screen').width
  readonly screenHeight = Dimensions.get('screen').height

  readonly currencies = 'USD,EUR,BRL'
}

export const applicationConfig = new ApplicationConfig()
