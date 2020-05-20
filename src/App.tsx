import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import React from 'react'

import Home from './scenes/Home'
import PageTwo from './scenes/PageTwo'
import {TouchIdTest} from './scenes/TouchIdTest'
import SecondTabTestPage from './scenes/SecondTabTestPage'

import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {rootReducer} from './store/reducers/root'
import {QrCodeGenerateTest} from './scenes/QrCodeGenerateTest'

type RootStackParamList = {
  Home: undefined
  TouchIdTest: undefined
  PageTwo: undefined
  QrCodeGenerateTest: undefined
}

const store = createStore(rootReducer)

const RootStack = createStackNavigator<RootStackParamList>()

const Tab = createBottomTabNavigator()

function RootStackScreen() {
  return (
    <RootStack.Navigator initialRouteName="Home">
      <RootStack.Screen name="Home" component={Home} />
      <RootStack.Screen name="TouchIdTest" component={TouchIdTest} />
      <RootStack.Screen name="PageTwo" component={PageTwo} />
      <RootStack.Screen name="QrCodeGenerateTest" component={QrCodeGenerateTest} />
    </RootStack.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Main Tab" component={RootStackScreen} />
          <Tab.Screen name="Second Tab" component={SecondTabTestPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
