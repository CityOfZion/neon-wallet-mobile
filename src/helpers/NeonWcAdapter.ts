import { ContractInvocationMulti } from '@cityofzion/neo3-invoker'
import * as Neon from '@cityofzion/neon-core'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonSigner } from '@cityofzion/neon-signer'

import { SessionRequest } from '../contexts/WalletConnectContext'

export class NeonWcAdapter {
  readonly invoke: NeonInvoker
  readonly signer: NeonSigner
  readonly account: Neon.wallet.Account | undefined
  readonly rpc: Neon.rpc.RPCClient

  constructor(invoke: NeonInvoker, sign: NeonSigner, rpc: Neon.rpc.RPCClient, account?: Neon.wallet.Account) {
    this.invoke = invoke
    this.signer = sign
    this.account = account
    this.rpc = rpc
  }

  static init = async (rpcURL: string, wif: string): Promise<NeonWcAdapter> => {
    const account = new Neon.wallet.Account(wif)
    const invoker = await NeonInvoker.init(rpcURL, account)
    const signer = new NeonSigner(account)
    const rpc = new Neon.rpc.RPCClient(rpcURL)
    return new NeonWcAdapter(invoker, signer, rpc, account)
  }

  async rpcCall(sessionRequest: SessionRequest): Promise<any> {
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
      result = await this.signer.verifyMessage(request.params)
    } else if (request.method === 'traverseIterator') {
      result = await this.invoke.traverseIterator(request.params[0], request.params[1], request.params[2])
    } else if (request.method === 'getWalletInfo') {
      result = { isLedger: false }
    } else if (request.method === 'getNetworkVersion') {
      const response = await this.rpc.getVersion()
      result = {
        rpcAddress: this.rpc.url,
        ...response,
      }
    } else {
      throw new Error('Invalid Request method')
    }

    return {
      id: sessionRequest.id,
      jsonrpc: '2.0',
      result,
    }
  }

  async calculateFee(requestParams: ContractInvocationMulti) {
    const testInvoke = await this.invoke.testInvoke(requestParams)
    const extraNetworkFee = requestParams.extraNetworkFee ? this.fixDecimalPlaces(requestParams.extraNetworkFee, 8) : 0
    const extraSystemFee = requestParams.extraSystemFee ? this.fixDecimalPlaces(requestParams.extraSystemFee, 8) : 0
    const gasconsumed = this.fixDecimalPlaces(Number(testInvoke.gasconsumed), 8)
    const summedFee = gasconsumed + extraNetworkFee + extraSystemFee
    return summedFee.toString()
  }

  private fixDecimalPlaces(value: number, decimalPlaces: number) {
    return value / 10 ** decimalPlaces
  }
}
