import { useCallback } from 'react'

import { BSNeo3NeonDappKitSingletonHelper, BSNeo3NeonJsSingletonHelper } from '@cityofzion/bs-neo3'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useSelectedNetworkSelector } from '@/hooks/useSettingsSelector'

import type { TNetwork } from '@/types/blockchain'
import type { TAccount, TNftSkin } from '@/types/store'

const MAX_COUNT = 100

async function fetchItemNeo3Skins(account: TAccount, network: TNetwork): Promise<TNftSkin[]> {
  const allNfts: TNftSkin[] = []

  if (account.blockchain !== 'neo3') return allNfts

  const { NeonInvoker, NeonParser, TypeChecker } = BSNeo3NeonDappKitSingletonHelper.getInstance()

  const invoker = await NeonInvoker.init({ rpcAddress: network.url })
  const tokenOfResult = await invoker.testInvoke({
    invocations: [
      {
        scriptHash: '0x904deb56fdd9a87b48d89e0cc0ac3415f9207840',
        operation: 'tokensOf',
        args: [{ type: 'Hash160', value: account.address }],
      },
    ],
  })

  const [firstStack] = tokenOfResult.stack

  if (!TypeChecker.isStackTypeInteropInterface(firstStack)) return []

  const traverseTokenOfResult = await invoker.traverseIterator(tokenOfResult.session!, firstStack.id, MAX_COUNT)
  const nftSkins: TNftSkin[] = []

  const { u } = BSNeo3NeonJsSingletonHelper.getInstance()

  for (const token of traverseTokenOfResult) {
    if (!TypeChecker.isStackTypeByteString(token)) continue

    const tokenId = u.BigInteger.fromHex(u.reverseHex(u.HexString.fromBase64(token.value).toString())).toString()
    const result = await invoker.testInvoke({
      invocations: [
        {
          scriptHash: '0x904deb56fdd9a87b48d89e0cc0ac3415f9207840',
          operation: 'getItemJSON',
          args: [{ type: 'Integer', value: tokenId }],
        },
      ],
    })

    const itemJson = NeonParser.parseRpcResponse(result.stack[0])
    const { epochId } = itemJson.epoch

    if (epochId !== 26) continue

    const imageUrl = `${itemJson.tokenURI}/wallet/skins/${epochId}.png`

    nftSkins.push({
      id: itemJson.tokenId,
      type: 'nft',
      imgUrl: imageUrl,
      contractHash: '0x904deb56fdd9a87b48d89e0cc0ac3415f9207840',
    })

    allNfts.push(...nftSkins)
  }

  return allNfts
}

async function fetchOwnerOfItemNeo3NftSkin(account: TAccount, nftSkin: TNftSkin) {
  if (account.blockchain !== 'neo3') return null

  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]

  if (service.network.type !== 'mainnet') return null

  const { NeonInvoker, NeonParser } = BSNeo3NeonDappKitSingletonHelper.getInstance()

  const invoker = await NeonInvoker.init({ rpcAddress: service.network.url })

  const ownerOfResult = await invoker.testInvoke({
    invocations: [
      {
        scriptHash: nftSkin.contractHash,
        operation: 'ownerOf',
        args: [{ type: 'Integer', value: nftSkin.id }],
      },
    ],
  })

  const response = NeonParser.parseRpcResponse(ownerOfResult.stack[0])

  const { u, wallet } = BSNeo3NeonJsSingletonHelper.getInstance()

  const { address } = new wallet.Account(u.reverseHex(u.HexString.fromBase64(response).toString()))

  return address
}

export const useItemNeo3NftSkins = (account: TAccount) => {
  const { selectedNetwork } = useSelectedNetworkSelector(account.blockchain)

  return useQuery<TNftSkin[]>({
    queryKey: ['nft-skins', account.address, selectedNetwork],
    queryFn: fetchItemNeo3Skins.bind(null, account, selectedNetwork),
    staleTime: 0,
    gcTime: 0,
  })
}

export const useLazyOwnershipOfItemNeo3NftSkin = () => {
  const queryClient = useQueryClient()

  const getOwnership = useCallback(
    async (account: TAccount, nftSkin: TNftSkin) => {
      return await queryClient.ensureQueryData({
        queryKey: ['nft-skin-owner', nftSkin.contractHash, nftSkin.id],
        queryFn: fetchOwnerOfItemNeo3NftSkin.bind(null, account, nftSkin),
      })
    },
    [queryClient]
  )

  return { getOwnership }
}
