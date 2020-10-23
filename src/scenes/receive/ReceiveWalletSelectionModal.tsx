import {RouteProp, useNavigationState} from '@react-navigation/native'
import {useHeaderHeight} from '@react-navigation/stack'
import React, {useState} from 'react'
import {ScrollView} from 'react-native'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {ReceiveModalStackParamList} from '~src/navigation/ReceiveModalStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ReceiveModalStackParamList, 'ReceiveWalletSelectionModal'>
}

const ReceiveWalletSelectionModal = (props: Props) => {
  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      Facade.route.ReceiveWalletSelectionModal.name
  )

  const {wallets, exchange} = useSelector((state: RootState) => state.app)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(
    wallets[0]
  )

  return show ? (
    <ScrollView
      style={{
        width: '100%',
        marginTop: useHeaderHeight(),
      }}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: PANEL_OFFSET + 20,
        paddingLeft: 15,
        paddingRight: 15,
      }}
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
    </ScrollView>
  ) : (
    <LinearLayout />
  )
}

export default ReceiveWalletSelectionModal
