import React from 'react'

import type { SvgProps } from 'react-native-svg'

import { StyleHelper } from '@/helpers/StyleHelper'

import ArbitrumDefault from '@/assets/blockchain/arbitrum_default.svg'
import ArbitrumGray from '@/assets/blockchain/arbitrum_gray.svg'
import ArbitrumWhite from '@/assets/blockchain/arbitrum_white.svg'
import BaseDefault from '@/assets/blockchain/base_default.svg'
import BaseGray from '@/assets/blockchain/base_gray.svg'
import BaseWhite from '@/assets/blockchain/base_white.svg'
import EthereumDefault from '@/assets/blockchain/ethereum_default.svg'
import EthereumGray from '@/assets/blockchain/ethereum_gray.svg'
import EthereumWhite from '@/assets/blockchain/ethereum_white.svg'
import NeoLegacyDefault from '@/assets/blockchain/neo_legacy_default.svg'
import NeoLegacyGray from '@/assets/blockchain/neo_legacy_gray.svg'
import NeoLegacyWhite from '@/assets/blockchain/neo_legacy_white.svg'
import Neo3Default from '@/assets/blockchain/neo3_default.svg'
import Neo3Gray from '@/assets/blockchain/neo3_gray.svg'
import Neo3White from '@/assets/blockchain/neo3_white.svg'
import NeoxDefault from '@/assets/blockchain/neox_default.svg'
import NeoxGray from '@/assets/blockchain/neox_gray.svg'
import NeoxWhite from '@/assets/blockchain/neox_white.svg'
import PolygonDefault from '@/assets/blockchain/polygon_default.svg'
import PolygonGray from '@/assets/blockchain/polygon_gray.svg'
import PolygonWhite from '@/assets/blockchain/polygon_white.svg'

import type { TBlockchainImageColor, TBlockchainServiceKey } from '../types/blockchain'

export const ICONS_BY_BLOCKCHAIN: Record<TBlockchainServiceKey, Record<TBlockchainImageColor, React.FC<SvgProps>>> = {
  neo3: {
    default: Neo3Default,
    gray: Neo3Gray,
    white: Neo3White,
  },
  neoLegacy: {
    default: NeoLegacyDefault,
    gray: NeoLegacyGray,
    white: NeoLegacyWhite,
  },
  ethereum: {
    default: EthereumDefault,
    gray: EthereumGray,
    white: EthereumWhite,
  },
  neox: {
    default: NeoxDefault,
    gray: NeoxGray,
    white: NeoxWhite,
  },
  polygon: {
    default: PolygonDefault,
    gray: PolygonGray,
    white: PolygonWhite,
  },
  base: {
    default: BaseDefault,
    gray: BaseGray,
    white: BaseWhite,
  },
  arbitrum: {
    default: ArbitrumDefault,
    gray: ArbitrumGray,
    white: ArbitrumWhite,
  },
}

type Props = SvgProps & {
  blockchain: TBlockchainServiceKey
  type?: TBlockchainImageColor
}

export const TwBlockchainIcon = ({ blockchain, type = 'default', ...props }: Props) => {
  const Component = ICONS_BY_BLOCKCHAIN[blockchain][type]

  return <Component {...props} className={StyleHelper.mergeStyles('h-8.5 w-8.5 object-contain', props.className)} />
}
