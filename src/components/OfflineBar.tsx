import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'
import { ImageView, LinearLayout, TextView } from '../styles/styled-components'

const OfflineBar = () => {
  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  return !isConnected ? (
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
  ) : null
}

export default OfflineBar
