import React from 'react'

import { ImageView, LinearLayout } from '~/src/styles/styled-components'

type Props = {
  width: number
  height: number
}

export const WalletOverlay = ({ height, width }: Props) => {
  return (
    <LinearLayout width={width} height={height} overflow="hidden" borderRadius="18px">
      <ImageView
        position="absolute"
        bottom="-8px"
        left="-2px"
        source={require('~src/assets/images/wallet-front.png')}
        style={{
          width: width * 1.05,
          height: height * 0.75,
        }}
      />
    </LinearLayout>
  )
}
