import { BSNeoXConstants } from '@cityofzion/bs-neox'

import type { TNetwork } from '@/types/blockchain'
import type { TNetworkHelperIsNeoxAntiMevParams } from '@/types/helpers'

export class NetworkHelper {
  static readonly defaultCozNeo3CustomNetwork: TNetwork = {
    id: 'coz-neo3',
    name: 'COZ',
    url: 'https://chain1.coz.io:443',
    type: 'custom',
  }

  static isDefaultCustomNetwork(network: TNetwork) {
    return network.id === this.defaultCozNeo3CustomNetwork.id
  }

  static isNeoxAntiMev({ blockchain, networkId, url }: TNetworkHelperIsNeoxAntiMevParams) {
    if (blockchain !== 'neox') return false

    const antiMevUrls =
      BSNeoXConstants.ANTI_MEV_RPC_LIST_BY_NETWORK_ID[
        networkId as keyof typeof BSNeoXConstants.ANTI_MEV_RPC_LIST_BY_NETWORK_ID
      ] || []

    return antiMevUrls.includes(url)
  }
}
