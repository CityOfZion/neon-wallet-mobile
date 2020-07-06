import React, {useRef, useState} from 'react'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import i18n from '~src/i18n'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootState} from '~src/store/reducers/root'
import {LinearLayout, TextView} from '~src/styles/styled-components'
import Carousel from 'react-native-snap-carousel'
import WalletCard from '~src/components/WalletCard'
import {mockWalletItems} from '~src/mockWalletItems'
import {ROUTES, WINDOW_WIDTH} from '~/constants'
import {FilterHelper} from '~src/helpers/FilterHelper'
import {ScrollView} from 'react-native'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const SendWalletSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [wallets, setWallets] = useState(mockWalletItems)
  const carouselRef = useRef(null)
  const currency = useSelector((state: RootState) => state.app.currency)

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={0}
      paddingLeft={0}
      title={i18n.t('modals.send.title')}
      rightButton={'X    '}
      onRightPress={() => controller.close()}
      onClose={() => props.navigation.goBack()}
      image={require('~/src/assets/images/upload-white.png')}
    >
      <ScrollView height="100%" width="100%">
        <TextView
          mb={24}
          color="text.0"
          fontSize={18}
          fontFamily="medium"
          textAlign="center"
        >
          {i18n.t('modals.send.walletSelection.subtitle')}
        </TextView>
        <Carousel
          layout={'default'}
          ref={carouselRef}
          data={wallets}
          firstItem={0}
          sliderWidth={WINDOW_WIDTH}
          itemWidth={Math.round(WINDOW_WIDTH * 0.7)}
          inactiveSlideScale={0.8}
          inactiveSlideOpacity={1}
          inactiveSlideShift={12}
          lockScrollWhileSnapping={true}
          lockScrollTimeoutDuration={200}
          activeSlideOffset={5}
          swipeThreshold={5}
          enableSnap={true}
          renderItem={({item}) =>
            <WalletCard
              onPress={() =>
                props.navigation.navigate(ROUTES.SEND_WALLET_SELECTION_MODAL.name)
              }
              height={330}
              wallet={item}
            />
          }
          onSnapToItem={(index) => setActiveIndex(index)}
        />
        <TextView alignSelf="center" fontSize="36px" color="text.0" fontFamily="medium">
          {FilterHelper.currency(wallets[activeIndex].currentValue, currency, false, true)}
        </TextView>
      </ScrollView>
    </SwiperPanel>
  )
}

export default SendWalletSelectionModal
