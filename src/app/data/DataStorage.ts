import {useAsyncStorage} from '@react-native-community/async-storage'
import {ClassTransformOptions} from 'class-transformer'

import {Data} from '~src/app/data/Data'

export class DataStorage {
  constructor(key: string, options?: ClassTransformOptions) {
    this.storage = useAsyncStorage(key)
    this.classTransformOptions = options ?? {}
  }

  readonly storage: AsyncStorage
  readonly classTransformOptions: ClassTransformOptions

  as<T = any>(dataType?: DataType<T>) {
    return new Data(this, dataType)
  }

  asArrayOf<T = any>(dataType?: DataType<T>) {
    return new Data<T[]>(this, dataType as DataType<any>)
  }

  asString<T extends string = string>() {
    return new Data<T>(this)
  }

  asNumber<T extends number = number>() {
    return new Data<T>(this)
  }

  asBoolean<T extends boolean = boolean>() {
    return new Data<T>(this)
  }

  asAny() {
    return new Data<any>(this)
  }
}
