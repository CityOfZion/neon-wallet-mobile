import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { RootState } from '../store/RootStore'
import { hasCustomSelector } from '../store/settings/SettingsSelector'
import { ImageView, LinearLayout, TextView } from '../styles/styled-components'

const OfflineBar = () => {
  const hasCustom = useSelector(hasCustomSelector)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  useEffect(() => {
    if (hasCustom) return

    StatusBar.setBackgroundColor(theme.colors.background[12])
  }, [hasCustom])

  return (
    <LinearLayout
      orientation="horiz"
      width="100%"
      padding={15}
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
