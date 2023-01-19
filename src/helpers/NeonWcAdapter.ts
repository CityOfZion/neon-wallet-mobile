import { Account } from '@cityofzion/neon-core-next/lib/wallet'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonSigner } from '@cityofzion/neon-signer'

import { SessionRequest } from '../contexts/WalletConnectContext'

export class NeonWcAdapter {
  readonly invoke: NeonInvoker
  readonly signer: NeonSigner
  readonly account: Account | undefined
  constructor(invoke: NeonInvoker, sign: NeonSigner, account?: Account) {
    this.invoke = invoke
    this.signer = sign
    this.account = account
  }

  static init = async (rpcAddress: string, account?: Account): Promise<NeonWcAdapter> => {
    const invoker = await NeonInvoker.init(rpcAddress)
    const signer = new NeonSigner(account)
    return new NeonWcAdapter(invoker, signer, account)
  }

  rpcCall = async (sessionRequest: SessionRequest): Promise<any> => {
    const {
      params: { request },
    } = sessionRequest
    let result: any

    if (request.method === 'invokeFunction') {
      if (!this.account) {
        throw new Error('No account')
      }
      if (this.signer.getAccountAddress() === null) throw new Error('No account')

      result = await this.invoke.invokeFunction(request.params)
    } else if (request.method === 'testInvoke') {
      if (!this.account) {
        throw new Error('No account')
      }

      result = await this.invoke.testInvoke(request.params)
    } else if (request.method === 'signMessage') {
      if (!this.account) {
        throw new Error('No account')
      }
      result = await this.signer.signMessage(request.params)
    } else if (request.method === 'verifyMessage') {
      alert(`verifyMessage => ${this.signer.getAccountAddress()}`)
      result = await this.signer.verifyMessage(request.params)
    } else {
      throw new Error('Invalid Request method')
    }

    return {
      id: sessionRequest.id,
      jsonrpc: '2.0',
      result,
    }
  }
}
