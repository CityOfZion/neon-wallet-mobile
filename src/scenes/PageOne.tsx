import React from 'react'
import { Text, View } from 'react-native'
import tailwind from 'tailwind-rn'

export default function PageOne() {
  return (
    <View style={tailwind('h-full bg-white items-center justify-center')}>
      <Text>Pg 1</Text>
    </View>
  )
}
