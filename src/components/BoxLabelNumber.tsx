import React from 'react'
import { ColorValue, View } from 'react-native'

import { TextView } from '../styles/styled-components'

interface BoxLabelNumberProps {
  color: ColorValue
  label: string
  number: number
}

export const BoxLabelNumber = (props: BoxLabelNumberProps) => {
  return (
    <View
      style={{
        backgroundColor: props.color,
        borderRadius: 5,
        flexDirection: 'row',
        padding: 5,
        marginHorizontal: 5,
      }}
    >
      <TextView mr={5} color="#fff">
        {props.label}
      </TextView>
      <TextView color="primary">{props.number}</TextView>
    </View>
  )
}
