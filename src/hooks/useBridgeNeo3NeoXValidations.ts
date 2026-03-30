import { useMemo } from 'react'

import { hasNeo3NeoXBridge } from '@cityofzion/blockchain-service'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import type { TAccount } from '@/types/store'

export const useBridgeNeo3NeoXValidations = (account?: TAccount) => {
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  const canAccountBridge = useMemo(() => {
    const service = account ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain] : null

    return (
      !!service && selectedNetworkByBlockchain[account!.blockchain].type === 'mainnet' && hasNeo3NeoXBridge(service)
    )
  }, [account, selectedNetworkByBlockchain])

  return { canAccountBridge }
}
