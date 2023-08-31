import React from 'react'
import { ImageResizeMode } from 'react-native'

import { TBlockchainImageColor, blockchainIconsByBlockchain } from '../assets/blockchain/images'
import { ImageView } from '../styles/styled-components'
import { TBlockchainServiceKey } from '../types/blockchain'
import { ImageViewProps } from '../types/styled-components'

type Props = ImageViewProps & {
  width: number
  height: number
  resizeMode?: ImageResizeMode
  blockchain: TBlockchainServiceKey
  type?: TBlockchainImageColor
}

export const BlockchainIcon = React.memo(({ blockchain, type = 'default', ...props }: Props) => {
  const source = blockchainIconsByBlockchain[blockchain][type]

  return <ImageView source={source} resizeMode="contain" alignSelf="center" {...props} />
})
