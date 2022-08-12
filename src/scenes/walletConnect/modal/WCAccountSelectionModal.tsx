import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AwaitActivity, Await } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { getWCChainByBlockchain, hasWalletconnect } from '~/src/blockchain/common'
import { AccountCards } from '~/src/components/AccountCards'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import { IURI } from '~/src/helpers/UriHelper'
import { useBalancesAndExchange } from '~/src/hooks/useBalancesAndExchange'
import { useTreatNetworkOnWalletConnectFlow } from '~/src/hooks/useTreatNetworkOnWalletConnectFlow'
import { Account } from '~/src/models/redux/Account'
import { Wallet } from '~/src/models/redux/Wallet'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { LinearLayout, TextView } from '~/src/styles/styled-components'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { useWalletConnect } from '~src/contexts/WalletConnectContext'

export interface WCAccountSelectionModalParams {
  wallet: Wallet
  uri?: IURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
  route: RouteProp<ModalStackParamList, 'WCAccountSelectionModal'>
}

export const WCAccountSelectionModal = (props: Props) => {
  const { wallet } = props.route.params

  useTreatNetworkOnWalletConnectFlow()
  const controller = useSwiperController(true)
  const accounts = useSelector(selectAccounts)
  const walletConnectCtx = useWalletConnect()

  const validAccounts = useMemo(
    () => wallet.getAccounts(accounts).filter(account => hasWalletconnect(account)),
    [wallet, accounts]
  )

  const balancesExchange = useBalancesAndExchange(validAccounts)

  const sessionProposal = useMemo(() => walletConnectCtx.sessionProposals[0], [walletConnectCtx.sessionProposals])

  const handleConnectDApp = async (account: Account) => {
    try {
      const wcChain = getWCChainByBlockchain(account.blockchain)

      if (!wcChain || !sessionProposal || !account?.address) {
        throw new Error(i18n.t('walletconnect.alert.unexpectedErrorToSelectAccount'))
      }

      await walletConnectCtx.approveSession(sessionProposal, [{ address: account.address, chain: wcChain }])

      showMessage({
        message: i18n.t('walletconnect.alert.text', {
          text: sessionProposal.proposer.metadata.name,
        }),
        duration: 7000,
        type: 'warning',
      })
    } catch (error: any) {
      showMessage({ message: error.message, duration: 7000, type: 'danger' })
    } finally {
      props.navigation.reset({
        index: 0,
        routes: [{ name: wrapper.route.Tab.name }],
      })
      props.navigation.navigate(wrapper.route.WalletConnectPage.name)

      Await.done('connectDapp')
    }
  }

  return (
    <SwiperPanel
      padding={20}
      smallerSize
      controller={controller}
      rightButton={<CloseButton mr="20px" />}
      title={i18n.t('modals.WCAccountSelection.title')}
      onClose={props.navigation.goBack}
      onRightPress={controller.close}
      solidColorBG
    >
      <AwaitActivity name="connectDapp" loadingView={<ScreenLoader />}>
        <LinearLayout mt={6} height="100%">
          <TextView color="text.0" fontSize={18} textAlign="center" mb="30px">
            {i18n.t('modals.WCAccountSelection.subtitle')}
          </TextView>

          <AccountCards balanceExchange={balancesExchange} accounts={validAccounts} onPress={handleConnectDApp} />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}
