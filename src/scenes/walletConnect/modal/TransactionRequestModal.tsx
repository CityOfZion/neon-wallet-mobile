import {WitnessScope} from '@cityofzion/neon-core-next/lib/tx/components/WitnessScope'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import {SessionTypes, AppMetadata} from '@walletconnect/types'
import i18n from 'i18n-js'
import React, {useCallback, useEffect, useState} from 'react'
import {TouchableWithoutFeedback, Linking} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import ConnectionHeader from '../components/ConnectionHeader'
import ContractDetailsBox from '../components/ContractDetailsBox'
import TransactionFailed from './fragment/TransactionFailed'
import TransactionSuccess from './fragment/TransactionSuccess'

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
  ContractInvocation,
  ContractInvocationMulti,
  Signer,
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

interface SessionItemProps {
  request: SessionTypes.RequestEvent
}

const TransactionRequestModal = (props: Props) => {
  const dispatch = useDispatch()
  const {request, session} = props.route.params
  const controller = useSwiperController(true)
  const {accounts} = useSelector((state: RootState) => state.app)
  const {
    sessions,
    requests,
    approveRequest,
    rejectRequest,
    onRequestListener,
  } = useWalletConnect()

  if (!['invokeFunction', 'testInvoke'].includes(request.request.method)) {
    return <></>
  }

  const requestParams: ContractInvocationMulti = request.request.params

  const [accountRequest, setAccountRequest] = useState<Account>()

  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const [feeRequest, setFeeRequest] = useState<number>()
  const [showModalSuccess, setshowModalSuccess] = useState<boolean>(false)
  const [showModalFailed, setShowModalFailed] = useState<boolean>(false)
  const [messageAfterAccept, setMessageAfterAccept] = useState<string>()
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

  type TypeArgsRequest = 'Address' | 'Integer' | 'Array'
  interface ArgsRequest {
    type?: TypeArgsRequest
    value?: string
  }
  const handleCalculateFee = useCallback(async () => {
    let sumFee: number = 0
    if (accountRequest?.address) {
      const bs = blockchainServices[accountRequest.blockchain]
      if (hasWCIntegration(bs)) {
        const {networkFee, systemFee} = await bs.calculateFee(
          accountRequest.address,
          requestParams
        )
        sumFee += networkFee + systemFee
        setFeeRequest(sumFee)
      }
    }
  }, [request, accountRequest])

  const handleAddPendingTransaction = useCallback(
    async (txid: string) => {
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
    [accounts, accountRequest]
  )

  useEffect(() => {
    if (accountRequest) {
      handleCalculateFee()
      dispatch(RootStore.account.actions.selectAccount(accountRequest.address))
    }
  }, [accountRequest])

  const scopes = requestParams.signers.map((signer) => signer.scopes) ?? [
    WitnessScope.CalledByEntry,
  ]
  const showWarning = scopes.some(
    (scope) =>
      scope !== WitnessScope.None && scope !== WitnessScope.CalledByEntry
  )

  //requestJson
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const handleAcceptRequest = useCallback(async () => {
    try {
      const response = await approveRequest(request)
      if (response && 'result' in response) {
        const {result} = response
        await handleAddPendingTransaction(result)
        setMessageAfterAccept(result as string)
        setshowModalSuccess(true)
      }
    } catch (error) {
      setShowModalFailed(true)
      setMessageAfterAccept(error.message as string)
      console.log('debug error handle accept ', error)
    }
  }, [requests, controller])

  const handleDeclineRequest = useCallback(async () => {
    await rejectRequest(props.route.params.request)
    controller.close()
  }, [requests, controller])

  return (
    <AwaitActivity name="wcTransactionAccepted">
      <SwiperPanel
        controller={controller}
        padding={20}
        fullSize={true}
        title={i18n.t('modals.transactionRequest.title')}
        rightButton={<CloseButton mr={'20px'} />}
        onRightPress={() => {
          handleDeclineRequest()
        }}
        solidColorBG
      >
        <LinearLayout orientation="verti" mr={2} ml={2} mt={5} mb={5}>
          {showModalSuccess && messageAfterAccept ? (
            <TransactionSuccess transactionHash={messageAfterAccept} />
          ) : showModalFailed && messageAfterAccept ? (
            <TransactionFailed errorMessage={messageAfterAccept} />
          ) : (
            <>
              <ConnectionHeader
                title={session.peer.metadata.name}
                imageUri={''}
              />
              {requestParams.invocations.map((contract, index) => (
                <ContractDetailsBox
                  key={`${contract.operation}-${index}`}
                  session={session}
                  contract={contract}
                  rightButton={
                    <TouchableWithoutFeedback
                      onPress={() =>
                        props.navigation.navigate(wrapper.route.Modal.name, {
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
                    props.navigation.navigate(
                      wrapper.route.SignatureScopeModal.name,
                      {
                        data: signer,
                        session,
                      }
                    )
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
                  props.navigation.navigate(wrapper.route.RawJsonModal.name, {
                    dataJson: JSON.stringify(requests[0], null, 2),
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
                onPress={() =>
                  Await.run('handleAcceptRequest', handleAcceptRequest, 500)
                }
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
            </>
          )}
        </LinearLayout>
      </SwiperPanel>
    </AwaitActivity>
  )
}

export default TransactionRequestModal
