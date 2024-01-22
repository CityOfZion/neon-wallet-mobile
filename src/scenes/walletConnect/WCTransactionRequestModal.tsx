import { TSession, TSessionRequest, useWalletConnectWallet } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { EthereumRawJsonTransactionRequest } from './TransactionRequestModals/Ethereum/EthereumRawJsonTransactionRequest/EthereumRawJsonTransactionRequest'
import { EthereumSignMessageTransactionRequest } from './TransactionRequestModals/Ethereum/EthereumSignMessageTransactionRequest'
import { DecryptFromArrayTransactionRequest } from './TransactionRequestModals/Neon/DecryptFromArrayTransactionRequest/DecryptFromArrayTransactionRequest'
import { DecryptTransactionRequest } from './TransactionRequestModals/Neon/DecryptTransactionRequest/DecryptTransactionRequest'
import { EncryptTransactionRequest } from './TransactionRequestModals/Neon/EncryptTransactionRequest/EncryptTransactionRequest'
import { InvokeFunctionTransactionRequest } from './TransactionRequestModals/Neon/InvokeFunctionTransactionRequest/InvokeFunctionTransactionRequest'
import { NeonSignMessageTransactionRequest } from './TransactionRequestModals/Neon/NeonSignMessageTransactionRequest'
import { SignTransactionRequest } from './TransactionRequestModals/Neon/SignTransactionRequest/SignTransactionRequest'
import { VerifyMessageTransactionRequest } from './TransactionRequestModals/Neon/VerifyMessageTransactionRequest/VerifyMessageTransactionRequest'

import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { useWalletConnectFlow } from '~/src/hooks/useWalletConnectFlow'
import { Account } from '~/src/store/account/Account'
import { selectAccounts } from '~/src/store/account/SelectorAccount'
import { TBlockchainServiceKey } from '~/src/types/blockchain'
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

const componentsByBlockchain: Partial<
  Record<TBlockchainServiceKey, Record<string, React.FC<TransactionRequestMethodComponentProps>>>
> = {
  neo3: {
    invokeFunction: InvokeFunctionTransactionRequest,
    signMessage: NeonSignMessageTransactionRequest,
    verifyMessage: VerifyMessageTransactionRequest,
    encrypt: EncryptTransactionRequest,
    decrypt: DecryptTransactionRequest,
    decryptFromArray: DecryptFromArrayTransactionRequest,
    signTransaction: SignTransactionRequest,
  },
  ethereum: {
    personal_sign: EthereumSignMessageTransactionRequest,
    eth_sign: EthereumSignMessageTransactionRequest,
    eth_signTransaction: EthereumRawJsonTransactionRequest,
    eth_signTypedData: EthereumRawJsonTransactionRequest,
    eth_signTypedData_v3: EthereumRawJsonTransactionRequest,
    eth_signTypedData_v4: EthereumRawJsonTransactionRequest,
    eth_sendTransaction: EthereumRawJsonTransactionRequest,
  },
}

const WCTransactionRequestModal = ({ navigation, route }: Props) => {
  const { request, session } = route.params
  const method = request.params.request.method
  const { rejectRequest } = useWalletConnectWallet()

  useWalletConnectFlow()

  const accounts = useSelector(selectAccounts)

  const infos = useMemo(() => WalletConnectHelper.getAccountInformationFromSession(session), [session])

  const account = useMemo(() => {
    const [{ address }] = infos
    return accounts.find(account => account.address === address)
  }, [accounts, infos])

  const Component = useMemo(() => componentsByBlockchain[infos[0].blockchain]?.[method], [method])

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
