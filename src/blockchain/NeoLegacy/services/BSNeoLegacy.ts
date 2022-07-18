import { SendAssetConfig, DoInvokeConfig } from '@cityofzion/neon-api/lib/funcs/types'
import { tx } from '@cityofzion/neon-core'
import { api, nep5, wallet } from '@cityofzion/neon-js'
import { u } from '@cityofzion/neon-js-next'
import type * as AsteroidSDK from '@moonlight-io/asteroid-sdk-js'
import { Platform, NativeModules, ImageLoadEventData } from 'react-native'

import tokens from '../tokens.json'

import { AsteroidHelper } from '~/src/helpers/AsteroidHelper'
import { Account } from '~/src/models/redux/Account'
import { BlockchainServiceKey, IBlockchainService, IClaimable, SendTransactionData, IToken } from '~src/blockchain'
import { NeoLegacyProviderOption } from '~src/blockchain/NeoLegacy'
import { TNeoLegacyProvider } from '~src/blockchain/NeoLegacy/providers'
import { NeoNative } from '~src/native/NeoNative'

const icon = require('~/src/assets/images/icon-neo-white.png') as ImageLoadEventData
const SDK: typeof AsteroidSDK = require('~src/vendor/asteroid-sdk')

type NativeAsset = 'GAS' | 'NEO'

export class BSNeoLegacy implements IClaimable, IBlockchainService {
  readonly networkDeprecatedLabel = 'MainNet'
  readonly defaultNodeNet = 'http://seed1.ngd.network:10332'
  cozTip: { address: string; token: string; hash: string }
  provider: TNeoLegacyProvider
  key: BlockchainServiceKey
  readonly icon = icon
  readonly derivationPath = "m/44'/888'/0'/0/?"
  readonly platform = 'neo'
  readonly nativeAssets: NativeAsset[] = ['NEO', 'GAS']
  readonly feeToken: { hash: string; token: string }
  readonly wcChains: string[]
  accountsPool: Account[] = []
  readonly tokens: IToken[] = tokens as IToken[]
  constructor() {
    this.provider = NeoLegacyProviderOption('doraSdk')
    this.key = 'neoLegacy'
    this.cozTip = {
      address: 'AVav2pJu9S5rpsLyne2iC4vG63ngqT7uv9',
      token: 'GAS',
      hash: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
    }
    this.feeToken = {
      hash: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
      token: 'GAS',
    }
    this.wcChains = [] //neoLegacy doesn't support wallet connect
  }

  generateMnemonic() {
    const keychain = new SDK.Keychain()
    keychain.generateMnemonic(128) // 12 words

    const list = keychain.mnemonic?.toString() ?? null
    return list?.split(' ') ?? null
  }

  generateWif(mnemonic: string, index: number) {
    const keychain = AsteroidHelper.getKeychainFromMnemonic(mnemonic)

    const childKey = keychain.generateChildKey(this.platform, this.derivationPath.replace(/\?$/, index.toString()))

    return childKey.getWIF()
  }

  generateAccount(mnemonic: string, index: number): { wif: string; address: string } {
    const wif = this.generateWif(mnemonic, index)
    const { WIF, address } = new wallet.Account(wif)
    return { wif: WIF, address }
  }

  generateAccountFromWif(wif: string) {
    const { address } = new wallet.Account(wif)
    return address
  }

