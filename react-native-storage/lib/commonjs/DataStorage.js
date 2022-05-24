"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataStorage = void 0;

var _DataResult = require("./DataResult");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DataStorage {
  constructor(key) {
    _defineProperty(this, "key", void 0);

    this.key = key;
  }

  static bind(key) {
    return new DataStorage(key);
  }

  as(dataType) {
    return new _DataResult.DataResult(this, dataType);
  }

  asArrayOf(dataType) {
    return new _DataResult.DataResult(this, dataType);
  }

  asString() {
    return new _DataResult.DataResult(this);
  }

  asNumber() {
    return new _DataResult.DataResult(this);
  }

  asBoolean() {
    return new _DataResult.DataResult(this);
  }

  asAny() {
    return new _DataResult.DataResult(this);
  }

}

exports.DataStorage = DataStorage;
//# sourceMappingURL=DataStorage.js.map