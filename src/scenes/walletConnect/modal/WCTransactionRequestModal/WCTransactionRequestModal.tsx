import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { InvokeFunctionTransactionRequest } from './InvokeFunctionTransactionRequest/InvokeFunctionTransactionRequest'
import { SignMessageTransactionRequest } from './SignMessageTransactionRequest/SignMessageTransactionRequest'
import { VerifyMessageTransactionRequest } from './VerifyMessageTransactionRequest/VerifyMessageTransactionRequest'

import { Session, SessionRequest } from '~/src/contexts/WalletConnectContext'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useTreatNetworkOnWalletConnectFlow } from '~/src/hooks/useTreatNetworkOnWalletConnectFlow'
import { Account } from '~/src/models/redux/Account'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'

export interface WCTransactionRequestModalParams {
  request: SessionRequest
  session: Session
}

type Props = {
  navigation: StackNavigationProp<TabStackParamList & RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WCTransactionRequestModal'>
}

export type TransactionRequestMethodComponentProps = {
  request: SessionRequest
  session: Session
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

  const accounts = useSelector(selectAccounts)
  useTreatNetworkOnWalletConnectFlow()

  const account = useMemo(() => {
    const [{ address }] = WalletConnectHelper.getAccountInformationFromSession(session)

    return accounts.find(account => account.address && account.address === address)
  }, [accounts])

  if (!WalletConnectHelper.checkSupportedMethods(method)) {
    showMessage({
      message: i18n.t('modals.WCTransactionRequestModal.unsupportedMethod', {
        method,
      }),
    })

    navigation.goBack()
    return <></>
  }

  if (!account) {
    showMessage({
      message: i18n.t('modals.WCTransactionRequestModal.errorToGetAccount', {
        method,
      }),
    })

    navigation.goBack()
    return <></>
  }

  const Component = componentsByMethod[method]

  return <Component account={account} request={request} session={session} />
}

export default WCTransactionRequestModal
