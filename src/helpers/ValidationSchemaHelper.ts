import zod from 'zod'

export type TValidationSchemaHelperAccountSchema = zod.infer<typeof accountSchema>

export type TValidationSchemaHelperWalletSchema = zod.infer<typeof walletSchema>

export type TValidationSchemaHelperBackupAccountSchema = zod.infer<typeof backupAccountSchema>

export type TValidationSchemaHelperBackupWalletSchema = zod.infer<typeof backupWalletSchema>

export type TValidationSchemaHelperNeonBackupDataSchema = zod.infer<typeof neonBackupDataSchema>

export type TValidationSchemaHelperNeonBackupFileSchema = zod.infer<typeof neonBackupFileSchema>

export type TValidationSchemaHelperNeonMigrateSchema = zod.infer<typeof neonMigrateSchema>

export type TValidationSchemaHelperNep6BackupSchema = zod.infer<typeof nep6BackupSchema>

const accountSchema = zod.object({
  id: zod.string(),
  address: zod.string(),
  type: zod.union([zod.literal('standard'), zod.literal('watch'), zod.literal('hardware')]),
  idWallet: zod.string(),
  name: zod.string(),
  blockchain: zod.union([
    zod.literal('neo3'),
    zod.literal('neoLegacy'),
    zod.literal('neox'),
    zod.literal('bitcoin'),
    zod.literal('solana'),
    zod.literal('ethereum'),
    zod.literal('polygon'),
    zod.literal('base'),
    zod.literal('arbitrum'),
    zod.literal('stellar'),
  ]),
  order: zod.number(),
  skin: zod.union([
    zod.object({
      id: zod.string(),
      type: zod.literal('color'),
    }),
    zod.object({
      id: zod.string(),
      type: zod.literal('local'),
    }),
    zod.object({
      id: zod.string(),
      type: zod.literal('nft'),
      imgUrl: zod.string(),
      contractHash: zod.string(),
    }),
  ]),
})

const walletSchema = zod.object({
  id: zod.string(),
  type: zod.union([zod.literal('standard'), zod.literal('hardware'), zod.literal('non-standard')]),
  name: zod.string(),
  lastVisitedAt: zod.string().optional(),
  backupStatus: zod.union([
    zod.literal('successful'),
    zod.literal('unsuccessful'),
    zod.literal('unsuccessful_with_knowledge'),
  ]),
})

const contactSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  addresses: zod.array(
    zod.object({
      address: zod.string(),
      blockchain: zod.string(),
    })
  ),
})

const swapSchema = zod.object({
  account: accountSchema,
  txFrom: zod.string().optional(),
  txTo: zod.string().optional(),
  swapProvider: zod.literal('simpleswap'),
  swapId: zod.string().optional(),
  swapStatus: zod.any(),
  tokenFrom: zod.any(),
  tokenTo: zod.any(),
  amountFrom: zod.string(),
  amountTo: zod.string(),
  addressTo: zod.string(),
  extraIdTo: zod.string().optional(),
  fee: zod.string().optional(),
})

const backupAccountSchema = accountSchema.omit({ blockchain: true }).extend({
  blockchain: zod.string(),
  key: zod.string().optional(),
})

const backupWalletSchema = walletSchema
  .omit({
    lastVisitedAt: true,
    backupStatus: true,
    type: true,
  })
  .extend({
    type: zod.union([zod.literal('standard'), zod.literal('hardware')]),
    mnemonic: zod.string().optional(),
    accounts: zod.array(backupAccountSchema),
  })

const neonBackupDataSchema = zod.object({
  wallets: zod.array(backupWalletSchema),
  contacts: zod.array(contactSchema),
  swapRecords: zod.array(swapSchema).optional(),
})

const neonBackupFileSchema = zod.object({
  version: zod.number(),
  data: zod.string(),
})

const neonMigrateAccountSchema = zod.object({
  address: zod.string().nullish(),
  label: zod.string().nullish(),
  key: zod.string().nullish(),
})

const neonMigrateContactSchema = zod.object({
  name: zod.string().nullish(),
  addresses: zod.array(zod.string()).nullish(),
})

const neonMigrateSchema = zod.object({
  accounts: zod.array(neonMigrateAccountSchema),
  contacts: zod.array(neonMigrateContactSchema),
})

const nep6BackupAccountSchema = zod.object({
  address: zod.string(),
  label: zod.string().nullish(),
  key: zod.string().nullish(),
})

const nep6BackupSchema = zod.object({
  version: zod.string(),
  scrypt: zod.looseObject({}),
  accounts: zod.array(nep6BackupAccountSchema).nonempty(),
})

export class ValidationSchemaHelper {
  static parseBackupFile(data: unknown): TValidationSchemaHelperNeonBackupFileSchema {
    return neonBackupFileSchema.parse(data)
  }

  static parseBackupData(data: unknown): TValidationSchemaHelperNeonBackupDataSchema {
    return neonBackupDataSchema.parse(data)
  }

  static parseAccount(data: unknown): TValidationSchemaHelperAccountSchema {
    return accountSchema.parse(data)
  }

  static parseWallet(data: unknown): TValidationSchemaHelperWalletSchema {
    return walletSchema.parse(data)
  }

  static parseNeonMigrate(data: unknown): TValidationSchemaHelperNeonMigrateSchema {
    return neonMigrateSchema.parse(data)
  }

  static parseNep6Backup(data: unknown): TValidationSchemaHelperNep6BackupSchema {
    return nep6BackupSchema.parse(data)
  }
}
