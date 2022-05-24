function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { classToPlain, plainToClass, plainToClassFromExist } from 'class-transformer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageListener } from './StorageListener';
export class DataResult {
  constructor(dataStore, dataType) {
    _defineProperty(this, "dataStore", void 0);

    _defineProperty(this, "dataType", void 0);

    this.dataStore = dataStore;
    this.dataType = dataType;
  }

  async erase() {
    StorageListener.emitStorageStart("erase".concat(this.dataStore.key));
    await AsyncStorage.removeItem(this.dataStore.key);
    StorageListener.emitStorageEnd("erase".concat(this.dataStore.key));
  }

  async save(data, options) {
    const content = JSON.stringify(classToPlain(data, options));
    StorageListener.emitStorageStart("save".concat(this.dataStore.key));
    await AsyncStorage.setItem(this.dataStore.key, content);
    StorageListener.emitStorageEnd("save".concat(this.dataStore.key));
  }

  async load(options) {
    StorageListener.emitStorageStart("load".concat(this.dataStore.key));
    const content = await AsyncStorage.getItem(this.dataStore.key);
    StorageListener.emitStorageEnd("load".concat(this.dataStore.key));

    if (content === null) {
      return null;
    }

    let data = JSON.parse(content !== null && content !== void 0 ? content : '{}');

    if (this.dataType === undefined) {
      return data;
    }

    if (typeof this.dataType === 'object') {
      // Class object instance from constructor (new CustomClass())
      // The instance will be automatically populated
      data = plainToClassFromExist(this.dataType, data, options);
    } else if (typeof this.dataType === 'function') {
      // Class constructor (CustomClass, Number, String, Boolean, etc.)
      data = plainToClass(this.dataType, data, options);
    } else throw Error('Error: Entity should be either a Class or ClassObject');

    return data;
  }

}
//# sourceMappingURL=DataResult.js.map