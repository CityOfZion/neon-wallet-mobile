import {ClassType} from 'class-transformer/ClassTransformer'
import {DataKey} from '~src/app/data/DataKey'
import {WrapperConfig} from '~src/config/WrapperConfig'

export declare global {
  type DataType<T> = ClassType<T> | T
  type EnumType<E> = Record<keyof E, number | string> & {[k: number]: string}

  export interface Dictionary<T> {
    [k: string]: T
  }

  type DataKeyName = WrapperConfig['dataKeys'][number]

  type StorageWrapper = {
    [T in DataKeyName]: DataKey<T>
  }

  interface AsyncStorage {
    getItem(
      callback?: (error?: Error, result?: string) => void
    ): Promise<string | null>
    setItem(value: string, callback?: (error?: Error) => void): Promise<void>
    mergeItem(value: string, callback?: (error?: Error) => void): Promise<void>
    removeItem(callback?: (error?: Error) => void): Promise<void>
  }
}
