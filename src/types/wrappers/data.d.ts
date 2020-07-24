import {DataKey} from '~src/app/DataKey'
import {WrapperConfig} from '~src/config/WrapperConfig'

export declare global {
  type EnumType<E> = Record<keyof E, number | string> & {[k: number]: string}

  export interface Dictionary<T> {
    [k: string]: T
  }

  type DataKeyName = WrapperConfig['dataKeys'][number]

  type StorageWrapper = {
    [T in DataKeyName]: DataKey<T>
  }
}
