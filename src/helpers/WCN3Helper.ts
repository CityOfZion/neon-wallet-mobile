import {ContractParam} from '@cityofzion/neon-core-next/lib/sc'
import {WitnessScope} from '@cityofzion/neon-core-next/lib/tx/components/WitnessScope'
import {HexString} from '@cityofzion/neon-core-next/lib/u'
import {Account} from '@cityofzion/neon-core-next/lib/wallet'
import Neon, {rpc, sc, tx} from '@cityofzion/neon-js-next'
import {JsonRpcRequest, JsonRpcResponse} from '@json-rpc-tools/utils'

export type Signer = {
  scope: WitnessScope
  allowedContracts?: string[]
  allowedGroups?: string[]
}

export type ContractInvocation = {
  scriptHash: string
  operation: string
  args: any[]
  abortOnFail?: boolean
  signer?: Signer
}

export class WCN3Helper {
  private readonly rpcAddress: string
  private readonly networkMagic: number

  constructor(rpcAddress: string, networkMagic: number) {
    this.rpcAddress = rpcAddress
    this.networkMagic = networkMagic
  }

  static init = async (
    rpcAddress: string,
    networkMagic?: number
  ): Promise<WCN3Helper> => {
    return new WCN3Helper(
      rpcAddress,
      networkMagic ?? (await WCN3Helper.getMagicOfRpcAddress(rpcAddress))
    )
  }

  static getMagicOfRpcAddress = async (rpcAddress: string): Promise<number> => {
    const resp: any = await new rpc.RPCClient(rpcAddress).execute(
      Neon.create.query({
        method: 'getversion',
        params: [],
        id: 1,
        jsonrpc: '2.0',
      })
    )

    return resp.protocol.network
  }

  rpcCall = async (
    account: Account | undefined,
    request: JsonRpcRequest
  ): Promise<JsonRpcResponse> => {
    let result: any

    if (request.method === 'invokefunction') {
      if (!account) {
        throw new Error('No account')
      }

      result = await this.contractInvoke(account, request.params[0])
    } else if (request.method === 'testInvoke') {
      if (!account) {
        throw new Error('No account')
      }

      result = await this.testInvoke(account, request.params[0])
    } else if (request.method === 'multiInvoke') {
      if (!account) {
        throw new Error('No account')
      }

      result = await this.multiInvoke(account, request.params)
    } else if (request.method === 'multiTestInvoke') {
      if (!account) {
        throw new Error('No account')
      }

      result = await this.multiTestInvoke(account, request.params)
    } else {
      const {jsonrpc, ...queryLike} = request
      result = await new rpc.RPCClient(this.rpcAddress).execute(
        Neon.create.query({...queryLike, jsonrpc: '2.0'})
      )
    }

    return {
      id: request.id,
      jsonrpc: '2.0',
      result,
    }
  }

  contractInvoke = async (
    account: Account,
    call: ContractInvocation
  ): Promise<any> => {
    const contract = new Neon.experimental.SmartContract(
      Neon.u.HexString.fromHex(call.scriptHash),
      {
        networkMagic: this.networkMagic,
        rpcAddress: this.rpcAddress,
        account,
      }
    )

    const convertedArgs = WCN3Helper.convertParams(call.args)

    try {
      return await contract.invoke(call.operation, convertedArgs, [
        WCN3Helper.buildSigner(account, call),
      ])
    } catch (e) {
      return WCN3Helper.convertError(e)
    }
  }

  testInvoke = async (
    account: Account,
    call: ContractInvocation
  ): Promise<any> => {
    const convertedArgs = WCN3Helper.convertParams(call.args)

    try {
      return await new rpc.RPCClient(
        this.rpcAddress
      ).invokeFunction(call.scriptHash, call.operation, convertedArgs, [
        WCN3Helper.buildSigner(account, call),
      ])
    } catch (e) {
      return WCN3Helper.convertError(e)
    }
  }

