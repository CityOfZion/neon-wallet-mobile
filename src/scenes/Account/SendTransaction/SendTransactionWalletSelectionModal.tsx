import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import ThemedCloseButton from '~/src/components/themed/ThemedCloseButton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useBalances } from '~/src/hooks/useBalances'
import { useExchange } from '~/src/hooks/useExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import { Wallet } from '~src/models/redux/Wallet'
import { RootState } from '~src/store/RootStore'
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

  const controller = useSwiperController(true)
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const language = useSelector((state: RootState) => state.settings.language)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const accounts = useSelector((state: RootState) => state.app.accounts)

  const validWallets = useMemo(() => wallets.filter((value: Wallet) => value.walletType !== 'watch'), [wallets])

  const [selectedWallet, setSelectedWallet] = useState<Wallet>(validWallets[0])

  const { exchange } = useExchange()
  const { balances: selectedWalletBalances } = useBalances(selectedWallet.getAccounts(accounts))

  const totalTokenBalance = useMemo(
    () => BalanceHelper.calculateTotalBalances(selectedWalletBalances, exchange),
    [selectedWalletBalances, exchange]
  )

  const formattedAllBalance = useMemo(() => {
    return FilterHelper.currency(totalTokenBalance, currency, language)
  }, [totalTokenBalance, currency, language])

  useEffect(() => {
    if (!address) return

    const account = accounts.find(account => account.address && account.address === address)
    const wallet = account?.getWallet(wallets)

    if (!account || !wallet) return

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
          wallets={validWallets}
          selectedWallet={selectedWallet}
          exchange={exchange}
          isInactive={totalTokenBalance ? totalTokenBalance <= 0 : true}
          selectedWalletBalances={selectedWalletBalances}
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
          {formattedAllBalance}
        </TextView>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SendTransactionWalletSelectionModal
