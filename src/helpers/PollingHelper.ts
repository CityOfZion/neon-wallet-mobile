type CallBack = () => void | Promise<void>

export class PollingHelper {
  private timeout?: NodeJS.Timeout
  private callback?: CallBack
  private shouldStop = false

  constructor(private readonly frequency: number = 7000) {}

  run(callback: CallBack): void {
    if (this.timeout || this.callback) {
      this.stop()
      return
    }

    this.shouldStop = false
    this.callback = callback

    this.timeout = setTimeout(() => this.execListener(), this.frequency)
  }

  private async execListener() {
    if (!this.callback) {
      this.stop()
      return
    }

    await this.callback()

    if (!this.shouldStop) {
      this.timeout = setTimeout(() => this.execListener(), this.frequency)
    }
  }

  stop(): void {
    this.shouldStop = true
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = undefined
    }
  }
}
