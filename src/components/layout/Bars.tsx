import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { RootState } from '~/src/store/RootStore'
import { hasCustomSelector } from '~/src/store/settings/SettingsSelector'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  colors: string[]
}

const OfflineBar = () => {
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

const CustomModeBar = () => {
  return (
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
  )
}

export const Bars = ({ colors }: Props) => {
  const hasCustom = useSelector(hasCustomSelector)
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const backgroundColor = useMemo(
    () => (hasCustom ? theme.colors.black : !isConnected ? theme.colors.background[12] : colors[0]),
    [colors, theme, isConnected, hasCustom]
  )

  return (
    <>
      <LinearLayout width="100%" height={applicationConfig.statusBarHeight} backgroundColor={backgroundColor} />
      {hasCustom && <CustomModeBar />}
      {!isConnected && <OfflineBar />}
    </>
  )
}
