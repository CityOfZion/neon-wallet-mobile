import {RequestConfig} from '@simpli/serialized-request'
import {AppLoading} from 'expo'
import * as Font from 'expo-font'
import React, {useState} from 'react'
import {Provider as StoreProvider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import '~src/window-crypto'
import 'reflect-metadata'

import {HttpConfig} from '~src/config/HttpConfig'
import AppNavigation from '~src/navigation/AppNavigation'
import {rootReducer} from '~src/store/reducers/root'

const fetchFonts = () => {
  return Font.loadAsync({
    bold: require('~src/assets/fonts/sofiapro-bold.otf'),
    medium: require('~src/assets/fonts/sofiapro-medium.otf'),
    regular: require('~src/assets/fonts/sofiapro-regular.otf'),
    italic: require('~src/assets/fonts/sofiapro-regularitalic.otf'),
    semibold: require('~src/assets/fonts/sofiapro-semibold.otf'),
  })
}

const store = createStore(rootReducer, applyMiddleware(thunk))

const httpConfig = new HttpConfig()
RequestConfig.axios = httpConfig.axiosInstance

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
      <AppNavigation />
    </StoreProvider>
  )
}

export default App
