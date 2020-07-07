import {StackNavigationOptions} from '@react-navigation/stack/lib/typescript/src/types'
import {StyleProp, ViewStyle} from 'react-native'

/**
 * Screen Configuration
 */
export class ScreenConfig implements StackNavigationOptions {
  readonly cardStyle: StyleProp<ViewStyle> = {
    backgroundColor: 'transparent',
    opacity: 1,
  }

  readonly animationEnabled = false

  readonly transparentCard = true

  readonly transitionConfig = () => ({
    containerStyle: {
      backgroundColor: 'transparent',
    },
  })
}
