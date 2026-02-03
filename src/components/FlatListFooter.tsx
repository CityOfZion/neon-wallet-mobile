import React from 'react'

import { View } from 'react-native'

import { Loader } from './Loader'

export const FlatListFooter = () => {
  return (
    <View className="mt-3 items-center">
      <Loader />
    </View>
  )
}
