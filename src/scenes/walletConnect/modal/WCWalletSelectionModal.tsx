import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { Skeleton } from '~/src/components/Skeleton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import { useTreatNetworkOnWalletConnectFlow } from '~/src/hooks/useTreatNetworkOnWalletConnectFlow'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import { IURI } from '~src/helpers/UriHelper'
import { Wallet } from '~src/models/redux/Wallet'
import { RootState } from '~src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface WCWalletSelectionModalModalParams {
  uri?: IURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WCWalletSelectionModal'>
}

const WCWalletSelectionModal = (props: Props) => {
  useTreatNetworkOnWalletConnectFlow()
  const accounts = useSelector(selectAccounts)
  const wallets = useSelector(selectWallets)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const controller = useSwiperController(true)
  const { getBlockchainService } = useBlockchainServiceUtils()

  const validWallets = useMemo(
    () =>
      wallets.filter((wallet: Wallet) => {
        const walletAccounts = wallet.getAccounts(accounts)

        const hasAccountWithWalletConnect = walletAccounts.some(account => {
          const service = getBlockchainService(account.blockchain)
          return service.hasWalletConnectIntegration()
        })

        return wallet.walletType !== 'watch' && hasAccountWithWalletConnect
      }),
    [wallets, accounts]
  )
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
      padding={20}
      fullSize
      controller={controller}
      rightButton={<CloseButton mr="20px" />}
      title={i18n.t('modals.WCAccountSelection.title')}
      onClose={props.navigation.goBack}
      onRightPress={controller.close}
      solidColorBG
    >
      <LinearLayout alignItems="center">
        <TextView mb={20} color="text.0" fontSize={18} fontFamily="medium" textAlign="center">
          {i18n.t('modals.receiveTransactionAccountSelectionModal.subtitle')}
        </TextView>

        <WalletPicker
          selectedWallet={selectedWallet}
          selectedWalletBalanceExchange={selectedWalletBalanceExchange}
          wallets={validWallets}
          onSelect={setSelectedWallet}
          onPress={wallet => {
            props.navigation.navigate(wrapper.route.WCAccountSelectionModal.name, {
              wallet,
            })
          }}
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

export default WCWalletSelectionModal
