import { ContractParam } from '@cityofzion/neon-core-next/lib/sc'
import { WitnessScope } from '@cityofzion/neon-core-next/lib/tx/components/WitnessScope'
import { Account } from '@cityofzion/neon-core-next/lib/wallet'
import Neon, { rpc, sc, tx, wallet, u } from '@cityofzion/neon-js-next'
import { randomBytes } from 'crypto'

import { SessionRequest } from '../contexts/WalletConnectContext'

export type Signer = {
  scopes: WitnessScope
  allowedContracts?: string[]
  allowedGroups?: string[]
}

export type ContractInvocation = {
  scriptHash: string
  operation: string
  args: any[]
  abortOnFail?: boolean
}

export type ContractInvocationMulti = {
  signers: Signer[]
  invocations: ContractInvocation[]
  extraSystemFee?: number
  systemFeeOverride?: number
  extraNetworkFee?: number
  networkFeeOverride?: number
}

export type SignMessagePayload = {
  message: string
  version: number
}

export type SignedMessage = {
  publicKey: string
  data: string
  salt: string
  messageHex: string
}

export const SUPPORTED_ARG_TYPES = [
  'Any',
  'Signature',
  'Boolean',
  'Integer',
  'Hash160',
  'Address',
  'ScriptHash',
  'Null',
  'Hash256',
  'ByteArray',
  'PublicKey',
  'String',
  'ByteString',
  'Array',
  'Buffer',
  'InteropInterface',
  'Void',
] as const

export type ArgType = typeof SUPPORTED_ARG_TYPES[number]

export class NeonWcAdapter {
  private readonly rpcAddress: string
  private readonly networkMagic: number

  constructor(rpcAddress: string, networkMagic: number) {
    this.rpcAddress = rpcAddress
    this.networkMagic = networkMagic
  }

