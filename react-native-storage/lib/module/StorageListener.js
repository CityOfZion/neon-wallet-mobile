const callbacksStart = [];
const callbacksEnd = [];
export const StorageListener = {
  emitStorageStart(name) {
    this.emitStorage(name, callbacksStart);
  },

  emitStorageEnd(name) {
    this.emitStorage(name, callbacksEnd);
  },

  emitStorage(name, callbacks) {
    if (callbacks) {
      callbacks.forEach(c => c(name));
    }
  },

  onStorageStart(cb) {
    callbacksStart.push(cb);
  },

  onStorageEnd(cb) {
    callbacksEnd.push(cb);
  },

  removeStartListener(cb) {
    this.removeListenerOf(cb, callbacksStart);
  },

  removeEndListener(cb) {
    this.removeListenerOf(cb, callbacksEnd);
  },

  removeListenerOf(cb, callbacks) {
    const index = callbacks.indexOf(cb);

    if (index > -1) {
      callbacks.splice(index, 1);
    }
  },

  removeListener(cb) {
    this.removeStartListener(cb);
    this.removeEndListener(cb);
  },

  clearStartListeners() {
    this.clearListenersOf(callbacksStart);
  },

  clearEndListeners() {
    this.clearListenersOf(callbacksEnd);
  },

  clearListenersOf(callbacks) {
    callbacks.splice(0, callbacks.length);
  },

  clearListeners() {
    this.clearStartListeners();
    this.clearEndListeners();
  },

  startListenerCount(cb = null) {
    return this.listenerCount(cb, callbacksStart);
  },

  endListenerCount(cb = null) {
    return this.listenerCount(cb, callbacksEnd);
  },

  listenerCount(cb = null, callbacks) {
    if (!cb) {
      return callbacks.length;
    }

    return callbacks.indexOf(cb) === -1 ? 0 : 1;
  }

};
//# sourceMappingURL=StorageListener.js.map