import React from 'react'
import { GestureResponderEvent, ImageSourcePropType } from 'react-native'

import { ButtonView, ImageView, TextView } from '../styles/styled-components'
import { ButtonViewProps, ImageViewProps, TextViewProps } from '../types/styled-components'

type Variant = 'text' | 'contained' | 'outline'

type Props = ButtonViewProps & {
  icon?: ImageSourcePropType
  label: string
  iconStyle?: Omit<ImageViewProps, 'width' | 'height'> & { width: number; height: number }
  labelStyle?: TextViewProps
  onPress?: (event: GestureResponderEvent) => void
  variant?: Variant
  disabled?: boolean
}

export const Button = ({ icon, label, iconStyle, labelStyle, onPress, variant, disabled, ...rest }: Props) => {
  return (
    <ButtonView
      orientation="horiz"
      p="10px"
      alignItems="center"
      onPress={onPress}
      backgroundColor={variant === 'contained' ? 'primary' : 'transparent'}
      borderRadius="4px"
      justifyContent="center"
      opacity={disabled ? 0.3 : 1}
      disabled={disabled}
      borderWidth={variant === 'outline' ? '1px' : '0px'}
      borderColor="primary"
      {...rest}
    >
      {!!icon && (
        <ImageView
          source={icon}
          resizeMode="contain"
          style={{ width: iconStyle?.width ?? 24, height: iconStyle?.height ?? 24 }}
          mr="8px"
          {...iconStyle}
        />
      )}

      <TextView
        fontFamily={variant === 'contained' || variant === 'outline' ? 'regular' : 'bold'}
        fontSize="lg"
        color={variant === 'contained' ? 'text.9' : 'primary'}
        {...labelStyle}
      >
        {label}
      </TextView>
    </ButtonView>
  )
}
