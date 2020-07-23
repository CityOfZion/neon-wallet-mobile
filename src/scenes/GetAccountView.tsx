import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import BalanceList from '~src/components/BalanceList'
import TransactionsList from '~src/components/TransactionsList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {mockAccountAssetDetails} from '~src/mocks/mockAccountAssetDetails'
import {mockWalletItems} from '~src/mocks/mockWalletItems'
import {TransactionModel} from '~src/models/TransactionModel'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {ButtonView, LinearLayout, TextView} from '~src/styles/styled-components'
import TabSelector from '~src/components/TabSelector'

interface GetAccountViewProps {
  route: RouteProp<QuickToolsStackParamList, 'GetAccount'>
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

const GetAccountView = (props: GetAccountViewProps) => {
  const {account} = props.route.params
  const [isAssetsTabSelected, setIsAssetsTabSelected] = useState<boolean>(true)

  const _renderTransactionViewElement = () => {
    return mockAccountAssetDetails.map(
      (transActionModel: TransactionModel, i: number) => {
        return (
          <TransactionsList
            key={i}
            isHistory={false}
            transactionModel={transActionModel}
            index={i}
          />
        )
      }
    )
  }

  return (
    <ScreenLayout>
      <LinearLayout mt={4}>
        <AccountCard
          account={account}
          isCompacted={true}
          onPress={() =>
            props.navigation.navigate(Facade.route.AccountAssetDetail.name, {
              account,
            })
          }
        />
      </LinearLayout>

      <LinearLayout mt="28px" mx="auto">
        <ThemedButton
          fontSize="16px"
          label={Facade.t('screens.getAccount.claimAsset', {
            assetAmount: '0.0000123 GAS',
          })}
        />
      </LinearLayout>

      <TabSelector
        isFirstTabSelected={isAssetsTabSelected}
        setFirstTabAsSelected={setIsAssetsTabSelected}
        firstTabLabel={Facade.t('screens.getAccount.assets')}
        secondTabLabel={Facade.t('screens.getAccount.transactions')}
      />

      <LinearLayout>
        {isAssetsTabSelected ? (
          <BalanceList
            my="16px"
            tokenAssets={mockWalletItems[2].currentAssets.assets}
          />
        ) : (
          _renderTransactionViewElement()
        )}
      </LinearLayout>
    </ScreenLayout>
  )
}

export default GetAccountView
