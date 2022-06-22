import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { ImageView, LinearLayout } from '../styles/styled-components'

type Props = {
  onPress(): void
}

export const BackButton = ({ onPress }: Props) => {
  return (
    <LinearLayout alignItems="center" flexDirection="row">
      <TouchableWithoutFeedback onPress={onPress}>
        <ImageView width={13} height={20} source={require('~src/assets/images/icon_arrow_left_white.png')} />
      </TouchableWithoutFeedback>
    </LinearLayout>
  )
}
