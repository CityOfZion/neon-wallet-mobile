import type {DataType} from './types'
import {DataResult} from './DataResult'
export declare class DataStorage {
  constructor(key: string)
  readonly key: string
  static bind(key: string): DataStorage
  as<T = any>(dataType?: DataType<T>): DataResult<T>
  asArrayOf<T = any>(dataType?: DataType<T>): DataResult<T[]>
  asString<T extends string = string>(): DataResult<T>
  asNumber<T extends number = number>(): DataResult<T>
  asBoolean<T extends boolean = boolean>(): DataResult<T>
  asAny(): DataResult<any>
}
