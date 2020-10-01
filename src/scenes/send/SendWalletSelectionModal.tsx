import {RouteProp, useNavigationState} from '@react-navigation/native'
import React, {useEffect, useState, Fragment} from 'react'
import {ScrollView, TouchableHighlight} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {useHeaderHeight} from '~/node_modules/@react-navigation/stack'
import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import {NeoURI} from '~src/helpers/UriHelper'
import {Wallet} from '~src/models/redux/Wallet'
import {SendModalStackParamList} from '~src/navigation/SendModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface SendWalletSelectionModalParams {
  uri?: NeoURI
}

interface Props {
  navigation: StackNavigationProp<SendModalStackParamList>
  route: RouteProp<SendModalStackParamList, 'SendWalletSelectionModal'>
}

const SendWalletSelectionModal = (props: Props) => {
  const dispatch = useDispatch<DispatchResult>()
  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      Facade.route.SendWalletSelectionModal.name
  )

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
        paddingLeft: 8,
        paddingRight: 8,
      }}
    >
      <TouchableHighlight>
        <Fragment>
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
            canBeInactive={true}
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
        </Fragment>
      </TouchableHighlight>
    </ScrollView>
  ) : (
    <LinearLayout />
  )
}

export default SendWalletSelectionModal
