import {wallet} from '@cityofzion/neon-core'
import {api} from '@cityofzion/neon-js'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {Dimensions, NativeScrollEvent} from 'react-native'

import AssetQuoteComponent from '~src/components/AssetQuoteComponent'
import TransactionsList from '~src/components/TransactionsList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {AssetQuoteModel} from '~src/models/AssetQuoteModel'
import {
  Asset,
  gas,
  neo,
  Receiver,
  Transaction,
  TransactionModel,
} from '~src/models/TransactionModel'
import {Account} from '~src/models/redux/Account'
import {AddressPaginatedRequest} from '~src/models/request/AddressPaginatedRequest'
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

  const [transactionModelList, setTransactionModelList] = useState<
    TransactionModel[]
  >([])
  const [asset] = useState<AssetQuoteModel>(assetModel)
  const [loaded, setLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const scrollViewEnded = (e: NativeScrollEvent) => {
    const windowHeight = Dimensions.get('window').height,
      height = e.contentSize.height,
      offset = e.contentOffset.y

    return windowHeight + offset >= height
  }

  useEffect(() => {
    if (!loaded) {
      fetchData()
    }
  }, [loaded])

  const fetchData = async () => {
    const address = 'Ad83tfsuWxxexhefPzXVpn5vv6oCbLKFEx' //props.route.params.account.address ?? ""
    const nextPage = currentPage + 1
    const request = new AddressPaginatedRequest(address, nextPage)
    const response = await request.getAddressAbstracts()

    setLoaded(true)

    setTotalPages(response.totalPages ?? totalPages)
    setCurrentPage(response.pageNumber ?? currentPage)

    if (response.entries.length > 0) {
      const transActionModelListAux: TransactionModel[] = []

      const distinctTimes = response.entries
        .map((item) => item.time)
        .filter((value, index, self) => self.indexOf(value) === index)

      distinctTimes.map((timeLong) => {
        const groupedByTime = response.entries.filter(
          (item) => item.time === timeLong
        )
        const transactionGroup = new TransactionModel()
        transactionGroup.date = new Date(timeLong ?? 0)
        transactionGroup.transactions = []

        groupedByTime.map((item) => {
          const transaction = new Transaction()
          transaction.receiver = []

          const receiver = new Receiver()
          receiver.assets = []
          receiver.isAddress = wallet.isAddress(item.addressTo ?? '')
          receiver.nameOrAdress = item.addressTo ?? ''

          const asset = new Asset()
          asset.value = item.amount ?? ''

          if (item.asset === gas.hash) {
            asset.nameSymbol = gas.nameSymbol
            asset.srcIcon = gas.srcIcon
          } else {
            if (item.asset === neo.hash) {
              asset.nameSymbol = neo.nameSymbol
              asset.srcIcon = neo.srcIcon
            } else {
              // neoscan?
            }
          }

          receiver?.assets?.push(asset)
          transaction?.receiver?.push(receiver)
          transactionGroup?.transactions?.push(transaction)
        })

        transActionModelListAux.push(transactionGroup)
      })

      setTransactionModelList((list) => list.concat(transActionModelListAux))
    }
  }

  const _renderTransactionViewElement = () => {
    const lastIndex = transactionModelList.length - 1
    return transactionModelList.map(
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
    <ScreenLayout
      onScroll={({nativeEvent}) => {
        if (
          scrollViewEnded(nativeEvent) &&
          totalPages &&
          currentPage < totalPages
        ) {
          fetchData()
        }
      }}
      scrollEventThrottle={1000}
    >
      <AssetQuoteComponent assetQuote={assetModel} />
      {_renderTransactionViewElement()}
    </ScreenLayout>
  )
}

export default AccountAssetDetail
