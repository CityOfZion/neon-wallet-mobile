import {NavigationContainer} from '@react-navigation/native'
import React from 'react'
import {useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import LoadingOverlay from '../components/LoadingOverlay'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import ModalStackNavigation from '~src/navigation/ModalStackNavigation'
import TabNavigation from '~src/navigation/TabNavigation'
import {RootState} from '~src/store/reducers/root'

export type RootStackParamList = {
  Tab: undefined
  Modal: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

const AppNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const loadingOverlayState = useSelector((state: RootState) => state.loading)
  const {progress, loadingText, isLoading} = loadingOverlayState

  return (
    <>
      <>
        <NavigationContainer>
          {isLoading && (
            <LoadingOverlay progress={progress} loadingText={loadingText} />
          )}
          <ThemeProvider theme={theme}>
            <RootStack.Navigator
              initialRouteName="Tab"
              headerMode="none"
              screenOptions={Facade.config.screen}
            >
              <RootStack.Screen name="Tab" component={TabNavigation} />
              <RootStack.Screen name="Modal" component={ModalStackNavigation} />
            </RootStack.Navigator>
          </ThemeProvider>
        </NavigationContainer>
      </>
    </>
  )
}

export default AppNavigation
