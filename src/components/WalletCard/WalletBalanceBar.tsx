import React, { useEffect, useMemo, useRef } from 'react'
import { Animated } from 'react-native'
import { Shadow } from 'react-native-shadow-2'

import { Skeleton } from '../Skeleton'

import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
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

  const opacityValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <LinearLayout position="absolute" bottom="8%" height="12px" width="85%">
      <Animated.View style={{ opacity: opacityValue }}>
        <Skeleton
          isLoading={balanceExchange.isLoading}
          layout={{ width: '100%', height: 12, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          {!!totalTokensBalances && tokensBalancesConverted && (
            <LinearLayout>
              <ImageView
                position="absolute"
                top="-2px"
                resizeMode="cover"
                source={require('~src/assets/images/wallet-card-bar-label.png')}
                style={{
                  width: '100%',
                }}
              />
              <LinearLayout orientation="horiz" width="100%" px="1px">
                {tokensBalancesConverted.map((tokenBalances, index) => {
                  const color = UtilsHelper.generateBlockchainColor(tokenBalances.token.symbol)

                  return (
                    <LinearLayout
                      key={index}
                      height="4px"
                      weight={(tokenBalances.convertedAmount * 100) / totalTokensBalances}
                      minWidth="4px"
                      mx="1px"
                    >
                      <Shadow distance={9} startColor={`${color}1A`} viewStyle={{ width: '100%', height: '100%' }}>
                        <LinearLayout height="100%" width="100%" borderRadius="2.5px" backgroundColor={color} />
                      </Shadow>
                    </LinearLayout>
                  )
                })}
              </LinearLayout>
            </LinearLayout>
          )}
        </Skeleton>
      </Animated.View>
    </LinearLayout>
  )
}
