import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useEffect, useState, useCallback, useMemo} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import {AccountCardsComponent} from '../../GetWalletView'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {getWCChainByBlockchain} from '~/src/blockchain/common'
import {ProgressBar} from '~/src/components/ProgressBar'
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
  const [addressConnect, setAddressConnect] = useState<string>('')
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false)
  const walletConnectCtx = useWalletConnect()

  const accounts = props.route.params.wallet.getAccounts(accountsPool)
  const nameDApp = useMemo(
    () => walletConnectCtx.sessionProposals[0].proposer.metadata.name,
    []
  )
  const pressEvent = useCallback(
    (account: Account) => {
      if (walletConnectCtx.sessionProposals.length > 0 && account.address) {
        const wcChain = getWCChainByBlockchain(account.blockchain)
        if (wcChain) {
          walletConnectCtx.addAccountAndChain(account.address, wcChain)
          setAddressConnect(account.address)
        }
      }
    },
    [walletConnectCtx.sessionProposals, walletConnectCtx.accounts]
  )

  const handleConnectDApp = useCallback(async () => {
    try {
      if (walletConnectCtx.sessionProposals.length > 0) {
        await walletConnectCtx.approveSession(
          walletConnectCtx.sessionProposals[0]
        )
        showMessage({
          message: i18n.t('walletconnect.alert.text', {text: nameDApp}),
          duration: 7000,
          type: 'warning',
        })
      }

      props.navigation.reset({
        index: 0,
        routes: [{name: wrapper.route.Tab.name}],
      })
      props.navigation.navigate(wrapper.route.WalletConnectPage.name)
    } catch (error) {
      console.log(error)
    }
  }, [walletConnectCtx.accounts, walletConnectCtx.sessionProposals])

  useEffect(() => {
    if (
      !!walletConnectCtx.accounts.find((it) => it.includes(addressConnect)) &&
      addressConnect !== ''
    ) {
      setShowProgressBar(true)
    }
  }, [walletConnectCtx.accounts, addressConnect])

  return (
    <>
      <ProgressBar
        onFinish={handleConnectDApp}
        show={showProgressBar}
        timeToComplete={10}
        text={i18n.t('walletconnect.waitingDAppConnect', {dAppName: nameDApp})}
      />
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
          <AccountCardsComponent accounts={accounts} onPress={pressEvent} />
        </LinearLayout>
      </SwiperPanel>
    </>
  )
}
