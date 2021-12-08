import {RouteProp} from '@react-navigation/native'
import i18n from 'i18n-js'
import React, {useState, Fragment} from 'react'
import {ScrollView, TouchableHighlight} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {wrapper} from '~/src/app/ApplicationWrapper'
import {FilterHelper} from '~/src/helpers/FilterHelper'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import {IURI} from '~src/helpers/UriHelper'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStore} from '~src/store/RootStore'
import {TextView} from '~src/styles/styled-components'

export interface WCWalletSelectionModalModalParams {
  uri?: IURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WCWalletSelectionModal'>
}

const WCWalletSelectionModal = (props: Props) => {
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()

  const wallet = dispatchWallet(RootStore.wallet.actions.getFromSelection())

  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
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

  const controller = useSwiperController(true)

  return (
    <SwiperPanel
      padding={20}
      fullSize={true}
      controller={controller}
      rightButton={<CloseButton mr={'20px'} />}
      title={i18n.t('modals.WCAccountSelection.title')}
      onClose={() => {
        props.navigation.goBack()
      }}
      onRightPress={controller.close}
      solidColorBG={true}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        <TouchableHighlight>
          <Fragment>
            <TextView
              mb={49}
              color="text.0"
              fontSize={18}
              fontFamily="medium"
              textAlign="center"
            >
              {i18n.t('modals.WCWalletSelection.title')}
            </TextView>
            <WalletPicker
              wallets={usableWallets}
              onSelect={setSelectedWallet}
              onPress={(wallet) => {
                props.navigation.navigate(
                  wrapper.route.WCAccountSelectionModal.name,
                  {
                    wallet,
                  }
                )
              }}
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
                : FilterHelper.currency(
                    selectedWallet?.calculateBalance(currency, exchange),
                    currency,
                    language,
                    0,
                    0
                  )}
            </TextView>
          </Fragment>
        </TouchableHighlight>
      </ScrollView>
    </SwiperPanel>
  )
}

export default WCWalletSelectionModal
