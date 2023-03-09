import Constants from 'expo-constants'
import React from 'react'
import { useSelector } from 'react-redux'

import { hasCustomSelector } from '../store/settings/SettingsSelector'
import { ImageView, LinearLayout, TextView } from '../styles/styled-components'

const OfflineBar = () => {
  const hasCustom = useSelector(hasCustomSelector)

  return (
    <LinearLayout
      orientation="horiz"
      width="100%"
      padding={15}
      paddingTop={15 + (!hasCustom ? Constants.statusBarHeight : 0)}
      backgroundColor="background.12"
      borderBottomWidth="1px"
      borderBottomColor="primary"
      alignItems="center"
      justifyContent="center"
    >
      <ImageView
        source={require('~src/assets/images/no-internet-icon.png')}
        width={34}
        height={34}
        resizeMode="contain"
      />
      <LinearLayout marginLeft="10px">
        <TextView color="primary" fontSize="10px">
          WARNING
        </TextView>
        <TextView color="text.0">No internet connection</TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

export default OfflineBar
