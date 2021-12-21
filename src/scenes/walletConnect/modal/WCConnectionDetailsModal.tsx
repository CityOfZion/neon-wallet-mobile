import {RouteProp, useNavigation} from '@react-navigation/native'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import {SessionTypes} from '@walletconnect/types'
import i18n from 'i18n-js'
import moment from 'moment'
import React, {useEffect, useState, useCallback} from 'react'
import {Linking, TouchableWithoutFeedback} from 'react-native'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {getBlockchainLogo} from '~/src/blockchain'
import {
  BlockchainServiceKey,
  getBlockchainByWCChain,
} from '~/src/blockchain/common'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {useWalletConnect} from '~src/contexts/WalletConnectContext'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {IDappInfo} from '~src/scenes/walletConnect/components/WCConnectedDapps'
import {LinearLayout, TextView, ImageView} from '~src/styles/styled-components'

export interface WCConnectionDetailsModalParams {
  dapp: IDappInfo
}

interface Props {
  route: RouteProp<ModalStackParamList, 'WCConnectionDetailsModal'>
}

const WCConnectionDetailsModal = (props: Props) => {
  const controller = useSwiperController(true)
  const walletConnectCtx = useWalletConnect()
  const navigation = useNavigation()
  const [blockchain, setBlockchain] = useState<BlockchainServiceKey>('neo3')
  const {dapp} = props.route.params
  //const approvalDate = walletConnectCtx.getApprovalDate(dapp.session.topic)
  useEffect(() => {
    if (walletConnectCtx.sessions.length > 0) {
      const blockchainByWCChain = getBlockchainByWCChain(
        dapp.session.permissions.blockchain.chains
      )
      blockchainByWCChain && setBlockchain(blockchainByWCChain)
    }
  }, [walletConnectCtx.sessions])

  const handleDisconnect = useCallback(async () => {
    walletConnectCtx.disconnect(dapp.session.topic)
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
      {walletConnectCtx.sessions.length > 0 ? (
        <LinearLayout height={'100%'} justifyContent={'space-between'}>
          <LinearLayout height={'50%'} mt={3}>
            <LinearLayout alignItems={'center'} pb={'38px'}>
              {dapp.connectedAcc.map((it, index) => {
                const accountInfo = dapp.session.state.accounts[index].split(
                  ':'
                )
                return (
                  <LinearLayout orientation={'horiz'} key={index}>
                    <TextView color={'text.10'} fontSize={'12px'}>
                      {it.wallet ? `${it.wallet.name} - ` : ''}
                    </TextView>
                    {it.account ? (
                      <>
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
                      </>
                    ) : (
                      <TextView color={'text.10'} fontSize={'12px'}>
                        {accountInfo[2]}
                      </TextView>
                    )}
                  </LinearLayout>
                )
              })}
              <TextView color={'text.10'} fontSize={'12px'}>
                {dapp.approvalDate
                  ? moment.unix(dapp.approvalDate).format('HH:mm Do MMM YYYY')
                  : ''}
              </TextView>
            </LinearLayout>
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
                  uri: dapp.session.peer.metadata.icons[0],
                }}
                width={'100%'}
                height={'100%'}
              />
            </LinearLayout>

            <TextView
              mb={'26px'}
              fontFamily={'medium'}
              fontSize={'24px'}
              fontWeight={'400'}
              color={'white'}
              textAlign={'center'}
            >
              {dapp.session.peer.metadata.name}
            </TextView>

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
                {dapp.session.permissions.jsonrpc.methods.map((it, index) => (
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
            <TouchableWithoutFeedback onPress={handleDisconnect}>
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
      ) : (
        <LinearLayout />
      )}
    </SwiperPanel>
  )
}

export default WCConnectionDetailsModal
