import type { TBSAccount } from '@cityofzion/blockchain-service'
import { BSKeychainHelper, hasLedger } from '@cityofzion/blockchain-service'
import type Transport from '@ledgerhq/hw-transport'
import HIDTransport from '@ledgerhq/react-native-hid'
import BleTransport from '@ledgerhq/react-native-hw-transport-ble'
import type { Device as BleDevice } from '@sfourdrinier/react-native-ble-plx'
import { cloneDeep } from 'lodash'
import { DeviceEventEmitter } from 'react-native'

import { I18nextHelper } from '@/helpers/I18nextHelper'

import { ledgerUSBVendorId } from '@ledgerhq/devices/lib-es/index'

import { BlockchainServiceHelper } from './BlockchainServiceHelper'
import { AbortError, AppError } from './ErrorHelper'
import { LoggerHelper } from './LoggerHelper'
import { ReduxHelper } from './ReduxHelper'
import { UtilsHelper } from './UtilsHelper'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { THardwareWalletHelperConnectByUsbParams, THardwareWalletHelperGetAccountParams } from '@/types/helpers'

const { t } = I18nextHelper.get()

export class HardwareWalletHelper {
  static #connectByUsbMaxAttempts = 10

  static #transport?: Transport
  static removeDeviceDetachListener?: () => void
  static onHardwareWalletDisconnect?: () => void

  static async #connect(transport: Transport): Promise<TBSAccount<TBlockchainServiceKey>[]> {
    if (this.#transport) {
      throw new AppError(t('hardwareWallet.errors.disconnectFirst'))
    }

    const newAccounts: TBSAccount<TBlockchainServiceKey>[] = []

    const services = Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName)

    const lastIndexesByWallet = ReduxHelper.store.getState().utility.data.lastIndexesByWallet

    for (const service of services) {
      try {
        if (!hasLedger(service)) continue

        const accounts = await service.ledgerService.getAccounts(transport, lastIndexesByWallet)

        newAccounts.push(...accounts)
      } catch {
        /* empty */
      }
    }

    if (newAccounts.length === 0) {
      transport.close()
      throw new AppError(t('hardwareWallet.errors.accountsNotFound'))
    }

    this.#transport = transport

    return cloneDeep(newAccounts)
  }

  static async connectByUsb({ abortSignal }: THardwareWalletHelperConnectByUsbParams) {
    for (let index = 0; index < this.#connectByUsbMaxAttempts; index++) {
      if (index > 0) {
        await UtilsHelper.sleep(2000)
      }

      if (abortSignal?.aborted) {
        throw new AbortError()
      }

      try {
        const devices = await HIDTransport.list()
        if (!devices.length) {
          throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))
        }

        const device = devices[0]

        const transport = await HIDTransport.open(device)

        const accounts = await this.#connect(transport)

        const disconnectedSubscription = DeviceEventEmitter.addListener('onDeviceDisconnect', async device => {
          if (device.vendorId !== ledgerUSBVendorId) return
          this.disconnect()
        })

        this.removeDeviceDetachListener = () => {
          disconnectedSubscription.remove()
        }

        return accounts
      } catch {
        /* empty */
      }
    }

    throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))
  }

  static async connectByBluetooth(device: BleDevice) {
    const transport = await BleTransport.open(device)

    const accounts = await this.#connect(transport)

    const disconnectedSubscription = device.onDisconnected(async () => {
      this.disconnect()
    })

    this.removeDeviceDetachListener = () => {
      disconnectedSubscription.remove()
    }

    return accounts
  }

  static async disconnect() {
    if (this.#transport) {
      await this.#transport.close()
    }

    this.#transport = undefined
    this.removeDeviceDetachListener?.()
    this.onHardwareWalletDisconnect?.()
  }

  static async getAccount({ blockchain, index }: THardwareWalletHelperGetAccountParams) {
    if (!this.#transport) {
      throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))
    }

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]
    if (!hasLedger(service)) {
      throw new AppError(t('hardwareWallet.errors.blockchainNotSupported', { blockchain }))
    }

    const account = await service.ledgerService.getAccount(this.#transport, index)

    return cloneDeep(account)
  }

  static async getTransport(account: TBSAccount<TBlockchainServiceKey>) {
    try {
      if (!this.#transport) throw new AppError(t('hardwareWallet.errors.hardwareWalletNotFound'))

      if (!account.bip44Path) throw new AppError(t('hardwareWallet.errors.missingBip44Path'))

      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[account.blockchain]
      if (!hasLedger(service))
        throw new AppError(t('hardwareWallet.errors.blockchainNotSupported', { blockchain: account.blockchain }))

      const index = BSKeychainHelper.extractIndexFromPath(account.bip44Path)

      const hardwareAccount = await service.ledgerService.getAccount(this.#transport, index)
      if (hardwareAccount.address !== account.address) {
        throw new AppError(t('hardwareWallet.errors.accountIsNotHardware'))
      }

      // Give some time for the transport to be ready for the next request
      await UtilsHelper.sleep(500)

      return this.#transport
    } catch (error) {
      LoggerHelper.error(error, { where: 'HardwareWalletHelper', operation: 'getTransport' })
      throw new AppError(t('hardwareWallet.errors.hardwareWalletIsNotConnectOrUnlocked'), error)
    }
  }

  static listenForUsbDeviceAttached(callback: () => void | Promise<void>) {
    const deviceSubscription = DeviceEventEmitter.addListener('onDeviceConnect', async (device: any) => {
      if (device.vendorId !== ledgerUSBVendorId) return
      callback()
    })

    return () => {
      deviceSubscription.remove()
    }
  }

  static listenForBluetoothDevice(callback: (devices: BleDevice[]) => void) {
    let devices: { device: BleDevice; time: number }[] = []

    return BleTransport.listen({
      complete: () => void 0,
      error: () => void 0,
      next: event => {
        if (event.type !== 'add') return

        const device = event.descriptor
        const now = Date.now()

        const filteredDevices = devices
          .filter(item => now - item.time < 5000)
          .filter(item => item.device.id !== device.id)

        devices = [...filteredDevices, { device, time: now }]
        callback(devices.map(item => item.device))
      },
    })
  }
}
