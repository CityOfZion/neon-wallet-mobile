import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'

import {Facade} from '~src/app/Facade'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export const ThemedFlatButton = (props: {
  text: string
  onPress: () => void
  width?: string
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'baseline' | 'stretch'
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-evenly'
    | 'space-between'
    | 'space-around'
  textAlign?: 'left' | 'right' | 'center' | 'justify' | 'auto'
}) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <LinearLayout
        width={props.width ?? '100%'}
        borderRadius="7px"
        borderWidth="1px"
        borderColor="primary"
        justifyContent={props.justifyContent ?? 'center'}
        alignItems={props.alignItems ?? 'center'}
        orientation="horiz"
        p="10px"
        mb={'2%'}
      >
        <TextView
          style={{includeFontPadding: false}}
          color={'primary'}
          fontSize={20}
          textAlign={props.textAlign ?? 'auto'}
        >
          {props.text}
        </TextView>
      </LinearLayout>
    </TouchableWithoutFeedback>
  )
}
