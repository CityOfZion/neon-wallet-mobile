import { api, sc, wallet, u, CONST, rpc } from '@cityofzion/neon-js'
import { TransactionOutput } from '@cityofzion/neon-js/node_modules/@cityofzion/neon-core/lib/tx/components/TransactionOutput'
import axios from 'axios'
import { Platform, NativeModules } from 'react-native'

import { DoraSDKProvider } from '../providers/DoraSDKProvider'
import { NeoLegacyProvider } from '../providers/common'

import { tokensByBlockchain } from '~/src/assets/tokens/infos'
import { blockchainConfig } from '~/src/config/BlockchainConfig'
import { AsteroidHelper, keychain } from '~/src/helpers/AsteroidHelper'
import { ExchangeInfo } from '~/src/models/response/ExchangeInfo'
import {
  BlockchainServiceKey,
  IBlockchainService,
  IClaimable,
  SendTransactionData,
  TCOZTip,
  TFeeToken,
  TNetwork,
  INFT,
  IWalletConnect,
  IIconDapps,
} from '~src/blockchain'
import { NeoNative } from '~src/native/NeoNative'

type TNativeAssetSymbol = 'GAS' | 'NEO'
type NativeAsset = {
  symbol: TNativeAssetSymbol
  hash: string
}

export interface CryptoCompareExchangeResponse {
  RAW: {
    [symbol: string]: {
      [currency: string]: {
        PRICE: number
      }
    }
  }
}

export class BSNeoLegacy implements IClaimable, IBlockchainService {
  readonly key: BlockchainServiceKey = 'neoLegacy'

  network!: TNetwork
  provider!: NeoLegacyProvider

  readonly derivationPath = "m/44'/888'/0'/0/?"
  readonly platform = 'neo'
  readonly nativeAssets: NativeAsset[] = [
    { hash: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7', symbol: 'GAS' },
    { hash: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b', symbol: 'NEO' },
  ]
  readonly feeToken: TFeeToken = {
    hash: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
    token: 'GAS',
    decimals: 8,
  }
  readonly cozTip: TCOZTip = {
    address: 'AVav2pJu9S5rpsLyne2iC4vG63ngqT7uv9',
    symbol: 'GAS',
    hash: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
    decimals: 8,
  }

  constructor() {
    this.setNetwork(blockchainConfig.defaultSelectedNetworks.neoLegacy)
  }

  isClaimable(): this is IClaimable {
    return true
  }

  hasNFTIntegration(): this is INFT {
    return false
  }

  hasWalletConnectIntegration(): this is IWalletConnect {
    return false
  }

  hasIconDappsIntegration(): this is IIconDapps {
    return false
  }

  setNetwork(network: TNetwork) {
    if (network.type === 'custom') throw new Error('Custom network is not supported for NEO Legacy')

    this.network = network
    this.provider = new DoraSDKProvider(this.network)
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
    const nativeAsset = this.nativeAssets.find(asset => asset.hash === data.tokenHash)

    if (nativeAsset) {
      return await this.sendNativeAsset(
        data.senderWif,
        data.receiverAddress,
        nativeAsset.symbol,
        data.amount,
        data.fee,
        data.tip
      )
    }

    return await this.sendNep5Asset(data)
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

  validateAddress(address: string) {
    return wallet.isAddress(address)
  }

  validatePrivateKeyWithPassword(privateKey: string) {
    return wallet.isNEP2(privateKey)
  }

  validateWif(privateKey: string) {
    return wallet.isWIF(privateKey)
  }

  async claimGas(wif: string) {
    const account = new wallet.Account(wif)

    const balances = await this.provider.getBalance(account.address)
    const NEOBalance = balances.find(balance => balance.symbol === 'NEO')

    const apiProvider = new api.neoscan.instance(this.network.url)

    if (NEOBalance) {
      await this.sendNativeAsset(account.address, account.address, 'NEO', NEOBalance.amount)
    }

    const claimGasResponse = await api.claimGas({
      api: apiProvider,
      url: this.network.url,
      account,
    })

    return claimGasResponse.response?.txid ?? null
  }

  async getExchange(currency: string): Promise<ExchangeInfo[]> {
    if (this.network.type !== 'mainnet') throw new Error('Exchange is only available on mainnet')

    const tokensSymbols = tokensByBlockchain[this.key][this.network.type].map(token => token.symbol)

    const url = 'https://min-api.cryptocompare.com/data/pricemultifull'
    const { data: prices } = await axios.get<CryptoCompareExchangeResponse>(url, {
      params: {
        fsyms: tokensSymbols.join(','),
        tsyms: currency,
      },
    })

    return Object.entries(prices.RAW).map(([symbol, price]) => ({
      symbol,
      amount: price[currency].PRICE,
    }))
  }

  async calculateTransferFee() {
    return 0
  }

  async getBlockCount(): Promise<number> {
    const rpcClient = new rpc.RPCClient(this.network.url)
    return await rpcClient.getBlockCount()
  }

  /**
   * Only GAS or NEO
   */
  private async sendNativeAsset(
    senderWif: string,
    receiverAddress: string,
    nativeAssetSymbol: TNativeAssetSymbol,
    amount: number,
    fees?: number,
    tip?: number
  ) {
    const account = new wallet.Account(senderWif)

    let intents: TransactionOutput[]

    if (tip) {
      const tipIntent = api.makeIntent({ [this.cozTip.symbol]: tip }, this.cozTip.address)
      const assetIntent = api.makeIntent({ [nativeAssetSymbol]: amount }, receiverAddress)
      intents = assetIntent.concat(tipIntent)
    } else {
      intents = api.makeIntent({ [nativeAssetSymbol]: amount }, receiverAddress)
    }

    const apiProvider = new api.neoscan.instance(this.network.url)

    const sendResponse = await api.sendAsset({
      url: this.network.url,
      account,
      api: apiProvider,
      intents,
      fees,
    })

    return sendResponse.tx?.hash ?? null
  }

  private async sendNep5Asset({ amount, receiverAddress, senderWif, tokenHash, fee, tip }: SendTransactionData) {
    const account = new wallet.Account(senderWif)

    const apiProvider = new api.neoscan.instance(this.network.url)
    const scBuilder = new sc.ScriptBuilder()

    const tokenHashFixed = tokenHash.replace('0x', '')
    const fromHash = u.reverseHex(wallet.getScriptHashFromAddress(account.address))
    const toHash = u.reverseHex(wallet.getScriptHashFromAddress(receiverAddress))
    const adjustedAmt = new u.Fixed8(amount).toRawNumber()
    scBuilder.emitAppCall(tokenHashFixed, 'transfer', [
      fromHash,
      toHash,
      sc.ContractParam.integer(adjustedAmt.toString()),
    ])

    if (tip) {
      const tipToHash = u.reverseHex(wallet.getScriptHashFromAddress(this.cozTip.address))
      const tipAdjustedAmt = new u.Fixed8(tip).toRawNumber()
      scBuilder.emitAppCall(CONST.ASSET_ID[this.cozTip.symbol], 'transfer', [
        fromHash,
        tipToHash,
        sc.ContractParam.integer(tipAdjustedAmt.toString()),
      ])
    }

    const invokeResponse = await api.doInvoke({
      api: apiProvider,
      url: this.network.url,
      account,
      script: scBuilder.str,
      fees: fee,
    })

    return invokeResponse.tx?.hash ?? null
  }
}
