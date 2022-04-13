import {JsonRpcRequest} from '@json-rpc-tools/utils'

import {DEFAULT_METHODS} from '~/src/config/walletConnect/constants'
import {
  SignedMessage,
  ContractInvocationMulti,
} from '~/src/helpers/NeonWcAdapter'

export function checkSupportedMethods(method: string) {
  return DEFAULT_METHODS.includes(method)
}

/**might be useful at some point */

/*export function isInvokeFunction(
  request: JsonRpcRequest
): request is JsonRpcRequest<ContractInvocationMulti> {
  return request.method === 'invokeFunction'
}

export function isVerifyMessage(
  request: JsonRpcRequest
): request is JsonRpcRequest<SignedMessage> {
  return request.method === 'verifyMessage'
}

export function isSignMessage(
  request: JsonRpcRequest
): request is JsonRpcRequest<string> {
  return request.method === 'signMessage'
}*/
