import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { Alert, Animated } from 'react-native'
import { useSelector } from 'react-redux'

import { Skeleton } from '~/src/components/Skeleton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { Wallet } from '~/src/models/redux/Wallet'
import { UseMultipleBalanceAndExchangeResult } from '~/src/types/query'
import BalanceList from '~src/components/BalanceList'
import { RootState } from '~src/store/RootStore'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  selectedWallet: Wallet
  selectedWalletBalanceExchange: UseMultipleBalanceAndExchangeResult
  opacity?: Animated.Value
}

export const SelectedWalletInfo = ({ selectedWallet, selectedWalletBalanceExchange, opacity }: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)

  const totalTokensBalances = useMemo(
    () =>
      BalanceHelper.calculateTotalBalances(
        selectedWalletBalanceExchange.balance.data,
        selectedWalletBalanceExchange.exchange.data
      ),
    [selectedWalletBalanceExchange]
  )

  const formattedTotalTokensBalances = useMemo(
    () => FilterHelper.currency(totalTokensBalances, currency, language),
    [totalTokensBalances, currency, language]
  )

  const handlePressWarning = () =>
    Alert.alert(
      i18n.t('screens.listWallets.incompleteBalanceWarningTitle'),
      i18n.t('screens.listWallets.incompleteBalanceWarningText'),
      [{ text: i18n.t('screens.listWallets.incompleteBalanceWarningButton') }],
      { cancelable: false }
    )

  return (
    <Animated.View style={{ opacity }}>
      <LinearLayout alignItems="center">
        <TextView fontSize="11px" color="text.2">
          {selectedWallet.formattedLastVisitedAt}
        </TextView>

        <Skeleton
          isLoading={selectedWalletBalanceExchange.isLoading}
          layout={{ width: 100, height: 36, marginVertical: 12 }}
        >
          <LinearLayout orientation="horiz" my="12px">
            <TextView fontSize="36px" color="text.0" fontFamily="medium">
              {formattedTotalTokensBalances}
            </TextView>

            <ButtonView onPress={handlePressWarning}>
              <ImageView
                mt="8px"
                mx="4px"
                source={require('~src/assets/images/icon-warning-green.png')}
                resizeMode="contain"
                style={{ width: 16, height: 16 }}
              />
            </ButtonView>
          </LinearLayout>
        </Skeleton>
      </LinearLayout>

      <BalanceList my="24px" px="16px" balanceExchange={selectedWalletBalanceExchange} showBlockchain />
    </Animated.View>
  )
}
