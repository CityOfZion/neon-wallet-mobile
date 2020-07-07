import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBar, {HeaderProps} from '~src/components/layout/HeaderBar'
import SettingsPage from '~src/scenes/SettingsPage'
import {RootState} from '~src/store/reducers/root'

type SettingsStackParamList = {
  Settings: undefined
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const navbarOptions = (headerProps: HeaderProps): StackNavigationOptions => ({
  headerBackTitle: Facade.t('app.back'),
  headerTitle: (props) => HeaderBar(headerProps, props),
  headerRight: () => HeaderActionButton(headerProps.route?.params),
  headerTransparent: true,
  headerTintColor: headerProps.theme?.colors.text[0],
})

const SettingsStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <SettingsStack.Navigator>
        <SettingsStack.Screen
          name={Facade.path.Settings.name}
          component={SettingsPage}
          options={({route}) =>
            navbarOptions({
              title: Facade.path.Settings.translate(),
              image: require('~src/assets/images/settings-white.png'),
              showIcon: true,
              iconWidth: 20,
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
