import i18n from 'i18n-js'
import React from 'react'

import { TransactionRequestBase } from '../TransactionRequestBase'
import { TransactionRequestMethodComponentProps } from '../WCTransactionRequestModal'
import { VerifyMessageFailed } from './VerifyMessageFailed'
import { VerifyMessageSuccess } from './VerifyMessageSuccess'

export const VerifyMessageTransactionRequest = ({
  request,
  session,
  account,
}: TransactionRequestMethodComponentProps) => {
  return (
    <TransactionRequestBase
      acceptButtonLabel={i18n.t('modals.verifyMessage.button.accept')}
      rejectButtonLabel={i18n.t('modals.transactionRequest.buttom.decline')}
      title={i18n.t('modals.verifyMessage.title', {
        dAppName: session.peer.metadata.name,
      })}
      hideDappName
      request={request}
      session={session}
      account={account}
      successElement={VerifyMessageSuccess}
      failedElement={VerifyMessageFailed}
    />
  )
}
