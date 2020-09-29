import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'

import {Facade} from '~src/app/Facade'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export const ThemedFlatButton = (props: {
  text: string
  onPress: () => void
}) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <LinearLayout
        width="100%"
        borderRadius="7px"
        borderWidth="1px"
        borderColor="primary"
        justifyContent="center"
        alignItems="center"
        orientation="horiz"
        p="10px"
        mb={'2%'}
      >
        <TextView
          style={{includeFontPadding: false}}
          ml={3}
          color={'primary'}
          fontSize={20}
        >
          {props.text}
        </TextView>
      </LinearLayout>
    </TouchableWithoutFeedback>
  )
}
