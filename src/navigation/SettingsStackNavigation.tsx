import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { RootState } from '../store/RootStore'
import PasscodeStackNavigation, { PasscodeStackParams } from './PasscodeStackNavigation'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Navigator } from '~src/app/Navigator'
import SettingsPage from '~src/scenes/SettingsPage'

export type SettingsStackParamList = {
  SettingsPage: undefined
  PasscodeStack: PasscodeStackParams
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const SettingsStackNavigation = () => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <ThemeProvider theme={theme}>
      <SettingsStack.Navigator>
        <SettingsStack.Screen
          name={wrapper.route.SettingsPage.name}
          component={SettingsPage}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.Settings.translate(),
              theme,
              route,
            })
          }
        />

        <SettingsStack.Screen
          name={wrapper.route.PasscodeStack.name}
          component={PasscodeStackNavigation}
          options={({ route }) =>
            Navigator.defaultStackNavigatorOptions({
              title: wrapper.route.PasscodeStack.name,
              theme,
              route,
            })
          }
        />
      </SettingsStack.Navigator>
    </ThemeProvider>
  )
}

export default SettingsStackNavigation
