import { BlockchainServiceHelper } from './BlockchainServiceHelper'
import { SkinHelper } from './SkinHelper'
import type {
  TValidationSchemaHelperBackupAccountSchema,
  TValidationSchemaHelperBackupWalletSchema,
} from './ValidationSchemaHelper'

import type { TAccount, TAccountType, TSkin, TWallet } from '@/types/store'

export class NeonBackupHelper {
  static readonly fileExtension = 'neonbkp'
  static readonly version = 1
  static readonly algorithm = 'aes-192-cbc'

  static fixAccountProperties(backupAccount: TValidationSchemaHelperBackupAccountSchema): TAccount | undefined {
    if (!BlockchainServiceHelper.doesBlockchainSupported(backupAccount.blockchain)) return

    const type: TAccountType = backupAccount.type === 'hardware' ? 'watch' : backupAccount.type
    let skin: TSkin

    if (!backupAccount.skin || backupAccount.skin.type === 'local' || !SkinHelper.isColorSkin(backupAccount.skin.id)) {
      skin = { type: 'color', id: SkinHelper.getSkinColor() }
    } else {
      skin = backupAccount.skin as TSkin
    }

    return {
      address: backupAccount.address,
      blockchain: backupAccount.blockchain,
      id: backupAccount.id,
      idWallet: backupAccount.idWallet,
      name: backupAccount.name,
      order: backupAccount.order,
      skin,
      type,
    }
  }

  static fixWalletProperties(backupWallet: TValidationSchemaHelperBackupWalletSchema): TWallet {
    const type = !backupWallet.mnemonic ? 'non-standard' : backupWallet.type

    return {
      id: backupWallet.id,
      name: backupWallet.name,
      backupStatus: 'successful',
      type,
    }
  }
}
