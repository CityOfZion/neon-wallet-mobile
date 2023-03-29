import React from 'react'
import { useSelector } from 'react-redux'

import { Normalize } from '../app/Normalize'
import { hasCustomSelector } from '../store/settings/SettingsSelector'
import { ImageView, LinearLayout, TextView } from '../styles/styled-components'

export const CustomModeBar = () => {
  const hasCustom = useSelector(hasCustomSelector)

  return hasCustom ? (
    <LinearLayout
      orientation="horiz"
      backgroundColor="black"
      width="100%"
      justifyContent="center"
      alignItems="flex-end"
      padding={15}
      borderBottomWidth="2px"
      borderBottomColor="quinary"
    >
      <LinearLayout orientation="horiz">
        <ImageView
          source={require('~src/assets/images/icon-warning-purple.png')}
          width={Normalize.scale(16)}
          height={Normalize.scale(16)}
          resizeMode="contain"
          alignSelf="center"
          marginRight="8px"
        />
        <TextView fontSize="18px" color="text.0">
          Custom Network Mode
        </TextView>
      </LinearLayout>
    </LinearLayout>
  ) : null
}
