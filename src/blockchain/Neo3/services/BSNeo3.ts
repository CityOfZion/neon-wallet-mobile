import Neon, { api, u, rpc, experimental, sc, tx, wallet } from '@cityofzion/neon-js-next'
import { CommonConfig } from '@cityofzion/neon-js-next/lib/experimental/types'
import {
  Nep17TransferIntent,
  signingConfig,
} from '@cityofzion/neon-js-next/node_modules/@cityofzion/neon-api/lib/NetworkFacade'
import { JsonRpcResponse } from '@json-rpc-tools/utils'
import axios from 'axios'
import { ImageLoadEventData, NativeModules, Platform } from 'react-native'

import tokens from '../tokens.json'

import { SessionRequest } from '~/src/contexts/WalletConnectContext'
import { AsteroidHelper, keychain } from '~/src/helpers/AsteroidHelper'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { NeoNode } from '~/src/models/NeoNode'
import { Account } from '~/src/models/redux/Account'
import { ExchangeInfo } from '~/src/models/response/ExchangeInfo'
import { NFTResponse } from '~/src/models/response/NFTResponse'
import { NFTSResponse } from '~/src/models/response/NFTSResponse'
import { NeoNative } from '~/src/native/NeoNative'
import {
  IBlockchainService,
  BlockchainServiceKey,
  SendTransactionData,
  IClaimable,
  IWalletConnect,
  INFT,
  IToken,
} from '~src/blockchain'
import { Neo3ProviderOptions } from '~src/blockchain/Neo3'
import { Neo3Provider } from '~src/blockchain/Neo3/providers/common'
import { ContractInvocationMulti, NeonWcAdapter } from '~src/helpers/NeonWcAdapter'

const icon = require('~/src/assets/images/icon-neo-white.png') as ImageLoadEventData

interface GhostMarketNFT {
  nft: {
    token_id: string
    symbol: string
    contract: string
    collection: {
      name: string
      logo_url: string
    }
    nft_metadata: {
      name: string
      image: string
    }
  }
}

interface GhostMarketAssets {
  assets: GhostMarketNFT[]
  total_results: number
}

export interface ContractParam {
  type: string
  name: string
}

export type FlamingoExchangeResponse = {
  symbol: string
  usd_price: number
}[]
export class BSNeo3 implements IBlockchainService, IClaimable, IWalletConnect, INFT {
  provider: Neo3Provider
  key: BlockchainServiceKey
  icon = icon
  cozTip: { address: string; token: string; hash: string }
  accountsPool: Account[] = []
  private defaultEndpoint = 'https://mainnet1.neo.coz.io:443'
  readonly magicNumber = 844378958
  readonly derivationPath = "m/44'/888'/0'/0/?"
  readonly platform = 'neo'
  readonly nativeAssets: string[] = ['NEO', 'GAS']
  readonly feeToken: { hash: string; token: string }
  readonly wcChains: string[]
  readonly tokens: IToken[] = tokens as IToken[]
  constructor() {
    this.provider = Neo3ProviderOptions('doraSDK')
    this.key = 'neo3'
    this.feeToken = {
      hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
      token: 'GAS',
    }
    this.cozTip = {
      address: 'NXWJfovnpRaj2r3yrYQXDMvBLixv9zJZsk',
      token: 'GAS',
      hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
    } //eslint-disable-next-line
    this.wcChains = ['neo3:mainnet']
  }

  rpcCall = async (address: string, request: SessionRequest): Promise<JsonRpcResponse> => {
    const neoAccount = await this.getNeoAccount(address)
    const nodes = await this.provider.getAllNodes()
    const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

    if (!neoAccount) {
      throw new Error('No account')
    }
    if (!bestUrl) {
      throw new Error('Blockchain unavailable, try again')
    }

    return await (await NeonWcAdapter.init(bestUrl)).rpcCall(neoAccount, request)
  }

