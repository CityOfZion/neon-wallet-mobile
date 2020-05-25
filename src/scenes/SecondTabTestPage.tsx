import React from 'react'
import {Text, View} from 'react-native'
import tailwind from 'tailwind-rn'

export default function SecondTabTestPage() {
  return (
    <View style={tailwind('h-full bg-white items-center justify-center')}>
      <Text style={tailwind('font-bold text-2xl')}>This is the 2nd tab!</Text>
    </View>
  )
}
