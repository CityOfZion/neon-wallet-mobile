import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AssetQuoteComponent from '~src/components/AssetQuoteComponent'
import TransactionsList from '~src/components/TransactionsList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {mockAccountAssetDetails} from '~src/mocks/mockAccountAssetDetails'
import {Account} from '~src/models/Account'
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
  account: Account
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

const AccountAssetDetail = (props: AccountAssetDetailProps) => {
  const assetModel = new AssetQuoteModel()
  assetModel.name = 'NEO'
  assetModel.fullName = 'NEO'
  assetModel.price = 123456
  assetModel.currencySymbol = 'USD'
  //assetModel.srcIcon = props.account.srcIcon

  const [account, setAccount] = useState<Account>(props.account)
  const [asset, setAsset] = useState<AssetQuoteModel>(assetModel)
  props.navigation.setOptions({headerShown: false})

  const Header = (props: {goBack: () => void}) => {
    return (
      <LinearLayout
        orientation="horiz"
        width="100%"
        mb="12px"
        px="5px"
        alignItems="center"
        marginTop="20px"
        justifyContent="space-between"
      >
        <ButtonView
          onPress={props.goBack}
          orientation="horiz"
          alignItems="center"
        >
          <ImageView
            height="20px"
            width="12px"
            source={require('~src/assets/images/Chevron.png')}
          />
          <TextView color="text.0" ml="6px" fontSize="18px">
            {Facade.t('app.back')}
          </TextView>
        </ButtonView>
      </LinearLayout>
    )
  }

  const _renderTransactionViewElement = () => {
    return mockAccountAssetDetails.map(
      (transActionModel: TransactionModel, i: number) => {
        return (
          <TransactionsList
            key={i}
            isHistory={true}
            transactionModel={transActionModel}
            index={i}
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
