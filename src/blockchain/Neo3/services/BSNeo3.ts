import { wallet } from '@cityofzion/n3-neon-core'
import Neon, { api } from '@cityofzion/n3-neon-js'
import { ContractInvocationMulti, ContractInvocation } from '@cityofzion/neo3-invoker'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import { JsonRpcResponse } from '@json-rpc-tools/utils'
import axios from 'axios'
import queryString from 'query-string'
import { ImageLoadEventData, NativeModules, Platform } from 'react-native'

import { IconDappsListResponse } from '../../common'
import tokens from '../tokens.json'

import { SessionRequest } from '~/src/contexts/WalletConnectContext'
import { AsteroidHelper, keychain } from '~/src/helpers/AsteroidHelper'
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
  IconDapps,
} from '~src/blockchain'
import { Neo3ProviderOptions } from '~src/blockchain/Neo3'
import { Neo3Provider } from '~src/blockchain/Neo3/providers/common'
import { NeonWcAdapter } from '~src/helpers/NeonWcAdapter'
const icon = require('~/src/assets/images/icon-neo-white.png') as ImageLoadEventData

type ImgMediaTypes = 'image/svg+xml' | 'image/png' | 'image/jpeg'

interface GhostMarketNFT {
  tokenId?: string
  contract: {
    chain?: string
    hash?: string
    symbol?: string
  }
  creator: {
    address?: string
    offchainName?: string
  }
  apiUrl?: string
  ownerships: {
    owner: {
      address?: string
    }
  }[]
  collection: {
    name?: string
    logoUrl?: string
  }
  metadata: {
    description: string
    mediaType: ImgMediaTypes
    mediaUri: string
    mintDate: number
    mintNumber: number
    name: string
  }
}

interface GhostMarketAssets {
  assets: GhostMarketNFT[]
  total: number
}

export interface ContractParam {
  type: string
  name: string
}

export type FlamingoExchangeResponse = {
  symbol: string
  usd_price: number
}[]
export class BSNeo3 implements IBlockchainService, IClaimable, IWalletConnect, INFT, IconDapps {
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
  readonly feeToken: { hash: string; token: string; decimals: number }
  readonly wcChains: string[]
  readonly tokens: IToken[] = tokens as IToken[]
  constructor() {
    this.provider = Neo3ProviderOptions('doraSDK')
    this.key = 'neo3'
    this.feeToken = {
      hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
      token: 'GAS',
      decimals: 8,
    }
    this.cozTip = {
      address: 'NXWJfovnpRaj2r3yrYQXDMvBLixv9zJZsk',
      token: 'GAS',
      hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
    } //eslint-disable-next-line
    this.wcChains = ['neo3:mainnet']
  }
  iconDappsScriptHash: string = '489e98351485bbd85be99618285932172f1862e4'

  setAccountsPool(accounts: Account[]) {
    this.accountsPool = accounts
  }

