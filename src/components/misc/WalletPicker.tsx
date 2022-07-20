import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import Carousel from 'react-native-snap-carousel'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { MoreStackParamList } from '~/src/navigation/MoreStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { Balance } from '~/src/types/balance'
import { Exchange } from '~/src/types/exchange'
import WalletCard from '~src/components/WalletCard'
import { Wallet } from '~src/models/redux/Wallet'
import { ButtonWithoutFeedbackView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  onPress?: (wallet: Wallet) => void
  onSelect?: (wallet: Wallet) => void
  selectedWallet: Wallet
  wallets: Wallet[]
  isInactive?: boolean
  onScrollBegin?: (evt?: NativeSyntheticEvent<NativeScrollEvent>) => void
  onScrollEnd?: (evt?: NativeSyntheticEvent<NativeScrollEvent>) => void
  exchange?: Exchange
  selectedWalletBalances?: Balance[]
}

interface ItemProps {
  disablePointerEvents?: boolean
  wallet: Wallet
  isInactive?: boolean
  exchange?: Exchange
  balances?: Balance[]
  onPress?: () => void
}

const EmptyListComponent = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & TabStackParamList & MoreStackParamList>>()

  const handlePress = () => {
    navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.More.name,
      params: {
        screen: wrapper.route.Step1CreateWallet.name,
        initial: false,
        params: {
          source: wrapper.route.WalletContextModal.name,
        },
      },
    })
  }

  return (
    <LinearLayout alignItems="center" mx={3}>
      <ButtonWithoutFeedbackView onPress={handlePress}>
        <LinearLayout
          my={6}
          orientation="horiz"
          width={Normalize.scale(300)}
          maxWidth="100%"
          alignItems="center"
          justifyContent="center"
          borderStyle="dashed"
          borderColor="text.0"
          borderRadius={17}
          borderWidth={1}
          style={{
            aspectRatio: 20 / 25,
          }}
        >
          <ImageView source={require('~src/assets/images/icon-plus-white.png')} />

          <TextView color="white" fontSize={18} mt={2} ml={3} fontFamily="medium">
            {i18n.t('screens.listWallets.createFirstWallet')}
          </TextView>
        </LinearLayout>
      </ButtonWithoutFeedbackView>
    </LinearLayout>
  )
}

const Item = React.memo(({ wallet, balances, exchange, isInactive, onPress, disablePointerEvents }: ItemProps) => {
  return (
    <LinearLayout
      weight={1}
      justifyContent="center"
      alignItems="center"
      py={6}
      pointerEvents={disablePointerEvents ? 'none' : undefined}
    >
      <WalletCard
        exchange={exchange}
        balances={balances}
        width={240}
        onPress={onPress}
        wallet={wallet}
        isInactive={isInactive}
      />
    </LinearLayout>
  )
})

const WalletPicker = ({
  selectedWallet,
  exchange,
  selectedWalletBalances,
  isInactive,
  onPress,
  onScrollBegin,
  onScrollEnd,
  onSelect,
  wallets,
}: Props) => {
  const selectWalletIndex = useMemo(
    () => wallets.findIndex(it => it.id === selectedWallet.id) ?? 0,
    [wallets, selectedWallet]
  )

  const pressEvent = async (wallet: Wallet) => {
    if (onPress) onPress(wallet)
  }

  const selectEvent = async (index: number) => {
    if (onSelect) onSelect(wallets[index])
  }

  return (
    <Carousel<Wallet>
      onScrollBeginDrag={onScrollBegin}
      onScrollEndDrag={onScrollEnd}
      layout="default"
      containerCustomStyle={{ overflow: 'visible' }}
      data={wallets}
      sliderWidth={applicationConfig.windowWidth}
      itemWidth={240}
      inactiveSlideScale={0.8}
      inactiveSlideOpacity={1}
      inactiveSlideShift={12}
      lockScrollWhileSnapping
      lockScrollTimeoutDuration={200}
      activeSlideOffset={5}
      swipeThreshold={5}
      useScrollView
      firstItem={selectWalletIndex}
      ListEmptyComponent={EmptyListComponent}
      onSnapToItem={index => selectEvent(index)}
      renderItem={({ item, index }) => (
        <Item
          disablePointerEvents={index !== selectWalletIndex}
          exchange={exchange}
          balances={index === selectWalletIndex ? selectedWalletBalances : undefined}
          onPress={() => pressEvent(item)}
          wallet={item}
          isInactive={isInactive}
        />
      )}
    />
  )
}

export default WalletPicker
