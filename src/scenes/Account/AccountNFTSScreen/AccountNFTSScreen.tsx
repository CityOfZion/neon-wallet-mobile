import { NftResponse, hasNft } from '@cityofzion/blockchain-service'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import I18n from 'i18n-js'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'

import { NFTItem } from './NFTItem'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import { FlatListEmpty } from '~/src/components/FlatListEmpty'
import { FlatListFooter } from '~/src/components/FlatListFooter'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
import { LinearLayout } from '~/src/styles/styled-components'

export interface AccountNFTSScreenParams {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<WalletStackParamList & RootStackParamList>
  route: RouteProp<WalletStackParamList, 'AccountNFTSScreen'>
}

const AccountNFTSScreen = (props: Props) => {
  const { account } = props.route.params

  const [NFTS, setNFTS] = useState<NftResponse[]>([])
  const [showMoreLoading, setShowMoreLoading] = useState(false)
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[account.blockchain]
  )
  const nextControl = useRef<string | undefined>()

  const handleLoadNFTS = useCallback(async () => {
    try {
      if (!hasNft(blockchainService)) return

      const response = await blockchainService.nftDataService.getNftsByAddress({
        address: account.address,
        cursor: nextControl.current,
      })

      nextControl.current = response.nextCursor
      setNFTS(prevState => [...prevState, ...response.items])

      if (!response.nextCursor) {
        setShowMoreLoading(false)
      } else {
        setShowMoreLoading(true)
      }
    } catch {}
  }, [account])

  useEffect(() => {
    Await.run('populateNFTS', handleLoadNFTS)
  }, [handleLoadNFTS])

  return (
    <ScreenLayout withoutScrollView>
      <AccountSubTitle account={account} />
      <AwaitActivity name="populateNFTS" loadingView={<ScreenLoader darkerSolidColorBG />}>
        <LinearLayout my="44px">
          <FlatList
            data={NFTS}
            renderItem={({ item }) => <NFTItem nft={item} navigation={props.navigation} />}
            ListFooterComponent={<FlatListFooter hide={!showMoreLoading} />}
            ListEmptyComponent={<FlatListEmpty label={I18n.t('screens.accountNFT.emptyList')} />}
            keyExtractor={({ id }, index) => `${id}-${index}`}
            onEndReached={handleLoadNFTS}
            onEndReachedThreshold={0.5}
          />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default AccountNFTSScreen
