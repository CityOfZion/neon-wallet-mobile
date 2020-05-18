import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'

import Home from './scenes/Home'
import PageTwo from './scenes/PageTwo'
import {TouchIdTest} from './scenes/TouchIdTest'

import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {rootReducer} from './store/reducers/root'

type RootStackParamList = {
  Home: undefined
  TouchIdTest: undefined
  PageTwo: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
const store = createStore(rootReducer)

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Home">
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen name="TouchIdTest" component={TouchIdTest} />
          <RootStack.Screen name="PageTwo" component={PageTwo} />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
