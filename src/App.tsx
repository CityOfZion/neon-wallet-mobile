import {AppLoading} from 'expo'
import * as Font from 'expo-font'
import React, {useState} from 'react'
import {AsyncStorage, StatusBar} from 'react-native'
import {Provider as StoreProvider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'

import AppNavigation from '~src/navigation/AppNavigation'
import {RootStore} from '~src/store/RootStore'

const loggerMiddleware = createLogger()

const store = createStore(
  RootStore.reducers,
  {},
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(thunk)
    : composeWithDevTools(applyMiddleware(thunk, loggerMiddleware))
)

const fetchFonts = () =>
  Font.loadAsync({
    bold: require('~src/assets/fonts/sofiapro-bold.otf'),
    medium: require('~src/assets/fonts/sofiapro-medium.otf'),
    regular: require('~src/assets/fonts/sofiapro-regular.otf'),
    italic: require('~src/assets/fonts/sofiapro-regularitalic.otf'),
    semibold: require('~src/assets/fonts/sofiapro-semibold.otf'),
  })

const App = () => {
  const [dataLoaded, setDataLoaded] = useState(false)
  AsyncStorage.clear()
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
      <AppNavigation />
    </StoreProvider>
  )
}

export default App