  static init = async (rpcAddress: string, networkMagic?: number): Promise<NeonWcAdapter> => {
    return new NeonWcAdapter(rpcAddress, networkMagic ?? (await NeonWcAdapter.getMagicOfRpcAddress(rpcAddress)))
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

  rpcCall = async (account: Account | undefined, sessionRequest: SessionRequest): Promise<any> => {
    const {
      params: { request },
    } = sessionRequest
    let result: any

    if (request.method === 'invokeFunction') {
      if (!account) {
        throw new Error('No account')
      }

      result = await this.invokeFunction(account, request.params)
    } else if (request.method === 'testInvoke') {
      if (!account) {
        throw new Error('No account')
      }

      result = await this.testInvoke(account, request.params)
    } else if (request.method === 'signMessage') {
      if (!account) {
        throw new Error('No account')
      }

      result = await this.signMessage(account, request.params)
    } else if (request.method === 'verifyMessage') {
      result = await this.verifyMessage(request.params)
    } else if (request.method === 'getapplicationlog') {
      result = await new rpc.RPCClient(this.rpcAddress).getApplicationLog(request.params[0])
    } else {
      throw new Error('Invalid Request method')
    }

    return {
      id: sessionRequest.id,
      jsonrpc: '2.0',
      result,
    }
  }

  calculateFee = async (account: Account, cim: ContractInvocationMulti): Promise<string> => {
    const sb = Neon.create.scriptBuilder()

    cim.invocations.forEach(c => {
      sb.emitContractCall({
        scriptHash: c.scriptHash,
        operation: c.operation,
        args: NeonWcAdapter.convertParams(c.args),
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
      signers: NeonWcAdapter.buildMultipleSigner(account, cim.signers),
    })

    const config = {
      rpcAddress: this.rpcAddress,
      networkMagic: this.networkMagic,
      account,
    }

    const systemFee = cim.systemFeeOverride
      ? u.BigInteger.fromNumber(cim.systemFeeOverride)
      : (await Neon.experimental.txHelpers.getSystemFee(trx.script, config, trx.signers)).add(cim.extraSystemFee ?? 0)

    const networkFee = cim.networkFeeOverride
      ? u.BigInteger.fromNumber(cim.networkFeeOverride)
      : (await Neon.experimental.txHelpers.calculateNetworkFee(trx, account, config)).add(cim.extraNetworkFee ?? 0)

    return systemFee.add(networkFee).toDecimal(8)
  }

  testInvoke = async (account: Account, cim: ContractInvocationMulti): Promise<any> => {
    const sb = Neon.create.scriptBuilder()

    cim.invocations.forEach(c => {
      sb.emitContractCall({
        scriptHash: c.scriptHash,
        operation: c.operation,
        args: NeonWcAdapter.convertParams(c.args),
      })

      if (c.abortOnFail) {
        sb.emit(0x39)
      }
    })

    const script = sb.build()

    return await new rpc.RPCClient(this.rpcAddress).invokeScript(
      Neon.u.HexString.fromHex(script),
      NeonWcAdapter.buildMultipleSigner(account, cim.signers)
    )
  }

  invokeFunction = async (account: Account, cim: ContractInvocationMulti): Promise<any> => {
    const sb = Neon.create.scriptBuilder()

    cim.invocations.forEach(c => {
      sb.emitContractCall({
        scriptHash: c.scriptHash,
        operation: c.operation,
        args: NeonWcAdapter.convertParams(c.args),
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
      signers: NeonWcAdapter.buildMultipleSigner(account, cim.signers),
    })

    const config = {
      rpcAddress: this.rpcAddress,
      networkMagic: this.networkMagic,
      account,
    }

    const systemFeeOverride = cim.systemFeeOverride
      ? u.BigInteger.fromNumber(cim.systemFeeOverride)
      : cim.extraSystemFee
      ? (await Neon.experimental.txHelpers.getSystemFee(trx.script, config, trx.signers)).add(cim.extraSystemFee)
      : undefined

    const networkFeeOverride = cim.networkFeeOverride
      ? u.BigInteger.fromNumber(cim.networkFeeOverride)
      : cim.extraNetworkFee
      ? (await Neon.experimental.txHelpers.calculateNetworkFee(trx, account, config)).add(cim.extraNetworkFee)
      : undefined

    await Neon.experimental.txHelpers.addFees(trx, {
      ...config,
      systemFeeOverride,
      networkFeeOverride,
    })

    trx.sign(account, this.networkMagic)

    return await rpcClient.sendRawTransaction(trx)
  }

  signMessage = (account: Account, message: string | SignMessagePayload): SignedMessage => {
    if (typeof message === 'string') {
      return this.signMessageLegacy(account, message)
    } else if (message.version === 1) {
      return this.signMessageLegacy(account, message.message)
    } else if (message.version === 2) {
      return this.signMessageNew(account, message.message)
    } else {
      throw new Error('Invalid signMessage version')
    }
  }

  signMessageLegacy = (account: Account, message: string): SignedMessage => {
    const salt = randomBytes(16).toString('hex')
    const parameterHexString = u.str2hexstring(salt + message)
    const lengthHex = u.num2VarInt(parameterHexString.length / 2)
    const messageHex = `010001f0${lengthHex}${parameterHexString}0000`

    return {
      publicKey: account.publicKey,
      data: wallet.sign(messageHex, account.privateKey),
      salt,
      messageHex,
    }
  }

  signMessageNew = (account: Account, message: string): SignedMessage => {
    const salt = randomBytes(16).toString('hex')
    const messageHex = u.str2hexstring(message)

    return {
      publicKey: account.publicKey,
      data: wallet.sign(messageHex, account.privateKey, salt),
      salt,
      messageHex,
    }
  }

  verifyMessage = (verifyArgs: SignedMessage): boolean => {
    return wallet.verify(verifyArgs.messageHex, verifyArgs.data, verifyArgs.publicKey)
  }

  private static convertParams(args: any[]): ContractParam[] {
    return args.map(a => {
      if (a.value === undefined) return a

      switch (a.type as ArgType) {
        case 'Any':
          return sc.ContractParam.any(a.value)
        case 'String':
          return sc.ContractParam.string(a.value)
        case 'Boolean':
          return sc.ContractParam.boolean(a.value)
        case 'PublicKey':
          return sc.ContractParam.publicKey(a.value)
        case 'Address':
        case 'Hash160':
          return sc.ContractParam.hash160(a.value)
        case 'Hash256':
          return sc.ContractParam.hash256(a.value)
        case 'Integer':
          return sc.ContractParam.integer(a.value)
        case 'ScriptHash':
          return sc.ContractParam.hash160(Neon.u.HexString.fromHex(a.value))
        case 'Array':
          return sc.ContractParam.array(...NeonWcAdapter.convertParams(a.value))
        case 'ByteArray':
          return sc.ContractParam.byteArray(a.value)
        default:
          return a
      }
    })
  }

  private static buildSigner(account: Account, signerEntry?: Signer) {
    const signer = new tx.Signer({
      account: account.scriptHash,
    })

    signer.scopes = signerEntry?.scopes ?? WitnessScope.CalledByEntry
    if (signerEntry?.allowedContracts) {
      signer.allowedContracts = signerEntry.allowedContracts.map(ac => Neon.u.HexString.fromHex(ac))
    }
    if (signerEntry?.allowedGroups) {
      signer.allowedGroups = signerEntry.allowedGroups.map(ac => Neon.u.HexString.fromHex(ac))
    }

    return signer
  }

  private static buildMultipleSigner(account: Account, signers: Signer[]) {
    return !signers?.length
      ? [NeonWcAdapter.buildSigner(account)]
      : signers.map(s => NeonWcAdapter.buildSigner(account, s))
  }
}
