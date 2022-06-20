import { DataKey } from '~src/app/DataKey'
import { WrapperConfig } from '~src/config/WrapperConfig'

type DataKeyName = WrapperConfig['dataKeys'][number]

export type StorageWrapper = {
  [T in DataKeyName]: DataKey<T>
}
