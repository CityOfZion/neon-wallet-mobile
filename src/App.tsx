import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import {ROUTES} from '~/constants'
import Home from '~src/scenes/Home'
import NeonJSTest from '~src/scenes/NeonJSTest'
import QrCodeGenerateTest from '~src/scenes/QrCodeGenerateTest'
import QRCodeScanTest from './scenes/QRCodeScanTest'
import Onboarding from '~src/scenes/Onboarding'
import ChartTestPage from '~src/scenes/ChartTestPage'
import TouchIdTest from '~src/scenes/TouchIdTest'
import {rootReducer} from '~src/store/reducers/root'

type RootStackParamList = {
  Home: undefined
  TouchIdTest: undefined
  QRCodeScanTest: undefined
  QrCodeGenerateTest: undefined
  NeonJSTest: undefined
  ChartTest: undefined
}

const store = createStore(rootReducer)

const RootStack = createStackNavigator<RootStackParamList>()

const Tab = createBottomTabNavigator()

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
    </RootStack.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Main Tab" component={RootStackScreen} />
          <Tab.Screen name="Onboarding" component={Onboarding} options={{tabBarVisible: false}} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
