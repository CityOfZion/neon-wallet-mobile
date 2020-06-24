import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {ROUTES} from '~/constants'
import HeaderBar, {HeaderProps} from '~src/components/HeaderBar'
import More from '~src/scenes/More'
import {RootState} from '~src/store/reducers/root'
import {DefaultTheme} from '~src/styles/styled-components'

type MoreStackParamList = {
  More: undefined
}

const MoreStack = createStackNavigator<MoreStackParamList>()

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

const MoreStackNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <ThemeProvider theme={theme}>
      <MoreStack.Navigator>
        <MoreStack.Screen
          name={ROUTES.MORE.name}
          component={More}
          options={() =>
            navbarOptions(
              {
                title: ROUTES.MORE.name,
                image: require('~src/assets/images/more-horiz.png'),
                showIcon: true,
                iconMarginRight: 3,
                iconWidth: 20,
              },
              theme
            )
          }
        />
      </MoreStack.Navigator>
    </ThemeProvider>
  )
}

export default MoreStackNavigation
