import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Normalize } from '../app/Normalize'
import { blockchainServices } from '../blockchain'
import { FilterHelper } from '../helpers/FilterHelper'
import { TokenHelper } from '../helpers/TokenHelper'
import { useTokens } from '../hooks/useTokens'
import { Account } from '../models/redux/Account'
import { RootState } from '../store/RootStore'
import { LinearLayout, TextView, ImageView } from '../styles/styled-components'
import { Exchange } from '../types/exchange'
import { HeaderColumn } from './HeaderColumn'

interface Props {
  tip: number
  account: Account
  exchange?: Exchange
}

export const TransactionTipCard = ({ account, tip, exchange }: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const tokens = useTokens({ blockchain: account.blockchain })

  const tipToken = useMemo(() => {
    const cozTip = blockchainServices[account.blockchain].cozTip

    if (!cozTip) return

    return tokens.find(token => token.symbol === cozTip.token)
  }, [account, tokens])
  const tipFiat = useMemo(() => {
    if (!tipToken || !exchange) {
      return
    }

    const price = exchange[tipToken.symbol].to[currency] * tip

    return FilterHelper.currency(price, currency, language)
  }, [exchange, currency, language, tip, account, tipToken])

  return (
    <LinearLayout
      orientation="verti"
      borderRadius="7px"
      bg="background.14"
      pt="12px"
      pb="12px"
      pl="16px"
      pr="16px"
      mt={4}
    >
      <TextView mb="5px" color="text.10">
        Tip
      </TextView>

      {tipToken && (
        <LinearLayout orientation="horiz">
          <ImageView
            source={TokenHelper.getIcon(tipToken.symbol, account.blockchain)}
            width={Normalize.scale(18)}
            height={Normalize.scale(18)}
            resizeMode="contain"
            alignSelf="center"
          />
          <TextView ml="4px" fontFamily="medium" color="text.0" fontSize="16px">
            {tipToken.symbol}
          </TextView>
        </LinearLayout>
      )}

      <LinearLayout orientation="horiz">
        <HeaderColumn
          weight={2}
          title={i18n.t('components.transactionTipCard.qty')}
          value={tipToken?.decimals ? tip.toFixed(tipToken.decimals) : String(tip)}
        />
        {tipFiat && <HeaderColumn weight={1.6} title={i18n.t('components.transactionTipCard.value')} value={tipFiat} />}
      </LinearLayout>
    </LinearLayout>
  )
}
