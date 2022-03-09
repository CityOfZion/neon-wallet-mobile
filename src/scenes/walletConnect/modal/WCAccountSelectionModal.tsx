import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState, useCallback, useMemo} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {getWCChainByBlockchain, hasWalletconnect} from '~/src/blockchain/common'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {IURI} from '~/src/helpers/UriHelper'
import {Account} from '~/src/models/redux/Account'
import {Wallet} from '~/src/models/redux/Wallet'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {WalletConnectStackParamList} from '~/src/navigation/WalletConnectStackNavigation'
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
  navigation: StackNavigationProp<
    ModalStackParamList & WalletConnectStackParamList
  >
  route: RouteProp<ModalStackParamList, 'WCAccountSelectionModal'>
}

export const WCAccountSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const walletConnectCtx = useWalletConnect()

  const accounts = props.route.params.wallet
    .getAccounts(accountsPool)
    .filter((it) => hasWalletconnect(it))

  const nameDApp = useMemo(
    () => walletConnectCtx.sessionProposals[0].proposer.metadata.name,
    []
  )

  const handleConnectDApp = useCallback(
    async (account: Account) => {
      Await.init('connectDapp')
      try {
        if (walletConnectCtx.sessionProposals.length > 0 && account?.address) {
          const wcChain = getWCChainByBlockchain(account.blockchain)
          if (wcChain) {
            walletConnectCtx.setsessionsWasClean(true)
            await walletConnectCtx.approveSession(
              walletConnectCtx.sessionProposals[0],
              [{address: account.address, chain: wcChain}]
            )
            showMessage({
              message: i18n.t('walletconnect.alert.text', {text: nameDApp}),
              duration: 7000,
              type: 'warning',
            })
          }
        }

        props.navigation.reset({
          index: 0,
          routes: [{name: wrapper.route.Tab.name}],
        })
        props.navigation.navigate(wrapper.route.WalletConnectPage.name, {})
      } catch (error) {
        const message = (error as {message: string}).message
        showMessage({message, duration: 7000, type: 'danger'})
        props.navigation.reset({
          index: 0,
          routes: [{name: wrapper.route.Tab.name}],
        })
        props.navigation.navigate(wrapper.route.WalletConnectPage.name, {})
      } finally {
        Await.done('connectDapp')
      }
    },
    [walletConnectCtx.sessionProposals]
  )

  return (
    <AwaitActivity name="connectDapp" loadingView={<ScreenLoader />}>
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
        <LinearLayout mt={6} height={'100%'} textAlign="center">
          <TextView color="text.0" fontSize={18} textAlign="center" mb={'30px'}>
            {i18n.t('modals.WCAccountSelection.subtitle')}
          </TextView>
          <AccountCardsComponent
            accounts={accounts}
            onPress={(account) =>
              Await.run('connectingDapp', () => handleConnectDApp(account))
            }
            disableSecondTouch={true}
          />
        </LinearLayout>
      </SwiperPanel>
    </AwaitActivity>
  )
}
