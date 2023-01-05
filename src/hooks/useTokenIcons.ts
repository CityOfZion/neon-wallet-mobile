import { useCallback } from 'react'
import { useQuery } from 'react-query'

import { BlockchainServiceKey, blockchainServices, hasIconDapps } from '../blockchain/common'

async function fetchTokenIcons(scriptHashList: string[], blockchain: BlockchainServiceKey) {
  const service = blockchainServices[blockchain]
  if (hasIconDapps(service)) {
    return await service.getIconList(scriptHashList)
  }
}

async function fetchTokenIconsByScriptHash(scriptHash: string, blockchain: BlockchainServiceKey) {
  const service = blockchainServices[blockchain]
  if (hasIconDapps(service)) {
    return await service.getIconByScriptHash(scriptHash)
  }
}

// export function useTokenIcons(
//     params: { blockchain: BlockchainServiceKey, scriptHash: string }
// ): ReturnType<typeof useQuery([''])>

export function useTokenIcons(params: { blockchain: BlockchainServiceKey; scriptHash: string[] }) {
  const { blockchain, scriptHash } = params
  const { data: iconList, ...rest } = useQuery(['getIconList', ...scriptHash], async () =>
    fetchTokenIcons(scriptHash, blockchain)
  )
  return {
    iconList,
    ...rest,
  }
}
