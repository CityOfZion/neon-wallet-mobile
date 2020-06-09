import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {RequestConfig} from '@simpli/serialized-request'
import React from 'react'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import '~src/window-crypto'
import 'reflect-metadata'
import {ROUTES} from '~/constants'
import {HttpConfig} from '~src/config/HttpConfig'
import {rootReducer} from '~src/store/reducers/root'

import ChartTestPage from '~src/scenes/ChartTestPage'
import Home from '~src/scenes/Home'
import NeonJSTest from '~src/scenes/NeonJSTest'
import Onboarding from '~src/scenes/Onboarding'
import QrCodeGenerateTest from '~src/scenes/QrCodeGenerateTest'
import QRCodeScanTest from './scenes/QRCodeScanTest'
import TouchIdTest from '~src/scenes/TouchIdTest'
import Wallet from '~src/scenes/Wallet'

type RootStackParamList = {
  Home: undefined
  TouchIdTest: undefined
  QRCodeScanTest: undefined
  QrCodeGenerateTest: undefined
  NeonJSTest: undefined
  ChartTest: undefined
  Wallet: undefined
}

const store = createStore(rootReducer, applyMiddleware(thunk))

const RootStack = createStackNavigator<RootStackParamList>()

const Tab = createBottomTabNavigator()

const httpConfig = new HttpConfig()
RequestConfig.axios = httpConfig.axiosInstance

function RootStackScreen() {
  return (
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
        name={ROUTES.QR_CODE_SCAN_TEST.name}
        component={QRCodeScanTest}
      />
      <RootStack.Screen name={ROUTES.WALLET.name} component={Wallet} />
    </RootStack.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}