  async getIconList(scriptHashList: string[]): Promise<Map<string, { sm: string; lg: string }>> {
    const nodes = await this.provider.getAllNodes()
    const rpcAddress = NeoNode.getHighestNodeUrlFromPool(nodes) ?? this.defaultEndpoint
    const parser = NeonParser
    const invoker = await NeonInvoker.init(rpcAddress)
    const res = await invoker.testInvoke({
      invocations: [
        {
          scriptHash: this.iconDappsScriptHash,
          operation: 'getMultipleMetaData',
          args: [{ type: 'Array', value: scriptHashList.map(hash => ({ type: 'Hash160', value: hash })) }],
        },
      ],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }
    const formattedResult: IconDappsListResponse = parser.parseRpcResponse(res.stack[0], {
      ByteStringToScriptHash: true,
    })

    return this.adaptGetIconList(formattedResult)
  }

  private adaptGetIconList(parseResponse: IconDappsListResponse) {
    const adaptedResult = new Map<string, { sm: string; lg: string }>()
    Object.keys(parseResponse).forEach(parseResponseKey => {
      const parseResponseValue = parseResponse[parseResponseKey]
      if (Object.keys(parseResponseValue).length > 0) {
        adaptedResult.set(parseResponseKey.startsWith('0x') ? parseResponseKey : `0x${parseResponseKey}`, {
          sm: parseResponseValue['icon/25x25'],
          lg: parseResponseValue['icon/288x288'],
        })
      }
    })
    return adaptedResult
  }

  rpcCall = async (address: string, request: SessionRequest): Promise<JsonRpcResponse> => {
    const neoAccount = await this.getNeoAccount(address)

    if (!neoAccount) {
      throw new Error('No account')
    }

    const nodes = await this.provider.getAllNodes()
    const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

    return await (await NeonWcAdapter.init(bestUrl ?? this.defaultEndpoint, neoAccount)).rpcCall(request)
  }

  async calculateFee(senderAddress: string, requestParams: ContractInvocationMulti) {
    const fromAccount = await this.getNeoAccount(senderAddress)

    if (!fromAccount) {
      throw new Error('Account not found')
    }

    const nodes = await this.provider.getAllNodes()
    const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

    const nwcAdapter = await NeonWcAdapter.init(bestUrl ?? this.defaultEndpoint, fromAccount)
    const testInvoke = await nwcAdapter.invoke.testInvoke(requestParams)
    const extraNetworkFee = requestParams.extraNetworkFee ? this.fixDecimalPlaces(requestParams.extraNetworkFee, 8) : 0
    const extraSystemFee = requestParams.extraSystemFee ? this.fixDecimalPlaces(requestParams.extraSystemFee, 8) : 0
    const gasconsumed = this.fixDecimalPlaces(Number(testInvoke.gasconsumed), 8)
    const summedFee = gasconsumed + extraNetworkFee + extraSystemFee
    return summedFee.toString()
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

  async sendTransaction(data: SendTransactionData) {
    const account = await this.getNeoAccount(data.senderAddress)

    if (!account) {
      throw new Error('Account not found')
    }

    const nodes = await this.provider.getAllNodes()
    const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

    const invocations: ContractInvocation[] = [
      {
        operation: 'transfer',
        scriptHash: data.tokenHash,
        args: [
          { type: 'Hash160', value: data.senderAddress },
          { type: 'Hash160', value: data.receiverAddress },
          { type: 'Integer', value: Neon.u.BigInteger.fromDecimal(data.amount, data.tokenDecimals).toString() },
          { type: 'Any', value: '' },
        ],
      },
    ]

    if (data.tip) {
      invocations.push({
        operation: 'transfer',
        scriptHash: this.cozTip.hash,
        args: [
          { type: 'Hash160', value: data.senderAddress },
          { type: 'Hash160', value: this.cozTip.address },
          { type: 'Integer', value: Neon.u.BigInteger.fromDecimal(data.tip, 8).toString() },
          { type: 'Any', value: '' },
        ],
      })
    }

    const invoker = await NeonInvoker.init(bestUrl ?? this.defaultEndpoint, account)
    const transactionHash = await invoker.invokeFunction({
      invocations,
      signers: [],
    })

    return transactionHash
  }

  async claimGas(address: string) {
    const neoAccount = await this.getNeoAccount(address)
    if (!neoAccount) {
      throw new Error('Account invalid to get claim')
    }

    const nodes = await this.provider.getAllNodes()
    const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

    const facade = await api.NetworkFacade.fromConfig({ node: bestUrl ?? this.defaultEndpoint })
    const transactionHash = await facade.claimGas(neoAccount, {
      signingCallback: api.signWithAccount(neoAccount),
    })

    return transactionHash
  }

  async calculateTransferFee(data: Omit<SendTransactionData, 'fee'>) {
    const account = await this.getNeoAccount(data.senderAddress)

    if (!account) {
      throw new Error('Account not found')
    }

    const nodes = await this.provider.getAllNodes()
    const bestUrl = NeoNode.getHighestNodeUrlFromPool(nodes)

    const invocations: ContractInvocation[] = [
      {
        operation: 'transfer',
        scriptHash: data.tokenHash,
        args: [
          { type: 'Hash160', value: data.senderAddress },
          { type: 'Hash160', value: data.receiverAddress },
          { type: 'Integer', value: Neon.u.BigInteger.fromDecimal(data.amount, data.tokenDecimals).toString() },
          { type: 'Any', value: '' },
        ],
      },
    ]

    if (data.tip) {
      invocations.push({
        operation: 'transfer',
        scriptHash: this.cozTip.hash,
        args: [
          { type: 'Hash160', value: data.senderAddress },
          { type: 'Hash160', value: this.cozTip.address },
          { type: 'Integer', value: Neon.u.BigInteger.fromDecimal(data.tip, 8).toString() },
          { type: 'Any', value: '' },
        ],
      })
    }

    const invoker = await NeonInvoker.init(bestUrl ?? this.defaultEndpoint, account)
    const { total } = await invoker.calculateFee({
      invocations,
      signers: [],
    })

    return total
  }

  async getNFTS(address: string, page: number = 1): Promise<NFTSResponse> {
    const nftPageLimit = 18
    const params = {
      owners: [address],
      size: nftPageLimit,
      page,
      getTotal: true,
    }

    const { nfts, total } = await this.getGhostMarketNFT(params)

    const totalPages = Math.ceil(total / nftPageLimit)

    const nftsResponse = new NFTSResponse({ totalPages })

    nfts.forEach(nft => {
      const nftResponse = new NFTResponse({
        collectionImage: this.treatGhostMarketImage(nft.collection.image),
        collectionName: nft.collection.name,
        image: this.treatGhostMarketImage(nft.image),
        name: nft.name,
        symbol: nft.symbol,
        id: nft.id,
        contractHash: nft.contract,
      })

      nftsResponse.items.push(nftResponse)
    })

    return nftsResponse
  }

  async getNFT(tokenId: string, hash: string): Promise<NFTResponse> {
    const url = this.buildGhostMarketURL('assets', {
      tokenId,
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
      id: nft.tokenId,
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

      return `https://ghostmarket.mypinata.cloud/ipfs/${imageId}`
    }

    return srcImage
  }

  private buildGhostMarketURL(path: string, params?: Record<string, any | any[]>) {
    const chain = 'n3'

    const baseUrl = 'https://api.ghostmarket.io/api/v2'

    const parameters = queryString.stringify(
      {
        chain,
        ...params,
      },
      { arrayFormat: 'bracket' }
    )

    const url = `${baseUrl}/${path}?${parameters}`

    return url
  }

  private async getGhostMarketNFT(params: Record<string, any | any[]>) {
    const response = await fetch(this.buildGhostMarketURL('assets', params))

    const data = await response.json()

    const { assets, total } = data as GhostMarketAssets

    const nfts = assets.map(nft => {
      return {
        imageType: nft.metadata.mediaType,
        name: nft.metadata.name,
        image: nft.metadata.mediaUri,
        chain: nft.contract.chain ?? '',
        symbol: nft.contract.symbol ?? '',
        contract: nft.contract.hash ?? '',
        id: nft.tokenId ?? '',
        creatorName: nft.creator.offchainName ?? '',
        creatorAddress: nft.creator.address ?? '',
        ownerAddress: nft.ownerships[0].owner.address ?? '',
        apiUrl: nft.apiUrl ?? '',
        collection: {
          image: nft.collection.logoUrl ?? '',
          name: nft.collection.name ?? '',
        },
      }
    })

    return {
      nfts,
      total,
    }
  }

  private fixDecimalPlaces(value: number, decimalPlaces: number) {
    return value / 10 ** decimalPlaces
  }
}
