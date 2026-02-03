export class NumberHelper {
  static number(input?: string | number) {
    if (typeof input === 'number') {
      return input
    }

    if (!input) {
      return 0
    }

    const float = parseFloat(input)
    return isNaN(float) ? 0 : float
  }

  static localeNumber(value: number) {
    return value.toLocaleString('en-US')
  }

  static getRandomNumber(max: number) {
    return Math.floor(Math.random() * Math.floor(max))
  }
}
