import {RouteProp} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {NeoURI} from '~src/helpers/UriHelper'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {TextView} from '~src/styles/styled-components'

export interface SendWalletSelectionModalParams {
  uri?: NeoURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SendWalletSelectionModal'>
}

const SendWalletSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)
  const dispatch = useDispatch<SyncDispatch>()

  const {wallets, exchange} = useSelector((state: RootState) => state.app)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const usableWallets = wallets.filter(
    (value: Wallet) => value.walletType !== 'watch'
  )

  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(
    usableWallets[0]
  )

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
      rightButton={<ThemedCloseButton onPress={controller.close} />}
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

      <WalletPicker
        wallets={usableWallets}
        onSelect={setSelectedWallet}
        onPress={(wallet) =>
          props.navigation.navigate(
            Facade.route.SendAccountSelectionModal.name,
            {
              wallet,
              uri: props.route.params?.uri,
            }
          )
        }
      />

      <TextView
        mt={5}
        alignSelf="center"
        fontSize="36px"
        color="text.0"
        fontFamily="medium"
      >
        {selectedWallet?.calculateBalanceFormatted(
          currency,
          language,
          exchange
        )}
      </TextView>
    </SwiperPanel>
  )
}

export default SendWalletSelectionModal
