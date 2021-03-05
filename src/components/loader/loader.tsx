import React from 'react'
import {ActivityIndicator, View} from 'react-native'

export const Loader = () => {
  return (
    <View>
      <ActivityIndicator size={'large'} color={'#fff'} />
    </View>
  )
}
