import React from 'react'
import { TouchableOpacity } from 'react-native'

import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  onPress?: () => void
  checked?: boolean
  label: string
  disabled?: boolean
}

const ThemedCheckbox = (props: Props) => {
  return (
    <TouchableOpacity
      style={{
        maxWidth: '100%',
        width: '90%',
        opacity: props.disabled ? 0.5 : 1,
      }}
      onPress={props.onPress}
      disabled={props.disabled}
    >
      <LinearLayout orientation="horiz" alignItems="center" width="100%">
        <LinearLayout
          borderWidth="1px"
          borderStyle="solid"
          borderRadius="7px"
          orientation="horiz"
          justifyContent="center"
          alignItems="center"
          width={36}
          height={36}
          borderColor="text.0"
          mr={4}
        >
          {props.checked && (
            <ImageView
              width={24}
              height={24}
              resizeMode="contain"
              source={require('~src/assets/images/icon-check-green.png')}
            />
          )}
        </LinearLayout>

        <TextView
          color="primary"
          fontSize="14px"
          fontFamily="bold"
          textAlign="left"
          allowFontScaling
          adjustsFontSizeToFit
          numberOfLines={3}
        >
          {props.label}
        </TextView>
      </LinearLayout>
    </TouchableOpacity>
  )
}

export default ThemedCheckbox
