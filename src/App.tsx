import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {RequestConfig} from '@simpli/serialized-request'
import {AppLoading} from 'expo'
import * as Font from 'expo-font'
import React, {useState} from 'react'
import {Provider, useSelector} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {ThemeProvider} from 'styled-components'

import '~src/window-crypto'
import 'reflect-metadata'

import ThemeTestPage from './scenes/ThemeTestPage'

import {ROUTES} from '~/constants'
import {HttpConfig} from '~src/config/HttpConfig'
import ChartTestPage from '~src/scenes/ChartTestPage'
import CustomColorPage from '~src/scenes/CustomColorPage'
import Home from '~src/scenes/Home'
import NeonJSTest from '~src/scenes/NeonJSTest'
import Onboarding from '~src/scenes/Onboarding'
import QRCodeScanTest from '~src/scenes/QRCodeScanTest'
import QrCodeGenerateTest from '~src/scenes/QrCodeGenerateTest'
import TouchIdTest from '~src/scenes/TouchIdTest'
import Wallet from '~src/scenes/Wallet'
import {rootReducer, RootState} from '~src/store/reducers/root'
import dark from '~src/styles/themes/dark'

type RootStackParamList = {
  Home: undefined
  TouchIdTest: undefined
  QRCodeScanTest: undefined
  QrCodeGenerateTest: undefined
  NeonJSTest: undefined
  ChartTest: undefined
  ThemeTest: undefined
  CustomColor: undefined
  Wallet: undefined
}

const fetchFonts = () => {
  return Font.loadAsync({
    'sofiapro-bold': require('~src/assets/fonts/sofiapro-bold.otf'),
    'sofiapro-medium': require('~src/assets/fonts/sofiapro-medium.otf'),
    'sofiapro-regular': require('~src/assets/fonts/sofiapro-regular.otf'),
    'sofiapro-regularitalic': require('~src/assets/fonts/sofiapro-regularitalic.otf'),
    'sofiapro-semibold': require('~src/assets/fonts/sofiapro-semibold.otf'),
  })
}

const store = createStore(rootReducer, applyMiddleware(thunk))

const RootStack = createStackNavigator<RootStackParamList>()

const Tab = createBottomTabNavigator()

const httpConfig = new HttpConfig()
RequestConfig.axios = httpConfig.axiosInstance

function RootStackScreen() {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
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
    <ThemeProvider theme={theme}>
      <RootStack.Navigator initialRouteName={ROUTES.HOME.name}>
        <RootStack.Screen name={ROUTES.HOME.name} component={Home} />
        <RootStack.Screen
          name={ROUTES.TOUCH_ID_TEST.name}
          component={TouchIdTest}
        />
        <RootStack.Screen
          name={ROUTES.QR_CODE_GENERATE_TEST.name}
          component={QrCodeGenerateTest}
        />
        <RootStack.Screen
          name={ROUTES.NEON_JS_TEST.name}
          component={NeonJSTest}
        />
        <RootStack.Screen
          name={ROUTES.CHART_TEST.name}
          component={ChartTestPage}
        />
        <RootStack.Screen
          name={ROUTES.THEME_TEST.name}
          component={ThemeTestPage}
        />
        <RootStack.Screen
          name={ROUTES.CUSTOM_COLOR.name}
          component={CustomColorPage}
        />
        <RootStack.Screen
          name={ROUTES.QR_CODE_SCAN_TEST.name}
          component={QRCodeScanTest}
        />
        <RootStack.Screen name={ROUTES.WALLET.name} component={Wallet} />
      </RootStack.Navigator>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={dark}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="MainTab" component={RootStackScreen} />
            <Tab.Screen
              name="Onboarding"
              component={Onboarding}
              options={{tabBarVisible: false}}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  )
}
