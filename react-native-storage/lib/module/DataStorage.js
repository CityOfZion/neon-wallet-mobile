function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { DataResult } from './DataResult';
export class DataStorage {
  constructor(key) {
    _defineProperty(this, "key", void 0);

    this.key = key;
  }

  static bind(key) {
    return new DataStorage(key);
  }

  as(dataType) {
    return new DataResult(this, dataType);
  }

  asArrayOf(dataType) {
    return new DataResult(this, dataType);
  }

  asString() {
    return new DataResult(this);
  }

  asNumber() {
    return new DataResult(this);
  }

  asBoolean() {
    return new DataResult(this);
  }

  asAny() {
    return new DataResult(this);
  }

}
//# sourceMappingURL=DataStorage.js.map