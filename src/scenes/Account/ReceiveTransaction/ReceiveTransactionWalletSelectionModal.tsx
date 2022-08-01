import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { Skeleton } from '~/src/components/Skeleton'
import ThemedCloseButton from '~/src/components/themed/ThemedCloseButton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import { Wallet } from '~src/models/redux/Wallet'
import { RootState } from '~src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface ReceiveTransactionWalletSelectionModalParams {}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ReceiveTransactionWalletSelectionModal'>
}

const ReceiveTransactionWalletSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const language = useSelector((state: RootState) => state.settings.language)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const accounts = useSelector((state: RootState) => state.app.accounts)

  const validWallets = useMemo(() => wallets.filter((value: Wallet) => value.walletType !== 'watch'), [wallets])

  const [selectedWallet, setSelectedWallet] = useState<Wallet>(validWallets[0])

  const selectedWalletBalanceExchange = useBalancesAndExchange(selectedWallet.getAccounts(accounts))

  const formattedAllBalance = useMemo(() => {
    const totalBalance = BalanceHelper.calculateTotalBalances(
      selectedWalletBalanceExchange.balance.data,
      selectedWalletBalanceExchange.exchange.data
    )

    return FilterHelper.currency(totalBalance, currency, language)
  }, [selectedWalletBalanceExchange, currency, language])

  return (
    <SwiperPanel
      controller={controller}
      fullSize
      title={i18n.t('modals.receiveTransactionAccountSelectionModal.title')}
      rightButton={<ThemedCloseButton />}
      onRightPress={controller.close}
      onClose={props.navigation.goBack}
      solidColorBG
    >
      <LinearLayout>
        <TextView mb={20} color="text.0" fontSize={18} fontFamily="medium" textAlign="center">
          {i18n.t('modals.receiveTransactionAccountSelectionModal.subtitle')}
        </TextView>

        <WalletPicker
          wallets={validWallets}
          selectedWallet={selectedWallet}
          selectedWalletBalanceExchange={selectedWalletBalanceExchange}
          onSelect={setSelectedWallet}
          onPress={wallet =>
            props.navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.ReceiveTransactionAccountSelectionModal.name,
              params: {
                wallet,
              },
            })
          }
        />

        <Skeleton
          isLoading={selectedWalletBalanceExchange.isLoading}
          layout={{ width: 100, height: 36, alignSelf: 'center' }}
        >
          <TextView alignSelf="center" fontSize="36px" color="text.0" fontFamily="medium">
            {formattedAllBalance}
          </TextView>
        </Skeleton>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default ReceiveTransactionWalletSelectionModal
