import React from 'react'

import { ImageView } from '~/src/styles/styled-components'

export const WalletOverlay = () => {
  return (
    <ImageView
      position="absolute"
      bottom="-2px"
      resizeMode="stretch"
      source={require('~src/assets/images/wallet-front.png')}
      style={{
        width: '100%',
        height: '75%',
      }}
    />
  )
}
