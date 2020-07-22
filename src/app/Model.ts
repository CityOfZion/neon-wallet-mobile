import {DataType} from '@simpli/react-native-storage'
import {classToPlain} from 'class-transformer'

export abstract class Model {
  static parse<T = any>(dataType: DataType<any>) {
    if (typeof dataType === 'function') {
      const instance = new dataType()
      return classToPlain(instance) as T
    }

    return classToPlain(dataType) as T
  }
}
