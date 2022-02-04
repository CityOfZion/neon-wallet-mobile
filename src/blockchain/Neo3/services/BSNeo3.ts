import Neon, {api, wallet, u, rpc, tx} from '@cityofzion/neon-js-next'
import {
  Nep17TransferIntent,
  signingConfig,
} from '@cityofzion/neon-js-next/node_modules/@cityofzion/neon-api/lib/NetworkFacade'
import {JsonRpcRequest, JsonRpcResponse} from '@json-rpc-tools/utils'
import type * as AsteroidSDK from '@moonlight-io/asteroid-sdk-js'
import {ImageLoadEventData, NativeModules, Platform} from 'react-native'

import {AsteroidHelper} from '~/src/helpers/AsteroidHelper'
import {NeoNode} from '~/src/models/NeoNode'
import {TokenAsset} from '~/src/models/TokenAsset'
import {Account} from '~/src/models/redux/Account'
import {NeoNative} from '~/src/native/NeoNative'
import {
  IBlockchainService,
  BlockchainServiceKey,
  SenderTransactionInfo,
  AssetInfo,
  IClaimable,
  IWalletConnect,
} from '~src/blockchain'
import {Neo3ProviderOptions} from '~src/blockchain/Neo3'
import {Neo3Provider} from '~src/blockchain/Neo3/providers/common'
import {
  ContractInvocationMulti,
  NeonWcAdapter,
} from '~src/helpers/NeonWcAdapter'

const icon = require('~/src/assets/images/icon-neo-white.png') as ImageLoadEventData
const feeTokenImg = require('~src/assets/nep5/png/GAS.png')
const SDK: typeof AsteroidSDK = require('~src/vendor/asteroid-sdk')

export interface ContractParam {
  type: string
  name: string
}
export class BSNeo3 implements IBlockchainService, IClaimable, IWalletConnect {
  provider: Neo3Provider
  key: BlockchainServiceKey
  icon = icon
  cozTip: {address: string; token: string; hash: string}
  accountsPool: Account[] = []
  readonly magicNumber = 844378958
  readonly derivationPath = "m/44'/888'/0'/0/?"
  readonly platform = 'neo'
  readonly assets: AssetInfo[] = [
    {
      name: 'NEO',
      hash: 'ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5',
      symbol: 'NEO',
      decimals: 0,
    },
    {
      name: 'GAS',
      hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
      symbol: 'GAS',
      decimals: 8,
    },
  ]
  readonly feeToken: {hash: string; token: string; img: ImageLoadEventData}
  readonly wcChains: string[]
  constructor() {
    this.provider = Neo3ProviderOptions('doraSDK')
    this.key = 'neo3'
    this.feeToken = {
      hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
      token: 'GAS',
      img: feeTokenImg,
    }
    this.cozTip = {
      address: 'NXWJfovnpRaj2r3yrYQXDMvBLixv9zJZsk',
      token: 'GAS',
      hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
    } //eslint-disable-next-line
    this.wcChains = __DEV__ ? ['neo3:testnet'] : ['neo3:mainnet']
  }

  rpcCall = async (
    address: string,
    request: JsonRpcRequest
  ): Promise<JsonRpcResponse> => {
    const neoAccount = await this.getNeoAccount(address)
    const nodes = await this.provider.getAllNodes()
    const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

    if (!neoAccount) throw new Error('No account')
    if (!bestUrl) throw new Error('Blockchain unavailable, try again')

    return await (await NeonWcAdapter.init(bestUrl)).rpcCall(
      neoAccount,
      request
    )
  }

  validateAddress(address: string) {
    return address.startsWith('n') || address.startsWith('N') //the method wallet.isAddress doesn't work correctly
  }
  validateWif(wif: string) {
    return wallet.isWIF(wif)
  }
  validatePrivateKeyWithPassword(privateKey: string) {
    return wallet.isNEP2(privateKey)
  }
  generateMnemonic() {
    const keychain = new SDK.Keychain()
    keychain.generateMnemonic(128) // 12 words

    const list = keychain.mnemonic?.toString() ?? null
    return list?.split(' ') ?? null
  }

  generateWif(mnemonic: string, index: number) {
    const keychain = AsteroidHelper.getKeychainFromMnemonic(mnemonic)

    const childKey = keychain.generateChildKey(
      this.platform,
      this.derivationPath.replace(/\?$/, index.toString())
    )

    return childKey.getWIF()
  }

