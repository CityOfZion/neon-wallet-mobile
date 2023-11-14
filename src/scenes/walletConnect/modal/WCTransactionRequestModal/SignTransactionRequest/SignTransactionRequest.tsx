import { tx } from '@cityofzion/neon-core/'
import { BuiltTransaction } from '@cityofzion/neon-dappkit-types'
import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import React, { useEffect, useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { TransactionRequestBase } from '../TransactionRequestBase'
import { TransactionRequestMethodComponentProps } from '../WCTransactionRequestModal'
import { SignTransactionFailed } from './SignTransactionFailed'
import { SignTransactionSuccess } from './SignTransactionSuccess'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { ContractDetails } from '~src/scenes/walletConnect/components/ContractDetails'
import { SignerBox } from '~src/scenes/walletConnect/components/SignerBox'
import { TransactionFee } from '~src/scenes/walletConnect/components/TransactionFee'

export const SignTransactionRequest = ({ request, session, account }: TransactionRequestMethodComponentProps) => {
  const navigation = useNavigation()

  const requestParams = useMemo(
    () => request.params.request.params as BuiltTransaction,
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
      successElement={SignTransactionSuccess}
      failedElement={SignTransactionFailed}
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
          bg="background.1"
          orientation="horiz"
          borderRadius={6}
          mb="13px"
          pt="13px"
          pb="13px"
          justifyContent="space-between"
        >
          <TextView color="text.10" weight={2} fontFamily="bold" fontSize={14} pl="18px">
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
