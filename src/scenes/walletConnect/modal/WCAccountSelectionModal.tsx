import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useCallback, useMemo} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {getWCChainByBlockchain, hasWalletconnect} from '~/src/blockchain/common'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {IURI} from '~/src/helpers/UriHelper'
import {useTreatNetworkOnWalletConnectFlow} from '~/src/hooks'
import {Account} from '~/src/models/redux/Account'
import {Wallet} from '~/src/models/redux/Wallet'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~/src/navigation/TabNavigation'
import {LinearLayout, TextView} from '~/src/styles/styled-components'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {AccountCardsComponent} from '~src/scenes/GetWalletView'
export interface WCAccountSelectionModalParams {
  wallet: Wallet
  uri?: IURI
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
  route: RouteProp<ModalStackParamList, 'WCAccountSelectionModal'>
}

export const WCAccountSelectionModal = (props: Props) => {
  useTreatNetworkOnWalletConnectFlow()
  const controller = useSwiperController(true)
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const walletConnectCtx = useWalletConnect()
  const accounts = props.route.params.wallet
    .getAccounts(accountsPool)
    .filter((it) => hasWalletconnect(it))

  const sessionProposal = useMemo(() => walletConnectCtx.sessionProposals[0], [
    walletConnectCtx.sessionProposals,
  ])

  const handleConnectDApp = useCallback(
    async (account: Account) => {
      try {
        const wcChain = getWCChainByBlockchain(account.blockchain)

        if (!wcChain || !sessionProposal || !account?.address) {
          throw new Error(
            i18n.t('walletconnect.alert.unexpectedErrorToSelectAccount')
          )
        }

        await walletConnectCtx.approveSession(sessionProposal, [
          {address: account.address, chain: wcChain},
        ])

        showMessage({
          message: i18n.t('walletconnect.alert.text', {
            text: sessionProposal.proposer.metadata.name,
          }),
          duration: 7000,
          type: 'warning',
        })
      } catch (error: any) {
        showMessage({message: error.message, duration: 7000, type: 'danger'})
      } finally {
        props.navigation.reset({
          index: 0,
          routes: [{name: wrapper.route.Tab.name}],
        })
        props.navigation.navigate(wrapper.route.WalletConnectPage.name, {})

        Await.done('connectDapp')
      }
    },
    [sessionProposal]
  )

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
      <AwaitActivity name="connectDapp" loadingView={<ScreenLoader />}>
        <LinearLayout mt={6} height={'100%'} textAlign="center">
          <TextView color="text.0" fontSize={18} textAlign="center" mb={'30px'}>
            {i18n.t('modals.WCAccountSelection.subtitle')}
          </TextView>
          <AccountCardsComponent
            accounts={accounts}
            onPress={handleConnectDApp}
            disableSecondTouch={true}
          />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}
