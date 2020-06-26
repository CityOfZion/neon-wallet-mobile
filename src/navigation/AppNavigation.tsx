import {NavigationContainer} from '@react-navigation/native'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import {RootState} from '~src/store/reducers/root'
import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import TabNavigation from '~src/navigation/TabNavigation'
import ModalStackNavigation from '~src/navigation/ModalStackNavigation'

const defaultScreenOptions = {
  cardStyle: {
    backgroundColor: 'transparent',
    opacity: 1,
  },
  transparentCard: true,
  transitionConfig: () => ({
    containerStyle: {
      backgroundColor: 'transparent',
    },
  }),
}

type RootStackParamList = {
  Tab: undefined
  Modal: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

const AppNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <RootStack.Navigator
          initialRouteName="Tab"
          headerMode="none"
          screenOptions={defaultScreenOptions}
        >
          <RootStack.Screen name="Tab" component={TabNavigation} />
          <RootStack.Screen name="Modal" component={ModalStackNavigation} />
        </RootStack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  )
}

export default AppNavigation
