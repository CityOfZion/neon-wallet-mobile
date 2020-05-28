import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import tailwind from 'tailwind-rn'
import Swiper from 'react-native-swiper'

export default function Onboarding() {
  return (
    <View style={tailwind('h-full bg-white items-center justify-center')}>
      <Swiper loop={false}>
        <View style={tailwind('h-full bg-white items-center justify-center')}>
          <Text style={tailwind('font-bold text-2xl')}>Welcome to Neon Wallet!</Text>
        </View>
        <View style={tailwind('h-full bg-white items-center justify-center')}>
          <Text style={tailwind('font-bold text-2xl')}>Some awesome feature!</Text>
        </View>
        <View style={tailwind('h-full bg-white items-center justify-center')}>
          <Text style={tailwind('font-bold text-2xl')}>Another killer feature!</Text>
        </View>
      </Swiper>
    </View>
  )
}
