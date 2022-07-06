import { useCallback, useMemo } from 'react'
import { useQuery, UseQueryOptions } from 'react-query'

import { getAllTokenSymbolList } from '../blockchain/common'
import { getExchangeData } from '../blockchain/genericProvider'
import { applicationConfig } from '../config/ApplicationConfig'
import { Exchange } from '../types/exchange'

type TExchangeFilter = {
  currencies?: string
  symbols?: string[]
}

interface IUseExchange {
  filter?: TExchangeFilter
  queryOptions?: Omit<UseQueryOptions<Exchange, unknown, Exchange, string[]>, 'queryKey' | 'queryFn'>
}

export function useExchange({ queryOptions, filter }: IUseExchange) {
  const currenciesDefault = applicationConfig.currencies

  const execFilters = (exchange: Exchange) => {
    const groupFilters: ((exchange: Exchange) => Exchange | undefined)[] = [filterBySymbols, filterByCurrencies]
    return groupFilters.reduce<Exchange | undefined>((prevExchange, callback) => {
      if (prevExchange) {
        return callback(prevExchange)
      } else {
        return prevExchange
      }
    }, exchange)
  }

  const filterBySymbols = (exchange: Exchange) => {
    if (filter?.symbols) {
      const filteredExchange = filter.symbols.reduce<Exchange>((prevExchange, symbol) => {
        if (exchange[symbol]) {
          prevExchange = { ...prevExchange, [symbol]: exchange[symbol] }
          return prevExchange
        } else {
          return prevExchange
        }
      }, {})
      return Object.keys(filteredExchange).length > 0 ? filteredExchange : undefined
    } else {
      return exchange
    }
  }

  const filterByCurrencies = (exchange: Exchange) => {
    if (filter?.currencies) {
      const filteredExchange = filter.currencies.split(',').reduce<Exchange>((_, currency) => {
        return Object.keys(exchange).reduce<Exchange>((prevExchange, symbol) => {
          if (exchange[symbol].to[currency]) {
            prevExchange = { ...prevExchange, [symbol]: { to: { [currency]: exchange[symbol].to[currency] } } }
            return prevExchange
          } else {
            return prevExchange
          }
        }, {})
      }, {})
      return Object.keys(filteredExchange).length > 0 ? filteredExchange : undefined
    } else {
      return exchange
    }
  }

  const fetchExchanges = useCallback(async () => {
    return await getExchangeData({ currencies: currenciesDefault, tokenAssetSymbols: getAllTokenSymbolList() })
  }, [])

  const { data, ...rest } = useQuery(['exchange'], fetchExchanges, queryOptions)

  const exchange = useMemo<Exchange | undefined>(() => {
    if (data) {
      return execFilters(data)
    }
    return data
  }, [data])

  return {
    exchange,
    ...rest,
  }
}
