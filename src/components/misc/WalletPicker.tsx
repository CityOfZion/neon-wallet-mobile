import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Dimensions, Platform } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { applicationConfig } from '~/src/config/ApplicationConfig'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { MoreStackParamList } from '~/src/navigation/MoreStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { Balance } from '~/src/types/balance'
import { MultiExchange } from '~/src/types/exchange'
import WalletCard from '~src/components/WalletCard'
import { Wallet } from '~src/models/redux/Wallet'
import { ButtonWithoutFeedbackView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
import { RootState, RootStore } from '~src/store/RootStore'

interface Props {
  onPress?: (wallet: Wallet) => void
  onSelect?: (wallet: Wallet) => void
  selectedWallet: Wallet
  wallets: Wallet[]
  isInactive?: boolean
  onScrollBegin?: (evt?: NativeSyntheticEvent<NativeScrollEvent>) => void
  onScrollEnd?: (evt?: NativeSyntheticEvent<NativeScrollEvent>) => void
  exchange?: MultiExchange
  selectedWalletBalances?: Balance[]
}

interface ItemProps {
  disablePointerEvents?: boolean
  wallet: Wallet
  isInactive?: boolean
  exchange?: MultiExchange
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
  const dispatch = useDispatch()
  const selectWalletIndex = useMemo(
    () => wallets.findIndex(it => it.id === selectedWallet.id) ?? 0,
    [wallets, selectedWallet]
  )

  const isFirstTime = useSelector((state: RootState) => state.settings.isFirstTime)
  const pressEvent = async (wallet: Wallet) => {
    if (onPress) {
      onPress(wallet)
    }
    if (isFirstTime) {
      dispatch(RootStore.settings.actions.setIsFirstTime(false))
    }
  }

  const selectEvent = async (index: number) => {
    if (onSelect) onSelect(wallets[index])
  }

  return (
    <>
      {isFirstTime && (
        <LinearLayout
          style={{
            backgroundColor: '#000',
            zIndex: 1,
            position: 'absolute',
            left: Dimensions.get('screen').width * 0.31,
            top: Dimensions.get('screen').width * (Platform.OS === 'ios' ? 0.27 : 0.22),
            borderRadius: 14.4,
            opacity: 0.7,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => pressEvent(wallets[0])}
            style={{
              width: Dimensions.get('screen').width * 0.35,
              height: Dimensions.get('screen').height * 0.2,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}
          >
            <LinearLayout border={1} borderColor="primary" p={4} borderRadius={50}>
              <ImageView
                width={26}
                height={23}
                source={require('~src/assets/images/icon-arrow-curve-down-green.png')}
              />
            </LinearLayout>
            <LinearLayout>
              <TextView fontWeight={500} fontSize="md" color="primary">
                Take a look inside!
              </TextView>
              <TextView color="text.0" fontSize="xs" textAlign="center">
                Your new accounts are waiting.
              </TextView>
            </LinearLayout>
          </TouchableWithoutFeedback>
        </LinearLayout>
      )}
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
        enableSnap
        useScrollView
        firstItem={selectWalletIndex > 0 ? selectWalletIndex : 0}
        onSnapToItem={index => selectEvent(index)}
        renderItem={(wallet: { item: Wallet; index: number }) => (
          <LinearLayout
            weight={1}
            justifyContent="center"
            alignItems="center"
            py={6}
            pointerEvents={wallet.index !== selectWalletIndex ? 'none' : undefined}
          >
            <WalletCard
              exchange={exchange}
              width={240}
              onPress={() => pressEvent(wallet.item)}
              isInactive={isInactive}
              wallet={wallet.item}
            />
          </LinearLayout>
        )}
      />
    </>
  )
}

export default WalletPicker
