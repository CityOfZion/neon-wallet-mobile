import {ClassTransformOptions} from 'class-transformer'

import {DataStorage} from '~src/app/data/DataStorage'

export class DataKey<T extends string> {
  key: string

  constructor(uniqueKey: T) {
    this.key = uniqueKey
  }

  bind(options?: ClassTransformOptions) {
    return new DataStorage(this.key, options)
  }
}
