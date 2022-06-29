import { WitnessScope } from '@cityofzion/neon-core-next/lib/tx'
import { useNavigation } from '@react-navigation/native'
import { SessionTypes } from '@walletconnect/types'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'

import ContractDetailsBox from '../../../components/ContractDetailsBox'
import { TransactionRequestBase } from '../TransactionRequestBase'
import { TransactionRequestMethodComponentProps } from '../WCTransactionRequestModal'
import { InvokeFunctionFailed } from './InvokeFunctionFailed'
import { InvokeFunctionSuccess } from './InvokeFunctionSuccess'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { blockchainServices, hasWCIntegration } from '~/src/blockchain'
import { ContractInvocation, ContractInvocationMulti, Signer } from '~/src/helpers/NeonWcAdapter'
import { RootState, RootStore } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { AsyncDispatch } from '~/src/types/reducers/root'

type ContractDetailsBoxButtonProps = {
  contract: ContractInvocation
  session: SessionTypes.Settled
}

type SignerBoxProps = {
  signer: Signer
  showWarning: boolean
  session: SessionTypes.Settled
}

const ContractDetailsBoxButton = ({ contract, session }: ContractDetailsBoxButtonProps) => {
  const navigation = useNavigation()

  return (
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
        alignSelf="center"
        resizeMode="contain"
        width={7}
        height={12}
        pr="40px"
        source={require('~src/assets/images/icon-arrow-right-green.png')}
      />
    </TouchableWithoutFeedback>
  )
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

export const InvokeFunctionTransactionRequest = ({
  request,
  session,
  account,
}: TransactionRequestMethodComponentProps) => {
  const requestParams = request.request.params as ContractInvocationMulti

  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const navigation = useNavigation()

  const [feeRequest, setFeeRequest] = useState<number>()

  const scopes = requestParams.signers.map(signer => signer.scopes) ?? [WitnessScope.CalledByEntry]

  const showWarning = scopes.some(scope => scope !== WitnessScope.None && scope !== WitnessScope.CalledByEntry)

  const handleCalculateFee = useCallback(async () => {
    if (account?.address) {
      const bs = blockchainServices[account.blockchain]
      if (hasWCIntegration(bs)) {
        const resultFee = await bs.calculateFee(account.address, request.request)

        setFeeRequest(Number(resultFee))
      }
    }
  }, [account])

  async function handleOnAccept(transactionId: string) {
    if (account?.address) {
      await account.addPendingWCTransaction(transactionId, requestParams.invocations.length)

      await dispatchAsync(RootStore.app.actions.updateAndSaveAccount(account))
    }
  }

  useEffect(() => {
    handleCalculateFee()
  }, [handleCalculateFee])

  return (
    <TransactionRequestBase
      acceptButtonLabel={i18n.t('modals.transactionRequest.buttom.accept')}
      rejectButtonLabel={i18n.t('modals.transactionRequest.buttom.decline')}
      title={i18n.t('modals.transactionRequest.confirmToProceed')}
      hideDappName={false}
      onAccept={handleOnAccept}
      request={request}
      session={session}
      account={account}
      successElement={InvokeFunctionSuccess}
      failedElement={InvokeFunctionFailed}
    >
      {requestParams.invocations.map((contract, index) => (
        <ContractDetailsBox
          key={`${contract.operation}-${index}`}
          session={session}
          contract={contract}
          rightButton={<ContractDetailsBoxButton contract={contract} session={session} />}
        />
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
