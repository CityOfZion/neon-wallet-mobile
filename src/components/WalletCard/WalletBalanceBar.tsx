import React, { useMemo } from 'react'

import { Skeleton } from '../Skeleton'

import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { TokenHelper } from '~/src/helpers/TokenHelper'
import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import { ImageView, LinearLayout } from '~src/styles/styled-components'

type Props = {
  balanceExchange: UseMultipleBalanceAndExchangeResult
}

export const WalletBalanceBar = ({ balanceExchange }: Props) => {
  const totalTokensBalances = useMemo(
    () => BalanceHelper.calculateTotalBalances(balanceExchange.balance.data, balanceExchange.exchange.data),
    [balanceExchange]
  )

  const tokensBalancesConverted = useMemo(
    () => BalanceHelper.convertBalancesToCurrency(balanceExchange.balance.data, balanceExchange.exchange.data),
    [balanceExchange]
  )

  return (
    <LinearLayout position="absolute" bottom="10%" height="12px" width="90%">
      <Skeleton
        isLoading={balanceExchange.isLoading}
        layout={{ width: '100%', height: 12, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        {!!totalTokensBalances && tokensBalancesConverted && (
          <LinearLayout>
            <ImageView
              resizeMode="cover"
              source={require('~src/assets/images/wallet-card-label.png')}
              style={{
                width: '100%',
                height: '100%',
                borderBottomRightRadius: 9999,
                borderTopRightRadius: 9999,
              }}
            />
            <LinearLayout position="absolute" top="3.5px" px="2px" orientation="horiz" width="100%">
              {tokensBalancesConverted.map((tokenBalances, index) => {
                return (
                  <>
                    <LinearLayout
                      key={index}
                      height="5px"
                      weight={(tokenBalances.convertedAmount * 100) / totalTokensBalances}
                      borderRadius="2.5px"
                      minWidth="2px"
                      mx="1px"
                      backgroundColor={TokenHelper.getColor(tokenBalances.symbol)}
                    />
                  </>
                )
              })}
            </LinearLayout>
          </LinearLayout>
        )}
      </Skeleton>
    </LinearLayout>
  )
}
