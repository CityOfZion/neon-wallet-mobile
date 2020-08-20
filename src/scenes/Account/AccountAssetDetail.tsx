import {wallet} from '@cityofzion/neon-core'
import {api} from '@cityofzion/neon-js'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import moment from 'moment'
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

  const [loaded, setLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const scrollViewEnded = (e: NativeScrollEvent) => {
    return (
      e.layoutMeasurement.height + e.contentOffset.y >= e.contentSize.height
    )
  }

  useEffect(() => {
    if (!loaded) {
      fetchData()
    }
  }, [loaded])

  const fetchData = async () => {
    setLoaded(true)
    const address = props.route.params.account.address ?? ''
    const nextPage = currentPage + 1
    const request = new AddressPaginatedRequest(address, nextPage)
    const response = await request.getAddressAbstracts()

    setTotalPages(response.totalPages ?? totalPages)
    setCurrentPage(response.pageNumber ?? currentPage)

    console.log('CALL')

    if (response.entries.length > 0) {
      const transActionModelListAux: TransactionModel[] = []

      response.entries.map((item) => {
        item.dayFormatter = moment.unix(item.time ?? 0).format('YYYY-MM-DD')
        item.hourFormatter = moment.unix(item.time ?? 0).format('HH:mm')
      })

      const distinctTimes = response.entries
        .map((item) => item.dayFormatter)
        .filter((value, index, self) => self.indexOf(value) === index)

      distinctTimes.map((timeLong) => {
        const groupedByTime = response.entries.filter(
          (item) => item.dayFormatter === timeLong
        )

        const transactionGroup = new TransactionModel()
        transactionGroup.date = moment(timeLong, 'YYYY-MM-DD').toDate()
        transactionGroup.transactions = []
        let lastTransHour = ''

        groupedByTime.map((item) => {
          const transaction = new Transaction()
          if (lastTransHour !== item.hourFormatter) {
            transaction.hourFormated = item.hourFormatter ?? ''
            lastTransHour = item.hourFormatter ?? ''
          }

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

          if (receiver?.assets) receiver.assets.push(asset)
          if (transaction?.receiver) transaction.receiver.push(receiver)
          if (transactionGroup?.transactions) {
            transactionGroup.transactions.push(transaction)
          }
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
      scrollEventThrottle={5000}
    >
      <AssetQuoteComponent assetQuote={assetModel} />
      {_renderTransactionViewElement()}
    </ScreenLayout>
  )
}

export default AccountAssetDetail
