import React from 'react'

import type { SvgProps } from 'react-native-svg'

import { StyleHelper } from '@/helpers/StyleHelper'

import ArbitrumDefault from '@/assets/blockchains/arbitrum-default.svg'
import ArbitrumGray from '@/assets/blockchains/arbitrum-gray.svg'
import ArbitrumWhite from '@/assets/blockchains/arbitrum-white.svg'
import BaseDefault from '@/assets/blockchains/base-default.svg'
import BaseGray from '@/assets/blockchains/base-gray.svg'
import BaseWhite from '@/assets/blockchains/base-white.svg'
import BitcoinDefault from '@/assets/blockchains/bitcoin-default.svg'
import BitcoinGray from '@/assets/blockchains/bitcoin-gray.svg'
import BitcoinWhite from '@/assets/blockchains/bitcoin-white.svg'
import EthereumDefault from '@/assets/blockchains/ethereum-default.svg'
import EthereumGray from '@/assets/blockchains/ethereum-gray.svg'
import EthereumWhite from '@/assets/blockchains/ethereum-white.svg'
import NeoLegacyDefault from '@/assets/blockchains/neo-legacy-default.svg'
import NeoLegacyGray from '@/assets/blockchains/neo-legacy-gray.svg'
import NeoLegacyWhite from '@/assets/blockchains/neo-legacy-white.svg'
import Neo3Default from '@/assets/blockchains/neo3-default.svg'
import Neo3Gray from '@/assets/blockchains/neo3-gray.svg'
import Neo3White from '@/assets/blockchains/neo3-white.svg'
import NeoxDefault from '@/assets/blockchains/neox-default.svg'
import NeoxGray from '@/assets/blockchains/neox-gray.svg'
import NeoxWhite from '@/assets/blockchains/neox-white.svg'
import PolygonDefault from '@/assets/blockchains/polygon-default.svg'
import PolygonGray from '@/assets/blockchains/polygon-gray.svg'
import PolygonWhite from '@/assets/blockchains/polygon-white.svg'
import SolanaDefault from '@/assets/blockchains/solana-default.svg'
import SolanaGray from '@/assets/blockchains/solana-gray.svg'
import SolanaWhite from '@/assets/blockchains/solana-white.svg'

import type { TBlockchainImageColor, TBlockchainServiceKey } from '@/types/blockchain'

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
  neox: {
    default: NeoxDefault,
    gray: NeoxGray,
    white: NeoxWhite,
  },
  bitcoin: {
    default: BitcoinDefault,
    gray: BitcoinGray,
    white: BitcoinWhite,
  },
  solana: {
    default: SolanaDefault,
    gray: SolanaGray,
    white: SolanaWhite,
  },
  ethereum: {
    default: EthereumDefault,
    gray: EthereumGray,
    white: EthereumWhite,
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

  return <Component {...props} className={StyleHelper.mergeStyles('size-8.5 object-contain', props.className)} />
}
