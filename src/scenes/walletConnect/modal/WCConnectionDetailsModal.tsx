import {RouteProp, useNavigation} from '@react-navigation/native'
import {SessionTypes} from '@walletconnect/types'
import i18n from 'i18n-js'
import moment from 'moment'
import React, {useEffect, useState, useCallback, useMemo} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {getBlockchainLogo} from '~/src/blockchain'
import {
  BlockchainServiceKey,
  getBlockchainByWCChain,
} from '~/src/blockchain/common'
import {ConnectedAccountAndWallet} from '~/src/components/ConnectionItem'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import ConnectionHeader from '~src/scenes/walletConnect/components/ConnectionHeader'
import {LinearLayout, TextView, ImageView} from '~src/styles/styled-components'

export interface WCConnectionDetailsModalParams {
  session: SessionTypes.Settled
  connectedAccountsAndWallets: ConnectedAccountAndWallet[]
}

interface Props {
  route: RouteProp<ModalStackParamList, 'WCConnectionDetailsModal'>
}

const WCConnectionDetailsModal = (props: Props) => {
  const {session, connectedAccountsAndWallets} = props.route.params
  const approvalDate = useSelector((state: RootState) =>
    state.wcReducer.approvalDates?.find(
      (approvalDate) => approvalDate.sessionTopic === session.topic
    )
  )
  const controller = useSwiperController(true)
  const walletConnectCtx = useWalletConnect()
  const navigation = useNavigation()
  const {isConnected} = useSelector((state: RootState) => state.network)

  const blockchain = useMemo<BlockchainServiceKey>(() => {
    const blockchainByWCChain = getBlockchainByWCChain(
      session.permissions.blockchain.chains
    )

    if (blockchainByWCChain) return blockchainByWCChain

    return 'neo3'
  }, [session])

  const handleDisconnect = useCallback(async () => {
    await walletConnectCtx.disconnect(session.topic)
    controller.close()
  }, [walletConnectCtx.sessions])

  return (
    <SwiperPanel
      padding={20}
      fullSize={true}
      controller={controller}
      rightButton={<CloseButton mr={'20px'} />}
      title={i18n.t('modals.WCConnectionDetails.title')}
      onClose={() => {
        navigation.goBack()
      }}
      onRightPress={controller.close}
      solidColorBG={true}
    >
      <LinearLayout height={'100%'} justifyContent={'space-between'}>
        <LinearLayout height={'50%'} mt={3}>
          <LinearLayout alignItems={'center'} pb={'38px'}>
            {connectedAccountsAndWallets.map((it, index) => (
              <LinearLayout orientation={'horiz'} key={index}>
                <TextView color={'text.10'} fontSize={'12px'}>
                  {`${it.wallet.name} - `}
                </TextView>

                <LinearLayout
                  width="7px"
                  height="7px"
                  mr="3px"
                  mt="6px"
                  bg={it.account.backgroundColor}
                  borderRadius={9999}
                />
                <TextView color={'text.10'} fontSize={'12px'}>
                  {it.account?.name ?? ''}
                </TextView>
              </LinearLayout>
            ))}

            {approvalDate && (
              <TextView color={'text.10'} fontSize={'12px'}>
                {moment
                  .unix(approvalDate.approvalDate)
                  .format('HH:mm Do MMM YYYY')}
              </TextView>
            )}
          </LinearLayout>
          <ConnectionHeader
            title={session.peer.metadata.name}
            imageUri={session.peer.metadata.icons[0]}
          />

          <LinearLayout
            width={'100%'}
            backgroundColor={'background.15'}
            orientation={'horiz'}
            padding={3}
            borderRadius={'7px'}
          >
            <LinearLayout width={'50%'} ml={3}>
              <TextView
                fontFamily={'bold'}
                color={'text.10'}
                fontSize={'14px'}
                fontWeight={'700'}
              >
                {i18n.t('modals.WCConnectionDetails.chain')}
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
                color={'text.10'}
                fontSize={'14px'}
                fontWeight={'700'}
              >
                {i18n.t('modals.WCConnectionDetails.features')}
              </TextView>
              {session.permissions.jsonrpc.methods.map((it, index) => (
                <TextView
                  key={index}
                  color={'#fff'}
                  fontFamily={'medium'}
                  fontSize={'16px'}
                >
                  {it}
                </TextView>
              ))}
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
        <LinearLayout height={'30%'} justifyContent={'flex-end'} mb={'12px'}>
          <TouchableWithoutFeedback
            onPress={handleDisconnect}
            disabled={!isConnected}
          >
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
                {i18n.t('modals.WCConnectionDetails.disconnect')}
              </TextView>
            </LinearLayout>
          </TouchableWithoutFeedback>
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default WCConnectionDetailsModal
