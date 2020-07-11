import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {HeaderCustomProps} from '~src/components/layout/HeaderBar'
import {Account} from '~src/models/Account'
import ReceiveQRCode from '~src/scenes/ReceiveQRCode'
import QRCodeScanTest from '~src/scenes/TestPage/QRCodeScanTest'

export type QuickToolsStackParamList = {
  Home: undefined
  Welcome: undefined
  CreateWallet: undefined
  ReceiveQrCode: undefined
  QrCodeScanTest: undefined
  CustomColor: undefined
  Onboarding: undefined
  GetWallet: undefined
  GetAccount: {account: Account} & HeaderActionButtonProps & HeaderCustomProps
}

const QuickToolsStack = createStackNavigator<QuickToolsStackParamList>()

const QuickToolsStackNavigation = () => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])

  return (
    <ThemeProvider theme={theme}>
      <QuickToolsStack.Navigator>
        <QuickToolsStack.Screen
          name={Facade.route.ReceiveQrCode.name}
          component={ReceiveQRCode}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.ReceiveQrCode.translate(),
              image: require('~src/assets/images/icon-qrcode-white.png'),
              theme,
              route,
            })
          }
        />

        <QuickToolsStack.Screen
          name={Facade.route.QrCodeScanTest.name}
          component={QRCodeScanTest}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.t(`routes.${Facade.route.QrCodeScanTest.name}`),
              image: require('~src/assets/images/icon-qrcode-white.png'),
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
