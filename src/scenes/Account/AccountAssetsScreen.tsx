import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { RefreshControl } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
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
  const balanceExchange = useBalancesAndExchange(account)

  return (
    <ScreenLayout
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.text[0]}
          refreshing={balanceExchange.isLoading ?? balanceExchange.isRefetchingByUser}
          onRefresh={balanceExchange.refetch}
        />
      }
    >
      <AccountSubTitle account={account} />

      <BalanceList balanceExchange={balanceExchange} my="16px" showHoldingValue={false} showBlockchain />
    </ScreenLayout>
  )
}

export default AccountAssetScreen
