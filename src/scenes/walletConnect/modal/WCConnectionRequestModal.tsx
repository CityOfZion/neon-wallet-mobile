import {RouteProp, useNavigation} from '@react-navigation/native'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import {SessionTypes} from '@walletconnect/types'
import i18n from 'i18n-js'
import React, {useEffect, useState, useCallback} from 'react'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {getBlockchainLogo} from '~/src/blockchain'
import {
  BlockchainServiceKey,
  getBlockchainByWCChain,
} from '~/src/blockchain/common'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
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
  const [hasError, setError] = useState(false)
  const [blockchain, setBlockchain] = useState<BlockchainServiceKey>('neo3')
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
      await walletConnectCtx.onURI(uri)
    } catch (error) {
      console.log('error onUri => ', error)
      setError(true)
    }
  }, [uri])

  const loadWCConnection = useCallback(async () => {
    try {
      await runOnURI()
    } catch (error) {
      setError(true)
      Await.done(activityName)
    }
  }, [runOnURI])

  useEffect(() => {
    if (walletConnectCtx.sessionProposals.length < 1) {
      Await.run(activityName, loadWCConnection, 8000)
    }
    return () => {
      walletConnectCtx.setSessionProposals([])
    }
  }, [])

  useEffect(() => {
    if (walletConnectCtx.sessionProposals.length > 0) {
      const blockchainByWCChain = getBlockchainByWCChain(
        walletConnectCtx.sessionProposals[0].permissions.blockchain.chains
      )
      blockchainByWCChain && setBlockchain(blockchainByWCChain)
    }
  }, [walletConnectCtx.sessionProposals])

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
              <LinearLayout
                borderRadius={'4px'}
                padding={5}
                width={'77px'}
                height={'75px'}
                backgroundColor={'#1c2228'}
                alignSelf={'center'}
                mb={'20px'}
              >
                <ImageView
                  resizeMode="contain"
                  source={{
                    uri:
                      walletConnectCtx.sessionProposals[0].proposer.metadata
                        .icons[0],
                  }}
                  width={'100%'}
                  height={'100%'}
                />
              </LinearLayout>

              <TextView
                mb={'40px'}
                fontFamily={'regular'}
                fontSize={'18px'}
                fontWeight={'400'}
                color={'#fff'}
                textAlign={'center'}
              >
                {`${walletConnectCtx.sessionProposals[0].proposer.metadata.name} wants to connect to your wallet`}
              </TextView>

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
            <LinearLayout height={'30%'} justifyContent={'space-between'}>
              <TextView color={'#fff'} fontSize={'18px'} textAlign={'center'}>
                {i18n.t('modals.WCConnectionRequest.subtitle')}
              </TextView>
              <ThemedButton label={'Accept'} onPress={handleAccept} />
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
