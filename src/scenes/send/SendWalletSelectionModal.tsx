import React, {useRef, useState} from 'react'
import {ScrollView} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import WalletCard from '~src/components/WalletCard'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const SendWalletSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)
  const carouselRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const {currency, language} = useSelector((state: RootState) => state.settings)

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
      <LinearLayout width={'100%'}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
                  props.navigation.navigate(
                    Facade.route.SendAccountSelectionModal.name,
                    {
                      wallet: item,
                    }
                  )
                }
                height={330}
                wallet={item}
              />
            )}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
          <TextView
            alignSelf="center"
            fontSize="36px"
            color="text.0"
            fontFamily="medium"
          >
            {Facade.filter.currency(
              wallets[activeIndex].currentValue,
              currency,
              language
            )}
          </TextView>
        </ScrollView>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendWalletSelectionModal
