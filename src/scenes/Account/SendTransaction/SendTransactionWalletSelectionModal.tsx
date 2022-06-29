import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import ThemedCloseButton from '~/src/components/themed/ThemedCloseButton'
import { useExchange } from '~/src/hooks/useExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { SyncDispatch } from '~/src/types/reducers/root'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import { Wallet } from '~src/models/redux/Wallet'
import { RootState, RootStore } from '~src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface SendTransactionWalletSelectionModalParams {
  address?: string
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'SendTransactionWalletSelectionModal'>
}

const SendTransactionWalletSelectionModal = (props: Props) => {
  const { address } = props.route.params

  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()
  const controller = useSwiperController(true)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const language = useSelector((state: RootState) => state.settings.language)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const { exchange } = useExchange({ filter: { currencies: currency } })
  const accounts = useSelector((state: RootState) => state.app.accounts)

  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(
    dispatchWallet(RootStore.wallet.actions.getFromSelection())
  )

  const validWallets = useMemo(() => wallets.filter((value: Wallet) => value.walletType !== 'watch'), [wallets])

  useEffect(() => {
    if (!address) {
      return
    }

    const account = accounts.find(account => account.address && account.address === address)
    const wallet = account?.getWallet(wallets)

    if (!account || !wallet) {
      return
    }

    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionAccountSelectionModal.name,
      params: {
        wallet,
      },
    })
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionModal.name,
      params: {
        wallet,
        account,
      },
    })
  }, [address])

  return (
    <SwiperPanel
      controller={controller}
      fullSize
      title={i18n.t('modals.sendTransactionWalletSelectionModal.title')}
      rightButton={<ThemedCloseButton />}
      onRightPress={controller.close}
      onClose={props.navigation.goBack}
      solidColorBG
    >
      <LinearLayout>
        <TextView mb={20} color="text.0" fontSize={18} fontFamily="medium" textAlign="center">
          {i18n.t('modals.sendTransactionWalletSelectionModal.subtitle')}
        </TextView>

        <WalletPicker
          canBeInactive
          wallets={validWallets}
          onSelect={setSelectedWallet}
          onPress={wallet =>
            props.navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.SendTransactionAccountSelectionModal.name,
              params: {
                wallet,
              },
            })
          }
        />

        <TextView alignSelf="center" fontSize="36px" color="text.0" fontFamily="medium">
          {selectedWallet?.calculateBalanceFormatted(currency, language, exchange)} {/** TODO set SkeletonContainer */}
        </TextView>

        {validWallets?.every(wallet => !wallet.hasFunds) && (
          <LinearLayout
            mt={21}
            mr={15}
            ml={15}
            alignSelf="center"
            flex={1}
            width="92%"
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
              {i18n.t('modals.sendTransactionWalletSelectionModal.noFunds')}
            </TextView>
          </LinearLayout>
        )}
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendTransactionWalletSelectionModal
