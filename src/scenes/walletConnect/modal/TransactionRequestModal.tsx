import {WitnessScope} from '@cityofzion/neon-core-next/lib/tx/components/WitnessScope'
import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import {SessionTypes, AppMetadata} from '@walletconnect/types'
import i18n from 'i18n-js'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {TouchableWithoutFeedback, Linking} from 'react-native'
import {showMessage} from 'react-native-flash-message'
import {useSelector, useDispatch} from 'react-redux'

import ConnectionHeader from '../components/ConnectionHeader'
import ContractDetailsBox from '../components/ContractDetailsBox'
import {checkSupportedMethods} from '../utils'
import {SignMessageFailed} from './fragment/SignMessageFailed'
import {SignMessageSuccess} from './fragment/SignMessageSuccess'
import TransactionFailed from './fragment/TransactionFailed'
import TransactionSuccess from './fragment/TransactionSuccess'
import {VerifyMessageFailed} from './fragment/VerifyMessageFailed'
import {VerifyMessageSuccess} from './fragment/VerifyMessageSuccess'

import {blockchainServices, hasWCIntegration} from '~/src/blockchain'
import ThemedButton from '~/src/components/themed/ThemedButton'
import {useWalletConnect} from '~/src/contexts/WalletConnectContext'
import {Account} from '~/src/models/redux/Account'
import {RootStore} from '~/src/store/RootStore'
import {wrapper} from '~src/app/ApplicationWrapper'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {
  ContractInvocationMulti,
  SignedMessage,
} from '~src/helpers/NeonWcAdapter'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface TransactionRequestModalParams {
  request: SessionTypes.RequestEvent
  session: SessionTypes.Settled
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'TransactionRequestModal'>
}

export interface ResponseModalProps {
  errorMessage?: string
  transactionHash?: string
  onClose?: () => void
}

const RequestWhenSignMessage = ({request}: TransactionRequestModalParams) => {
  const requestParams = request.request.params as string
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  return (
    <LinearLayout orientation={'verti'} alignItems={'center'}>
      <TextView
        color={theme.colors.text[6]}
        fontSize={14}
        fontWeight={500}
        fontFamily="medium"
        textAlign={'center'}
        mb={4}
        borderRadius={5}
      >
        {i18n.t('modals.signMessage.labelMessage').toUpperCase()}
      </TextView>
      <TextView
        color={theme.colors.text[0]}
        fontSize={16}
        fontWeight={300}
        lineHeight="20px"
        fontFamily="light"
        width={'90%'}
        minHeight={'73px'}
        bg={theme.colors.background[7]}
        px={5}
        py={2}
        mb={'auto'}
        borderRadius={5}
      >
        {requestParams}
      </TextView>
    </LinearLayout>
  )
}

const RequestWhenVerifyMessage = ({
  request,
  session,
}: TransactionRequestModalParams) => {
  return <LinearLayout />
}

const RequestWhenInvokeFunction = ({
  request,
  session,
}: TransactionRequestModalParams) => {
  const [accountRequest, setAccountRequest] = useState<Account>()
  const [feeRequest, setFeeRequest] = useState<number>()

  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const requestParams = request.request.params as ContractInvocationMulti
  const navigation = useNavigation<StackNavigationProp<ParamList>>()
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const scopes = requestParams.signers.map((signer) => signer.scopes) ?? [
    WitnessScope.CalledByEntry,
  ]
  const showWarning = scopes.some(
    (scope) =>
      scope !== WitnessScope.None && scope !== WitnessScope.CalledByEntry
  )

  useEffect(() => {
    requestParams.invocations.forEach((invocation) => {
      const args = invocation.args as ArgsRequest[]
      if (args.length > 0) {
        const acc = accountsPool.find(
          (account) => account.address === args[0].value
        )
        if (acc) {
          setAccountRequest(acc)
        }
      }
    })
  }, [request, accountsPool])

  useEffect(() => {
    if (accountRequest) {
      handleCalculateFee()
    }
  }, [accountRequest])

  type TypeArgsRequest = 'Address' | 'Integer' | 'Array'
  interface ArgsRequest {
    type?: TypeArgsRequest
    value?: string
  }
  const handleCalculateFee = useCallback(async () => {
    if (accountRequest?.address) {
      const bs = blockchainServices[accountRequest.blockchain]
      if (hasWCIntegration(bs)) {
        const resultFee = await bs.calculateFee(
          accountRequest.address,
          request.request
        )

        setFeeRequest(Number(resultFee))
      }
    }
  }, [accountRequest])

  return (
    <>
      {requestParams.invocations.map((contract, index) => (
        <ContractDetailsBox
          key={`${contract.operation}-${index}`}
          session={session}
          contract={contract}
          rightButton={
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate(wrapper.route.Modal.name, {
                  screen: wrapper.route.WCInvocationDetailsModal.name,
                  params: {
                    session,
                    contract,
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
        />
      ))}
      {requestParams.signers.map((signer, index) => (
        <TouchableWithoutFeedback
          key={`${signer.scopes}-${index}`}
          onPress={() => {
            navigation.navigate(wrapper.route.SignatureScopeModal.name, {
              data: signer,
              session,
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
              {i18n.t('modals.transactionRequest.signatureScope')}
            </TextView>
            <LinearLayout orientation={'horiz'}>
              {showWarning && (
                <ImageView
                  alignSelf={'center'}
                  resizeMode={'contain'}
                  width={7}
                  height={12}
                  pr={'20px'}
                  source={require('~src/assets/images/red-alert.png')}
                />
              )}
              <TextView
                color={showWarning ? '#ea5d8e' : 'white'}
                alignSelf={'flex-end'}
                pb={'3px'}
                fontSize={12}
                fontFamily={'bold'}
              >
                {i18n.t(`modals.signatureScope.${signer.scopes}.scope`)}
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
      ))}
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
            color={'primary'}
            alignSelf={'flex-end'}
            pb={'3px'}
            fontSize={'16px'}
            fontFamily={'bold'}
            pr={'20px'}
          >
            {i18n.t('modals.transactionRequest.xGas', {
              amount: feeRequest ? (feeRequest / 8).toFixed(8) : '',
            })}
          </TextView>
        </LinearLayout>
      </LinearLayout>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(wrapper.route.RawJsonModal.name, {
            dataJson: JSON.stringify(request, null, 2),
            metadata: session.peer.metadata,
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
    </>
  )
}

const TransactionRequestModal = (props: Props) => {
  const {request, session} = props.route.params
  const controller = useSwiperController(true)
  const {accounts} = useSelector((state: RootState) => state.app)
  const {requests, approveRequest, rejectRequest} = useWalletConnect()

  if (!checkSupportedMethods(request.request.method)) {
    showMessage({
      message: i18n.t('contexts.walletConnect.unsupportedMethod', {
        method: request.request.method,
      }),
    })
    return <></>
  }

  const requestParams = request.request.params

  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const [feeRequest, setFeeRequest] = useState<number>()
  const [showModalSuccess, setshowModalSuccess] = useState<boolean>(false)
  const [showModalFailed, setShowModalFailed] = useState<boolean>(false)
  const [messageAfterAccept, setMessageAfterAccept] = useState<string>()
  const [isAcceptetdRequest, setIsAcceptedRequest] = useState<boolean>(false)
  const [buttonsIsDisabled, setButtonsIsDisabled] = useState<boolean>(false)
  const shouldProcessButtons = useRef<boolean>(true)

  const handleAddPendingTransaction = useCallback(
    async (txid: string, accountRequest?: Account) => {
      if (accountRequest?.address) {
        const accountFound = accounts.find(
          (it) => it.address === accountRequest.address
        )
        if (accountFound) {
          await accountFound.addPendingWCTransaction(
            txid,
            requestParams.invocations.length
          )
          await dispatchAsync(
            RootStore.app.actions.updateAndSaveAccount(accountFound)
          )
        }
      }
    },
    [accounts]
  )

  //requestJson
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  type TypeArgsRequest = 'Address' | 'Integer' | 'Array'
  interface ArgsRequest {
    type?: TypeArgsRequest
    value?: string
  }

  const handleAcceptRequestWhenInvokeFunction = useCallback(async () => {
    if (shouldProcessButtons.current) {
      shouldProcessButtons.current = false
      setButtonsIsDisabled(true)

      try {
        const response = await approveRequest(request)
        const requestParam = request.request.params as ContractInvocationMulti
        const accountRequest = requestParam.invocations.reduce(
          (_, invocation) => {
            const args = invocation.args as ArgsRequest[]
            if (args.length > 0) {
              const acc = accountsPool.find(
                (account) => account.address === args[0].value
              )
              if (acc) {
                return acc
              }
            }
            return undefined
          },
          undefined as Account | undefined
        )
        if (response && 'result' in response) {
          const {result} = response
          await handleAddPendingTransaction(result, accountRequest)
          setMessageAfterAccept(result as string)
          setshowModalSuccess(true)
          setIsAcceptedRequest(true)
        }
      } catch (error: any) {
        setShowModalFailed(true)
        setMessageAfterAccept(error.message as string)
        console.log('debug error handle accept ', error)
      }

      shouldProcessButtons.current = true
      setButtonsIsDisabled(false)
    }
  }, [requests, controller, request])

  const handleDeclineRequestWhenInvokeFunction = useCallback(async () => {
    if (!isAcceptetdRequest) {
      await rejectRequest(props.route.params.request)
    }
    controller.close()
  }, [requests, controller, isAcceptetdRequest])

  /**
   * The key need be the method name that wallet coonect is using
   */
  const listComponentByMethod: {
    [key: string]: {
      component: (props: TransactionRequestModalParams) => JSX.Element
      accept: () => Promise<void>
      reject: () => Promise<void>
      text: {
        button: {
          accept: string
          reject: string
        }
        title: string
      }
      hideDappName?: boolean
      responseModal: {
        success: (props: ResponseModalProps) => JSX.Element
        failed: (props: ResponseModalProps) => JSX.Element
      }
    }
  } = {
    invokeFunction: {
      component: RequestWhenInvokeFunction,
      accept: handleAcceptRequestWhenInvokeFunction,
      reject: handleDeclineRequestWhenInvokeFunction,
      text: {
        button: {
          accept: i18n.t('modals.transactionRequest.buttom.accept'),
          reject: i18n.t('modals.transactionRequest.buttom.decline'),
        },
        title: i18n.t('modals.transactionRequest.confirmToProceed'),
      },
      responseModal: {
        success: TransactionSuccess,
        failed: TransactionFailed,
      },
    },
    verifyMessage: {
      component: RequestWhenVerifyMessage,
      accept: async () => {
        setButtonsIsDisabled(true)
        try {
          const response = await approveRequest(request)
          if (response && 'result' in response) {
            setshowModalSuccess(true)
          }
        } catch (error: any) {
          setShowModalFailed(true)
          setMessageAfterAccept(error.message as string)
        } finally {
          setButtonsIsDisabled(false)
        }
      },
      reject: async () => {
        setButtonsIsDisabled(true)
        try {
          if (!isAcceptetdRequest) {
            await rejectRequest(props.route.params.request)
          }
          controller.close()
        } catch (error: any) {
          setShowModalFailed(true)
          setMessageAfterAccept(error.message as string)
        } finally {
          setButtonsIsDisabled(false)
        }
      },
      text: {
        button: {
          accept: i18n.t('modals.verifyMessage.button.accept'),
          reject: i18n.t('modals.transactionRequest.buttom.decline'),
        },
        title: i18n.t('modals.verifyMessage.title', {
          dAppName: session.peer.metadata.name,
        }),
      },
      hideDappName: true,
      responseModal: {
        success: VerifyMessageSuccess,
        failed: VerifyMessageFailed,
      },
    },
    signMessage: {
      component: RequestWhenSignMessage,
      accept: async () => {
        setButtonsIsDisabled(true)
        try {
          const response = await approveRequest(request)
          if (response && 'result' in response) {
            setshowModalSuccess(true)
          }
        } catch (error: any) {
          setShowModalFailed(true)
          setMessageAfterAccept(error.message as string)
        } finally {
          setButtonsIsDisabled(false)
        }
      },
      reject: async () => {
        setButtonsIsDisabled(true)
        try {
          if (!isAcceptetdRequest) {
            await rejectRequest(props.route.params.request)
          }
          controller.close()
        } catch (error: any) {
          setShowModalFailed(true)
          setMessageAfterAccept(error.message as string)
        } finally {
          setButtonsIsDisabled(false)
        }
      },
      text: {
        button: {
          accept: i18n.t('modals.signMessage.button.accept'),
          reject: i18n.t('modals.transactionRequest.buttom.decline'),
        },
        title: i18n.t('modals.signMessage.title', {
          dAppName: session.peer.metadata.name,
        }),
      },
      responseModal: {
        success: SignMessageSuccess,
        failed: SignMessageFailed,
      },
      hideDappName: true,
    },
  }

  const handleRenderingComponentByMethod = () => {
    const Component = listComponentByMethod[request.request.method].component
    if (Component) {
      return <Component request={request} session={session} />
    } else {
      return <></>
    }
  }

  const handleRenderingModal = (typeModal: 'success' | 'failed') => {
    const Component =
      listComponentByMethod[request.request.method].responseModal[typeModal]
    if (Component) {
      return (
        <Component
          errorMessage={messageAfterAccept}
          transactionHash={messageAfterAccept}
          onClose={controller.close}
        />
      )
    } else {
      return <></>
    }
  }

  return (
    <AwaitActivity name="wcTransactionAccepted">
      <SwiperPanel
        controller={controller}
        padding={20}
        fullSize={true}
        title={i18n.t('modals.transactionRequest.title')}
        rightButton={<CloseButton mr={'20px'} />}
        onRightPress={listComponentByMethod[request.request.method].reject}
        onClose={async () => {
          await listComponentByMethod[request.request.method].reject()
          props.navigation.goBack()
        }}
        solidColorBG
      >
        <LinearLayout orientation="verti" mr={2} ml={2} mt={5} mb={5}>
          {showModalSuccess ? (
            handleRenderingModal('success')
          ) : showModalFailed ? (
            handleRenderingModal('failed')
          ) : (
            <LinearLayout height="100%" justifyContent="space-between">
              <LinearLayout>
                <ConnectionHeader
                  title={session.peer.metadata.name}
                  imageUri={''}
                  hideTitle={
                    listComponentByMethod[
                      props.route.params.request.request.method
                    ].hideDappName
                  }
                />
                <TextView
                  mt={'2%'}
                  mr={'20px'}
                  ml={'20px'}
                  mb={'31px'}
                  color={'white'}
                  fontSize={'18px'}
                  alignself={'center'}
                  textAlign={'center'}
                >
                  {
                    listComponentByMethod[
                      props.route.params.request.request.method
                    ].text.title
                  }
                </TextView>
                {handleRenderingComponentByMethod()}
              </LinearLayout>
              <LinearLayout>
                <ThemedButton
                  label={
                    listComponentByMethod[
                      props.route.params.request.request.method
                    ].text.button.accept
                  }
                  disabled={buttonsIsDisabled}
                  onPress={() =>
                    Await.run(
                      'handleAcceptRequest',
                      listComponentByMethod[request.request.method].accept,
                      500
                    )
                  }
                />
                <LinearLayout mt={'24px'}>
                  <TouchableWithoutFeedback
                    onPress={
                      listComponentByMethod[request.request.method].reject
                    }
                    disabled={buttonsIsDisabled}
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
                      opacity={buttonsIsDisabled ? '0.3' : '1'}
                    >
                      <TextView
                        style={{includeFontPadding: false}}
                        ml={3}
                        color={'primary'}
                        fontSize={20}
                      >
                        {
                          listComponentByMethod[
                            props.route.params.request.request.method
                          ].text.button.reject
                        }
                      </TextView>
                    </LinearLayout>
                  </TouchableWithoutFeedback>
                </LinearLayout>
              </LinearLayout>
            </LinearLayout>
          )}
        </LinearLayout>
      </SwiperPanel>
    </AwaitActivity>
  )
}

export default TransactionRequestModal
