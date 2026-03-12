import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useMount } from '@/hooks/useMount'
import { useLazyPingNodes } from '@/hooks/useNodes'
import { useAppDispatch } from '@/hooks/useRedux'
import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import { settingsReducerActions } from '@/store/reducers/settings'

export const NetworkManagerSetup = () => {
  const dispatch = useAppDispatch()
  const { getPingNodes } = useLazyPingNodes()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  useMount(() => {
    const callbackId = requestIdleCallback(
      async () => {
        const services = Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName)

        const updatedNetworks = cloneDeep(selectedNetworkByBlockchain)

        const promises = services.map(async service => {
          const currentNetwork = updatedNetworks[service.name]

          try {
            await service.pingNode(currentNetwork.url)
          } catch {
            const nodes = await getPingNodes(service.name)

            const newNode = nodes[0]
            if (!newNode) return

            updatedNetworks[service.name] = {
              ...currentNetwork,
              url: newNode.url,
            }
          }
        })

        await Promise.allSettled(promises)

        if (!isEqual(updatedNetworks, selectedNetworkByBlockchain)) {
          dispatch(settingsReducerActions.setSelectedNetworkByBlockchain(updatedNetworks))
        }
      },
      { timeout: 2000 }
    )

    return () => {
      cancelIdleCallback(callbackId)
    }
  })

  return null
}
