import {RouteProp, useNavigation} from '@react-navigation/native'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useEffect, useState, useCallback} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {showMessage} from 'react-native-flash-message'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {getBlockchainLogo} from '~/src/blockchain'
import {BlockchainServiceKey, isValidWcChain} from '~/src/blockchain/common'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {useHandleOfflineFunctions} from '~/src/hooks'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import ConnectionHeader from '~src/scenes/walletConnect/components/ConnectionHeader'
import {LinearLayout, TextView, ImageView} from '~src/styles/styled-components'

export interface WCConnectionRequestModalParams {
  uri: string
}

interface Props {
  route: RouteProp<ModalStackParamList, 'WCConnectionRequestModal'>
}

const WCConnectionRequestModal = (props: Props) => {
  const controller = useSwiperController(true)
  const walletConnectCtx = useWalletConnect()
  const navigation = useNavigation()
  const [blockchain, setBlockchain] = useState<BlockchainServiceKey>('neo3')
  const [sessionIsValid, setSessionIsValid] = useState<boolean>()
  const {handleAsyncOnlyOnline, handleOnlyOnline} = useHandleOfflineFunctions()
  const {uri} = props.route.params
  const activityName = 'loadWCConnection'

  const handleAccept = useCallback(async () => {
    if (walletConnectCtx.sessionProposals.length > 0) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.WCWalletSelectionModal.name,
      })
    }
  }, [walletConnectCtx.sessionProposals])

  const runOnURI = useCallback(async () => {
    try {
      console.log('debug runOnURI => ', uri)
      await walletConnectCtx.onURI(uri)
    } catch (error: any) {
      console.log('error onUri => ', error)
      controller.close()

      showMessage({
        message: error.message,
        type: 'danger',
        duration: 3000,
      })

      navigation.goBack()
    }
  }, [uri])

  const validateSessionProposal = useCallback(() => {
    if (walletConnectCtx.sessionProposals.length > 0) {
      const session = walletConnectCtx.sessionProposals[0]
      const isValid = isValidWcChain(
        session.permissions.blockchain.chains,
        blockchain
      )
      setSessionIsValid(isValid)
    }
  }, [walletConnectCtx.sessionProposals, blockchain])

  const handleAcceptSessionProposal = useCallback(() => {
    if (walletConnectCtx.sessionProposals.length < 1) {
      Await.run<void>(
        activityName,
        async () => {
          return handleOnlyOnline(runOnURI)
        },
        5000
      )
    }
  }, [walletConnectCtx.sessionProposals])

  useEffect(() => {
    handleAcceptSessionProposal()
    return () => {
      walletConnectCtx.setSessionProposals([]) //will guarantee that there will be only one sessionProposal at a time
    }
  }, [])

  useEffect(() => {
    validateSessionProposal()
  }, [walletConnectCtx.sessionProposals])

  useEffect(() => {
    if (
      walletConnectCtx.sessionProposals.length > 0 &&
      sessionIsValid === false
    ) {
      showMessage({
        message: i18n.t('walletconnect.invalidSession'),
        type: 'danger',
        duration: 3000,
      })
    }
  }, [sessionIsValid, walletConnectCtx.sessionProposals])

  return (
    <SwiperPanel
      padding={20}
      fullSize={true}
      controller={controller}
      rightButton={<CloseButton mr={'20px'} />}
      title={i18n.t('modals.transactionSent.title')}
      onClose={() => {
        navigation.goBack()
      }}
      onRightPress={controller.close}
      solidColorBG={true}
    >
      <AwaitActivity
        name={activityName}
        loadingView={<ScreenLoader transparent={true} />}
      >
        {walletConnectCtx.sessionProposals.length > 0 ? (
          <LinearLayout height={'100%'} justifyContent={'space-between'}>
            <LinearLayout height={'50%'} mt={3}>
              <ConnectionHeader
                title={i18n.t('modals.WCConnectionRequest.subtitle_1', {
                  dAppName:
                    walletConnectCtx.sessionProposals[0].proposer.metadata.name,
                })}
                imageUri={
                  walletConnectCtx.sessionProposals[0].proposer.metadata
                    .icons[0]
                }
              />

              <LinearLayout
                width={'100%'}
                backgroundColor={'#282f35'}
                orientation={'horiz'}
                padding={3}
                borderRadius={'7px'}
              >
                <LinearLayout width={'50%'} ml={3}>
                  <TextView
                    fontFamily={'bold'}
                    color={'#7b9098'}
                    fontSize={'14px'}
                    fontWeight={'700'}
                  >
                    {i18n.t('modals.WCConnectionRequest.chain')}
                  </TextView>
                  <LinearLayout orientation={'horiz'} mt={3}>
                    <ImageView
                      source={getBlockchainLogo(blockchain)}
                      resizeMode="contain"
                      width={'20px'}
                      height={'20px'}
                      mr={1}
                    />
                    <TextView
                      fontFamily={'medium'}
                      color={'#fff'}
                      fontSize={'16px'}
                    >
                      {i18n.t(`blockchainServices.${blockchain}.id`)}
                    </TextView>
                  </LinearLayout>
                </LinearLayout>
                <LinearLayout>
                  <TextView
                    fontFamily={'bold'}
                    color={'#7b9098'}
                    fontSize={'14px'}
                    fontWeight={'700'}
                  >
                    {i18n.t('modals.WCConnectionRequest.features')}
                  </TextView>
                  {walletConnectCtx.sessionProposals[0].permissions.jsonrpc.methods.map(
                    (it, index) => (
                      <TextView
                        key={index}
                        color={'#fff'}
                        fontFamily={'medium'}
                        fontSize={'16px'}
                      >
                        {it}
                      </TextView>
                    )
                  )}
                </LinearLayout>
              </LinearLayout>
            </LinearLayout>
            <LinearLayout height={'35%'} justifyContent={'space-between'}>
              <TextView color={'#fff'} fontSize={'18px'} textAlign={'center'}>
                {i18n.t('modals.WCConnectionRequest.subtitle')}
              </TextView>
              <LinearLayout>
                <ThemedButton
                  disabled={!sessionIsValid}
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
                      <TextView
                        style={{includeFontPadding: false}}
                        ml={3}
                        color={'primary'}
                        fontSize={20}
                      >
                        {i18n.t('modals.WCConnectionRequest.declineLabel')}
                      </TextView>
                    </LinearLayout>
                  </TouchableWithoutFeedback>
                </LinearLayout>
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        ) : (
          <LinearLayout />
        )}
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default WCConnectionRequestModal
