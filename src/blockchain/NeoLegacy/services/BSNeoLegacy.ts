import {
  SendAssetConfig,
  DoInvokeConfig,
} from '@cityofzion/neon-api/lib/funcs/types'
import {tx} from '@cityofzion/neon-core'
import {api, nep5, wallet} from '@cityofzion/neon-js'
import type * as AsteroidSDK from '@moonlight-io/asteroid-sdk-js'
import i18n from 'i18n-js'
import moment from 'moment'
import {Platform, NativeModules, ImageLoadEventData} from 'react-native'

import {appBus} from '~/src/app/AppBus'
import {AsteroidHelper} from '~/src/helpers/AsteroidHelper'
import {ContractInvocationMulti} from '~/src/helpers/NeonWcAdapter'
import {UtilsHelper} from '~/src/helpers/UtilsHelper'
import {Account} from '~/src/models/redux/Account'
import {Settings} from '~/src/models/redux/Settings'
import {
  BlockchainServiceKey,
  IBlockchainService,
  AssetInfo,
  IClaimable,
  SenderTransactionInfo,
} from '~src/blockchain'
import {NeoLegacyProviderOption} from '~src/blockchain/NeoLegacy'
import {TNeoLegacyProvider} from '~src/blockchain/NeoLegacy/providers'
import {TokenAsset} from '~src/models/TokenAsset'
import {NeoNative} from '~src/native/NeoNative'

const icon = require('~/src/assets/images/icon-neo-white.png') as ImageLoadEventData
const feeTokenImg = require('~src/assets/nep5/png/GAS.png')
const SDK: typeof AsteroidSDK = require('~src/vendor/asteroid-sdk')
export class BSNeoLegacy implements IClaimable, IBlockchainService {
  readonly siteUrlQuery = `https://dora.coz.io/transaction/neo2/mainnet/`
  readonly networkDeprecatedLabel = 'MainNet'
  readonly defaultNodeNet = 'http://seed1.ngd.network:10332'
  cozTip: {address: string; token: string; hash: string}
  provider: TNeoLegacyProvider
  key: BlockchainServiceKey
  readonly icon = icon
  readonly derivationPath = "m/44'/888'/0'/0/?"
  readonly platform = 'neo'
  readonly assets: AssetInfo[] = [
    {
      name: 'NEO',
      hash: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      symbol: 'NEO',
      decimals: 0,
    },
    {
      name: 'GAS',
      hash: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
      symbol: 'GAS',
      decimals: 8,
    },
  ]
  readonly feeToken: {hash: string; token: string; img: ImageLoadEventData}
  readonly wcChains: string[]
  accountsPool: Account[] = []
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
      img: feeTokenImg,
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

