import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { Dimensions } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import ThemedCloseButton from '~/src/components/themed/ThemedCloseButton'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import { Wallet } from '~src/models/redux/Wallet'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ReceiveModalStackParamList } from '~src/navigation/ReceiveModalStackNavigation'
import { RootStore } from '~src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ReceiveModalStackParamList, 'ReceiveWalletSelectionModal'>
}

const ReceiveWalletSelectionModal = (props: Props) => {
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()

  const controller = useSwiperController(true)

  const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  const { wallets, exchange } = useSelector((state: RootState) => state.app)
  const { currency, language } = useSelector((state: RootState) => state.settings)

  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(wallet)

  return (
    <SwiperPanel
      controller={controller}
      fullSize
      title={i18n.t('modals.receive.title')}
      padding={0}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onRightPress={controller.close}
      onClose={() => props.navigation.goBack()}
      solidColorBG
    >
      <LinearLayout width="100%" px="15px">
        <TextView
          mb={24}
          color="text.0"
          fontSize={18}
          fontFamily="medium"
          textAlign="center"
          style={{ marginBottom: Dimensions.get('screen').height * 0.05 }}
        >
          {i18n.t('modals.receive.walletSelection.subtitle')}
        </TextView>

        <WalletPicker
          wallets={wallets}
          onSelect={setSelectedWallet}
          onPress={wallet =>
            props.navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.ReceiveModalStack.name,
              params: {
                screen: wrapper.route.ReceiveAccountSelectionModal.name,
                params: {
                  wallet,
                },
              },
            })
          }
        />

        <TextView alignSelf="center" fontSize="36px" color="text.0" fontFamily="medium">
          {selectedWallet?.calculateBalanceFormatted(currency, language, exchange)}
        </TextView>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default ReceiveWalletSelectionModal
