import { TransactionTransferAsset } from '@cityofzion/blockchain-service'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { TokenIcon } from '~/src/components/TokenIcon'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
import { TextView, LinearLayout } from '~/src/styles/styled-components'
import { MultiExchange } from '~/src/types/query'

type Props = TransactionTransferAsset & {
  account: Account
  exchange?: MultiExchange
}

export const TransferAssetItem = React.memo((props: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)

  const fiatAmount = useMemo(() => {
    if (!props.token?.symbol) return

    const ratio = BalanceHelper.getExchangeRatio(props.token.symbol, props.account.blockchain, props.exchange)

    const calculateAmount = ratio ? ratio * Number(props.amount) : undefined

    return FilterHelper.currency(calculateAmount, currency, language)
  }, [currency, language, props.exchange, props.token, props.amount])

  return (
    <LinearLayout orientation="horiz">
      <LinearLayout orientation="horiz" width="80px" marginRight="8px">
        {props.token ? (
          <TokenIcon width={20} height={20} marginRight={12} blockchain={props.account.blockchain} {...props.token} />
        ) : (
          <LinearLayout width="20px" />
        )}

        <TextView color="text.0" fontFamily="bold" fontSize="16px" numberOfLines={1} ellipsizeMode="middle">
          {props.token?.symbol ?? props.contractHash}
        </TextView>
      </LinearLayout>

      <LinearLayout orientation="horiz" justifyContent="space-between" flex={1}>
        <TextView color="text.0" fontSize="16px" width="100px" fontFamily="medium" numberOfLines={1} textAlign="right">
          {props.amount}
        </TextView>
        <TextView color="text.0" fontSize="16px" width="100px" numberOfLines={1} fontFamily="medium" textAlign="right">
          {fiatAmount}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
})
