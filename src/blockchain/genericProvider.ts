import axios from 'axios'
import { mapValues } from 'lodash'

import { Exchange, ExchangeResponse } from '../types/exchange'
export async function getExchangeData(params: { tokenAssetSymbols: string[]; currencies: string }): Promise<Exchange> {
  const { tokenAssetSymbols, currencies } = params
  const paramRequest = {
    fsyms: tokenAssetSymbols.join(','),
    tsyms: currencies,
  }

  const { data } = await axios.get<ExchangeResponse>('https://min-api.cryptocompare.com/data/pricemultifull', {
    params: paramRequest,
  })

  return mapValues(data.RAW, symbolRef => {
    const symbolRefMap = mapValues(symbolRef, symbolToUse => symbolToUse.PRICE)

    return {
      to: symbolRefMap,
    }
  })
}
