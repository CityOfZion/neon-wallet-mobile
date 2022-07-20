import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { FormattedTransferAsset } from './AccountTransactionsScreen'

import { Normalize } from '~/src/app/Normalize'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { TokenHelper } from '~/src/helpers/TokenHelper'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { ImageView, TextView, LinearLayout } from '~/src/styles/styled-components'
import { Exchange } from '~/src/types/exchange'

type Props = FormattedTransferAsset & {
  account: Account
  exchange?: Exchange
}

export const TransferAssetItem = React.memo((props: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)

  const fiatAmount = useMemo(() => {
    const ratio = BalanceHelper.getExchangeRatio(props.symbol, props.exchange, currency)

    const calculateAmount = ratio ? ratio * Number(props.amount) : undefined

    return FilterHelper.currency(calculateAmount, currency, language)
  }, [currency, language, props.exchange, props.symbol, props.amount])

  return (
    <LinearLayout orientation="horiz">
      <LinearLayout orientation="horiz" width={80}>
        <ImageView
          width={Normalize.scale(21)}
          height={Normalize.scale(21)}
          resizeMode="contain"
          alignSelf="center"
          source={TokenHelper.getIcon(props.symbol, props.account.blockchain)}
          mr="5px"
        />

        <TextView color="#fff" fontFamily="bold" fontSize="16px" numberOfLines={1} ellipsizeMode="tail">
          {props.symbol}
        </TextView>
      </LinearLayout>
      <TextView color="#fff" fontSize="16px" fontFamily="medium" flex={1} numberOfLines={1} textAlign="center">
        {props.amount}
      </TextView>
      <LinearLayout ml="30%">
        <TextView color="#fff" fontSize="16px" numberOfLines={1} width={80} fontFamily="medium" textAlign="right">
          {fiatAmount}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
})
