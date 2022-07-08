import { RouteProp, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AwaitActivity, Await } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useEffect, useCallback, useRef, useMemo } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { getBlockchainLogo } from '~/src/blockchain'
import { BlockchainServiceKey, isValidWcChain } from '~/src/blockchain/common'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import { useTreatNetworkOnWalletConnectFlow } from '~/src/hooks/useTreatNetworkOnWalletConnectFlow'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { RootState } from '~/src/store/RootStore'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import { useWalletConnect } from '~src/contexts/WalletConnectContext'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import ConnectionHeader from '~src/scenes/walletConnect/components/ConnectionHeader'
import { LinearLayout, TextView, ImageView } from '~src/styles/styled-components'

export interface WCConnectionRequestModalParams {
  uri: string
}

interface Props {
  route: RouteProp<ModalStackParamList, 'WCConnectionRequestModal'>
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
}

const WCConnectionRequestModal = (props: Props) => {
  useTreatNetworkOnWalletConnectFlow()
  const controller = useSwiperController(true)
  const walletConnectCtx = useWalletConnect()
  const navigation = useNavigation()
  const isConnected = useSelector((state: RootState) => state.network.isConnected)

  const blockchain = useRef<BlockchainServiceKey>('neo3')

  const sessionProposal = useMemo(() => {
    if (walletConnectCtx.sessionProposals.length > 0) {
      return walletConnectCtx.sessionProposals[0]
    }
  }, [walletConnectCtx.sessionProposals])
  const sessionProposalIsValid = useMemo(() => {
    if (sessionProposal) {
      const isValid = isValidWcChain(sessionProposal.permissions.blockchain.chains, blockchain.current)

      return isValid
    }
  }, [sessionProposal])

  const { uri } = props.route.params

  const handleAccept = useCallback(async () => {
    if (walletConnectCtx.sessionProposals.length > 0) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WCWalletSelectionModal.name,
      })
    }
  }, [walletConnectCtx.sessionProposals])

  const runOnURI = useCallback(async () => {
    try {
      await walletConnectCtx.onURI(uri)
    } catch (error: any) {
      showMessage({
        message: error.message,
        type: 'danger',
        duration: 3000,
      })

      controller.close()
      navigation.goBack()
    }
  }, [uri])

  useEffect(() => {
    Await.run('loadWCConnection', runOnURI)
  }, [])

  useEffect(() => {
    if (sessionProposalIsValid === false) {
      showMessage({
        message: i18n.t('walletconnect.invalidSession'),
        type: 'danger',
        duration: 3000,
      })
    }
  }, [sessionProposalIsValid])

  return (
    <SwiperPanel
      padding={20}
      fullSize
      controller={controller}
      rightButton={<CloseButton mr="20px" />}
      title={i18n.t('modals.transactionSent.title')}
      onClose={() => {
        navigation.goBack()
      }}
      onRightPress={controller.close}
      solidColorBG
    >
      <AwaitActivity name="loadWCConnection" loadingView={<ScreenLoader transparent />}>
        {sessionProposal && (
          <LinearLayout height="100%" justifyContent="space-between">
            <LinearLayout height="50%" mt={3}>
              <ConnectionHeader
                title={i18n.t('modals.WCConnectionRequest.subtitle_1', {
                  dAppName: sessionProposal.proposer.metadata.name,
                })}
                imageUri={sessionProposal.proposer.metadata.icons[0]}
              />

              <LinearLayout width="100%" backgroundColor="#282f35" orientation="horiz" padding={3} borderRadius="7px">
                <LinearLayout width="50%" ml={3}>
                  <TextView fontFamily="bold" color="#7b9098" fontSize="14px" fontWeight="700">
                    {i18n.t('modals.WCConnectionRequest.chain')}
                  </TextView>
                  <LinearLayout orientation="horiz" mt={3}>
                    <ImageView
                      source={getBlockchainLogo(blockchain.current)}
                      resizeMode="contain"
                      width="20px"
                      height="20px"
                      mr={1}
                    />
                    <TextView fontFamily="medium" color="#fff" fontSize="16px">
                      {i18n.t(`blockchainServices.${blockchain.current}.id`)}
                    </TextView>
                  </LinearLayout>
                </LinearLayout>
                <LinearLayout>
                  <TextView fontFamily="bold" color="#7b9098" fontSize="14px" fontWeight="700">
                    {i18n.t('modals.WCConnectionRequest.features')}
                  </TextView>

                  {sessionProposal.permissions.jsonrpc.methods.map((it, index) => (
                    <TextView key={index} color="#fff" fontFamily="medium" fontSize="16px">
                      {it}
                    </TextView>
                  ))}
                </LinearLayout>
              </LinearLayout>
            </LinearLayout>
            <LinearLayout height="35%" justifyContent="space-between">
              <TextView color="#fff" fontSize="18px" textAlign="center">
                {i18n.t('modals.WCConnectionRequest.subtitle')}
              </TextView>
              <LinearLayout>
                <ThemedButton
                  disabled={!sessionProposalIsValid || !isConnected}
                  label={i18n.t('modals.WCConnectionRequest.acceptLabel')}
                  onPress={handleAccept}
                />
                <LinearLayout mt={5}>
                  <TouchableWithoutFeedback onPress={controller.close}>
                    <LinearLayout
                      width="100%"
                      borderRadius="4px"
                      borderWidth="1px"
                      borderColor="primary"
                      justifyContent="center"
                      alignItems="center"
                      orientation="horiz"
                      p="10px"
                    >
                      <TextView style={{ includeFontPadding: false }} ml={3} color="primary" fontSize={20}>
                        {i18n.t('modals.WCConnectionRequest.declineLabel')}
                      </TextView>
                    </LinearLayout>
                  </TouchableWithoutFeedback>
                </LinearLayout>
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        )}
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default WCConnectionRequestModal
