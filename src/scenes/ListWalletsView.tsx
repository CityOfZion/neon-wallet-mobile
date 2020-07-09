import {StackNavigationProp} from '@react-navigation/stack'
import moment from 'moment'
import React, {useRef, useState} from 'react'
import Carousel from 'react-native-snap-carousel'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import BalanceList from '~src/components/BalanceList'
import Notification from '~src/components/Notification'
import WalletCard from '~src/components/WalletCard'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'
import {mockWalletAccounts} from '~src/mocks/mockWalletAccounts'
import {mockEmptyWallet, mockWalletItems} from '~src/mocks/mockWalletItems'
import {Account} from '~src/models/Account'
import {TokenBalance} from '~src/models/TokenBalance'
import {TokenValue} from '~src/models/TokenValue'
import {Wallet} from '~src/models/Wallet'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootState} from '~src/store/reducers/root'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface WalletProps {
  navigation: StackNavigationProp<WalletStackParamList>
  theme: DefaultTheme
}

const ListWalletsView = (props: WalletProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [wallets, setWallets] = useState(mockWalletItems)
  const [accounts, setAccounts] = useState<Account[]>(mockWalletAccounts)
  const carouselRef = useRef(null)
  const currency = useSelector((state: RootState) => state.app.currency)

  props.navigation.setOptions({headerShown: false})

  const _renderWalletChange = (wallet: Wallet) => {
    return (
      <LinearLayout orientation="verti" alignItems="center">
        <TextView fontSize="11px" color="text.2">
          {Facade.t('screens.listWallets.changeSinceLastVisit', {
            date: moment(wallet.lastVisitedAt).format('HH:mm - DD/MM/YYYY'),
          })}
        </TextView>
        <LinearLayout orientation="horiz">
          <TextView fontSize="36px" color="text.0" fontFamily="medium">
            {Facade.filter.currency(
              wallet.currentValue ?? 0,
              currency,
              false,
              false
            )}
          </TextView>
          <ImageView
            mt="8px"
            mx="4px"
            source={require('~src/assets/images/info-primary.png')}
          />
          {wallet.previousValue ? (
            <TextView fontSize="36px" color="primary" fontFamily="semibold">
              {calculateChangePercentage(wallet)}
            </TextView>
          ) : null}
        </LinearLayout>
      </LinearLayout>
    )
  }

  const calculateChangePercentage = (wallet: Wallet) => {
    const changePercentage =
      ((wallet.currentValue - wallet.previousValue) / wallet.previousValue) *
      100
    const resultString = `${changePercentage > 0 ? '+' : ''}${Math.round(
      changePercentage
    )}%`

    return resultString
  }

  return (
    <ScreenLayout useHeaderPadding={false} padding={0}>
      <LinearLayout alignSelf={'flex-end'}>
        <ThemedMoreButton onPress={() => setWallets([mockEmptyWallet])} />
      </LinearLayout>

      <LinearLayout
        mt="12px"
        orientation="horiz"
        justifyContent="center"
        height={400}
      >
        <Carousel
          layout={'default'}
          ref={carouselRef}
          data={wallets}
          firstItem={0}
          sliderWidth={Facade.app.windowWidth}
          itemWidth={Math.round(Facade.app.windowWidth * 0.7)}
          inactiveSlideScale={0.8}
          inactiveSlideOpacity={1}
          inactiveSlideShift={12}
          lockScrollWhileSnapping={true}
          lockScrollTimeoutDuration={200}
          activeSlideOffset={5}
          swipeThreshold={5}
          enableSnap={true}
          renderItem={({item}) => (
            <WalletCard
              onPress={() =>
                props.navigation.navigate(Facade.path.GetWallet.name, {
                  wallet: accounts,
                  headerTitle: item.title,
                })
              }
              wallet={item}
            />
          )}
          onSnapToItem={(index) => setActiveIndex(index)}
        />
      </LinearLayout>

      {_renderWalletChange(wallets[activeIndex])}

      <LinearLayout mx="16px" mt="16px">
        <Notification
          text={
            'Tum dicere exorsus est et dolore magnam aliquam quaerat voluptatem ut de homine.'
          }
        />
      </LinearLayout>

      <BalanceList
        my="16px"
        mx="16px"
        tokenAssets={wallets[activeIndex].currentAssets}
      />
    </ScreenLayout>
  )
}

export default ListWalletsView
