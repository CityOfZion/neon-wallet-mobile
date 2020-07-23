import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import {HeaderActionButtonProps} from '~src/components/layout/HeaderActionButton'
import {HeaderCustomProps} from '~src/components/layout/HeaderBar'
import {AccountMock} from '~src/models/AccountMock'
import AccountAssetDetail from '~src/scenes/AccountAssetDetail'
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
  GetAccount: {account: AccountMock} & HeaderActionButtonProps &
    HeaderCustomProps
  AccountAssetDetail: {account: AccountMock} & HeaderCustomProps
}

const QuickToolsStack = createStackNavigator<QuickToolsStackParamList>()

const QuickToolsStackNavigation = () => {
  const theme = useSelector((state: RootState) => {
    return Facade.theme[state.settings.theme]
  })

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

        <QuickToolsStack.Screen
          name={Facade.route.AccountAssetDetail.name}
          component={AccountAssetDetail}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
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
