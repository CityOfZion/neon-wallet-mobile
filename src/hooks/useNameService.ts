import { useCallback, useState } from 'react'

import { hasNameService } from '@cityofzion/blockchain-service'
import { useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import type { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'

function buildQueryKey(blockchain: TBlockchainServiceKey, domain: string, network: TNetwork) {
  return ['nameService', blockchain, domain, network]
}

export const useNameServiceLazy = () => {
  const queryClient = useQueryClient()

  const validateAddressOrNS = useCallback(
    async (domainOrAddress: string, blockchain: TBlockchainServiceKey) => {
      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

      let isValid: boolean
      let address: string | undefined
      let isNS = false

      if (service.validateAddress(domainOrAddress)) {
        address = domainOrAddress
        isValid = true
      } else if (!hasNameService(service) || !service.validateNameServiceDomainFormat(domainOrAddress)) {
        isValid = false
        address = undefined
      } else {
        const queryCache = queryClient.getQueryCache()
        const queryKey = buildQueryKey(blockchain, domainOrAddress, service.network)
        const defaultedOptions = queryClient.defaultQueryOptions({ queryKey })
        const query = queryCache.get<string>(defaultedOptions.queryHash)
        const shouldFetch = !query || query.isStaleByTime(Number(defaultedOptions.staleTime))

        if (!shouldFetch) {
          address = query?.state.data
          isValid = true
          isNS = true
        } else {
          try {
            address = await service.resolveNameServiceDomain(domainOrAddress)

            isValid = true
            isNS = true

            queryCache.build(queryClient, defaultedOptions).setData(address, { manual: true })
          } catch {
            isValid = false
            address = undefined
          }
        }
      }

      return {
        isValid,
        address,
        isNS,
      }
    },
    [queryClient]
  )

  return { validateAddressOrNS }
}

export const useNameService = (debounceTime = 1000) => {
  const { validateAddressOrNS: validateAddressOrNSLazy } = useNameServiceLazy()

  const [isValidatingAddressOrDomainAddress, setIsValidatingAddressOrDomainAddress] = useState(false)
  const [validatedAddress, setValidatedAddress] = useState<string>()
  const [isNameService, setIsNameService] = useState(false)
  const [isValidAddressOrDomainAddress, setIsValidAddressOrDomainAddress] = useState<boolean>()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateAddressOrNSDebounce = useCallback(
    debounce(async (domainOrAddress: string, blockchain: TBlockchainServiceKey) => {
      const { address, isNS, isValid } = await validateAddressOrNSLazy(domainOrAddress, blockchain)

      setValidatedAddress(address)
      setIsValidAddressOrDomainAddress(isValid)
      setIsNameService(isNS)
      setIsValidatingAddressOrDomainAddress(false)
    }, debounceTime),
    []
  )

  const validateAddressOrNS = useCallback(
    (domainOrAddress?: string, blockchain?: TBlockchainServiceKey) => {
      setIsValidatingAddressOrDomainAddress(true)

      if (domainOrAddress === undefined || !blockchain) {
        setIsValidatingAddressOrDomainAddress(false)
        setValidatedAddress(undefined)
        setIsNameService(false)
        setIsValidAddressOrDomainAddress(undefined)
        validateAddressOrNSDebounce.cancel()
        return
      }

      validateAddressOrNSDebounce(domainOrAddress, blockchain)
    },
    [validateAddressOrNSDebounce]
  )

  return {
    validateAddressOrNS,
    isValidatingAddressOrDomainAddress,
    validatedAddress,
    isNameService,
    isValidAddressOrDomainAddress,
  }
}
