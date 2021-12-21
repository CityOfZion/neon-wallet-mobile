import {isJsonRpcRequest, JsonRpcRequest} from '@json-rpc-tools/utils'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {SessionTypes, AppMetadata} from '@walletconnect/types'
import i18n from 'i18n-js'
import React, {useCallback, useEffect, useState} from 'react'
import {TouchableWithoutFeedback, Linking} from 'react-native'
import {useSelector} from 'react-redux'

import ContractDetailsBox from '../components/ContractDetailsBox'

import ThemedButton from '~/src/components/themed/ThemedButton'
import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {wrapper} from '~src/app/ApplicationWrapper'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface TransactionRequestModalParams {
<<<<<<< Updated upstream
  metadata: AppMetadata
  // session: SessionTypes.Settled
=======
  request: SessionTypes.RequestEvent
  session?: SessionTypes.Settled
>>>>>>> Stashed changes
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'TransactionRequestModal'>
}

interface SessionItemProps {
  request: SessionTypes.RequestEvent
}

export interface WCRequestParams {
  scriptHash: string
  operation: string
  args: {type: string; value: number | string}[]
  signer: {scope: number}
}

const TransactionRequestModal = (props: Props) => {
  const controller = useSwiperController(true)
  const {sessions, requests, approveRequest, rejectRequest} = useWalletConnect()

  const [feeAmount, setFeeAmount] = useState<number>(0)
  //requestJson
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

<<<<<<< Updated upstream
  const session = sessions.find(
    (item) => item.topic === requests[0].topic
  ) as SessionTypes.Settled
=======
  interface WCRequestParams {
    scriptHash: string
    operation: string
    args: {type: string; value: number}[]
    signer: {scope: number}
  }

  useEffect(() => {
    alert(JSON.stringify(props.route.params.request))
  }, [])
>>>>>>> Stashed changes

  const handleAcceptRequest = useCallback(async () => {
    await approveRequest(requests[0])
    controller.close()
    props.navigation.goBack()
  }, [requests, controller])

  const handleDeclineRequest = useCallback(async () => {
    await rejectRequest(props.route.params.request)
    controller.close()
    props.navigation.goBack()
  }, [requests, controller])

  return (
    <SwiperPanel
      controller={controller}
      padding={20}
      fullSize={true}
      title={i18n.t('modals.transactionRequest.title')}
      rightButton={<CloseButton mr={'20px'} />}
      onRightPress={controller.close}
      onClose={props.navigation.goBack}
      solidColorBG
    >
      <LinearLayout orientation="verti" mr={2} ml={2} mt={5} mb={5}>
        <ImageView
          //source={params.metadata.icons[0]}
          source={require('~src/assets/ic_launcher.png')}
          resizeMode={'contain'}
          alignSelf={'center'}
          width={77}
          height={75}
        />
        <TextView
          pt={'13px'}
          color="white"
          fontSize={18}
          alignSelf={'center'}
          pb={'19px'}
        >
          params.metadata.name
        </TextView>
        <ContractDetailsBox
          session={session}
          rightButton={
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.navigate(wrapper.route.Modal.name, {
                  screen: wrapper.route.WCInvocationDetailsModal.name,
                  params: {
                    request: requests[0],
                    session,
                  },
                })
              }
            >
              <ImageView
                alignSelf={'center'}
                resizeMode={'contain'}
                width={7}
                height={12}
                pr={'40px'}
                source={require('~src/assets/images/icon-arrow-right-green.png')}
              />
            </TouchableWithoutFeedback>
          }
          hash="042454707407254752547274476674235723752"
          method="Invokefunction"
          title="Contract 1"
        />
        <TouchableWithoutFeedback onPress={() => {}}>
          <LinearLayout
            bg={theme.colors.background[1]}
            orientation={'horiz'}
            borderRadius={6}
            mb={'13px'}
            pt={'13px'}
            pb={'13px'}
            justifyContent={'space-between'}
          >
            <TextView
              color={theme.colors.text[10]}
              weight={2}
              fontFamily={'bold'}
              fontSize={14}
              pl={'18px'}
            >
              {i18n.t('modals.transactionRequest.signatureScope')}
            </TextView>
            <LinearLayout orientation={'horiz'}>
              <ImageView
                alignSelf={'center'}
                resizeMode={'contain'}
                width={7}
                height={12}
                pr={'20px'}
                source={require('~src/assets/images/red-alert.png')}
              />
              <TextView
                color={'#ea5d8e'}
                alignSelf={'flex-end'}
                pb={'3px'}
                fontSize={12}
                fontFamily={'bold'}
              >
                {'GLOBAL'}
              </TextView>
              <ImageView
                alignSelf={'center'}
                resizeMode={'contain'}
                width={7}
                height={12}
                pr={'35px'}
                source={require('~src/assets/images/icon-arrow-right-green.png')}
              />
            </LinearLayout>
          </LinearLayout>
        </TouchableWithoutFeedback>
        <LinearLayout
          bg={theme.colors.background[1]}
          orientation={'horiz'}
          borderRadius={6}
          mb={'13px'}
          pt={'13px'}
          pb={'13px'}
          justifyContent={'space-between'}
        >
          <TextView
            color={theme.colors.text[10]}
            weight={2}
            fontFamily={'bold'}
            fontSize={14}
            pl={'18px'}
          >
            {i18n.t('modals.transactionRequest.transactionFee')}
          </TextView>
          <LinearLayout orientation={'horiz'}>
            <TextView
              //pr={'20px'}
              color={'primary'}
              alignSelf={'flex-end'}
              pb={'3px'}
              fontSize={'16px'}
              fontFamily={'bold'}
              pr={'20px'}
            >
              {i18n.t('modals.transactionRequest.xGas', {
                amount: '20',
              })}
            </TextView>
          </LinearLayout>
        </LinearLayout>
        <TouchableWithoutFeedback
          onPress={() => {
            // TODO: When you receive the proper information, remove the mock => [0]
            props.navigation.navigate(wrapper.route.RawJsonModal.name, {
              dataJson: JSON.stringify(requests[0], null, 2),
              metadata: props.route.params.metadata,
            })
          }}
        >
          <LinearLayout
            bg={theme.colors.background[1]}
            orientation={'horiz'}
            borderRadius={6}
            mb={'13px'}
            pt={'13px'}
            pb={'13px'}
            justifyContent={'space-between'}
          >
            <TextView
              color={theme.colors.text[10]}
              weight={2}
              fontFamily={'bold'}
              fontSize={14}
              pl={'18px'}
            >
              {i18n.t('modals.transactionRequest.json')}
            </TextView>
            <LinearLayout orientation={'horiz'}>
              <ImageView
                alignSelf={'center'}
                resizeMode={'contain'}
                width={7}
                height={12}
                pr={'35px'}
                source={require('~src/assets/images/icon-arrow-right-green.png')}
              />
            </LinearLayout>
          </LinearLayout>
        </TouchableWithoutFeedback>
        <TextView
          mt={'31px'}
          mr={'20px'}
          ml={'20px'}
          mb={'31px'}
          color={'white'}
          fontSize={'18px'}
          alignself={'center'}
          textAlign={'center'}
        >
          {i18n.t('modals.transactionRequest.confirmToProceed')}
        </TextView>
        <ThemedButton
          label={i18n.t('modals.transactionRequest.buttom.accept')}
          onPress={handleAcceptRequest}
        />
        <LinearLayout mt={'24px'}>
          <TouchableWithoutFeedback onPress={handleDeclineRequest}>
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
                {i18n.t('modals.transactionRequest.buttom.decline')}
              </TextView>
            </LinearLayout>
          </TouchableWithoutFeedback>
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default TransactionRequestModal
