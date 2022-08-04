import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { ImageView } from '~src/styles/styled-components'

export const InputClearButton = (props: { onPress: () => void }) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <ImageView
        width={14}
        height={14}
        mr="4px"
        ml="4px"
        alignSelf="center"
        source={require('~/src/assets/images/icon-cancel-grey.png')}
      />
    </TouchableWithoutFeedback>
  )
}
