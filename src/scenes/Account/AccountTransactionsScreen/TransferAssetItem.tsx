import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { FormattedTransferAsset } from './AccountTransactionsScreen'

import { FilterHelper } from '~/src/helpers/FilterHelper'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { ImageView, TextView, LinearLayout } from '~/src/styles/styled-components'

type Props = FormattedTransferAsset & {
  account: Account
}

export const TransferAssetItem = React.memo((props: Props) => {
  const { exchange, tokens } = useSelector((state: RootState) => state.app)
  const { currency } = useSelector((state: RootState) => state.settings)

  const [fiatAmount, setFiatAmount] = useState<string>('')

  const getTokenIcon = () => {
    return tokens.find(token => token.symbol === props.symbol && token.blockchain === props.account.blockchain)?.srcIcon
  }

  useEffect(() => {
    const { symbol, amount } = props
    if (symbol && exchange[props.account.blockchain][symbol]) {
      const ratio = exchange[props.account.blockchain][symbol].to[currency]
      const fiatCalculated = ratio * Number(amount)
      setFiatAmount(`$${FilterHelper.decimal(fiatCalculated, undefined, 2)}`)
    }
  }, [exchange, currency])

  return (
    <LinearLayout orientation="horiz">
      <LinearLayout orientation="horiz" width={80}>
        {!!getTokenIcon() && (
          <ImageView
            width="21px"
            height="21px"
            resizeMode="contain"
            alignSelf="center"
            source={getTokenIcon()}
            mr="5px"
          />
        )}
        <TextView color="#fff" fontFamily="bold" fontSize="16px" numberOfLines={1} ellipsizeMode="tail">
          {props.symbol}
        </TextView>
      </LinearLayout>
      <TextView color="#fff" fontSize="16px" fontFamily="medium" flex={1} numberOfLines={1} textAlign="center">
        {props.amount}
      </TextView>
      <TextView color="#fff" fontSize="16px" numberOfLines={1} width={80} fontFamily="medium" textAlign="right">
        {fiatAmount}
      </TextView>
    </LinearLayout>
  )
})
