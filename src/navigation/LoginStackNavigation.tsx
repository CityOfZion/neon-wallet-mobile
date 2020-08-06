import React from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import ConfirmPasscodePage from '~src/scenes/LoginPage/ConfirmPasscodePage'
import LoginPage from '~src/scenes/LoginPage/LoginPage'
import PasscodePage from '~src/scenes/LoginPage/PasscodePage'

export type LoginStackParamList = {
  Welcome: undefined
  LoginPage: undefined
  Passcode: {showError: boolean}
  ConfirmPasscode: {passcode: number[]}
}

const LoginStack = createStackNavigator<LoginStackParamList>()

const LoginStackNavigation = () => {
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
      <LoginStack.Navigator
        initialRouteName={Facade.route.LoginPage.name}
        headerMode="none"
        screenOptions={Facade.config.screen}
      >
        <LoginStack.Screen
          name={Facade.route.LoginPage.name}
          component={LoginPage}
        />
        <LoginStack.Screen
          name={Facade.route.Passcode.name}
          component={PasscodePage}
        />
        <LoginStack.Screen
          name={Facade.route.ConfirmPasscode.name}
          component={ConfirmPasscodePage}
        />
      </LoginStack.Navigator>
    </ThemeProvider>
  )
}

export default LoginStackNavigation
