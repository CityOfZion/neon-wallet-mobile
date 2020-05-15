import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'

import {Home} from './scenes/Home'
import PageTwo from './scenes/PageTwo'
import {TouchIdTest} from './scenes/TouchIdTest'

type RootStackParamList = {
  Home: undefined
  TouchIdTest: undefined
  PageTwo: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="TouchIdTest" component={TouchIdTest} />
        <RootStack.Screen name="PageTwo" component={PageTwo} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
