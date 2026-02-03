import { useQuery } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'

import { useCurrencySelector } from './useSettingsSelector'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { TUseCurrencyRatioResult } from '@/types/query'
import type { TCurrency } from '@/types/store'

// There is no need to get ratio from multiple blockchains
const blockchain: TBlockchainServiceKey = 'neo3'

const fetchRatio = async (currency: TCurrency): Promise<number> => {
  let currencyRatio = 1

  if (currency.label !== 'USD') {
    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
    currencyRatio = await service.exchangeDataService.getCurrencyRatio(currency.label).catch(() => 1)
  }

  return currencyRatio
}

export function useCurrencyRatio(): TUseCurrencyRatioResult {
  const { currency } = useCurrencySelector()

  return useQuery({
    queryKey: ['currency-ratio', currency],
    queryFn: fetchRatio.bind(null, currency),
  })
}
