import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {$} from '~/facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBar, {HeaderProps} from '~src/components/layout/HeaderBar'
import {Account} from '~src/models/Account'
import ReceiveQRCode from '~src/scenes/ReceiveQRCode'
import QRCodeScanTest from '~src/scenes/TestPage/QRCodeScanTest'
import {RootState} from '~src/store/reducers/root'

export type QuickToolsStackParamList = {
  Home: undefined
  Welcome: undefined
  CreateWallet: undefined
  ReceiveQrCode: undefined
  QrCodeScanTest: undefined
  CustomColor: undefined
  Onboarding: undefined
  GetWallet: undefined
  GetAccount: {account: Account}
}

const QuickToolsStack = createStackNavigator<QuickToolsStackParamList>()

const navbarOptions = (headerProps: HeaderProps): StackNavigationOptions => ({
  headerBackTitle: $.t('app.back'),
  headerTitle: (props) => HeaderBar(headerProps, props),
  headerRight: () => HeaderActionButton(headerProps.route?.params),
  headerTransparent: true,
  headerTintColor: headerProps.theme?.colors.text[0],
})

const QuickToolsStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <QuickToolsStack.Navigator>
        <QuickToolsStack.Screen
          name={$.path.ReceiveQrCode.name}
          component={ReceiveQRCode}
          options={({route}) =>
            navbarOptions({
              title: $.path.ReceiveQrCode.translate(),
              image: require('~src/assets/images/icon-qrcode-white.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />

        <QuickToolsStack.Screen
          name={$.path.QrCodeScanTest.name}
          component={QRCodeScanTest}
          options={({route}) =>
            navbarOptions({
              title: $.t(`routes.${$.path.QrCodeScanTest.name}`),
              image: require('~src/assets/images/icon-qrcode-white.png'),
              showIcon: true,
              iconWidth: 20,
              theme,
              route,
            })
          }
        />
      </QuickToolsStack.Navigator>
    </ThemeProvider>
  )
}

export default QuickToolsStackNavigation
