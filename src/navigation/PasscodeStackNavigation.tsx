import React from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
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
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        translucent
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
      />
      <PasscodeStack.Navigator
        initialRouteName={Facade.route.Passcode.name}
        headerMode="none"
        screenOptions={Facade.config.screen}
      >
        <PasscodeStack.Screen
          name={Facade.route.Passcode.name}
          component={PasscodePage}
        />
        <PasscodeStack.Screen
          name={Facade.route.ConfirmPasscode.name}
          component={ConfirmPasscodePage}
        />
        <PasscodeStack.Screen
          name={Facade.route.VerifyPasscode.name}
          component={VerifyPasscodePage}
        />
      </PasscodeStack.Navigator>
    </ThemeProvider>
  )
}

export default PasscodeStackNavigation
