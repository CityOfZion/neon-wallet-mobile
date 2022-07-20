import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { RefreshControl } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import { useBalance } from '~/src/hooks/useBalance'
import { useExchange } from '~/src/hooks/useExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import BalanceList from '~src/components/BalanceList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { Account } from '~src/models/redux/Account'
import { RootState } from '~src/store/RootStore'

export interface AccountAssetScreenParams {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'AccountAssetScreen'>
}

const AccountAssetScreen = ({ route }: Props) => {
  const { account } = route.params

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const { exchange, isRefetching: exchangeIsRefetching, refetch: exchangeRefetch } = useExchange()
  const { balance, isRefetching: balanceIsRefetching, refetch: balanceRefetch } = useBalance(account)

  function handleRefresh() {
    exchangeRefetch()
    balanceRefetch()
  }

  return (
    <ScreenLayout
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.text[0]}
          refreshing={exchangeIsRefetching || balanceIsRefetching}
          onRefresh={handleRefresh}
        />
      }
      darkerSolidColorBG
    >
      <AccountSubTitle account={account} />

      <BalanceList exchange={exchange} balances={balance} my="16px" showHoldingValue={false} showBlockchain />
    </ScreenLayout>
  )
}

export default AccountAssetScreen
