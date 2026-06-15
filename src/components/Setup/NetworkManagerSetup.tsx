import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useMount } from '@/hooks/useMount'
import { useLazyPingNetworks } from '@/hooks/usePingNetworks'
import { useAppDispatch } from '@/hooks/useRedux'
import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import { settingsReducerActions } from '@/store/reducers/settings'

export const NetworkManagerSetup = () => {
  const dispatch = useAppDispatch()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { getPingNetworks } = useLazyPingNetworks()

  useMount(() => {
    const callbackId = requestIdleCallback(
      async () => {
        const services = Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName)
        const updatedNetworks = cloneDeep(selectedNetworkByBlockchain)

        const promises = services.map(async service => {
          const currentNetwork = updatedNetworks[service.name]

          try {
            await service.pingNetwork(currentNetwork.url)
          } catch {
            const [newNetwork] = await getPingNetworks(service.name)

            if (!newNetwork) return

            updatedNetworks[service.name] = {
              ...currentNetwork,
              url: newNetwork.url,
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
