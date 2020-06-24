import {StackNavigationProp} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import moment from 'moment'
import React, {useRef, useState} from 'react'
import {ScrollView} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import {useSelector} from 'react-redux'
import {layout, LayoutProps, space, SpaceProps} from 'styled-system'

import {WINDOW_WIDTH} from '~/constants'
import BalanceList from '~src/components/BalanceList'
import Notification from '~src/components/Notification'
import WalletCard from '~src/components/WalletCard'
import {FilterHelper} from '~src/helpers/FilterHelper'
import i18n from '~src/i18n'
import {mockWalletItems} from '~src/mockWalletItems'
import {Wallet} from '~src/models/Wallet'
import {RootState} from '~src/store/reducers/root'
import styled, {
  DefaultTheme,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

const SLIDER_WIDTH = WINDOW_WIDTH
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

interface WalletProps {
  navigation: StackNavigationProp<{Home: undefined}>
  theme: DefaultTheme
}

const WalletView = (props: WalletProps) => {
  const [activeIndex, setActiveIndex] = useState(1)
  const [wallets, setWallets] = useState(mockWalletItems)
  const carouselRef = useRef(null)
  const currency = useSelector((state: RootState) => state.app.currency)
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  props.navigation.setOptions({headerShown: false})

  const _renderWalletChange = (wallet: Wallet) => {
    return (
      <LinearLayout orientation="verti" alignItems="center">
        <TextView fontSize="11px" color="text.2">
          {i18n.t('screens.wallet.changeSinceLastVisit', {
            date: moment(wallet.lastVisitedAt).format('HH:mm - DD/MM/YYYY'),
          })}
        </TextView>
        <LinearLayout orientation="horiz">
          <TextView fontSize="36px" color="text.0" fontFamily="medium">
            {FilterHelper.currency(wallet.currentValue, currency, false, true)}
          </TextView>
          <ImageView
            mt="8px"
            mx="4px"
            source={require('~src/assets/images/info-primary.png')}
          />
          <TextView fontSize="36px" color="primary" fontFamily="semibold">
            {calculateChangePercentage(wallet)}
          </TextView>
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
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[1], theme.colors.background[2]]}
      start={[0.1, 0.1]}
      end={[1, 1]}
    >
      <LinearLayout orientation="verti">
        <ScrollView>
          <MoreButton
            mt="40px"
            alignSelf="flex-end"
            height={'6px'}
            source={require('~src/assets/images/more-horiz.png')}
          />
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
              firstItem={1}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              inactiveSlideScale={0.8}
              inactiveSlideOpacity={1}
              inactiveSlideShift={12}
              lockScrollWhileSnapping={true}
              lockScrollTimeoutDuration={200}
              activeSlideOffset={5}
              swipeThreshold={5}
              enableSnap={true}
              renderItem={({item}) => <WalletCard wallet={item} />}
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
            tokenAssets={wallets[activeIndex].currentAssets.assets}
          />
        </ScrollView>
      </LinearLayout>
    </LinearGradient>
  )
}

const MoreButton = styled(ImageView)<LayoutProps & SpaceProps>`
  ${layout}
  ${space}
  resize-mode: contain;
`

export default WalletView
