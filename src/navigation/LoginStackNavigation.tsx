import {useNavigation} from '@react-navigation/native'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useEffect, useState} from 'react'
import {StatusBar} from 'react-native'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ConfirmPasscodePage from '~src/scenes/LoginPage/ConfirmPasscodePage'
import LoginPage from '~src/scenes/LoginPage/LoginPage'
import PasscodePage from '~src/scenes/LoginPage/PasscodePage'
import WelcomePage from '~src/scenes/WelcomePage'

export type LoginStackParamList = {
  Welcome: undefined
  Login: undefined
  Passcode: {showError: boolean}
  ConfirmPasscode: {passcode: number[]}
}

const LoginStack = createStackNavigator<LoginStackParamList>()

const LoginStackNavigation = () => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        translucent
        barStyle={theme.statusBarStyle}
        backgroundColor="transparent"
      />
      <LoginStack.Navigator
        initialRouteName={Facade.route.Login.name}
        headerMode="none"
        screenOptions={Facade.config.screen}
      >
        <LoginStack.Screen
          name={Facade.route.Login.name}
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
