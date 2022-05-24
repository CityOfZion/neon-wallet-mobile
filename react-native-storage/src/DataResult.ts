import {
  classToPlain,
  ClassTransformOptions,
  plainToClass,
  plainToClassFromExist,
} from 'class-transformer'
import type {DataType} from './types'
import type {DataStorage} from './DataStorage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type {ClassType} from 'class-transformer/ClassTransformer'
import {StorageListener} from './StorageListener'

export class DataResult<T = any> {
  constructor(dataStore: DataStorage, dataType?: DataType<T>) {
    this.dataStore = dataStore
    this.dataType = dataType
  }

  private readonly dataStore: DataStorage
  readonly dataType?: DataType<T>

  async erase() {
    StorageListener.emitStorageStart(`erase${this.dataStore.key}`)
    await AsyncStorage.removeItem(this.dataStore.key)
    StorageListener.emitStorageEnd(`erase${this.dataStore.key}`)
  }

  async save(data: T, options?: ClassTransformOptions) {
    const content = JSON.stringify(classToPlain(data, options))

    StorageListener.emitStorageStart(`save${this.dataStore.key}`)
    await AsyncStorage.setItem(this.dataStore.key, content)
    StorageListener.emitStorageEnd(`save${this.dataStore.key}`)
  }

  async load(options?: ClassTransformOptions) {
    StorageListener.emitStorageStart(`load${this.dataStore.key}`)
    const content = await AsyncStorage.getItem(this.dataStore.key)
    StorageListener.emitStorageEnd(`load${this.dataStore.key}`)

    if (content === null) {
      return null
    }

    let data: T = JSON.parse(content ?? '{}')

    if (this.dataType === undefined) {
      return data
    }

    if (typeof this.dataType === 'object') {
      // Class object instance from constructor (new CustomClass())
      // The instance will be automatically populated
      data = plainToClassFromExist(this.dataType as T, data, options)
    } else if (typeof this.dataType === 'function') {
      // Class constructor (CustomClass, Number, String, Boolean, etc.)
      data = plainToClass(this.dataType as ClassType<T>, data, options)
    } else throw Error('Error: Entity should be either a Class or ClassObject')

    return data
  }
}
