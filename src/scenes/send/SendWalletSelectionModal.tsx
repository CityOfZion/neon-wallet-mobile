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

  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()

  const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const {wallets, exchange} = useSelector((state: RootState) => state.app)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  const usableWallets = wallets.filter(
    (value: Wallet) => value.walletType !== 'watch'
  )

  const walletWithFunds = usableWallets.filter(
    (value: Wallet) => value.hasFunds
  )

  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(
    wallet
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
            mb={20}
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
            alignSelf="center"
            fontSize="36px"
            color="text.0"
            fontFamily="medium"
          >
            {selectedWallet?.calculateBalance(currency, exchange) !== 0
              ? selectedWallet?.calculateBalanceFormatted(
                  currency,
                  language,
                  exchange
                )
              : Facade.filter.currency(
                  selectedWallet?.calculateBalance(currency, exchange),
                  currency,
                  language,
                  0,
                  0
                )}
          </TextView>
          {walletWithFunds.length === 0 && (
            <LinearLayout
              mt={21}
              mr={15}
              ml={15}
              alignSelf="center"
              flex={1}
              width={'92%'}
              borderRadius={7}
              bg={theme.colors.background[14]}
            >
              <TextView
                mt={25}
                mr={15}
                ml={17}
                mb={25}
                alignSelf="center"
                fontSize="18px"
                color="text.0"
                fontFamily="light"
                textAlign="center"
              >
                {Facade.t('modals.send.walletSelection.noFunds')}
              </TextView>
            </LinearLayout>
          )}
        </Fragment>
      </TouchableHighlight>
    </ScrollView>
  ) : (
    <LinearLayout />
  )
}

export default SendWalletSelectionModal
