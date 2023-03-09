import { useCallback, useMemo, useState } from 'react'
import { ImageSourcePropType } from 'react-native'
import { useQuery, UseQueryOptions } from 'react-query'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey } from '../blockchain'
import { RootState } from '../store/RootStore'
import { useBlockchainService, useBlockchainServiceUtils } from './useBlockchainServices'

import { icons } from '~src/assets/tokens/icons'
import { tokensByBlockchain } from '~src/assets/tokens/infos'

type Props = {
  blockchain: BlockchainServiceKey | 'all'
}

type TUseTokenIconProps = {
  blockchain: BlockchainServiceKey
  symbol: string
  hash: string
}

export const useLocalTokensUtils = () => {
  const selectedBlockchainNetwork = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)

  const getTokensByBlockchain = useCallback(
    (key: BlockchainServiceKey) => {
      const network = selectedBlockchainNetwork[key].type
      return tokensByBlockchain[key][network]
    },

    [selectedBlockchainNetwork]
  )

  const getTokenBySymbol = useCallback(
    (symbol: string, key: BlockchainServiceKey) => {
      const tokens = getTokensByBlockchain(key)

      return tokens.find(token => token.symbol === symbol)
    },
    [getTokensByBlockchain]
  )

  return {
    getTokensByBlockchain,
    getTokenBySymbol,
  }
}

export const useLocalTokens = ({ blockchain }: Props) => {
  const { blockchainKeyList } = useBlockchainServiceUtils()
  const { getTokensByBlockchain } = useLocalTokensUtils()

  const tokens = useMemo(() => {
    if (blockchain === 'all') {
      return blockchainKeyList.map(getTokensByBlockchain).flat()
    }

    return getTokensByBlockchain(blockchain)
  }, [blockchain, getTokensByBlockchain])

  return { tokens }
}

export const useTokenIcon = (
  { blockchain, hash, symbol }: TUseTokenIconProps,
  queryOptions?: Omit<
    UseQueryOptions<ImageSourcePropType, unknown, ImageSourcePropType, string[]>,
    'queryKey' | 'queryFn'
  >
) => {
  const { blockchainService } = useBlockchainService(blockchain)
  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false)

  const fetchIcon = useCallback(async (): Promise<ImageSourcePropType> => {
    try {
      if (!blockchainService.hasIconDappsIntegration()) throw new Error('Blockchain does not support IconDapps')

      const iconURI = await blockchainService.getIcon(hash)
      if (!iconURI) throw new Error('Icon not found')

      return { uri: iconURI }
    } catch {
      return icons[blockchain][symbol] ?? require('~src/assets/tokens/images/Default.png')
    }
  }, [blockchainService])

  const { refetch, ...rest } = useQuery(['token_icon', blockchain, symbol], () => fetchIcon(), {
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: false,
    ...queryOptions,
  })

  const customRefetch = useCallback(async () => {
    setIsRefetchingByUser(true)

    try {
      await refetch()
    } finally {
      setIsRefetchingByUser(false)
    }
  }, [refetch])

  return {
    ...rest,
    refetch: customRefetch,
    isRefetchingByUser,
  }
}
