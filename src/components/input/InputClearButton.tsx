import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'

import {ImageView} from '~src/styles/styled-components'

export const InputClearButton = (props: {
  onPress: () => void
  value: string
}) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress} disabled={!props.value}>
      <ImageView
        opacity={props.value ? 1 : 0}
        width={15}
        height={15}
        mb="-6px"
        resizeMode="contain"
        source={require('~/src/assets/images/icon-cancel-grey.png')}
      />
    </TouchableWithoutFeedback>
  )
}
