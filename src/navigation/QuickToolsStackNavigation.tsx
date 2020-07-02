import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {ROUTES} from '~/constants'
import HeaderBar, {HeaderProps} from '~src/components/HeaderBar'
import i18n from '~src/i18n'
import CustomColorPage from '~src/scenes/CustomColorPage'
import QRCodeScanTest from '~src/scenes/QRCodeScanTest'
import ReceiveQRCode from '~src/scenes/ReceiveQRCode'
import {RootState} from '~src/store/reducers/root'
import {DefaultTheme} from '~src/styles/styled-components'

export type QuickToolsStackParamList = {
  Home: undefined
  Welcome: undefined
  CreateWallet: undefined
  ReceiveQRCode: undefined
  QRCodeScanTest: undefined
  CustomColor: undefined
  Onboarding: undefined
  GetWallet: undefined
  GetAccount: {account: Account}
}

const QuickToolsStack = createStackNavigator<QuickToolsStackParamList>()

const navbarOptions = (headerProps: HeaderProps, theme: DefaultTheme) => ({
  headerTitle: () => HeaderBar(headerProps),
  headerTransparent: true,
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    marginRight: 22,
  },
  headerTintColor: theme.colors.text[0],
})

const QuickToolsStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <QuickToolsStack.Navigator>
        <QuickToolsStack.Screen
          name={ROUTES.RECEIVE_QR_CODE.name}
          component={ReceiveQRCode}
          options={() =>
            navbarOptions(
              {
                title: i18n.t(`routes.${ROUTES.RECEIVE_QR_CODE.name}`),
                image: require('~src/assets/images/icon-qrcode-white.png'),
                showIcon: true,
                iconWidth: 20,
              },
              theme
            )
          }
        />

        <QuickToolsStack.Screen
          name={ROUTES.CUSTOM_COLOR.name}
          component={CustomColorPage}
          options={() =>
            navbarOptions(
              {
                title: i18n.t(`routes.${ROUTES.RECEIVE_QR_CODE.name}`),
                image: require('~src/assets/images/icon-qrcode-white.png'),
                showIcon: true,
                iconWidth: 20,
              },
              theme
            )
          }
        />
        <QuickToolsStack.Screen
          name={ROUTES.QR_CODE_SCAN_TEST.name}
          component={QRCodeScanTest}
          options={() =>
            navbarOptions(
              {
                title: i18n.t(`routes.${ROUTES.QR_CODE_SCAN_TEST.name}`),
                image: require('~src/assets/images/icon-qrcode-white.png'),
                showIcon: true,
                iconWidth: 20,
              },
              theme
            )
          }
        />
      </QuickToolsStack.Navigator>
    </ThemeProvider>
  )
}

export default QuickToolsStackNavigation
