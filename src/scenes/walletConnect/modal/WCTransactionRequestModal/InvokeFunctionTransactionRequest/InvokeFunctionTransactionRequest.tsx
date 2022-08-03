import { WitnessScope } from '@cityofzion/neon-core-next/lib/tx'
import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'

import ContractDetailsBox from '../../../components/ContractDetailsBox'
import { TransactionRequestBase } from '../TransactionRequestBase'
import { TransactionRequestMethodComponentProps } from '../WCTransactionRequestModal'
import { InvokeFunctionFailed } from './InvokeFunctionFailed'
import { InvokeFunctionSuccess } from './InvokeFunctionSuccess'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { blockchainServices, getBlockchainByWCChain, hasWCIntegration } from '~/src/blockchain'
import { Session } from '~/src/contexts/WalletConnectContext'
import { ContractInvocation, ContractInvocationMulti, Signer } from '~/src/helpers/NeonWcAdapter'
import { ContractResponse } from '~/src/models/response/ContractResponse'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type SignerBoxProps = {
  signer: Signer
  showWarning: boolean
  session: Session
}

type ContractDetailsProps = {
  session: Session
  contract: ContractInvocation
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
            color={showWarning ? '#ea5d8e' : 'white'}
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

  const [contractInfo, setContractInfo] = useState<ContractResponse>()

  const handleGetContractInfo = useCallback(async () => {
    const blockchain = getBlockchainByWCChain(session)

    if (blockchain && session) {
      const info = await blockchainServices[blockchain].provider.getContract(contract.scriptHash)
      setContractInfo(info)
    }
  }, [session])

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
    handleGetContractInfo()
  }, [handleGetContractInfo])

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

export const InvokeFunctionTransactionRequest = ({
  request,
  session,
  account,
}: TransactionRequestMethodComponentProps) => {
  const requestParams = request.params.request.params as ContractInvocationMulti

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const navigation = useNavigation()

  const [feeRequest, setFeeRequest] = useState<number>()

  const scopes = requestParams.signers.map(signer => signer.scopes) ?? [WitnessScope.CalledByEntry]

  const showWarning = scopes.some(scope => scope !== WitnessScope.None && scope !== WitnessScope.CalledByEntry)

  const handleCalculateFee = useCallback(async () => {
    if (account?.address) {
      const bs = blockchainServices[account.blockchain]
      if (hasWCIntegration(bs)) {
        const resultFee = await bs.calculateFee(account.address, requestParams)

        setFeeRequest(Number(resultFee))
      }
    }
  }, [account])

  useEffect(() => {
    handleCalculateFee()
  }, [handleCalculateFee])

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

      {requestParams.signers.map((signer, index) => (
        <SignerBox key={`${signer.scopes}-${index}`} session={session} showWarning={showWarning} signer={signer} />
      ))}

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
