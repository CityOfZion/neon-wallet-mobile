import { useEffect } from 'react'

import { hasWalletConnect } from '@cityofzion/blockchain-service'
import { WalletKitHelper as BSWalletKitHelper } from '@cityofzion/bs-multichain'
import { useIsFocused } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ReactQueryHelper } from '@/helpers/ReactQueryHelper'
import { WalletKitHelper } from '@/helpers/WalletKitHelper'

import type { IAccountState } from '@/types/store'

export const buildWalletConnectSessionKey = (account?: IAccountState) => {
  const key = ['wallet-connect', 'sessions']

  if (account) {
    key.push(account.id)
  }

  return key
}

export const invalidateWalletConnectSessions = (account?: IAccountState) => {
  return ReactQueryHelper.client.invalidateQueries({
    queryKey: buildWalletConnectSessionKey(account),
  })
}

const fetchSessions = async (account?: IAccountState) => {
  const sessions = Object.values(WalletKitHelper.kit.getActiveSessions())

  if (account) {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
    if (!hasWalletConnect(service)) return []

    return BSWalletKitHelper.filterSessions(sessions, {
      addresses: [account.address],
      chains: [service.walletConnectService.chain],
    })
  }

  return sessions
}

export const useWalletConnectSessions = (account?: IAccountState) => {
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
