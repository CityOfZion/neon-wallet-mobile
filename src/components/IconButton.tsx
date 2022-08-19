import React from 'react'
import { ImageSourcePropType } from 'react-native'

import { ButtonView, ImageView } from '../styles/styled-components'
import { ButtonViewProps } from '../types/styled-components'

type IconType = 'more' | 'more-primary' | 'alter-right-arrow-green' | 'check-green'

type Props = Omit<ButtonViewProps, 'width' | 'height'> & {
  type: IconType
  onPress?: () => void
  width?: number
  height?: number
}

const icons: Record<IconType, ImageSourcePropType> = {
  more: require('~src/assets/images/more-horiz.png'),
  'more-primary': require('~src/assets/images/more-primary.png'),
  'alter-right-arrow-green': require('~src/assets/images/icon-arrow-right-green.png'),
  'check-green': require('~src/assets/images/icon-check-green.png'),
}

export const IconButton = ({ type, height = 24, width = 24, ...rest }: Props) => {
  return (
    <ButtonView p="8px" {...rest}>
      <ImageView source={icons[type]} resizeMode="contain" style={{ width, height }} />
    </ButtonView>
  )
}
