import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {RequestConfig} from '@simpli/serialized-request'
import {AppLoading} from 'expo'
import * as Font from 'expo-font'
import React, {useState} from 'react'
import {StatusBar} from 'react-native'
import {Provider as StoreProvider, useSelector} from 'react-redux'
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
import WalletView from '~src/scenes/WalletView'
import {rootReducer, RootState} from '~src/store/reducers/root'

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
    bold: require('~src/assets/fonts/sofiapro-bold.otf'),
    medium: require('~src/assets/fonts/sofiapro-medium.otf'),
    regular: require('~src/assets/fonts/sofiapro-regular.otf'),
    italic: require('~src/assets/fonts/sofiapro-regularitalic.otf'),
    semibold: require('~src/assets/fonts/sofiapro-semibold.otf'),
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

  const navbarOptions = {
    headerStyle: {
      backgroundColor: theme.colors.background[0],
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerTintColor: theme.colors.text[0],
  }

  return (
    <ThemeProvider theme={theme}>
      <RootStack.Navigator
        initialRouteName={ROUTES.HOME.name}
        screenOptions={navbarOptions}
      >
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
        <RootStack.Screen name={ROUTES.WALLET.name} component={WalletView} />
      </RootStack.Navigator>
    </ThemeProvider>
  )
}

const AppNavigation = () => {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <StatusBar
          translucent
          barStyle={theme.statusBarStyle}
          backgroundColor="transparent"
        />
        <Tab.Navigator>
          <Tab.Screen name="MainTab" component={RootStackScreen} />
          <Tab.Screen
            name="Onboarding"
            component={Onboarding}
            options={{tabBarVisible: false}}
          />
        </Tab.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <StoreProvider store={store}>
      <AppNavigation />
    </StoreProvider>
  )
}