  multiTestInvoke = async (
    account: Account,
    calls: ContractInvocation[]
  ): Promise<any> => {
    const sb = Neon.create.scriptBuilder()

    calls.forEach((c) => {
      sb.emitContractCall({
        scriptHash: c.scriptHash,
        operation: c.operation,
        args: WCN3Helper.convertParams(c.args),
      })

      if (c.abortOnFail) {
        sb.emit(0x39)
      }
    })

    const script = sb.build()
    return await new rpc.RPCClient(
      this.rpcAddress
    ).invokeScript(Neon.u.HexString.fromHex(script), [
      WCN3Helper.buildSigner(account, calls),
    ])
  }

  multiInvoke = async (
    account: Account,
    calls: ContractInvocation[]
  ): Promise<any> => {
    const sb = Neon.create.scriptBuilder()

    calls.forEach((c) => {
      sb.emitContractCall({
        scriptHash: c.scriptHash,
        operation: c.operation,
        args: WCN3Helper.convertParams(c.args),
      })

      if (c.abortOnFail) {
        sb.emit(0x39)
      }
    })

    const script = sb.build()

    const rpcClient = new rpc.RPCClient(this.rpcAddress)

    const currentHeight = await rpcClient.getBlockCount()

    const trx = new tx.Transaction({
      script: Neon.u.HexString.fromHex(script),
      validUntilBlock: currentHeight + 100,
      signers: [WCN3Helper.buildSigner(account, calls)],
    })

    console.log(trx)

    await Neon.experimental.txHelpers.addFees(trx, {
      rpcAddress: this.rpcAddress,
      networkMagic: this.networkMagic,
      account,
    })

    trx.sign(account, this.networkMagic)

    return await rpcClient.sendRawTransaction(trx)
  }

  private static convertParams(args: any[]): ContractParam[] {
    return args.map((a) =>
      a.value === undefined
        ? a
        : a.type === 'Address'
        ? sc.ContractParam.hash160(a.value)
        : a.type === 'ScriptHash'
        ? sc.ContractParam.hash160(Neon.u.HexString.fromHex(a.value))
        : a.type === 'Array'
        ? sc.ContractParam.array(...WCN3Helper.convertParams(a.value))
        : a
    )
  }

  private static buildSigner(
    account: Account,
    call: ContractInvocation | ContractInvocation[]
  ) {
    const signer = new tx.Signer({
      account: account.scriptHash,
    })

    if (Array.isArray(call)) {
      signer.scopes = WitnessScope.None
      const allowedContractsSet = new Set<HexString>()
      const allowedGroupsSet = new Set<HexString>()
      call.forEach((c) => {
        signer.scopes = Math.max(
          signer.scopes,
          c.signer?.scope ?? WitnessScope.CalledByEntry
        )
        c.signer?.allowedContracts?.forEach((ac) => {
          allowedContractsSet.add(Neon.u.HexString.fromHex(ac))
        })
        c.signer?.allowedGroups?.forEach((ac) => {
          allowedGroupsSet.add(Neon.u.HexString.fromHex(ac))
        })
      })
      if (allowedContractsSet.size) {
        signer.allowedContracts = Array.from(allowedContractsSet)
      }
      if (allowedGroupsSet.size) {
        signer.allowedGroups = Array.from(allowedGroupsSet)
      }
    } else {
      signer.scopes = call.signer?.scope ?? WitnessScope.CalledByEntry
      if (call.signer?.allowedContracts) {
        signer.allowedContracts = call.signer.allowedContracts.map((ac) =>
          Neon.u.HexString.fromHex(ac)
        )
      }
      if (call.signer?.allowedGroups) {
        signer.allowedGroups = call.signer.allowedGroups.map((ac) =>
          Neon.u.HexString.fromHex(ac)
        )
      }
    }

    return signer
  }

  private static convertError(e: any) {
    return {error: {message: e.message, ...e}}
  }
}
