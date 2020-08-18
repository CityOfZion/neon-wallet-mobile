import {RouteProp} from '@react-navigation/native'
import React, {useEffect, useRef, useState} from 'react'
import Carousel from 'react-native-snap-carousel'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import WalletCard from '~src/components/WalletCard'
import {NeoURI} from '~src/helpers/UriHelper'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface SendWalletSelectionModalParams {
  uri?: NeoURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SendWalletSelectionModal'>
}

const SendWalletSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)
  const carouselRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const {wallets, exchange} = useSelector((state: RootState) => state.app)
  const usableWallets = wallets.filter(
    (value: Wallet) => value.walletType !== 'watch'
  )
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const dispatch = useDispatch<SyncDispatch>()

  useEffect(() => {
    dispatch(RootStore.senderTransaction.actions.clearState())
  }, [])

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={8}
      paddingLeft={0}
      title={Facade.t('modals.send.title')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/upload-white.png')}
    >
      <TextView
        mb={24}
        color="text.0"
        fontSize={18}
        fontFamily="medium"
        textAlign="center"
      >
        {Facade.t('modals.send.walletSelection.subtitle')}
      </TextView>

      <Carousel<Wallet>
        layout={'default'}
        ref={carouselRef}
        data={usableWallets}
        firstItem={0}
        sliderWidth={Facade.app.windowWidth}
        itemWidth={Math.round(Facade.app.windowWidth * 0.6)}
        inactiveSlideScale={0.8}
        inactiveSlideOpacity={1}
        inactiveSlideShift={12}
        lockScrollWhileSnapping={true}
        lockScrollTimeoutDuration={200}
        activeSlideOffset={5}
        swipeThreshold={5}
        enableSnap={true}
        renderItem={({item}) => (
          <LinearLayout
            weight={1}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <WalletCard
              width={240}
              onPress={() =>
                props.navigation.navigate(
                  Facade.route.SendAccountSelectionModal.name,
                  {
                    wallet: item,
                    uri: props.route.params?.uri,
                  }
                )
              }
              wallet={item}
            />
          </LinearLayout>
        )}
        onSnapToItem={(index) => setActiveIndex(index)}
      />

      <TextView
        mt={5}
        alignSelf="center"
        fontSize="36px"
        color="text.0"
        fontFamily="medium"
      >
        {usableWallets[activeIndex]?.calculateBalanceFormatted(
          currency,
          language,
          exchange
        )}
      </TextView>
    </SwiperPanel>
  )
}

export default SendWalletSelectionModal
