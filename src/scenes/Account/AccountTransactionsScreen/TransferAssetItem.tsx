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
    let amount = 0

    if (props.token?.symbol) {
      const ratio = BalanceHelper.getExchangeRatio(
        props.token.hash,
        props.token.symbol,
        props.account.blockchain,
        props.exchange
      )
      amount = ratio ? ratio * Number(props.amount) : 0
    }

    return FilterHelper.currency(amount, currency, language)
  }, [currency, language, props.exchange, props.token, props.amount])

  return (
    <LinearLayout orientation="horiz" justifyContent="space-between">
      <LinearLayout orientation="horiz" width="30%" alignItems="center">
        {props.token ? (
          <TokenIcon width={20} height={20} marginRight={4} blockchain={props.account.blockchain} {...props.token} />
        ) : (
          <LinearLayout width="20px" marginRight={4} />
        )}

        <TextView
          color="text.0"
          fontFamily="bold"
          fontSize="md"
          numberOfLines={1}
          flexShrink={1}
          flexGrow={1}
          ellipsizeMode="middle"
        >
          {props.token?.symbol ?? props.contractHash}
        </TextView>
      </LinearLayout>

      <TextView color="text.0" width="35%" fontSize="md" fontFamily="medium" numberOfLines={1} textAlign="right">
        {props.amount}
      </TextView>

      <TextView color="text.0" fontSize="md" width="30%" numberOfLines={1} fontFamily="medium" textAlign="right">
        {fiatAmount}
      </TextView>
    </LinearLayout>
  )
})
