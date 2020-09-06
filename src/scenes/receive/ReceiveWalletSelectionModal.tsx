import React, {useState} from 'react'
import {ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const ReceiveWalletSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)

  const {wallets, exchange} = useSelector((state: RootState) => state.app)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(
    wallets[0]
  )

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={24}
      paddingRight={30}
      paddingLeft={0}
      title={Facade.t('modals.receive.title')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
      onClose={() => props.navigation.goBack()}
      image={require('~src/assets/images/download-white.png')}
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
            {Facade.t('modals.receive.walletSelection.subtitle')}
          </TextView>

          <WalletPicker
            wallets={wallets}
            onSelect={setSelectedWallet}
            onPress={(wallet) =>
              props.navigation.navigate(
                Facade.route.ReceiveAccountSelectionModal.name,
                {
                  wallet,
                }
              )
            }
          />

          <TextView
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
        </ScrollView>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default ReceiveWalletSelectionModal
