import { useEffect } from 'react'

import { hasWalletConnect } from '@cityofzion/blockchain-service'
import { useIsFocused } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ReactQueryHelper } from '@/helpers/ReactQueryHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import type { TAccount } from '@/types/store'

export const buildWalletConnectSessionKey = (account?: TAccount) => {
  const key = ['wallet-connect', 'sessions']

  if (account) {
    key.push(account.id)
  }

  return key
}

export const invalidateWalletConnectSessions = (account?: TAccount) => {
  return ReactQueryHelper.client.invalidateQueries({
    queryKey: buildWalletConnectSessionKey(account),
  })
}

const fetchSessions = async (account?: TAccount) => {
  const sessions = Object.values(WalletKitHelper.kit.getActiveSessions())

  if (account) {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
    if (!hasWalletConnect(service)) return []

    return WalletKitHelper.filterSessions(sessions, {
      addresses: [account.address],
      chains: [service.walletConnectService.chain],
    })
  }

  return sessions
}

export const useWalletConnectSessions = (account?: TAccount) => {
  const isFocused = useIsFocused()

  const query = useQuery({
    queryKey: buildWalletConnectSessionKey(account),
    queryFn: fetchSessions.bind(null, account),
    staleTime: 0,
  })

  useEffect(() => {
    const listener = () => {
      invalidateWalletConnectSessions(account)
    }

    WalletKitHelper.kit.on('session_delete', listener)

    return () => {
      WalletKitHelper.kit.off('session_delete', listener)
    }
  }, [account])

  useEffect(() => {
    query.refetch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused])

  return query
}
