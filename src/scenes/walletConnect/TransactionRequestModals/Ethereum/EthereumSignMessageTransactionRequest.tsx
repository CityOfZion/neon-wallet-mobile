import { utils } from 'ethers'
import React from 'react'

import { SignMessageTransactionRequest } from '../../SignMessageTransactionRequest/SignMessageTransactionRequest'
import { TransactionRequestMethodComponentProps } from '../../WCTransactionRequestModal'

export const EthereumSignMessageTransactionRequest = (props: TransactionRequestMethodComponentProps) => {
  const message = props.request.params.request.params.filter((p: string) => !utils.isAddress(p))[0]
  const convertedMessage = utils.isHexString(message) ? utils.toUtf8String(message) : message

  return <SignMessageTransactionRequest {...props} message={convertedMessage} />
}
