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

  const selectedWalletBalanceExchange = useBalancesAndExchange(selectedWallet.getAccounts(accounts))

  const totalTokenBalance = useMemo(
    () =>
      BalanceHelper.calculateTotalBalances(
        selectedWalletBalanceExchange.balance.data,
        selectedWalletBalanceExchange.exchange.data
      ),
    [selectedWalletBalanceExchange]
  )

  const formattedAllBalance = useMemo(() => {
    return FilterHelper.currency(totalTokenBalance, currency, language)
  }, [totalTokenBalance, currency, language])

  const handlePress = (wallet: Wallet) => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SendTransactionAccountSelectionModal.name,
      params: {
        wallet,
        address,
      },
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize
      title={i18n.t('modals.sendTransactionWalletSelectionModal.title')}
      rightButton={<ThemedCloseButton />}
      onRightPress={controller.close}
      onClose={props.navigation.goBack}
      solidColorBG
      padding={0}
    >
      <LinearLayout>
        <TextView mb={20} color="text.0" fontSize={18} fontFamily="medium" textAlign="center">
          {i18n.t('modals.sendTransactionWalletSelectionModal.subtitle')}
        </TextView>

        <WalletPicker
          wallets={validWallets}
          selectedWallet={selectedWallet}
          selectedWalletBalanceExchange={selectedWalletBalanceExchange}
          isInactive={totalTokenBalance ? totalTokenBalance <= 0 : true}
          onSelect={setSelectedWallet}
          onPress={handlePress}
          inactiveNotSelected
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

export default SendTransactionWalletSelectionModal
