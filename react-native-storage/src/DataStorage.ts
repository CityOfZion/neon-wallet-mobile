import type {DataType} from './types'
import {DataResult} from './DataResult'

export class DataStorage {
  constructor(key: string) {
    this.key = key
  }

  readonly key: string

  static bind(key: string) {
    return new DataStorage(key)
  }

  as<T = any>(dataType?: DataType<T>) {
    return new DataResult(this, dataType)
  }

  asArrayOf<T = any>(dataType?: DataType<T>) {
    return new DataResult<T[]>(this, dataType as DataType<any>)
  }

  asString<T extends string = string>() {
    return new DataResult<T>(this)
  }

  asNumber<T extends number = number>() {
    return new DataResult<T>(this)
  }

  asBoolean<T extends boolean = boolean>() {
    return new DataResult<T>(this)
  }

  asAny() {
    return new DataResult<any>(this)
  }
}
