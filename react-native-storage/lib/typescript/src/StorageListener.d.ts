import type { CallbackType } from './types'
export declare const StorageListener: {
  emitStorageStart(name: string): void
  emitStorageEnd(name: string): void
  emitStorage(name: string, callbacks: CallbackType[] | null): void
  onStorageStart(cb: CallbackType): void
  onStorageEnd(cb: CallbackType): void
  removeStartListener(cb: CallbackType): void
  removeEndListener(cb: CallbackType): void
  removeListenerOf(cb: CallbackType, callbacks: CallbackType[]): void
  removeListener(cb: CallbackType): void
  clearStartListeners(): void
  clearEndListeners(): void
  clearListenersOf(callbacks: CallbackType[]): void
  clearListeners(): void
  startListenerCount(cb?: CallbackType | null): number
  endListenerCount(cb?: CallbackType | null): number
  listenerCount(cb: CallbackType | null | undefined, callbacks: CallbackType[]): number
}
