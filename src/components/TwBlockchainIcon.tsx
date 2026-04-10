import React from 'react'

import type { SvgProps } from 'react-native-svg'

import { StyleHelper } from '@/helpers/StyleHelper'

import { Arbitrum } from '@/assets/images/blockchains/Arbitrum'
import { Base } from '@/assets/images/blockchains/Base'
import { Bitcoin } from '@/assets/images/blockchains/Bitcoin'
import { Ethereum } from '@/assets/images/blockchains/Ethereum'
import { Neo3 } from '@/assets/images/blockchains/Neo3'
import { NeoLegacy } from '@/assets/images/blockchains/NeoLegacy'
import { NeoX } from '@/assets/images/blockchains/NeoX'
import { Polygon } from '@/assets/images/blockchains/Polygon'
import { Solana } from '@/assets/images/blockchains/Solana'
import { Stellar } from '@/assets/images/blockchains/Stellar'

import type { TBlockchainServiceKey } from '@/types/blockchain'

export const ICONS_BY_BLOCKCHAIN: Record<TBlockchainServiceKey, React.FC<SvgProps>> = {
  neo3: Neo3,
  neoLegacy: NeoLegacy,
  neox: NeoX,
  bitcoin: Bitcoin,
  solana: Solana,
  ethereum: Ethereum,
  polygon: Polygon,
  base: Base,
  arbitrum: Arbitrum,
  stellar: Stellar,
}

type Props = SvgProps & {
  blockchain: TBlockchainServiceKey
}

export const TwBlockchainIcon = ({ blockchain, className, ...props }: Props) => {
  const Component = ICONS_BY_BLOCKCHAIN[blockchain]

  const color = StyleHelper.extractTailwindValue('text', className)

  return (
    <Component
      className={StyleHelper.mergeStyles('size-8.5 object-contain', className)}
      fill={color || undefined}
      {...props}
    />
  )
}
