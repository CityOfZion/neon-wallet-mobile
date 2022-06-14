import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Normalize } from '../app/Normalize'
import { blockchainServices } from '../blockchain'
import { FilterHelper } from '../helpers/FilterHelper'
import { Account } from '../models/redux/Account'
import { LinearLayout, TextView, ImageView } from '../styles/styled-components'
import { HeaderColumn } from './HeaderColumn'

interface Props {
  tip: number
  account: Account
}

export const TransactionTipCard = ({ account, tip }: Props) => {
  const tokens = useSelector((state: RootState) => state.app.tokens)
  const exchange = useSelector((state: RootState) => state.app.exchange)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)

  const tipToken = useMemo(() => {
    const cozTip = blockchainServices[account.blockchain].cozTip

    if (!cozTip) return

    return tokens.find(token => token.symbol === cozTip.token)
  }, [account, tokens])
  const tipFiat = useMemo(() => {
    if (!tipToken) return

    const price = exchange[account.blockchain][tipToken.symbol].to[currency] * tip

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
            source={tipToken.srcIcon}
            width={Normalize.scale(18)}
            height={Normalize.scale(18)}
            resizeMode="contain"
            alignSelf="center"
          />
          <TextView
            ml="4px"
            fontFamily="medium"
            color="text.0"
            fontSize="16px"
            textAlignVertical="bottom"
            includeFontPadding={false}
          >
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
