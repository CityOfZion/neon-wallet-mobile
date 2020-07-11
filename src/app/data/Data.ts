import {
  classToPlain,
  plainToClass,
  plainToClassFromExist,
} from 'class-transformer'
import {ClassType} from 'class-transformer/ClassTransformer'

import {DataStorage} from '~src/app/data/DataStorage'

export class Data<T = any> {
  constructor(dataStore: DataStorage, dataType?: DataType<T>) {
    this.dataStore = dataStore
    this.dataType = dataType
  }

  readonly dataStore: DataStorage
  readonly dataType?: DataType<T>

  async erase() {
    await this.dataStore.storage.removeItem()
  }

  async save(data: T) {
    const content = JSON.stringify(classToPlain(data))
    await this.dataStore.storage.setItem(content)
  }

  async load() {
    const content = await this.dataStore.storage.getItem()

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
      data = plainToClassFromExist(
        this.dataType as T,
        data,
        this.dataStore.classTransformOptions
      )
    } else if (typeof this.dataType === 'function') {
      // Class constructor (CustomClass, Number, String, Boolean, etc.)
      data = plainToClass(
        this.dataType as ClassType<T>,
        data,
        this.dataStore.classTransformOptions
      )
    } else throw Error('Error: Entity should be either a Class or ClassObject')

    return data
  }
}
