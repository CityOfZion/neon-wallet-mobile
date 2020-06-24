import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {ROUTES} from '~/constants'
import HeaderBar, {HeaderProps} from '~src/components/HeaderBar'
import i18n from '~src/i18n'
import Settings from '~src/scenes/Settings'
import {RootState} from '~src/store/reducers/root'
import {DefaultTheme} from '~src/styles/styled-components'

type SettingsStackParamList = {
  Settings: undefined
}

const SettingsStack = createStackNavigator<SettingsStackParamList>()

const navbarOptions = (headerProps: HeaderProps, theme: DefaultTheme) => ({
  headerTitle: () => HeaderBar(headerProps),
  headerTransparent: true,
  headerStyle: {
    backgroundColor: theme.colors.background[0],
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    textAlign: 'center',
    flexGrow: 1,
    marginRight: 22,
  },
  headerTintColor: theme.colors.text[0],
})

const SettingsStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <SettingsStack.Navigator>
        <SettingsStack.Screen
          name={ROUTES.SETTINGS.name}
          component={Settings}
          options={() =>
            navbarOptions(
              {
                title: i18n.t(`routes.${ROUTES.SETTINGS.name}`),
                image: require('~src/assets/images/settings-white.png'),
                showIcon: true,
                iconMarginRight: 3,
                iconWidth: 20,
              },
              theme
            )
          }
        />
      </SettingsStack.Navigator>
    </ThemeProvider>
  )
}

export default SettingsStackNavigation
