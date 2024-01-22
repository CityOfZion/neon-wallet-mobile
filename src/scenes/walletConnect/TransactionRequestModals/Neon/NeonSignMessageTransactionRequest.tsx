import React from 'react'

import { SignMessageTransactionRequest } from '../../SignMessageTransactionRequest/SignMessageTransactionRequest'
import { TransactionRequestMethodComponentProps } from '../../WCTransactionRequestModal'

export const NeonSignMessageTransactionRequest = (props: TransactionRequestMethodComponentProps) => {
  return <SignMessageTransactionRequest {...props} message={props.request.params.request.params.message} />
}
