import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import HeaderActionButton, {
  ActionButtonOptions,
} from '~src/components/layout/HeaderActionButton'
import HeaderBar, {HeaderProps} from '~src/components/layout/HeaderBar'
import Step1CreateWalletPage from '~src/scenes/CreateWalletPage/Step1CreateWalletPage'
import Step2CreateWalletPage from '~src/scenes/CreateWalletPage/Step2CreateWalletPage'
import Step3CreateWalletPage from '~src/scenes/CreateWalletPage/Step3CreateWalletPage'
import Step4CreateWalletPage from '~src/scenes/CreateWalletPage/Step4CreateWalletPage'
import Step5CreateWalletPage from '~src/scenes/CreateWalletPage/Step5CreateWalletPage'
import CustomColorPage from '~src/scenes/CustomColorPage'
import MorePage from '~src/scenes/MorePage'
import {RootState} from '~src/store/reducers/root'

export type MoreStackParamList = {
  More: undefined
  Step1CreateWallet: undefined
  Step2CreateWallet: undefined
  Step3CreateWallet: ActionButtonOptions
  Step4CreateWallet: undefined
  Step5CreateWallet: undefined
  ListWallets: undefined
  CustomColor: undefined
  Modal: {screen: string}
}

const MoreStack = createStackNavigator<MoreStackParamList>()

const navbarOptions = (headerProps: HeaderProps): StackNavigationOptions => ({
  headerBackTitle: Facade.t('app.back'),
  headerTitle: (props) => HeaderBar(headerProps, props),
  headerRight: () => HeaderActionButton(headerProps.route?.params),
  headerTransparent: true,
  headerTintColor: headerProps.theme?.colors.text[0],
})

const MoreStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <MoreStack.Navigator>
        <MoreStack.Screen
          name={Facade.path.More.name}
          component={MorePage}
          options={({route}) =>
            navbarOptions({
              title: Facade.path.More.name,
              image: require('~src/assets/images/more-horiz.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.path.Step1CreateWallet.name}
          component={Step1CreateWalletPage}
          options={({route}) =>
            navbarOptions({
              title: Facade.path.Step1CreateWallet.translate(),
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.path.Step2CreateWallet.name}
          component={Step2CreateWalletPage}
          options={({route}) =>
            navbarOptions({
              title: Facade.path.Step2CreateWallet.translate(),
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.path.Step3CreateWallet.name}
          component={Step3CreateWalletPage}
          options={({route}) =>
            navbarOptions({
              title: Facade.path.Step3CreateWallet.translate(),
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.path.Step4CreateWallet.name}
          component={Step4CreateWalletPage}
          options={({route}) =>
            navbarOptions({
              title: Facade.path.Step4CreateWallet.translate(),
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.path.Step5CreateWallet.name}
          component={Step5CreateWalletPage}
          options={({route}) =>
            navbarOptions({
              title: Facade.path.Step5CreateWallet.translate(),
              image: require('~src/assets/images/icon-add-circle-outline-white.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />

        <MoreStack.Screen
          name={Facade.path.CustomColor.name}
          component={CustomColorPage}
          options={({route}) =>
            navbarOptions({
              title: Facade.path.CustomColor.translate(),
              image: require('~src/assets/images/palette.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />
      </MoreStack.Navigator>
    </ThemeProvider>
  )
}

export default MoreStackNavigation
