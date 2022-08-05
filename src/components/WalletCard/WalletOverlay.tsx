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
        left="0px"
        source={require('~src/assets/images/wallet-front.png')}
        style={{
          width: '102%',
        }}
      />
    </LinearLayout>
  )
}
