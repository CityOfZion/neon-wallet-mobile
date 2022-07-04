import type {CallbackType} from './types'

const callbacksStart: CallbackType[] = []
const callbacksEnd: CallbackType[] = []

export const StorageListener = {
  emitStorageStart(name: string) {
    this.emitStorage(name, callbacksStart)
  },
  emitStorageEnd(name: string) {
    this.emitStorage(name, callbacksEnd)
  },
  emitStorage(name: string, callbacks: CallbackType[] | null) {
    if (callbacks) {
      callbacks.forEach((c) => c(name))
    }
  },
  onStorageStart(cb: CallbackType) {
    callbacksStart.push(cb)
  },
  onStorageEnd(cb: CallbackType) {
    callbacksEnd.push(cb)
  },
  removeStartListener(cb: CallbackType) {
    this.removeListenerOf(cb, callbacksStart)
  },
  removeEndListener(cb: CallbackType) {
    this.removeListenerOf(cb, callbacksEnd)
  },
  removeListenerOf(cb: CallbackType, callbacks: CallbackType[]) {
    const index = callbacks.indexOf(cb)
    if (index > -1) {
      callbacks.splice(index, 1)
    }
  },
  removeListener(cb: CallbackType) {
    this.removeStartListener(cb)
    this.removeEndListener(cb)
  },
  clearStartListeners() {
    this.clearListenersOf(callbacksStart)
  },
  clearEndListeners() {
    this.clearListenersOf(callbacksEnd)
  },
  clearListenersOf(callbacks: CallbackType[]) {
    callbacks.splice(0, callbacks.length)
  },
  clearListeners() {
    this.clearStartListeners()
    this.clearEndListeners()
  },
  startListenerCount(cb: CallbackType | null = null) {
    return this.listenerCount(cb, callbacksStart)
  },
  endListenerCount(cb: CallbackType | null = null) {
    return this.listenerCount(cb, callbacksEnd)
  },
  listenerCount(cb: CallbackType | null = null, callbacks: CallbackType[]) {
    if (!cb) {
      return callbacks.length
    }

    return callbacks.indexOf(cb) === -1 ? 0 : 1
  },
}
