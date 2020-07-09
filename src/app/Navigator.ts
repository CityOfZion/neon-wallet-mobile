import {StackNavigationOptions} from '@react-navigation/stack'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBackButton from '~src/components/layout/HeaderBackButton'
import HeaderBar, {HeaderProps} from '~src/components/layout/HeaderBar'

export abstract class Navigator {
  static defaultStackNavigatorOptions(
    headerProps: HeaderProps
  ): StackNavigationOptions {
    return {
      headerBackTitle: Facade.t('app.back'),
      headerLeft: Facade.utils.isAndroid ? HeaderBackButton : undefined,
      headerTitle: (props) => HeaderBar(headerProps, props),
      headerRight: () => HeaderActionButton(headerProps.route?.params),
      headerTransparent: true,
      headerTintColor: headerProps.theme?.colors.text[0],
    }
  }
}
