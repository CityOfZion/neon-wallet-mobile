import React from 'react'

import { ButtonView, ImageView, TextView } from '../styles/styled-components'

type Props = {
  value?: string | React.ReactNode
  onPress?: () => void
  placeholder?: string
  withoutIcon?: boolean
}

export const Select = ({ value, onPress, placeholder, withoutIcon }: Props) => {
  const isPlaceholder = !value

  return (
    <ButtonView
      orientation="horiz"
      alignItems="center"
      borderColor="background.10"
      borderBottomWidth="2px"
      py="6px"
      onPress={onPress}
    >
      {isPlaceholder || typeof value === 'string' ? (
        <TextView
          color={isPlaceholder ? 'text.10' : 'text.0'}
          flexGrow={1}
          flexShrink={1}
          numberOfLines={1}
          fontSize={18}
          ellipsizeMode="middle"
        >
          {isPlaceholder ? placeholder : value}
        </TextView>
      ) : (
        value
      )}

      {!withoutIcon && (
        <ImageView
          source={require('~src/assets/images/icon-arrow-down-green.png')}
          width={10}
          height={10}
          resizeMode="contain"
          ml="12px"
        />
      )}
    </ButtonView>
  )
}
