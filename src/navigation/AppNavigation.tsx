import {NavigationContainer} from '@react-navigation/native'
import React, {useEffect} from 'react'
import {ActivityIndicator} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {ThemeProvider} from 'styled-components'

import LoadingOverlay from '../components/LoadingOverlay'

import {createStackNavigator} from '~/node_modules/@react-navigation/stack'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ModalStackNavigation from '~src/navigation/ModalStackNavigation'
import TabNavigation from '~src/navigation/TabNavigation'
import {RootStore} from '~src/store/RootStore'

export type RootStackParamList = {
  Tab: undefined
  Modal: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

const AppNavigation = () => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const loadingOverlayState = useSelector((state: RootState) => state.loading)
  const {progress, loadingText, isLoading} = loadingOverlayState
  const {language} = useSelector((state: RootState) => state.app)
  const [isRefreshing, setRefreshing] = React.useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    populate()
  }, [])

  useEffect(() => {
    refresh()
  }, [language])

  const refresh = async () => {
    setRefreshing(true)
    await Facade.utils.sleep(1000)
    setRefreshing(false)
  }

  const populate = async () => {
    const currency = await Storage.currency.load()
    const language = await Storage.language.load()
    const theme = await Storage.theme.load()

    if (currency) {
      dispatch(RootStore.app.actions.setCurrency(currency))
    }

    if (language) {
      dispatch(RootStore.app.actions.setLanguage(language))
    }

    if (theme) {
      dispatch(RootStore.app.actions.setTheme(theme))
    }
  }

  if (isRefreshing) {
    return (
      <ScreenLayout alignY={'center'}>
        <ActivityIndicator size={'large'} color={theme.colors.text[0]} />
      </ScreenLayout>
    )
  }

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
