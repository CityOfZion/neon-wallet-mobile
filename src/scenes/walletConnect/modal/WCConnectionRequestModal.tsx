import {
  DEFAULT_BLOCKCHAIN,
  EStatus,
  TSessionProposal,
  useWalletConnectWallet,
} from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp, useNavigationState } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AwaitActivity, Await } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useDispatch, useSelector } from 'react-redux'

import { TOnFinishSelectionParams } from '../../Wallet/WalletSelectionModal'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { TNetworkType } from '~/src/blockchain'
import { Alert, AlertButton, AlertButtonGroup } from '~/src/components/Alert'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useWalletConnectFlow } from '~/src/hooks/useWalletConnectFlow'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { RootState } from '~/src/store/RootStore'
import { settingsReducerActions } from '~/src/store/settings/SettingsReducer'
import { selectWallets } from '~/src/store/wallet/SelectorWallet'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import ConnectionHeader from '~src/scenes/walletConnect/components/ConnectionHeader'
import { LinearLayout, TextView, ImageView } from '~src/styles/styled-components'

export interface WCConnectionRequestModalParams {
  uri: string
}

interface Props {
  route: RouteProp<ModalStackParamList, 'WCConnectionRequestModal'>
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList & TabStackParamList>
}

const WCConnectionRequestModal = (props: Props) => {
  const { uri } = props.route.params

  useWalletConnectFlow()
  const controller = useSwiperController(true)
  const { proposals, approveProposal, connect, rejectProposal, status } = useWalletConnectWallet()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const networks = useSelector((state: RootState) => state.settings.blockchainNetworks)
  const selectedBlockchainNetworks = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)
  const dispatch = useDispatch()
  const wallets = useSelector(selectWallets)

  const switchedNetwork = useRef<TNetworkType>()

  const [alertIsVisible, setAlertIsVisible] = useState(false)

  const proposal = useMemo<TSessionProposal | undefined>(() => proposals[0], [proposals])
  const sessionNetwork = useMemo(() => {
    if (!proposal) return

    return WalletConnectHelper.getNetworkFromProposal(proposal)
  }, [proposal])

  const handleFinishSelect = useCallback(
    async ({ account }: TOnFinishSelectionParams) => {
      try {
        Await.init('load')

        props.navigation.goBack()
        props.navigation.goBack()

        if (!proposal || !account?.address) {
          throw new Error(i18n.t('walletconnect.alert.unexpectedErrorToSelectAccount'))
        }

        const chain = WalletConnectHelper.convertChain(
          switchedNetwork.current ?? selectedBlockchainNetworks[account.blockchain].type
        )

        await approveProposal(proposal, { account: { address: account.address, chain } })

        showMessage({
          message: i18n.t('walletconnect.alert.text', {
            text: proposal.params.proposer.metadata.name,
          }),
          description: i18n.t('walletconnect.alert.description'),
          duration: 7000,
          type: 'success',
        })
      } catch (error: any) {
        showMessage({ message: error.message, duration: 7000, type: 'danger' })
      } finally {
        props.navigation.navigate(wrapper.route.WalletConnect.name, { screen: wrapper.route.WalletConnectPage.name })
        Await.done('load')
      }
    },
    [proposal, selectedBlockchainNetworks, approveProposal]
  )

  const navigateToSelection = useCallback(() => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wallets.length === 1 ? wrapper.route.AccountSelectionModal.name : wrapper.route.WalletSelectionModal.name,
      params: {
        textSchema: 'modals.walletConnectSelectionModal',
        onFinish: handleFinishSelect,
        filter: 'walletConnect',
        style: 'alter',
        wallet: wallets.length === 1 ? wallets[0] : undefined,
      },
    })
  }, [handleFinishSelect])

  const handleAccept = useCallback(async () => {
    if (!proposal || !sessionNetwork) return

    const currentNetwork = selectedBlockchainNetworks[sessionNetwork.blockchain].type
    const dAppNetwork = sessionNetwork.network

    if (currentNetwork !== dAppNetwork) {
      setAlertIsVisible(true)
      return
    }

    navigateToSelection()
  }, [proposal, navigateToSelection, selectedBlockchainNetworks, sessionNetwork])

  const runOnURI = useCallback(async () => {
    await connect(uri).catch(error => {
      showMessage({
        message: error.message,
        type: 'danger',
        duration: 3000,
      })

      controller.close()
      props.navigation.goBack()
    })
  }, [controller.close, props.navigation.goBack, connect, uri])

  const handleClose = async () => {
    setAlertIsVisible(false)
    props.navigation.goBack()
    if (proposal) rejectProposal(proposal)
  }

  const handleSwitchNetwork = () => {
    setAlertIsVisible(false)
    if (!sessionNetwork) return

    const value = networks[sessionNetwork.blockchain].find(network => network.type === sessionNetwork.network)
    if (!value) {
      showMessage({
        message: i18n.t('walletconnect.alert.networkNotFound', { network: sessionNetwork.network }),
        type: 'danger',
      })
      controller.close()
      return
    }

    dispatch(
      settingsReducerActions.setSelectNetwork({
        blockchain: sessionNetwork.blockchain,
        id: value.id,
      })
    )
    switchedNetwork.current = value.type
    navigateToSelection()
  }

  useEffect(() => {
    if (status !== EStatus.STARTED) return

    runOnURI()
  }, [runOnURI, status])

  useEffect(() => {
    if (proposal) {
      Await.done('load')
      return
    }

    Await.init('load')
  }, [proposal])

  return (
    <SwiperPanel
      controller={controller}
      rightButton={<CloseButton onPress={controller.close} />}
      title={i18n.t('modals.WCConnectionRequest.title')}
      onClose={handleClose}
    >
      <AwaitActivity name="load" loadingView={<ScreenLoader transparent />}>
        {proposal && sessionNetwork && (
          <>
            <LinearLayout flexGrow={1} justifyContent="space-between">
              <LinearLayout>
                <ConnectionHeader
                  title={i18n.t('modals.WCConnectionRequest.subtitle_1', {
                    dAppName: proposal.params.proposer.metadata.name,
                  })}
                  imageUri={proposal.params.proposer.metadata.icons[0]}
                />

                <LinearLayout
                  width="100%"
                  backgroundColor="background.15"
                  orientation="horiz"
                  paddingX="8px"
                  paddingY="8px"
                  borderRadius="8px"
                >
                  <LinearLayout weight={1}>
                    <TextView fontFamily="bold" color="text.12" fontSize="14px" fontWeight="700">
                      {i18n.t('modals.WCConnectionRequest.chain')}
                    </TextView>

                    <LinearLayout orientation="horiz" mt="6px">
                      <ImageView
                        source={BlockchainHelper.getIcon(sessionNetwork.blockchain)}
                        resizeMode="contain"
                        width={20}
                        height={20}
                        mr="2px"
                      />
                      <TextView fontFamily="medium" color="#fff" fontSize="16px">
                        {i18n.t(`blockchainServices.${sessionNetwork.blockchain}.id`)}
                      </TextView>
                    </LinearLayout>
                  </LinearLayout>

                  <LinearLayout weight={1}>
                    <TextView fontFamily="bold" color="text.12" fontSize="14px" fontWeight="700">
                      {i18n.t('modals.WCConnectionRequest.features')}
                    </TextView>

                    {proposal.params.requiredNamespaces[DEFAULT_BLOCKCHAIN].methods.map((it, index) => (
                      <TextView key={index} color="text.0" fontFamily="medium" fontSize="16px">
                        {it}
                      </TextView>
                    ))}
                  </LinearLayout>
                </LinearLayout>
              </LinearLayout>

              <LinearLayout mt="24px">
                <TextView color="text.0" fontSize="18px" textAlign="center">
                  {i18n.t('modals.WCConnectionRequest.subtitle')}
                </TextView>

                <ThemedButton
                  disabled={!isConnected}
                  label={i18n.t('modals.WCConnectionRequest.acceptLabel')}
                  onPress={handleAccept}
                  my={12}
                />
                <TouchableWithoutFeedback onPress={controller.close}>
                  <LinearLayout
                    width="100%"
                    borderRadius="4px"
                    borderWidth="1px"
                    borderColor="primary"
                    justifyContent="center"
                    alignItems="center"
                    p="10px"
                  >
                    <TextView color="primary" fontSize="20px">
                      {i18n.t('modals.WCConnectionRequest.declineLabel')}
                    </TextView>
                  </LinearLayout>
                </TouchableWithoutFeedback>
              </LinearLayout>
            </LinearLayout>

            <Alert
              title={i18n.t('modals.WCConnectionRequest.dialog_title')}
              subtitle={i18n.t('modals.WCConnectionRequest.dialog_message', {
                dAppName: proposal.params.proposer.metadata.name,
                dAppNetwork: i18n.t(`app.networks.${sessionNetwork.network}`),
                currentNetwork: i18n.t(`app.networks.${selectedBlockchainNetworks[sessionNetwork.blockchain].type}`),
              })}
              visible={alertIsVisible}
              onRequestClose={() => setAlertIsVisible(false)}
            >
              <AlertButtonGroup>
                <AlertButton label={i18n.t('modals.WCConnectionRequest.dialog_cancel')} onPress={controller.close} />
                <AlertButton
                  label={i18n.t('modals.WCConnectionRequest.dialog_confirm')}
                  onPress={handleSwitchNetwork}
                />
              </AlertButtonGroup>
            </Alert>
          </>
        )}
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default WCConnectionRequestModal
