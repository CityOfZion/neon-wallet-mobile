import {EventBus} from '~src/app/EventBus'

export enum AwaitState {
  DEFAULT,
  LOADING,
  ERROR,
}

export class AwaitWrapper {
  readonly event = new EventBus()

  private cacheInAction: Dictionary<boolean> = {}

  inAction(name: string) {
    return Boolean(this.cacheInAction[name])
  }

  init(name?: string) {
    if (name) {
      this.cacheInAction[name] = true
    }
    this.event.emit('toggle', name, AwaitState.LOADING)
  }

  done(name?: string) {
    if (name) {
      delete this.cacheInAction[name]
    }
    this.event.emit('toggle', name, AwaitState.DEFAULT)
  }

  error(name?: string) {
    if (name) {
      delete this.cacheInAction[name]
    }
    this.event.emit('toggle', name, AwaitState.ERROR)
  }

  async run<T>(
    name: string,
    func: (...args: any[]) => Promise<T>,
    delay?: number
  ): Promise<T> {
    try {
      this.init(name)
      // eslint-disable-next-line no-undef
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
      const result = await func()
      this.done(name)
      return result
    } catch (e) {
      this.error(name)
      throw e
    }
  }
}
