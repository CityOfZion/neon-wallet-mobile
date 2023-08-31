import { TSession, TSessionRequest, useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { InvokeFunctionTransactionRequest } from './InvokeFunctionTransactionRequest/InvokeFunctionTransactionRequest'
import { SignMessageTransactionRequest } from './SignMessageTransactionRequest/SignMessageTransactionRequest'
import { VerifyMessageTransactionRequest } from './VerifyMessageTransactionRequest/VerifyMessageTransactionRequest'

import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useWalletConnectFlow } from '~/src/hooks/useWalletConnectFlow'
import { Account } from '~/src/store/account/Account'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'

export interface WCTransactionRequestModalParams {
  request: TSessionRequest
  session: TSession
}

type Props = {
  navigation: StackNavigationProp<TabStackParamList & RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WCTransactionRequestModal'>
}

export type TransactionRequestMethodComponentProps = {
  request: TSessionRequest
  session: TSession
  account: Account
}

const componentsByMethod: Record<string, React.FC<TransactionRequestMethodComponentProps>> = {
  invokeFunction: InvokeFunctionTransactionRequest,
  signMessage: SignMessageTransactionRequest,
  verifyMessage: VerifyMessageTransactionRequest,
}

const WCTransactionRequestModal = ({ navigation, route }: Props) => {
  const { request, session } = route.params
  const method = request.params.request.method
  const { rejectRequest } = useWalletConnectWallet()

  useWalletConnectFlow()

  const accounts = useSelector(selectAccounts)

  const account = useMemo(() => {
    const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)

    return accounts.find(account => account.address === address)
  }, [accounts, session])

  const Component = useMemo(() => componentsByMethod[method], [method])

  useEffect(() => {
    ;(async () => {
      if (!account || !Component) {
        const message = i18n.t(
          !Component
            ? 'modals.WCTransactionRequestModal.unsupportedMethod'
            : 'modals.WCTransactionRequestModal.errorToGetAccount',
          {
            method,
          }
        )

        showMessage({
          message,
        })

        await rejectRequest(request, { code: 1, message })
        navigation.goBack()
      }
    })()
  }, [rejectRequest, account, Component, request])

  return account && Component ? <Component account={account} request={request} session={session} /> : <></>
}

export default WCTransactionRequestModal
