import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'

import AssetQuoteComponent from '~src/components/AssetQuoteComponent'
import TransactionsList from '~src/components/TransactionsList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {mockAccountAssetDetails} from '~src/mocks/mockAccountAssetDetails'
import {AssetQuoteModel} from '~src/models/AssetQuoteModel'
import {TransactionModel} from '~src/models/TransactionModel'
import {Account} from '~src/models/redux/Account'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'

interface AccountAssetDetailProps {
  route: RouteProp<WalletStackParamList, 'AccountAssetDetail'>
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

export interface AccountAssetDetailParams {
  account: Account
}

const AccountAssetDetail = (props: AccountAssetDetailProps) => {
  const assetModel = new AssetQuoteModel()
  assetModel.name = 'Neo'
  assetModel.fullName = 'NEO'
  assetModel.price = 123456
  assetModel.currencySymbol = 'USD'
  //assetModel.srcIcon = props.account.srcIcon

  const [account, setAccount] = useState<Account>(props.route.params.account)
  const [asset, setAsset] = useState<AssetQuoteModel>(assetModel)

  const _renderTransactionViewElement = () => {
    const lastIndex = mockAccountAssetDetails.length - 1
    return mockAccountAssetDetails.map(
      (transActionModel: TransactionModel, i: number) => {
        return (
          <TransactionsList
            key={i}
            isHistory={true}
            transactionModel={transActionModel}
            index={i}
            lastIndex={lastIndex}
          />
        )
      }
    )
  }

  return (
    <ScreenLayout>
      <AssetQuoteComponent assetQuote={assetModel} />
      {_renderTransactionViewElement()}
    </ScreenLayout>
  )
}

export default AccountAssetDetail
