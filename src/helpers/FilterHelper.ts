import moment from 'moment'

import i18n from '~src/i18n'

export type InputType = string | number | null

export abstract class FilterHelper {
  static toString(input?: InputType) {
    return input !== null && input !== undefined ? String(input) : ''
  }

  static bool(input?: InputType | boolean) {
    return input !== undefined && input !== null
      ? (i18n.t(`boolean.${Boolean(input)}`) as string)
      : ''
  }

  static datetime(input?: moment.MomentInput | null) {
    return moment(input ?? undefined).isValid()
      ? moment(input ?? undefined).format(
          i18n.t('dateFormat.datetime') as string
        )
      : ''
  }

  static date(input?: moment.MomentInput | null) {
    return moment(input ?? undefined).isValid()
      ? moment(input ?? undefined).format(i18n.t('dateFormat.date') as string)
      : ''
  }

  static time(input?: moment.MomentInput | null) {
    return moment(input ?? undefined).isValid()
      ? moment(input ?? undefined).format(i18n.t('dateFormat.time') as string)
      : ''
  }

  static truncate(input?: InputType, length?: number) {
    const value = this.toString(input)
    if (value.length > (length || 0)) {
      return `${value.substring(0, length)}...`
    }
    return value
  }

  static removeDelimiters(input?: InputType) {
    return this.toString(input).replace(/[. ,:\-/]+/g, '')
  }

  static phone(input?: InputType) {
    return this.toString(input)
      .replace(/\D/g, '')
      .replace(
        new RegExp(i18n.t('filter.phone.regex') as string),
        i18n.t('filter.phone.format') as string
      )
  }

  static zipcode(input?: InputType) {
    return this.toString(input)
      .replace(/\D/g, '')
      .replace(
        new RegExp(i18n.t('filter.zipcode.regex') as string),
        i18n.t('filter.zipcode.format') as string
      )
  }

  static pad(input?: InputType, length = 2) {
    let value = this.toString(input)
    while (value.length < length) value = `0${value}`
    return value
  }

  static decimal(input?: InputType, precision?: number) {
    const num = Number(input)

    let result = this.toString(input)
    if (precision !== undefined) {
      result = num.toFixed(precision)
    }

    const separator = i18n.t('filter.number.decimal') as string

    if (separator === ',') {
      return result.replace(/\./g, ',')
    }

    return result.replace(/,/g, '.')
  }

  static currency(
    input?: InputType,
    prefix = '?',
    inCents = true,
    decimal = true
  ) {
    const precision = decimal ? 2 : 0
    const val = inCents ? (Number(input) / 100).toString() : input

    return `${prefix.substring(0, 3)}${this.decimal(val, precision)}`.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      i18n.t('filter.number.thousands') as string
    )
  }

  static hslToHex(h: number, s: number, l: number) {
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2

    let r = 0,
      g = 0,
      b = 0

    if (0 <= h && h < 60) {
      r = c
      g = x
      b = 0
    } else if (60 <= h && h < 120) {
      r = x
      g = c
      b = 0
    } else if (120 <= h && h < 180) {
      r = 0
      g = c
      b = x
    } else if (180 <= h && h < 240) {
      r = 0
      g = x
      b = c
    } else if (240 <= h && h < 300) {
      r = x
      g = 0
      b = c
    } else if (300 <= h && h < 360) {
      r = c
      g = 0
      b = x
    }

    // Having obtained RGB, convert channels to hex
    const red = Math.round((r + m) * 255).toString(16)
    const green = Math.round((g + m) * 255).toString(16)
    const blue = Math.round((b + m) * 255).toString(16)

    return `#${this.pad(red, 2)}${this.pad(green, 2)}${this.pad(blue, 2)}`
  }

  static hexToHsl(hex: string) {
    // Convert hex to RGB first
    let r: number = 0
    let g: number = 0
    let b: number = 0

    if (hex.length === 4) {
      r = Number('0x' + hex[1] + hex[1])
      g = Number('0x' + hex[2] + hex[2])
      b = Number('0x' + hex[3] + hex[3])
    } else if (hex.length === 7) {
      r = Number('0x' + hex[1] + hex[2])
      g = Number('0x' + hex[3] + hex[4])
      b = Number('0x' + hex[5] + hex[6])
    }

    // Then to HSL
    r /= 255
    g /= 255
    b /= 255

    const cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin

    let h, s, l

    if (delta === 0) h = 0
    else if (cmax === r) h = ((g - b) / delta) % 6
    else if (cmax === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4

    h = Math.round(h * 60)

    if (h < 0) h += 360

    l = (cmax + cmin) / 2
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
    s = +(s * 100).toFixed(1)
    l = +(l * 100).toFixed(1)

    return [h, s, l]
  }
}
