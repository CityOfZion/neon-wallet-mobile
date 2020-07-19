import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Navigator} from '~src/app/Navigator'
import SettingsPage from '~src/scenes/SettingsPage'

type SettingsStackParamList = {
  Settings: undefined
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const SettingsStackNavigation = () => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])

  return (
    <ThemeProvider theme={theme}>
      <SettingsStack.Navigator>
        <SettingsStack.Screen
          name={Facade.route.Settings.name}
          component={SettingsPage}
          options={({route}) =>
            Navigator.defaultStackNavigatorOptions({
              title: Facade.route.Settings.translate(),
              image: require('~src/assets/images/settings-white.png'),
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
