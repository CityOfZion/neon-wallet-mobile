"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataResult = void 0;

var _classTransformer = require("class-transformer");

var _asyncStorage = _interopRequireDefault(require("@react-native-community/async-storage"));

var _StorageListener = require("./StorageListener");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DataResult {
  constructor(dataStore, dataType) {
    _defineProperty(this, "dataStore", void 0);

    _defineProperty(this, "dataType", void 0);

    this.dataStore = dataStore;
    this.dataType = dataType;
  }

  async erase() {
    _StorageListener.StorageListener.emitStorageStart("erase".concat(this.dataStore.key));

    await _asyncStorage.default.removeItem(this.dataStore.key);

    _StorageListener.StorageListener.emitStorageEnd("erase".concat(this.dataStore.key));
  }

  async save(data, options) {
    const content = JSON.stringify((0, _classTransformer.classToPlain)(data, options));

    _StorageListener.StorageListener.emitStorageStart("save".concat(this.dataStore.key));

    await _asyncStorage.default.setItem(this.dataStore.key, content);

    _StorageListener.StorageListener.emitStorageEnd("save".concat(this.dataStore.key));
  }

  async load(options) {
    _StorageListener.StorageListener.emitStorageStart("load".concat(this.dataStore.key));

    const content = await _asyncStorage.default.getItem(this.dataStore.key);

    _StorageListener.StorageListener.emitStorageEnd("load".concat(this.dataStore.key));

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
      data = (0, _classTransformer.plainToClassFromExist)(this.dataType, data, options);
    } else if (typeof this.dataType === 'function') {
      // Class constructor (CustomClass, Number, String, Boolean, etc.)
      data = (0, _classTransformer.plainToClass)(this.dataType, data, options);
    } else throw Error('Error: Entity should be either a Class or ClassObject');

    return data;
  }

}

exports.DataResult = DataResult;
//# sourceMappingURL=DataResult.js.map