import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import tailwind from 'tailwind-rn'

export default function PageTwo() {
  return (
    <View style={tailwind('h-full bg-white items-center justify-center')}>
      <Text>Pg 2</Text>
    </View>
  )
}
