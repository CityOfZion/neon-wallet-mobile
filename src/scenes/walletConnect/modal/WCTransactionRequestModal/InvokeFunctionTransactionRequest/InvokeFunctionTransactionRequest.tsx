import { ContractResponse } from '@cityofzion/blockchain-service'
import { Signer, ContractInvocation, ContractInvocationMulti } from '@cityofzion/neo3-invoker'
import { tx } from '@cityofzion/neon-core/'
import { TSession, TSessionRequest } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { showMessage } from 'react-native-flash-message'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'

import ContractDetailsBox from '../../../components/ContractDetailsBox'
import { TransactionRequestBase } from '../TransactionRequestBase'
import { TransactionRequestMethodComponentProps } from '../WCTransactionRequestModal'
import { InvokeFunctionFailed } from './InvokeFunctionFailed'
import { InvokeFunctionSuccess } from './InvokeFunctionSuccess'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { WalletConnectNeonAdapter } from '~/src/libs/WalletConnectNeonAdapter'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { TBlockchainServiceKey } from '~/src/types/blockchain'

type SignerBoxProps = {
  signer: Signer
  showWarning: boolean
  session: TSession
}

type ContractDetailsProps = {
  session: TSession
  contract: ContractInvocation
}

type TransactionFeeProps = {
  request: TSessionRequest
  session: TSession
}

const SignerBox = ({ signer, showWarning, session }: SignerBoxProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const navigation = useNavigation()

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(wrapper.route.SignatureScopeModal.name, {
          data: signer,
          session,
        })
      }}
    >
      <LinearLayout
        bg={theme.colors.background[1]}
        orientation="horiz"
        borderRadius={6}
        mb="13px"
        pt="13px"
        pb="13px"
        justifyContent="space-between"
      >
        <TextView color={theme.colors.text[10]} weight={2} fontFamily="bold" fontSize={14} pl="18px">
          {i18n.t('modals.transactionRequest.signatureScope')}
        </TextView>
        <LinearLayout orientation="horiz">
          {showWarning && (
            <ImageView
              alignSelf="center"
              resizeMode="contain"
              width={7}
              height={12}
              pr="20px"
              source={require('~src/assets/images/red-alert.png')}
            />
          )}
          <TextView
            color={showWarning ? 'danger' : 'white'}
            alignSelf="flex-end"
            pb="3px"
            fontSize={12}
            fontFamily="bold"
          >
            {i18n.t(`modals.signatureScope.${signer.scopes}.scope`)}
          </TextView>
          <ImageView
            alignSelf="center"
            resizeMode="contain"
            width={7}
            height={12}
            pr="35px"
            source={require('~src/assets/images/icon-arrow-right-green.png')}
          />
        </LinearLayout>
      </LinearLayout>
    </TouchableWithoutFeedback>
  )
}

const ContractDetails = ({ contract, session }: ContractDetailsProps) => {
  const navigation = useNavigation()
  const blockchain = useMemo<TBlockchainServiceKey>(
    () => WalletConnectHelper.getAccountInformationFromSession(session)[0].blockchain,
    [session]
  )
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[blockchain]
  )
  const [contractInfo, setContractInfo] = useState<ContractResponse>()

  const handlePressRightButton = () => {
    if (!contractInfo) return

    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCInvocationDetailsModal.name,
      params: {
        session,
        contract,
        contractInfo,
      },
    })
  }

  useEffect(() => {
    blockchainService.blockchainDataService.getContract(contract.scriptHash).then(setContractInfo)
  }, [blockchainService])

  return (
    <ContractDetailsBox
      session={session}
      contract={contract}
      title={contractInfo?.name ?? ''}
      withRightButton
      onPressRightButton={handlePressRightButton}
    />
  )
}

const TransactionFee = ({ request, session }: TransactionFeeProps) => {
  const [feeRequest, setFeeRequest] = useState<number>()

  const handleCalculateFee = useCallback(async () => {
    const adapter = new WalletConnectNeonAdapter()
    const fee = await adapter.calculateFee({ request, session })

    setFeeRequest(fee)
  }, [request, session])

  useEffect(() => {
    handleCalculateFee()
  }, [handleCalculateFee])

  return (
    <LinearLayout
      bg="background.1"
      orientation="horiz"
      borderRadius={6}
      mb="13px"
      pt="13px"
      pb="13px"
      justifyContent="space-between"
    >
      <TextView color="text.10" weight={2} fontFamily="bold" fontSize={14} pl="18px">
        {i18n.t('modals.transactionRequest.transactionFee')}
      </TextView>
      <LinearLayout orientation="horiz">
        <TextView color="primary" alignSelf="flex-end" pb="3px" fontSize="16px" fontFamily="bold" pr="20px">
          {i18n.t('modals.transactionRequest.xGas', {
            amount: feeRequest ? (feeRequest / 8).toFixed(8) : '',
          })}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

export const InvokeFunctionTransactionRequest = ({
  request,
  session,
  account,
}: TransactionRequestMethodComponentProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const navigation = useNavigation()

  const requestParams = useMemo<ContractInvocationMulti>(
    () => request.params.request.params,
    [request.params.request.params]
  )

  const scopes = requestParams.signers?.map(signer => signer.scopes) ?? [tx.WitnessScope.CalledByEntry]

  const showWarning = scopes.some(scope => scope !== tx.WitnessScope.None && scope !== tx.WitnessScope.CalledByEntry)

  useEffect(() => {
    const { extraNetworkFee, extraSystemFee, networkFeeOverride, systemFeeOverride } = requestParams

    if (!extraNetworkFee && !extraSystemFee && !networkFeeOverride && !systemFeeOverride) return

    showMessage({ type: 'info', message: i18n.t('modals.transactionRequest.overrideFeeInfo'), duration: 3000 })
  }, [requestParams])

  return (
    <TransactionRequestBase
      acceptButtonLabel={i18n.t('modals.transactionRequest.buttom.accept')}
      rejectButtonLabel={i18n.t('modals.transactionRequest.buttom.decline')}
      title={i18n.t('modals.transactionRequest.confirmToProceed')}
      hideDappName={false}
      request={request}
      session={session}
      account={account}
      successElement={InvokeFunctionSuccess}
      failedElement={InvokeFunctionFailed}
    >
      {requestParams.invocations.map((contract, index) => (
        <ContractDetails key={`${contract.operation}-${index}`} session={session} contract={contract} />
      ))}

      {requestParams.signers?.map((signer, index) => (
        <SignerBox key={`${signer.scopes}-${index}`} session={session} showWarning={showWarning} signer={signer} />
      ))}

      <TransactionFee session={session} request={request} />

      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate(wrapper.route.RawJsonModal.name, {
            request,
            session,
          })
        }}
      >
        <LinearLayout
          bg={theme.colors.background[1]}
          orientation="horiz"
          borderRadius={6}
          mb="13px"
          pt="13px"
          pb="13px"
          justifyContent="space-between"
        >
          <TextView color={theme.colors.text[10]} weight={2} fontFamily="bold" fontSize={14} pl="18px">
            {i18n.t('modals.transactionRequest.json')}
          </TextView>
          <LinearLayout orientation="horiz">
            <ImageView
              alignSelf="center"
              resizeMode="contain"
              width={7}
              height={12}
              pr="35px"
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          </LinearLayout>
        </LinearLayout>
      </TouchableWithoutFeedback>
    </TransactionRequestBase>
  )
}