  async sendTransaction(data: SendTransactionData) {
    const hexHash = u.HexString.fromHex(data.tokenHash).toString()

    const token = this.tokens.find(token => token.hash === hexHash)

    const nativeAsset = this.nativeAssets.find(symbol => symbol === token?.symbol)

    if (nativeAsset) {
      return await this.sendNativeAsset(
        data.senderAddress,
        data.receiverAddress,
        nativeAsset,
        data.amount,
        data.fee,
        data.tip,
        this.cozTip.address
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

  async calculateTransferFee() {
    return 0
  }

  private async getNeoAccount(address: string) {
    const account = this.accountsPool.find(it => it.address === address)
    const wifAccount = await account?.getWif()
    return wifAccount ? new wallet.Account(wifAccount) : null
  }

  setAccountsPool(accounts: Account[]) {
    this.accountsPool = accounts
  }

  /**
   * Only GAS or NEO
   */
  private async sendNativeAsset(
    senderAddress: string,
    receiverAddress: string,
    asset: 'GAS' | 'NEO',
    amount: number,
    fees?: number,
    tipAmount?: number,
    tipReceiverAddress?: string
  ) {
    const neoAccount = await this.getNeoAccount(senderAddress)
    const listUrls = (await this.provider.getAllNodes()).map(node => node.url)

    let intents: tx.TransactionOutput[]

    if (tipAmount && tipReceiverAddress) {
      const tipIntent = api.makeIntent({ GAS: tipAmount }, tipReceiverAddress)
      const assetIntent = api.makeIntent({ [asset]: amount }, receiverAddress)
      intents = assetIntent.concat(tipIntent)
    } else {
      intents = api.makeIntent({ [asset]: amount }, receiverAddress)
    }

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(this.networkDeprecatedLabel)

    const sendResponse = new Promise<SendAssetConfig>(async (resolve, reject) => {
      let stopSend = true
      for (let i = 0; i < listUrls.length; i++) {
        if (!stopSend) {
          break
        }
        const url = listUrls[i]
        if (url) {
          setTimeout(async () => {
            try {
              const sendResponse = await api.sendAsset({
                url,
                account: neoAccount,
                api: apiProvider,
                intents,
                fees,
              })
              stopSend = true
              resolve(sendResponse)
            } catch (error: any) {
              reject(error)
              throw new Error(error.message)
            }
          }, 8000)
        }
      }
    })

    return (await sendResponse).tx?.hash ?? null
  }

  private async sendNep5Asset({ amount, receiverAddress, senderAddress, tokenHash, fee, tip }: SendTransactionData) {
    const neoAccount = await this.getNeoAccount(senderAddress)
    const pool = await this.provider.getAllNodes()
    const height = pool.reduce((max, node) => Math.max(max, node.height ?? 0), pool[0]?.height ?? 0)
    const url = pool.find(it => it.height === height)?.url ?? this.defaultNodeNet

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(this.networkDeprecatedLabel)

    const scBuilder = nep5.abi.transfer(tokenHash, neoAccount.address, receiverAddress, amount)

    let invokeResponse: DoInvokeConfig

    if (tip) {
      const tipIntent = api.makeIntent({ GAS: tip }, this.cozTip.address)
      invokeResponse = await api.doInvoke({
        api: apiProvider,
        url,
        account: neoAccount,
        script: scBuilder().str,
        fees: fee,
        intents: tipIntent,
      })
    } else {
      invokeResponse = await api.doInvoke({
        api: apiProvider,
        url,
        account: neoAccount,
        script: scBuilder().str,
        fees: fee,
      })
    }

    return invokeResponse.tx?.hash ?? null
  }

  async claimGas(address: string) {
    try {
      const neoAccount = await this.getNeoAccount(address)

      if (!neoAccount) {
        throw new Error('Neo Account not found')
      }

      const balances = await this.provider.getBalance(address)
      const balance = balances.find(balance => balance.symbol === 'NEO')

      const apiProvider = new api.neoscan.instance(this.networkDeprecatedLabel)

      if (balance) {
        await this.sendNativeAsset(address, address, 'NEO', balance.amount)
      }

      const claimGasResponse = await api.claimGas({
        api: apiProvider,
        account: neoAccount,
      })

      return {
        txid: claimGasResponse.response?.txid ?? null,
        token: this.cozTip.token,
        hash: this.cozTip.hash,
        fee: claimGasResponse.fees ?? null,
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }
}
