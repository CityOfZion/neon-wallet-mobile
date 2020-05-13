import React from 'react'
import {Home} from './scenes/Home'
import { createStackNavigator } from '@react-navigation/stack'
import PageOne from './scenes/PageOne'
import PageTwo from './scenes/PageTwo'
import {NavigationContainer} from '@react-navigation/native'

type RootStackParamList = {
  Home: undefined
  PageOne: undefined
  Feed: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="PageOne" component={PageOne} />
        <RootStack.Screen name="PageTwo" component={PageTwo} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
