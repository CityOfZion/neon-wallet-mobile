import {AppLoading} from 'expo'
import * as Font from 'expo-font'
import React, {useState} from 'react'
import {StatusBar} from 'react-native'
import FlashMessage from 'react-native-flash-message'
import {Provider as StoreProvider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'

import {ThemedAlert} from '~src/components/themed/ThemedAlert'
import ErrorBound from '~src/config/ErrorBound'
import AppNavigation from '~src/navigation/AppNavigation'
import {RootStore} from '~src/store/RootStore'
const loggerMiddleware = createLogger()

const store = createStore(RootStore.reducers, {}, applyMiddleware(thunk))

const fetchFonts = () =>
  Font.loadAsync({
    bold: require('~src/assets/fonts/sofiapro-bold.otf'),
    medium: require('~src/assets/fonts/sofiapro-medium.otf'),
    regular: require('~src/assets/fonts/sofiapro-regular.otf'),
    italic: require('~src/assets/fonts/sofiapro-regularitalic.otf'),
    semibold: require('~src/assets/fonts/sofiapro-semibold.otf'),
    light: require('~src/assets/fonts/sofiapro-light.otf'),
  })

const App = () => {
  const [dataLoaded, setDataLoaded] = useState(false)

  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      />
    )
  }

  return (
    <StoreProvider store={store}>
      <StatusBar barStyle={'light-content'} />
      <ErrorBound>
        <AppNavigation />
      </ErrorBound>
      <FlashMessage position="top" MessageComponent={ThemedAlert} />
    </StoreProvider>
  )
}

export default App