  validateAddress(address: string) {
    const regex = new RegExp('^N\\S{33}$')
    const validAddress = regex.exec(address)

    if (validAddress?.[0]) {
      return true
    }

    return false
  }
  validateWif(wif: string) {
    return wallet.isWIF(wif)
  }
  validatePrivateKeyWithPassword(privateKey: string) {
    return wallet.isNEP2(privateKey)
  }
  generateMnemonic() {
    keychain.generateMnemonic(128) // 12 words

    const list = keychain.mnemonic?.toString() ?? null
    return list?.split(' ') ?? null
  }

  async generateWif(mnemonic: string, index: number) {
    const childKey = AsteroidHelper.getKeychainFromMnemonic(mnemonic).generateChildKey(
      this.platform,
      this.derivationPath.replace(/\?$/, index.toString())
    )
    return childKey.getWIF()
  }

  async generateAccount(mnemonic: string, index: number) {
    const wif = await this.generateWif(mnemonic, index)
    const { WIF, address } = new wallet.Account(wif)
    return { wif: WIF, address }
  }

  generateAccountFromWif(wif: string) {
    const { address } = new wallet.Account(wif)
    return address
  }

  async sendTransaction(data: SendTransactionData) {
    try {
      if (!data.senderAddress) {
        throw new Error('Sender address not defined')
      }

      const nodes = await this.provider.getAllNodes()
      const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

      if (!bestUrl) {
        throw new Error('Blockchain unavailable, try again')
      }

      const facade = await api.NetworkFacade.fromConfig({ node: bestUrl })

      const intents = await this.buildNep17(data)
      const signing = await this.signing(data.senderAddress)

      const result = await facade.transferToken(intents, signing)

      return result
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  async decryptKey(encryptedKey: string, password: string) {
    return new Promise<{ address: string; wif: string }>(async (resolve, reject) => {
      if (Platform.OS === 'ios') {
        try {
          NativeModules.RNNeoSdkBindings.decryptNep2(encryptedKey, password, (wif: string | null) => {
            if (wif) {
              const newAccount = new wallet.Account(wif)
              if (newAccount.address) {
                resolve({ address: newAccount.address, wif })
              } else {
                reject(new Error('Key decryption failed'))
              }
            } else {
              reject(new Error('Key decryption failed'))
            }
          })
        } catch {
          reject(new Error('Key decryption failed'))
        }
      } else {
        try {
          const wif = await NeoNative.decryptNep2(password, encryptedKey)
          const newAccount = new wallet.Account(wif)
          if (newAccount.address) {
            resolve({ address: newAccount.address, wif })
          } else {
            reject(new Error('Key decryption failed'))
          }
        } catch {
          reject(new Error('Key decryption failed'))
        }
      }
    })
  }

  async claimGas(address: string) {
    const response = await this.provider.getBalance(address)

    const neoHash = this.tokens.find(token => token.symbol === 'NEO')?.hash

    const neoBalance = response.filter(balance => balance.symbol === 'NEO')
    const gasBalance = response.filter(balance => balance.symbol === 'GAS')

    if (neoBalance.length < 1) {
      throw new Error("Address don't have NEO to make a claim")
    }
    if (!neoHash) {
      throw new Error('NEO not found')
    }

    const gasFee = await this.calculateTransferFee({
      receiverAddress: address,
      senderAddress: address,
      tokenHash: neoHash,
      amount: neoBalance[0].amount ?? 0,
    })

    const gasAmount = gasBalance[0].amount ?? 0

    if (gasAmount < gasFee) {
      throw new Error('Insuficient GAS to complete transaction')
    }

    const neoAccount = await this.getNeoAccount(address)
    if (!neoAccount) {
      throw new Error('Account invalid to get claim')
    }

    const signing = await this.signing(address)
    const nodes = await this.provider.getAllNodes()
    const url = NeoNode.getHighestNodeUrlFromPool(nodes)

    if (!url) {
      throw new Error('Problem to do claim')
    }

    const facade = await api.NetworkFacade.fromConfig({ node: url })
    const txid = await facade.claimGas(neoAccount, signing)
    return {
      txid,
      token: this.feeToken.token,
      hash: this.feeToken.hash,
      fee: gasFee,
    }
  }

  async calculateFee(senderAddress: string, requestParams: ContractInvocationMulti) {
    const fromAccount = await this.getNeoAccount(senderAddress)

    if (!fromAccount) {
      throw new Error('Account not found')
    }

    const node = (await this.provider.getAllNodes())[0]
    const endpoint = node.url

    const nwcAdapter = await NeonWcAdapter.init(endpoint ?? this.defaultEndpoint)
    const testInvokeResult = await nwcAdapter.testInvoke(fromAccount, requestParams)

    return UtilsHelper.convertToArbitraryDecimals(Number(testInvokeResult.gasconsumed))
  }

  async calculateTransferFee(data: Omit<SendTransactionData, 'fee'>) {
    try {
      const fromAccount = await this.getNeoAccount(data.senderAddress)

      if (!fromAccount) {
        throw new Error('Account not found')
      }

      const node = (await this.provider.getAllNodes())[0]
      const endpoint = node.url

      const rpcClient = new rpc.NeoServerRpcClient(endpoint ?? this.defaultEndpoint)

      const args = [
        sc.ContractParam.hash160(data.senderAddress),
        sc.ContractParam.hash160(data.receiverAddress),
        sc.ContractParam.integer(data.amount),
        sc.ContractParam.string(''),
      ]

      const script = Neon.create.scriptBuilder().emitContractCall({
        scriptHash: data.tokenHash,
        operation: 'transfer',
        args,
      })

      if (data.tip) {
        script.emitContractCall({
          scriptHash: this.cozTip.hash,
          operation: 'transfer',
          args: [
            sc.ContractParam.hash160(data.senderAddress),
            sc.ContractParam.hash160(this.cozTip.address),
            sc.ContractParam.integer(data.tip),
            sc.ContractParam.string(''),
          ],
        })
      }

      const buildScript = script.build()

      const currentHeight = await rpcClient.getBlockCount()
      const {
        protocol: { network: networkMagic },
      } = await rpcClient.getVersion()

      const config: CommonConfig = {
        networkMagic,
        rpcAddress: endpoint ?? this.defaultEndpoint,
      }

      const txn = new tx.Transaction({
        script: buildScript,
        validUntilBlock: currentHeight + 100,
        signers: [
          new tx.Signer({
            account: fromAccount.scriptHash,
            scopes: String(tx.WitnessScope.CalledByEntry),
          }),
        ],
      })
      const networkFee = await experimental.txHelpers.calculateNetworkFee(txn, fromAccount, config)
      const invokeFunctionResponse = await rpcClient.invokeScript(u.HexString.fromHex(buildScript), [
        {
          account: fromAccount.scriptHash,
          scopes: String(tx.WitnessScope.CalledByEntry),
        },
      ])
      const requiredSystemFee = u.BigInteger.fromNumber(invokeFunctionResponse.gasconsumed)

      return Number(requiredSystemFee.toDecimal(8)) + Number(networkFee.toDecimal(8))
    } catch (error: any) {
      console.log('Error calculate fee')
      console.log(error)
      throw new Error(error)
    }
  }

  setAccountsPool(accounts: Account[]) {
    this.accountsPool = accounts
  }

  async getNFTS(address: string, page: number = 1): Promise<NFTSResponse> {
    const nftPageLimit = 18

    const url = this.buildGhostMarketURL('assets', {
      owner: address,
      limit: nftPageLimit,
      offset: nftPageLimit * (page - 1),
      with_total: 1,
    })

    const { data } = await axios.get(url)

    const { assets, total_results: totalResults } = data as GhostMarketAssets

    const totalPages = Math.ceil(totalResults / nftPageLimit)

    const nftsResponse = new NFTSResponse({ totalPages })

    assets.forEach(({ nft }) => {
      const nftResponse = new NFTResponse({
        collectionImage: this.treatGhostMarketImage(nft.collection.logo_url),
        collectionName: nft.collection.name,
        image: this.treatGhostMarketImage(nft.nft_metadata.image),
        name: nft.nft_metadata.name,
        symbol: nft.symbol,
        id: nft.token_id,
        contractHash: nft.contract,
      })

      nftsResponse.items.push(nftResponse)
    })

    return nftsResponse
  }

  async getNFT(tokenId: string, hash: string): Promise<NFTResponse> {
    const url = this.buildGhostMarketURL('assets', {
      token_id: tokenId,
      contract: hash,
    })

    const { data } = await axios.get(url)

    const [{ nft }] = data.assets

    const nftResponse = new NFTResponse({
      collectionImage: this.treatGhostMarketImage(nft.collection.logo_url),
      collectionName: nft.collection.name,
      image: this.treatGhostMarketImage(nft.nft_metadata.image),
      name: nft.nft_metadata.name,
      symbol: nft.symbol,
      id: nft.token_id,
      contractHash: nft.contract,
    })

    return nftResponse
  }

  async getExchange(currency: string): Promise<ExchangeInfo[]> {
    const { data: prices } = await axios.get<FlamingoExchangeResponse>('https://api.flamingo.finance/token-info/prices')

    let currencyRatio: number = 1

    if (currency !== 'USD') {
      const { data } = await axios.get<number>(`https://api.flamingo.finance/fiat/exchange-rate?pair=USD_${currency}`)

      currencyRatio = data
    }

    return prices.map(price => ({
      amount: price.usd_price * currencyRatio,
      symbol: price.symbol,
    }))
  }

  private async signing(address: string) {
    const neoAccount = await this.getNeoAccount(address)
    if (!neoAccount) {
      throw new Error('Sender Address in invalid')
    }
    const result: signingConfig = {
      signingCallback: api.signWithAccount(neoAccount),
    }
    return result
  }

  private async buildNep17({
    tokenHash,
    amount,
    receiverAddress,
    senderAddress,
    tip,
  }: Omit<SendTransactionData, 'fee'>) {
    const intents: Nep17TransferIntent[] = []

    const neoAccount = await this.getNeoAccount(senderAddress)
    if (!neoAccount) {
      throw new Error('Sender Address in invalid')
    }

    intents.push({
      to: receiverAddress,
      from: neoAccount,
      contractHash: tokenHash,
      decimalAmt: amount,
    })

    if (tip) {
      intents.push({
        to: this.cozTip.address,
        from: neoAccount,
        contractHash: this.cozTip.hash,
        decimalAmt: tip,
      })
    }

    return intents
  }

  private async getNeoAccount(address: string) {
    const account = this.accountsPool.find(it => it.address === address)
    const wifAccount = await account?.getWif()
    return wifAccount ? new wallet.Account(wifAccount) : null
  }

  private treatGhostMarketImage(srcImage?: string) {
    if (!srcImage) {
      return
    }

    if (srcImage.startsWith('ipfs://')) {
      const [, imageId] = srcImage.split('://')

      return `https://ipfs.ghostmarket.io/ipfs/${imageId}`
    }

    return srcImage
  }

  private buildGhostMarketURL(path: string, params?: Record<string, string | number>) {
    const chain = 'n3'

    const baseUrl = 'https://api.ghostmarket.io/api/v1'

    const parameters =
      params && Object.keys(params).length > 0
        ? Object.keys(params).reduce((acc, item) => acc + `&${item}=${params[item]}`, '')
        : ''

    const url = `${baseUrl}/${path}?chain=${chain}${parameters}`

    return url
  }
}
