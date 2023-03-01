import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey, TNetwork } from '../blockchain'
import { BlockchainHelper } from '../helpers/BlockchainHelper'
import { RootState } from '../store/RootStore'

export function useBlockchainService(blockchain: BlockchainServiceKey) {
  const selectedBlockchainNetwork = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)

  const blockchainService = useMemo(
    () => BlockchainHelper.getBlockchainService({ blockchain }),
    [selectedBlockchainNetwork, blockchain]
  )

  return { blockchainService }
}

export function useBlockchainServiceUtils() {
  const selectedBlockchainNetwork = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)

  const getBlockchainService = useCallback(
    (blockchainKey: BlockchainServiceKey, network?: TNetwork) =>
      BlockchainHelper.getBlockchainService({
        blockchain: blockchainKey,
        network: network ?? selectedBlockchainNetwork[blockchainKey],
      }),
    [selectedBlockchainNetwork]
  )

  const getBlockchainServices = useCallback(
    (network?: Record<BlockchainServiceKey, TNetwork>) => {
      return BlockchainHelper.getBlockchainServices({
        network: network ?? selectedBlockchainNetwork,
      })
    },
    [selectedBlockchainNetwork]
  )

  const validateAddressAllBlockchains = useCallback(
    (address: string): boolean => {
      const services = getBlockchainServices()
      return services.some(service => service.validateAddress(address))
    },
    [getBlockchainServices]
  )

  const validatePrivateKeyWithPasswordAllBlockchains = useCallback(
    (privateKey: string): boolean => {
      const services = getBlockchainServices()
      return services.some(service => service.validatePrivateKeyWithPassword(privateKey))
    },
    [getBlockchainServices]
  )

  const validateWifAllBlockchains = useCallback(
    (wif: string): boolean => {
      const services = getBlockchainServices()
      return services.some(service => service.validateWif(wif))
    },
    [getBlockchainServices]
  )

  const validateTextAllBlockchains = useCallback(
    (text: string) => {
      const services = getBlockchainServices()
      return services.some(
        service =>
          service.validateAddress(text) || service.validatePrivateKeyWithPassword(text) || service.validateWif(text)
      )
    },
    [getBlockchainServices]
  )

  const getBlockchainByAddress = useCallback(
    (address: string) => {
      const services = getBlockchainServices()
      const addressService = services.find(service => service.validateAddress(address))
      return addressService?.key
    },
    [getBlockchainServices]
  )

  const getBlockchainByWif = useCallback(
    (wif: string) => {
      const services = getBlockchainServices()
      const wifService = services.find(service => service.validateWif(wif))
      return wifService?.key
    },
    [getBlockchainServices]
  )

  const blockchainKeyList = useMemo(() => {
    const services = getBlockchainServices()
    return services.map(service => service.key)
  }, [getBlockchainServices])

  return {
    getBlockchainService,
    getBlockchainServices,
    validateAddressAllBlockchains,
    validatePrivateKeyWithPasswordAllBlockchains,
    validateWifAllBlockchains,
    validateTextAllBlockchains,
    getBlockchainByAddress,
    blockchainKeyList,
    getBlockchainByWif,
  }
}
