import { rpc, wallet } from '@cityofzion/n3-neon-core'
import Neon, { api } from '@cityofzion/n3-neon-js'
import { ContractInvocation } from '@cityofzion/neo3-invoker'
import { NeonInvoker } from '@cityofzion/neon-invoker'
import { NeonParser } from '@cityofzion/neon-parser'
import axios from 'axios'
import queryString from 'query-string'
import { NativeModules, Platform } from 'react-native'

import { TCOZTip, TFeeToken, TNetwork, TNetworkType } from '../../common'
import { DoraSDKProvider } from '../providers/DoraSDKProviderNeo3'

import { blockchainConfig } from '~/src/config/BlockchainConfig'
import { AsteroidHelper, keychain } from '~/src/helpers/AsteroidHelper'
import { ContractMethod } from '~/src/models/ContractMethod'
import { ContractParameter } from '~/src/models/ContractParameter'
import { ContractResponse } from '~/src/models/response/ContractResponse'
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
  IIconDapps,
} from '~src/blockchain'
import { Neo3Provider } from '~src/blockchain/Neo3/providers/common'

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

export class BSNeo3 implements IBlockchainService, IClaimable, IWalletConnect, INFT, IIconDapps {
  network!: TNetwork
  provider!: Neo3Provider

  readonly key: BlockchainServiceKey = 'neo3'
  readonly cozTip: TCOZTip = {
    address: 'NXWJfovnpRaj2r3yrYQXDMvBLixv9zJZsk',
    symbol: 'GAS',
    hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
    decimals: 8,
  }
  readonly feeToken: TFeeToken = {
    hash: 'd2a4cff31913016155e38e474a2c06d08be276cf',
    token: 'GAS',
    decimals: 8,
  }
  readonly magicNumber = 844378958
  readonly derivationPath = "m/44'/888'/0'/0/?"
  readonly platform = 'neo'

  constructor() {
    this.setNetwork(blockchainConfig.defaultSelectedNetworks.neo3)
  }

  isClaimable(): this is IClaimable {
    return true
  }

  hasNFTIntegration(): this is INFT {
    return true
  }

  hasWalletConnectIntegration(): this is IWalletConnect {
    return true
  }

  hasIconDappsIntegration(): this is IIconDapps {
    return true
  }

  setNetwork(network: TNetwork) {
    this.network = network
    this.provider = new DoraSDKProvider(this.network)
  }

  async getIcon(hash: string): Promise<string | undefined> {
    if (this.network.type !== 'mainnet') throw new Error('Not supported on custom networks')

    const contractHash = '489e98351485bbd85be99618285932172f1862e4'
    const parser = NeonParser
    const invoker = await NeonInvoker.init(this.network.url)
    const res = await invoker.testInvoke({
      invocations: [
        {
          scriptHash: contractHash,
          operation: 'getMetaData',
          args: [{ type: 'Hash160', value: hash }],
        },
      ],
    })

    if (res.stack.length === 0) {
      throw new Error(res.exception ?? 'unrecognized response')
    }
    const formattedResult = parser.parseRpcResponse(res.stack[0], {
      ByteStringToScriptHash: true,
    })

    return formattedResult['icon/288x288']
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
    const account = new wallet.Account(data.senderWif)

    const invocations: ContractInvocation[] = [
      {
        operation: 'transfer',
        scriptHash: data.tokenHash,
        args: [
          { type: 'Hash160', value: account.address },
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
          { type: 'Hash160', value: account.address },
          { type: 'Hash160', value: this.cozTip.address },
          { type: 'Integer', value: Neon.u.BigInteger.fromDecimal(data.tip, 8).toString() },
          { type: 'Any', value: '' },
        ],
      })
    }

    const invoker = await NeonInvoker.init(this.network.url, account)
    const transactionHash = await invoker.invokeFunction({
      invocations,
      signers: [],
    })

    return transactionHash
  }

  async claimGas(wif: string) {
    const account = new wallet.Account(wif)

    const facade = await api.NetworkFacade.fromConfig({ node: this.network.url })
    const transactionHash = await facade.claimGas(account, {
      signingCallback: api.signWithAccount(account),
    })

    return transactionHash
  }

  async calculateTransferFee(data: Omit<SendTransactionData, 'fee'>) {
    const account = new wallet.Account(data.senderWif)

    const invocations: ContractInvocation[] = [
      {
        operation: 'transfer',
        scriptHash: data.tokenHash,
        args: [
          { type: 'Hash160', value: account.address },
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
          { type: 'Hash160', value: account.address },
          { type: 'Hash160', value: this.cozTip.address },
          { type: 'Integer', value: Neon.u.BigInteger.fromDecimal(data.tip, 8).toString() },
          { type: 'Any', value: '' },
        ],
      })
    }

    const invoker = await NeonInvoker.init(this.network.url, account)
    const { total } = await invoker.calculateFee({
      invocations,
      signers: [],
    })

    return total
  }

  async getBlockCount(): Promise<number> {
    const rpcClient = new rpc.RPCClient(this.network.url)
    return await rpcClient.getBlockCount()
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
    if (this.network.type !== 'mainnet') throw new Error('Exchange is only available on mainnet')

    const pricesURL = 'https://api.flamingo.finance/token-info/prices'
    const { data: prices } = await axios.get<FlamingoExchangeResponse>(pricesURL)

    let currencyRatio: number = 1

    if (currency !== 'USD') {
      const exchangeURL = `https://api.flamingo.finance/fiat/exchange-rate?pair=USD_${currency}`
      const { data } = await axios.get<number>(exchangeURL)
      currencyRatio = data
    }

    return prices.map(price => ({
      amount: price.usd_price * currencyRatio,
      symbol: price.symbol,
    }))
  }

  async getContract(hash: string): Promise<ContractResponse> {
    const contract = new ContractResponse()
    const rpcClient = new rpc.RPCClient(this.network.url)
    const contractState = await rpcClient.getContractState(hash)

    contract.hash = contractState.hash
    contract.name = contractState.manifest.name

    contractState.manifest.abi?.methods.forEach(method => {
      const contractMethod = new ContractMethod()

      contractMethod.name = method.name

      method.parameters.forEach(parameter => {
        const contractParameter = new ContractParameter()

        contractParameter.name = parameter.name
        contractParameter.type = parameter.type

        contractMethod.parameters.push(contractParameter)
      })

      contract.methods.push(contractMethod)
    })

    return contract
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
    if (this.network.type === 'custom') throw new Error('This method does not support custom networks')

    const chainsByNetwork: Partial<Record<TNetworkType, string>> = {
      mainnet: 'n3',
      testnet: 'n3t',
    }

    const baseURlByNetwork: Partial<Record<TNetworkType, string>> = {
      mainnet: 'https://api.ghostmarket.io/api/v2',
      testnet: 'https://api-testnet.ghostmarket.io/api/v2',
    }

    const chain = chainsByNetwork[this.network.type]
    if (!chain) throw new Error('Invalid network')

    const baseUrl = baseURlByNetwork[this.network.type]
    if (!baseUrl) throw new Error('Invalid network')

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
}
