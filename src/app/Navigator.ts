import {StackNavigationOptions} from '@react-navigation/stack'
import i18n from 'i18n-js'

import HeaderActionButton, {
  HeaderActionButtonProps,
} from '~src/components/layout/HeaderActionButton'
import HeaderBackButton from '~src/components/layout/HeaderBackButton'
import HeaderBar, {HeaderProps} from '~src/components/layout/HeaderBar'
import {UtilsHelper} from '~src/helpers/UtilsHelper'
export abstract class Navigator {
  static defaultStackNavigatorOptions(
    headerProps: HeaderProps
  ): StackNavigationOptions {
    const params: HeaderActionButtonProps = headerProps.route?.params

    return {
      headerBackTitle: i18n.t('app.back'),
      headerLeft: UtilsHelper.isAndroid ? HeaderBackButton : undefined,
      headerTitle: (props) => HeaderBar(headerProps, props),
      headerRight: () => HeaderActionButton(params),
      headerTransparent: true,
      headerTintColor: headerProps.theme?.colors.text[0],
    }
  }
}
