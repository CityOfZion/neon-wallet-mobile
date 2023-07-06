import { RouteProp } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useState, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { Skeleton } from '~/src/components/Skeleton'
import { BalanceHelper } from '~/src/helpers/BalanceHelper'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import { Account } from '~/src/models/redux/Account'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import { TokenBalance } from '~/src/types/query'
import SwiperPanel, { CloseButton, DEFAULT_PADDING, useSwiperController } from '~src/components/SwiperPanel'
import WalletPicker from '~src/components/misc/WalletPicker'
import { Wallet } from '~src/models/redux/Wallet'
import { RootState } from '~src/store/RootStore'
import { TextView } from '~src/styles/styled-components'

export type TOnFinishSelectionParams = {
  wallet: Wallet
  account: Account
  token?: TokenBalance
}

export type TFilterSelectionType = 'walletConnect'

export type TStyleSelectionType = 'normal' | 'alter'

export interface WalletSelectionModalParams {
  textSchema: string
  onFinish?: (params: TOnFinishSelectionParams) => void
  filter?: TFilterSelectionType
  disconnectDisable?: boolean
  noBalanceDisable?: boolean
  style?: TStyleSelectionType
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WalletSelectionModal'>
}

const WalletSelectionModal = (props: Props) => {
  const { textSchema, onFinish, filter, disconnectDisable, noBalanceDisable, style } = props.route.params
  const controller = useSwiperController(true)
  const wallets = useSelector(selectWallets)
  const language = useSelector((state: RootState) => state.settings.language)
  const currency = useSelector((state: RootState) => state.settings.currency)
  const accounts = useSelector(selectAccounts)
  const { getBlockchainService } = useBlockchainServiceUtils()

  const validWallets = useMemo(
    () =>
      wallets.filter((wallet: Wallet) => {
        if (wallet.walletType === 'watch') return false

        if (filter === 'walletConnect') {
          const walletAccounts = wallet.getAccounts(accounts)

          const hasAccountWithWalletConnect = walletAccounts.some(account => {
            const service = getBlockchainService(account.blockchain)
            return service.hasWalletConnectIntegration()
          })

          return hasAccountWithWalletConnect
        }

        return true
      }),
    [wallets, getBlockchainService]
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

  const handlePress = (wallet: Wallet) => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.AccountSelectionModal.name,
      params: {
        wallet,
        textSchema,
        onFinish,
        filter,
        disconnectDisable,
        noBalanceDisable,
        style,
      },
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t(`${textSchema}.wallet.title`)}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={props.navigation.goBack}
      contentStyle={{ paddingHorizontal: 0 }}
    >
      <TextView
        mb={20}
        paddingX={`${DEFAULT_PADDING}px`}
        color="text.0"
        fontSize={18}
        fontFamily="medium"
        textAlign="center"
      >
        {i18n.t(`${textSchema}.wallet.subtitle`)}
      </TextView>

      <WalletPicker
        wallets={validWallets}
        selectedWallet={selectedWallet}
        selectedWalletBalanceExchange={selectedWalletBalanceExchange}
        onSelect={setSelectedWallet}
        onPress={handlePress}
      />

      <Skeleton
        isLoading={selectedWalletBalanceExchange.isLoading}
        layout={{ width: 100, height: 36, alignSelf: 'center' }}
      >
        <TextView alignSelf="center" fontSize="36px" color="text.0" fontFamily="medium">
          {formattedAllBalance}
        </TextView>
      </Skeleton>
    </SwiperPanel>
  )
}

export default WalletSelectionModal
