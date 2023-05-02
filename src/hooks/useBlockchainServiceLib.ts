import { BSAgreggator, BlockchainService, hasNNS } from '@cityofzion/blockchain-service'
import { BSNeoLegacy } from '@cityofzion/bs-neo-legacy'
import { BSNeo3 } from '@cityofzion/bs-neo3'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey } from '../blockchain'
import { RootState } from '../store/RootStore'

const bsAgreggator = new BSAgreggator<BlockchainService<BlockchainServiceKey>, BlockchainServiceKey>({
  neo3: new BSNeo3('neo3'),
  neoLegacy: new BSNeoLegacy('neoLegacy'),
})

export const useBlockchainServiceLib = () => {
  const selectedBlockchainNetwork = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)

  const getBlockchainServiceLib = useCallback(
    (blockchain: BlockchainServiceKey) => {
      if (selectedBlockchainNetwork[blockchain].type !== 'mainnet') throw new Error('Only mainnet is supported')

      return bsAgreggator.blockchainservices[blockchain]
    },
    [selectedBlockchainNetwork]
  )

  return { bsAgreggator, getBlockchainServiceLib, hasNNS }
}
