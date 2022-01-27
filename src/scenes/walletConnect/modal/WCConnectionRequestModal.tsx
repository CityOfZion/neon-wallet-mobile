import {RouteProp, useNavigation} from '@react-navigation/native'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useEffect, useState, useCallback} from 'react'
import {showMessage} from 'react-native-flash-message'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {getBlockchainLogo} from '~/src/blockchain'
import {BlockchainServiceKey} from '~/src/blockchain/common'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import ConnectionHeader from '~src/scenes/walletConnect/components/ConnectionHeader'
import {LinearLayout, TextView, ImageView} from '~src/styles/styled-components'
import {TouchableWithoutFeedback} from 'react-native'

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
  const {uri} = props.route.params
  const activityName = 'loadWCConnection'

  const handleAccept = useCallback(async () => {
    console.log('debug handleAccept =>', {
      sizeSessionProposals: walletConnectCtx.sessionProposals.length,
    })
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

      showMessage({
        message: error.message,
        type: 'danger',
      })

      navigation.goBack()
    }
  }, [uri])

  useEffect(() => {
    if (walletConnectCtx.sessionProposals.length < 1) {
      Await.run(activityName, runOnURI, 5000)
    }
    return () => {
      walletConnectCtx.setSessionProposals([]) //will guarantee that there will be only one sessionProposal at a time
    }
  }, [])

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
      <AwaitActivity name={activityName} loadingView={<ScreenLoader />}>
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
