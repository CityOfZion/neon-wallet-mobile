import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SessionTypes } from '@walletconnect/types'
import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { InvokeFunctionTransactionRequest } from './InvokeFunctionTransactionRequest/InvokeFunctionTransactionRequest'
import { SignMessageTransactionRequest } from './SignMessageTransactionRequest/SignMessageTransactionRequest'
import { VerifyMessageTransactionRequest } from './VerifyMessageTransactionRequest/VerifyMessageTransactionRequest'

import { SupportedMethods, WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useTreatNetworkOnWalletConnectFlow } from '~/src/hooks'
import { Account } from '~/src/models/redux/Account'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'

export interface WCTransactionRequestModalParams {
  request: SessionTypes.RequestEvent
  session: SessionTypes.Settled
}

type Props = {
  navigation: StackNavigationProp<TabStackParamList & RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WCTransactionRequestModal'>
}

export type TransactionRequestMethodComponentProps = {
  request: SessionTypes.RequestEvent
  session: SessionTypes.Settled
  account: Account
}

const componentsByMethod: Record<SupportedMethods, React.FC<TransactionRequestMethodComponentProps>> = {
  invokeFunction: InvokeFunctionTransactionRequest,
  signMessage: SignMessageTransactionRequest,
  verifyMessage: VerifyMessageTransactionRequest,
}

const WCTransactionRequestModal = ({ navigation, route }: Props) => {
  const { request, session } = route.params
  const { accounts } = useSelector((state: RootState) => state.app)
  useTreatNetworkOnWalletConnectFlow()

  const account = useMemo(() => {
    const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)

    return accounts.find(account => account.address && account.address === address)
  }, [accounts])

  if (!WalletConnectHelper.checkSupportedMethods(request.request.method)) {
    showMessage({
      message: i18n.t('modals.WCTransactionRequestModal.unsupportedMethod', {
        method: request.request.method,
      }),
    })

    navigation.goBack()
    return <></>
  }

  if (!account) {
    showMessage({
      message: i18n.t('modals.WCTransactionRequestModal.errorToGetAccount', {
        method: request.request.method,
      }),
    })

    navigation.goBack()
    return <></>
  }

  const Component = componentsByMethod[request.request.method as SupportedMethods]

  return <Component account={account} request={request} session={session} />
}

export default WCTransactionRequestModal
