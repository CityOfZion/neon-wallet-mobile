import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await, AwaitActivity} from '@simpli/react-native-await'
import I18n from 'i18n-js'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {FlatList} from 'react-native'

import {NFTItem} from './NFTItem'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {blockchainServices} from '~/src/blockchain'
import {hasNFTIntegration} from '~/src/blockchain/common'
import AccountSubTitle from '~/src/components/AccountSubTitle'
import {FlatListEmpty} from '~/src/components/FlatListEmpty'
import {FlatListFooter} from '~/src/components/FlatListFooter'
import ScreenLayoutWithoutScroll from '~/src/components/layout/ScreenLayoutWithoutScroll'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {Loader} from '~/src/components/loader/loader'
import {Account} from '~/src/models/redux/Account'
import {NFTResponse} from '~/src/models/response/NFTResponse'
import {RootStackParamList} from '~/src/navigation/AppNavigation'
import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {LinearLayout, TextView} from '~/src/styles/styled-components'

export interface AccountNFTSScreenParams {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'AccountNFTSScreen'>
}

const AccountNFTSScreen = (props: Props) => {
  const {account} = props.route.params

  const [NFTS, setNFTS] = useState<NFTResponse[]>([])
  const [showMoreLoading, setShowMoreLoading] = useState(false)
  const onEndReachedCalledDuringMomentum = useRef(true)

  const pageControl = useRef<number>(1)

  const handleEndReached = () => {
    if (onEndReachedCalledDuringMomentum.current) {
      handleLoadNFTS()
    }
  }

  const handleMomentumScrollBegin = () => {
    if (!onEndReachedCalledDuringMomentum.current) {
      onEndReachedCalledDuringMomentum.current = true
    }
  }

  const handleLoadNFTS = useCallback(async () => {
    const service = blockchainServices[account.blockchain]

    if (!hasNFTIntegration(service) || !account.address) {
      return
    }

    const {items, totalPages} = await service.getNFTS(
      account.address,
      pageControl.current
    )

    setNFTS((prevState) => [...prevState, ...items])

    if (totalPages && pageControl.current < totalPages) {
      setShowMoreLoading(true)
    } else {
      setShowMoreLoading(false)
    }

    pageControl.current += 1
  }, [account])

  useEffect(() => {
    Await.run('populateNFTS', handleLoadNFTS)
  }, [handleLoadNFTS])

  return (
    <ScreenLayoutWithoutScroll darkerSolidColorBG>
      <AccountSubTitle account={account} />
      <AwaitActivity
        name="populateNFTS"
        loadingView={<ScreenLoader darkerSolidColorBG />}
      >
        <LinearLayout mt="44px" mb="44px">
          <FlatList
            data={NFTS}
            renderItem={({item}) => (
              <NFTItem nft={item} navigation={props.navigation} />
            )}
            ListFooterComponent={
              showMoreLoading ? <FlatListFooter /> : undefined
            }
            ListEmptyComponent={
              <FlatListEmpty label={I18n.t('screens.accountNFT.emptyList')} />
            }
            keyExtractor={({id}) => id}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={handleMomentumScrollBegin}
          />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayoutWithoutScroll>
  )
}

export default AccountNFTSScreen
