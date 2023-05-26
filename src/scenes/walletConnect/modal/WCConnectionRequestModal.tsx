import { RouteProp } from '@react-navigation/native'
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
import { walletConnectConfig } from '~/src/config/WalletConnectConfig'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useWalletConnectFlow } from '~/src/hooks/useWalletConnectFlow'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { RootState } from '~/src/store/RootStore'
import { settingsReducerActions } from '~/src/store/settings/SettingsReducer'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import { SessionProposal, useWalletConnect } from '~src/contexts/WalletConnectContext'
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
  const walletConnectCtx = useWalletConnect()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const networks = useSelector((state: RootState) => state.settings.blockchainNetworks)
  const selectedBlockchainNetworks = useSelector((state: RootState) => state.settings.selectedBlockchainNetworks)
  const dispatch = useDispatch()

  const switchedNetwork = useRef<TNetworkType>()

  const [alertIsVisible, setAlertIsVisible] = useState(false)

  const sessionProposal = useMemo<SessionProposal | undefined>(
    () => walletConnectCtx.sessionProposals[0],
    [walletConnectCtx.sessionProposals]
  )
  const sessionNetwork = useMemo(() => {
    if (!sessionProposal) return

    return WalletConnectHelper.getNetworkFromProposal(sessionProposal)
  }, [sessionProposal])

  const handleFinishSelect = useCallback(
    async ({ account }: TOnFinishSelectionParams) => {
      try {
        Await.init('load')

        props.navigation.goBack()
        props.navigation.goBack()

        if (!sessionProposal || !account?.address) {
          throw new Error(i18n.t('walletconnect.alert.unexpectedErrorToSelectAccount'))
        }

        const chain = WalletConnectHelper.getChain(
          switchedNetwork.current ?? selectedBlockchainNetworks[account.blockchain].type,
          account.blockchain
        )

        await walletConnectCtx.approveSession(
          sessionProposal,
          [{ address: account.address, chain }],
          walletConnectConfig.defaultNamespace
        )

        showMessage({
          message: i18n.t('walletconnect.alert.text', {
            text: sessionProposal.params.proposer.metadata.name,
          }),
          description: i18n.t('walletconnect.alert.description'),
          duration: 7000,
          type: 'success',
        })
      } catch (error: any) {
        showMessage({ message: error.message, duration: 7000, type: 'danger' })
      } finally {
        props.navigation.reset({
          index: 0,
          routes: [{ name: wrapper.route.Tab.name }],
        })
        props.navigation.navigate(wrapper.route.WalletConnectPage.name)
        Await.done('load')
      }
    },
    [sessionProposal, selectedBlockchainNetworks, walletConnectCtx.approveSession]
  )

  const navigateToSelection = useCallback(() => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WalletSelectionModal.name,
      params: {
        textSchema: 'modals.walletConnectSelectionModal',
        onFinish: handleFinishSelect,
        filter: 'walletConnect',
        style: 'alter',
      },
    })
  }, [handleFinishSelect])

  const handleAccept = useCallback(async () => {
    if (!sessionProposal || !sessionNetwork) return

    const currentNetwork = selectedBlockchainNetworks[sessionNetwork.blockchain].type
    const dAppNetwork = sessionNetwork.network

    if (currentNetwork !== dAppNetwork) {
      setAlertIsVisible(true)
      return
    }

    navigateToSelection()
  }, [sessionProposal, navigateToSelection, selectedBlockchainNetworks, sessionNetwork])

  const runOnURI = useCallback(async () => {
    if (!walletConnectCtx.initialized) return

    try {
      await walletConnectCtx.onURI(uri)
    } catch (error: any) {
      showMessage({
        message: error.message,
        type: 'danger',
        duration: 3000,
      })

      controller.close()
      props.navigation.goBack()
    }
  }, [uri, walletConnectCtx.onURI, controller.close, walletConnectCtx.initialized])

  const handleClose = async () => {
    setAlertIsVisible(false)
    props.navigation.goBack()
    if (sessionProposal) walletConnectCtx.rejectSession(sessionProposal)
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
    runOnURI()
  }, [runOnURI])

  useEffect(() => {
    if (!sessionProposal) {
      Await.init('load')
      return
    }
    Await.done('load')
  }, [sessionProposal])

  return (
    <SwiperPanel
      controller={controller}
      rightButton={<CloseButton onPress={controller.close} />}
      title={i18n.t('modals.WCConnectionRequest.title')}
      onClose={handleClose}
    >
      <AwaitActivity name="load" loadingView={<ScreenLoader transparent />}>
        {sessionProposal && sessionNetwork && (
          <>
            <LinearLayout flexGrow={1} justifyContent="space-between">
              <LinearLayout>
                <ConnectionHeader
                  title={i18n.t('modals.WCConnectionRequest.subtitle_1', {
                    dAppName: sessionProposal.params.proposer.metadata.name,
                  })}
                  imageUri={sessionProposal.params.proposer.metadata.icons[0]}
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

                    {sessionProposal.params.requiredNamespaces[walletConnectConfig.defaultBlockchain].methods.map(
                      (it, index) => (
                        <TextView key={index} color="text.0" fontFamily="medium" fontSize="16px">
                          {it}
                        </TextView>
                      )
                    )}
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
                dAppName: sessionProposal.params.proposer.metadata.name,
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