  generateAccount(
    mnemonic: string,
    index: number
  ): {wif: string; address: string} {
    const wif = this.generateWif(mnemonic, index)
    const {WIF, address} = new wallet.Account(wif)
    return {wif: WIF, address}
  }

  generateAccountFromWif(wif: string) {
    const {address} = new wallet.Account(wif)
    return address
  }

  async sendTransaction(sendtx: SenderTransactionInfo) {
    const {senderAddress} = sendtx
    try {
      if (!senderAddress) throw new Error('Sender address not defined')

      const nodes = await this.provider.getAllNodes()
      const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

      if (!bestUrl) throw new Error('Blockchain unavailable, try again')

      const facade = await api.NetworkFacade.fromConfig({node: bestUrl})

      const intents = await this.buildNep17(sendtx)
      const signing = await this.signing(senderAddress)

      const result = await facade.transferToken(intents, signing)

      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async decryptKey(encryptedKey: string, password: string) {
    return new Promise<{address: string; wif: string}>(
      async (resolve, reject) => {
        if (Platform.OS === 'ios') {
          try {
            NativeModules.RNNeoSdkBindings.decryptNep2(
              encryptedKey,
              password,
              (wif: string | null) => {
                if (wif) {
                  const newAccount = new wallet.Account(wif)
                  if (newAccount.address)
                    resolve({address: newAccount.address, wif})
                  else reject(new Error('Key decryption failed'))
                } else {
                  reject(new Error('Key decryption failed'))
                }
              }
            )
          } catch (error) {
            reject(new Error('Key decryption failed'))
          }
        } else {
          try {
            const wif = await NeoNative.decryptNep2(password, encryptedKey)
            const newAccount = new wallet.Account(wif)
            if (newAccount.address) resolve({address: newAccount.address, wif})
            else reject(new Error('Key decryption failed'))
          } catch (error) {
            reject(new Error('Key decryption failed'))
          }
        }
      }
    )
  }

  async claimGas(address: string) {
    const response = await this.provider.getBalance(address)
    const neoHash = this.assets.find((asset) => asset.symbol === 'NEO')?.hash
    const neoBalance = response.balance.filter(
      (balance) => balance.assetSymbol === 'NEO'
    )
    const gasBalance = response.balance.filter(
      (balance) => balance.assetSymbol === 'GAS'
    )

    if (neoBalance.length < 1)
      throw new Error("Address don't have NEO to make a claim")
    if (!neoHash) throw new Error('NEO not found')

    const tokenFee = new TokenAsset('NEO', 'NEO', neoHash, this.key)
    tokenFee.amount = neoBalance[0].amount ?? 0
    const gasFee = await this.calculateTransferFee({
      receiverAddress: address,
      senderAddress: address,
      token: tokenFee,
    })
    const gasAmount = gasBalance[0].amount ?? 0

    if (gasAmount < gasFee) {
      throw new Error('Insuficient GAS to complete transaction')
    }

    const neoAccount = await this.getNeoAccount(address)
    if (!neoAccount) throw new Error('Account invalid to get claim')

    const signing = await this.signing(address)
    const nodes = await this.provider.getAllNodes()
    const url = NeoNode.getHighestNodeUrlFromPool(nodes)

    if (!url) throw new Error('Problem to do claim')

    const facade = await api.NetworkFacade.fromConfig({node: url})
    const txid = await facade.claimGas(neoAccount, signing)
    return {
      txid,
      token: this.feeToken.token,
      hash: this.feeToken.hash,
    }
  }

  async calculateFee(senderAddress: string, cim: ContractInvocationMulti) {
    const fromAccount = await this.getNeoAccount(senderAddress)

    if (!fromAccount) throw new Error('Account not found')
    const sb = Neon.create.scriptBuilder()

    cim.invocations.forEach((invocation) => {
      sb.emitContractCall({
        scriptHash: invocation.scriptHash,
        operation: invocation.operation,
        args: NeonWcAdapter.convertParams(invocation.args),
      })
    })
    const script = sb.build()

    const defaultEndpoint = 'http://seed1.neo.org:10332'
    const node = (await this.provider.getAllNodes())[0]
    const endpoint = node.url

    const rpcClient = new rpc.NeoServerRpcClient(endpoint ?? defaultEndpoint)

    const currentHeight = await rpcClient.getBlockCount()

    const trx = new tx.Transaction({
      script: Neon.u.HexString.fromHex(script),
      validUntilBlock: currentHeight + 100,
      signers: NeonWcAdapter.buildMultipleSigner(fromAccount, cim.signers),
    })

    const magicNumber = await NeonWcAdapter.getMagicOfRpcAddress(
      endpoint ?? defaultEndpoint
    )

    const config = {
      networkMagic: magicNumber,
      rpcAddress: endpoint ?? defaultEndpoint,
    }

    const networkFee = await Neon.experimental.txHelpers.calculateNetworkFee(
      trx,
      fromAccount,
      config
    )
    const systemFee = await Neon.experimental.txHelpers.getSystemFee(
      Neon.u.HexString.fromHex(script),
      config
    )

    return {
      networkFee: Number(networkFee / 10 ** 8),
      systemFee: Number(systemFee / 10 ** 8),
    }
  }

  async calculateTransferFee(sendtx: Omit<SenderTransactionInfo, 'feeAmount'>) {
    try {
      const {receiverAddress, senderAddress, token} = sendtx
      if (!receiverAddress) throw new Error('Receiver address is invalid')
      if (!senderAddress) throw new Error('Sender address is invalid')
      if (!token) throw new Error('Token is invalid')

      const fromAccount = await this.getNeoAccount(senderAddress)

      if (!fromAccount) throw new Error('Account not found')

      const defaultEndpoint = 'http://seed1.neo.org:10332'
      const node = (await this.provider.getAllNodes())[0]
      const endpoint = node.url

      const rpcClient = new rpc.NeoServerRpcClient(endpoint ?? defaultEndpoint)

      const intents = await this.buildNep17(sendtx)

      const txbuilder = new api.TransactionBuilder()
      for (const intent of intents) {
        if (intent.decimalAmt) {
          const [tokenInfo] = await api.getTokenInfos(
            [intent.contractHash],
            rpcClient
          )
          const amt = u.BigInteger.fromDecimal(
            intent.decimalAmt,
            tokenInfo.decimals
          )
          txbuilder.addNep17Transfer(
            intent.from,
            intent.to,
            intent.contractHash,
            amt
          )
        }
      }
      const {feePerByte, executionFeeFactor} = await api.getFeeInformation(
        rpcClient
      )

      const txn = txbuilder.build()
      const networkFee = api.calculateNetworkFee(
        txn,
        feePerByte,
        executionFeeFactor
      )
      const invokeFunctionResponse = await rpcClient.invokeScript(
        u.HexString.fromHex(txn.script),
        [
          {
            account: fromAccount.scriptHash,
            scopes: String(tx.WitnessScope.CalledByEntry),
          },
        ]
      )
      const requiredSystemFee = u.BigInteger.fromNumber(
        invokeFunctionResponse.gasconsumed
      )

      return (
        Number(requiredSystemFee.toDecimal(8)) + Number(networkFee.toDecimal(8))
      )
    } catch (error) {
      console.log('Error calculate fee')
      console.log(error)
      throw new Error(error)
    }
  }

  setAccountsPool(accounts: Account[]) {
    this.accountsPool = accounts
  }

  private async signing(address: string) {
    const neoAccount = await this.getNeoAccount(address)
    if (!neoAccount) throw new Error('Sender Address in invalid')
    const result: signingConfig = {
      signingCallback: api.signWithAccount(neoAccount),
    }
    return result
  }

  private async buildNep17(sendtx: Omit<SenderTransactionInfo, 'feeAmount'>) {
    const intents: Nep17TransferIntent[] = []
    const {token, receiverAddress, senderAddress, tip} = sendtx
    if (!token) throw new Error('Token not defined')
    if (!senderAddress) throw new Error('Sender address not defined')
    if (!receiverAddress) throw new Error('Receiver address not defined')

    const neoAccount = await this.getNeoAccount(senderAddress)
    if (!neoAccount) throw new Error('Sender Address in invalid')

    intents.push({
      to: receiverAddress,
      from: neoAccount,
      contractHash: token.hash,
      decimalAmt: token.amount,
    })

    if (tip) {
      intents.push({
        to: tip.address,
        from: neoAccount,
        contractHash: this.cozTip.hash,
        decimalAmt: tip.amount,
      })
    }
    return intents
  }

  private async getNeoAccount(address: string) {
    const account = this.accountsPool.find((it) => it.address === address)
    const wifAccount = await account?.getWif()
    return wifAccount ? new wallet.Account(wifAccount) : null
  }
}
