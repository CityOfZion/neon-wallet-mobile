import { DataStorage } from '@simpli/react-native-storage'

export class DataKey<T extends string> {
  key: string

  constructor(uniqueKey: T) {
    this.key = uniqueKey
  }

  bind() {
    return DataStorage.bind(this.key)
  }
}
