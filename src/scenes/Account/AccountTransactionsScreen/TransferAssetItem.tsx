import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { FormattedTransferAsset } from './AccountTransactionsScreen'

import { Normalize } from '~/src/app/Normalize'
import SkeletonContainer from '~/src/components/SkeletonContainer'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { TokenHelper } from '~/src/helpers/TokenHelper'
import { useExchange } from '~/src/hooks/useExchange'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { ImageView, TextView, LinearLayout } from '~/src/styles/styled-components'

type Props = FormattedTransferAsset & {
  account: Account
}

export const TransferAssetItem = React.memo((props: Props) => {
  const { currency } = useSelector((state: RootState) => state.settings)

  const { exchange } = useExchange({ filter: { currencies: currency } })

  const [fiatAmount, setFiatAmount] = useState<string>()

  useEffect(() => {
    const { symbol, amount } = props
    if (symbol && exchange && exchange[symbol]) {
      const ratio = exchange[symbol].to[currency]
      const fiatCalculated = ratio * Number(amount)
      setFiatAmount(`$${FilterHelper.decimal(fiatCalculated, undefined, 2)}`)
    }
  }, [exchange, currency])

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
      <SkeletonContainer isLoading={!exchange} skeletonType="transactionList">
        <LinearLayout ml="30%">
          <TextView color="#fff" fontSize="16px" numberOfLines={1} width={80} fontFamily="medium" textAlign="right">
            {fiatAmount}
          </TextView>
        </LinearLayout>
      </SkeletonContainer>
    </LinearLayout>
  )
})