  async sendTransaction(sendTx: SenderTransactionInfo) {
    const {token, senderAddress, receiverAddress, feeAmount, tip} = sendTx
    const fees = feeAmount

    if (!token) throw new Error('Token not defined')
    if (!senderAddress) throw new Error('Sender address not defined')
    if (!receiverAddress) throw new Error('Receiver address not defined')

    const {symbol, amount} = token
    const nativeAssets = this.assets.map(({name}) => {
      return name
    })

    if (nativeAssets.includes(symbol)) {
      const assets = symbol as 'GAS' | 'NEO'

      return await this.sendNativeAsset(
        senderAddress,
        receiverAddress,
        assets,
        amount,
        fees?.fee,
        tip ? tip.amount : undefined,
        tip ? tip.address : undefined
      )
    }

    return await this.sendNep5Asset(
      senderAddress,
      receiverAddress,
      token,
      fees?.fee,
      tip ? tip.amount : undefined,
      tip ? tip.address : undefined
    )
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

  validateAddress(address: string) {
    return wallet.isAddress(address)
  }

  validatePrivateKeyWithPassword(privateKey: string) {
    return wallet.isNEP2(privateKey)
  }

  validateWif(privateKey: string) {
    return wallet.isWIF(privateKey)
  }

  async calculateFee(senderAddress: string, cim: ContractInvocationMulti) {
    throw new Error('function not available to neo legacy')
    return {systemFee: 0, networkFee: 0}
  }

  async calculateTransferFee(sendtx: Omit<SenderTransactionInfo, 'feeAmount'>) {
    return 0
  }

  private async getNeoAccount(address: string) {
    const account = this.accountsPool.find((it) => it.address === address)
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
    const listUrls = (await this.provider.getAllNodes()).map((node) => node.url)

    let intents: tx.TransactionOutput[]

    if (tipAmount && tipReceiverAddress) {
      const tipIntent = api.makeIntent({GAS: tipAmount}, tipReceiverAddress)
      const assetIntent = api.makeIntent({[asset]: amount}, receiverAddress)
      intents = assetIntent.concat(tipIntent)
    } else {
      intents = api.makeIntent({[asset]: amount}, receiverAddress)
    }

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(this.networkDeprecatedLabel)

    const sendResponse = new Promise<SendAssetConfig>(
      async (resolve, reject) => {
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
              } catch (error) {
                reject(error)
                throw new Error(error.message)
              }
            }, 8000)
          }
        }
      }
    )

    return (await sendResponse).tx?.hash ?? null
  }

  private async sendNep5Asset(
    senderAddress: string,
    receiverAddress: string,
    token: TokenAsset,
    fees?: number,
    tipAmount?: number,
    tipReceiverAddress?: string
  ) {
    const neoAccount = await this.getNeoAccount(senderAddress)
    const pool = await this.provider.getAllNodes()
    const height = pool.reduce(
      (max, node) => Math.max(max, node.height ?? 0),
      pool[0]?.height ?? 0
    )
    const url =
      pool.find((it) => it.height === height)?.url ?? this.defaultNodeNet

    if (!neoAccount) {
      throw new Error('Neo Account not found')
    }

    const apiProvider = new api.neoscan.instance(this.networkDeprecatedLabel)

    const scBuilder = nep5.abi.transfer(
      token.hash,
      neoAccount.address,
      receiverAddress,
      token.amount
    )

    let invokeResponse: DoInvokeConfig

    if (tipAmount && tipReceiverAddress) {
      const tipIntent = api.makeIntent({GAS: tipAmount}, tipReceiverAddress)
      invokeResponse = await api.doInvoke({
        api: apiProvider,
        url,
        account: neoAccount,
        script: scBuilder().str,
        fees,
        intents: tipIntent,
      })
    } else {
      invokeResponse = await api.doInvoke({
        api: apiProvider,
        url,
        account: neoAccount,
        script: scBuilder().str,
        fees,
      })
    }

    appBus.emit('transactionStart', invokeResponse)

    return invokeResponse.tx?.hash ?? null
  }

  async claimGas(address: string) {
    try {
      const account = this.accountsPool.find((it) => it.address === address)

      const neoAccount = await this.getNeoAccount(address)

      if (!neoAccount) {
        throw new Error('Neo Account not found')
      }

      const response = await this.provider.getBalance(address)
      const balance = response.balance.find((it) => it.assetSymbol === 'NEO')
      const amount = balance?.amount ?? null
      const requiresTransaction = Boolean(amount)

      const apiProvider = new api.neoscan.instance(this.networkDeprecatedLabel)

      const lastClaimedTransaction =
        account?.flattedAllTransactions.find(
          (it) => it.senderAddress === 'claim' || it.receiverAddress === 'claim'
        ) ?? null

      const nextClaimAllowed = lastClaimedTransaction?.sentAt
        ? moment(lastClaimedTransaction.sentAt).add(5, 'minutes')
        : null

      // NW-473 After you claim gas, you have to wait 5 minutes to claim again
      if (nextClaimAllowed && moment().isBefore(nextClaimAllowed)) {
        throw new Error(i18n.t('toast.gasClaimGapError'))
      }

      if (requiresTransaction) {
        await this.sendNativeAsset(address, address, 'NEO', amount ?? 0)
      }

      const claimGasResponse = await api.claimGas({
        api: apiProvider,
        account: neoAccount,
      })

      return {
        txid: claimGasResponse.response?.txid ?? null,
        token: this.cozTip.token,
        hash: this.cozTip.hash,
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  private async watchTransaction(
    txid: string,
    onComplete?: () => void,
    maxAttempts = 10,
    intervalInMs = 3000
  ) {
    await UtilsHelper.sleep(intervalInMs)

    try {
      await this.provider.getTransaction(txid)

      if (onComplete) onComplete()
    } catch {
      if (maxAttempts > 0) {
        await this.watchTransaction(
          txid,
          onComplete,
          maxAttempts - 1,
          intervalInMs
        )
      }
    }
  }
}
