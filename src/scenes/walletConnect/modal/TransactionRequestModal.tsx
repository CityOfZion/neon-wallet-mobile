import {isJsonRpcRequest, JsonRpcRequest} from '@json-rpc-tools/utils'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {SessionTypes, AppMetadata} from '@walletconnect/types'
import i18n from 'i18n-js'
import React, {useCallback, useEffect, useState} from 'react'
import {TouchableWithoutFeedback, Linking} from 'react-native'
import {useSelector} from 'react-redux'

import ThemedButton from '~/src/components/themed/ThemedButton'
import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {wrapper} from '~src/app/ApplicationWrapper'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {applicationConfig} from '~src/config/ApplicationConfig'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface TransactionRequestModalParams {
  metadata: AppMetadata
  //session: SessionTypes.Settled
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'TransactionRequestModal'>
}

//const SessionItem = (props: {request: JsonRpcRequest<any>}) => {
const SessionItem = () => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <LinearLayout mb={'13px'}>
      <LinearLayout
        bg={theme.colors.background[14]}
        borderTopLeftRadius={6}
        borderTopRightRadius={6}
        orientation={'horiz'}
        justifyContent={'space-between'}
      >
        <TextView
          color={'white'}
          fontFamily={'bold'}
          fontSize={'16px'}
          pl={'18px'}
          pt={'14px'}
          pb={'20px'}
        >
          {'Contract 1'}
        </TextView>
        <ImageView
          alignSelf={'center'}
          resizeMode={'contain'}
          width={7}
          height={12}
          pr={'40px'}
          source={require('~src/assets/images/icon-arrow-right-green.png')}
        />
      </LinearLayout>
      <LinearLayout
        bg={theme.colors.background[1]}
        orientation={'verti'}
        borderBottomLeftRadius={6}
        borderBottomRightRadius={6}
        pt={'13px'}
        pb={'13px'}
      >
        <LinearLayout
          pb={'13px'}
          orientation={'horiz'}
          justifyContent={'space-between'}
        >
          <TextView
            color={theme.colors.text[10]}
            weight={2}
            fontFamily={'bold'}
            fontSize={14}
            pl={'18px'}
          >
            {i18n.t('modals.transactionRequest.hash')}
          </TextView>
          <LinearLayout width={'65%'} orientation={'horiz'} pr={'30px'}>
            <TextView
              color={'primary'}
              ellipsizeMode={'middle'}
              numberOfLines={1}
              fontSize={16}
              pr={'13px'}
            >
              {}
              {'042454707407254752547274476674235723752'}
            </TextView>
            <TouchableWithoutFeedback onPress={() => {}}>
              <ImageView
                alignSelf={'center'}
                resizeMode={'contain'}
                width={14}
                height={13}
                source={require('~src/assets/images/dora-link.png')}
              />
            </TouchableWithoutFeedback>
          </LinearLayout>
        </LinearLayout>
        <LinearLayout
          height={'1px'}
          ml={'16px'}
          mr={'16px'}
          bg={theme.colors.background[10]}
        />
        <LinearLayout
          orientation={'horiz'}
          justifyContent={'space-between'}
          mt={'13px'}
        >
          <TextView
            color={theme.colors.text[10]}
            weight={2}
            fontFamily={'bold'}
            fontSize={14}
            pl={'18px'}
          >
            {i18n.t('modals.transactionRequest.method')}
          </TextView>
          <TextView
            pr={'20px'}
            color={'white'}
            alignSelf={'flex-end'}
            fontSize={16}
          >
            {/*{props.request.method}*/}
            {'Invokefunction'}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

const TransactionRequestModal = (props: Props) => {
  const controller = useSwiperController(true)
  const {sessions, requests, approveRequest, rejectRequest} = useWalletConnect()

  const [feeAmount, setFeeAmount] = useState<number>(0)
  //requestJson
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const params = props.route.params

  interface WCRequestParams {
    scriptHash: string
    operation: string
    args: {type: string; value: number}[]
    signer: {scope: number}
  }

  useEffect(() => {
    //console.log('debug requests and sessions', {requests, sessions})
    //alert(JSON.stringify(requests[0]))
  }, [])

  const handleAcceptRequest = useCallback(async () => {
    await approveRequest(requests[0])
    controller.close()
    props.navigation.goBack()
  }, [requests, controller])

  const handleDeclineRequest = useCallback(async () => {
    await rejectRequest(requests[0])
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
        {
          // walletConnectCtx.requests.map(
          //   (requestEvent) =>
          // isJsonRpcRequest(requestEvent.request) &&
          // requestEvent.topic === params.session.topic &&
          <SessionItem
          // key={requestEvent.request.id}
          // request={requestEvent.request}
          />
          //)
        }
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
