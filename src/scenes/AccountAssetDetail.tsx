import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AssetQuoteComponent from '~src/components/AssetQuoteComponent'
import TransactionsList from '~src/components/TransactionsList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {mockAccountAssetDetails} from '~src/mocks/mockAccountAssetDetails'
import {AccountMock} from '~src/models/AccountMock'
import {AssetQuoteModel} from '~src/models/AssetQuoteModel'
import {TransactionModel} from '~src/models/TransactionModel'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearGradientLayout,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface AccountAssetDetailProps {
  account: AccountMock
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

const AccountAssetDetail = (props: AccountAssetDetailProps) => {
  const assetModel = new AssetQuoteModel()
  assetModel.name = 'Neo'
  assetModel.fullName = 'NEO'
  assetModel.price = 123456
  assetModel.currencySymbol = 'USD'
  //assetModel.srcIcon = props.account.srcIcon

  const [account, setAccount] = useState<AccountMock>(props.account)
  const [asset, setAsset] = useState<AssetQuoteModel>(assetModel)

  const _renderTransactionViewElement = () => {
    let lastIndex = mockAccountAssetDetails.length - 1
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
