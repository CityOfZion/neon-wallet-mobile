import React from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {wrapper} from '~src/app/ApplicationWrapper'
import {screenConfig} from '~src/config/ScreenConfig'
import ConfirmPasscodePage, {
  ConfirmPasscodePageParams,
} from '~src/scenes/LoginPage/ConfirmPasscodePage'
import PasscodePage, {
  PasscodePageParams,
} from '~src/scenes/LoginPage/PasscodePage'
import VerifyPasscodePage, {
  VerifyPasscodePageParams,
} from '~src/scenes/LoginPage/VerifyPasscodePage'

export type PasscodeStackParamList = {
  Passcode: PasscodePageParams
  ConfirmPasscode: ConfirmPasscodePageParams
  VerifyPasscode: VerifyPasscodePageParams
}

export type PasscodeStackParams =
  | DefaultNavigationParam<PasscodePageParams>
  | DefaultNavigationParam<ConfirmPasscodePageParams>
  | DefaultNavigationParam<VerifyPasscodePageParams>

const PasscodeStack = createStackNavigator<PasscodeStackParamList>()

const PasscodeStackNavigation = () => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        translucent
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
      />
      <PasscodeStack.Navigator
        initialRouteName={wrapper.route.Passcode.name}
        screenOptions={{...screenConfig, headerShown: false}}
      >
        <PasscodeStack.Screen
          name={wrapper.route.Passcode.name}
          component={PasscodePage}
        />
        <PasscodeStack.Screen
          name={wrapper.route.ConfirmPasscode.name}
          component={ConfirmPasscodePage}
        />
        <PasscodeStack.Screen
          name={wrapper.route.VerifyPasscode.name}
          component={VerifyPasscodePage}
        />
      </PasscodeStack.Navigator>
    </ThemeProvider>
  )
}

export default PasscodeStackNavigation
