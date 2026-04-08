import React from 'react'

import type { SvgProps } from 'react-native-svg'

import { StyleHelper } from '@/helpers/StyleHelper'

import ArbitrumDefault from '@/assets/images/blockchains/arbitrum-default.svg'
import ArbitrumGray from '@/assets/images/blockchains/arbitrum-gray.svg'
import ArbitrumWhite from '@/assets/images/blockchains/arbitrum-white.svg'
import BaseDefault from '@/assets/images/blockchains/base-default.svg'
import BaseGray from '@/assets/images/blockchains/base-gray.svg'
import BaseWhite from '@/assets/images/blockchains/base-white.svg'
import BitcoinDefault from '@/assets/images/blockchains/bitcoin-default.svg'
import BitcoinGray from '@/assets/images/blockchains/bitcoin-gray.svg'
import BitcoinWhite from '@/assets/images/blockchains/bitcoin-white.svg'
import EthereumDefault from '@/assets/images/blockchains/ethereum-default.svg'
import EthereumGray from '@/assets/images/blockchains/ethereum-gray.svg'
import EthereumWhite from '@/assets/images/blockchains/ethereum-white.svg'
import NeoLegacyDefault from '@/assets/images/blockchains/neo-legacy-default.svg'
import NeoLegacyGray from '@/assets/images/blockchains/neo-legacy-gray.svg'
import NeoLegacyWhite from '@/assets/images/blockchains/neo-legacy-white.svg'
import Neo3Default from '@/assets/images/blockchains/neo3-default.svg'
import Neo3Gray from '@/assets/images/blockchains/neo3-gray.svg'
import Neo3White from '@/assets/images/blockchains/neo3-white.svg'
import NeoxDefault from '@/assets/images/blockchains/neox-default.svg'
import NeoxGray from '@/assets/images/blockchains/neox-gray.svg'
import NeoxWhite from '@/assets/images/blockchains/neox-white.svg'
import PolygonDefault from '@/assets/images/blockchains/polygon-default.svg'
import PolygonGray from '@/assets/images/blockchains/polygon-gray.svg'
import PolygonWhite from '@/assets/images/blockchains/polygon-white.svg'
import SolanaDefault from '@/assets/images/blockchains/solana-default.svg'
import SolanaGray from '@/assets/images/blockchains/solana-gray.svg'
import SolanaWhite from '@/assets/images/blockchains/solana-white.svg'

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
