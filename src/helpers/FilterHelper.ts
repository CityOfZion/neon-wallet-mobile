import i18n from 'i18n-js'
import moment from 'moment'

import { Currency } from '~src/enums/Currency'
import { Lang } from '~src/enums/Lang'

export type InputType = string | number | null

const SATURATION_FACTOR = 0.69 //nice
const LUMINANCE_FACTOR = 0.58

export abstract class FilterHelper {
  static toString(input?: InputType) {
    return input !== null && input !== undefined ? String(input) : ''
  }

  static bool(input?: InputType | boolean) {
    return input !== undefined && input !== null ? (i18n.t(`boolean.${Boolean(input)}`) as string) : ''
  }

  static datetime(input?: moment.MomentInput | null) {
    return moment(input ?? undefined).isValid()
      ? moment(input ?? undefined).format(i18n.t('dateFormat.datetime') as string)
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
      .replace(new RegExp(i18n.t('filter.phone.regex') as string), i18n.t('filter.phone.format') as string)
  }

  static zipcode(input?: InputType) {
    return this.toString(input)
      .replace(/\D/g, '')
      .replace(new RegExp(i18n.t('filter.zipcode.regex') as string), i18n.t('filter.zipcode.format') as string)
  }

  static pad(input?: InputType, length = 2) {
    let value = this.toString(input)
    while (value.length < length) value = `0${value}`
    return value
  }

  static decimal(input?: InputType, language = Lang.EN_US, minimumFractionDigits = 0) {
    const num = Number(input)

    try {
      if (!isNaN(num)) {
        return new Intl.NumberFormat(language, {
          style: 'decimal',
          minimumFractionDigits,
        }).format(num)
      }

      return String(input)
    } catch {
      return String(input)
    }
  }

  static currency(
    input?: InputType,
    currency?: Currency | string | null,
    language = Lang.EN_US,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  ) {
    const num = Number(input)

    try {
      if (!isNaN(num)) {
        return new Intl.NumberFormat(language, {
          style: 'currency',
          currency: currency ?? undefined,
          minimumFractionDigits,
          maximumFractionDigits,
        }).format(num)
      }

      return String(input)
    } catch {
      return String(input)
    }
  }

  static currencyExtendedMaxLimit(
    input?: InputType,
    currency?: Currency | string | null,
    language = Lang.EN_US,
    minimumFractionDigits = 2,
    maximumFractionDigits = 4
  ) {
    const num = Number(input)

    try {
      if (!isNaN(num)) {
        return new Intl.NumberFormat(language, {
          style: 'currency',
          currency: currency ?? undefined,
          minimumFractionDigits,
          maximumFractionDigits,
        }).format(num)
      }

      return String(input)
    } catch {
      return String(input)
    }
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
    const value = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value)
    if (!result) return [0, 0, 0]

    const r = parseInt(result[1], 16) / 255
    const g = parseInt(result[2], 16) / 255
    const b = parseInt(result[3], 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h, s
    const l = (max + min) / 2

    if (max === min) {
      h = 0
      s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
        default:
          h = 0
      }
      h /= 6
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
  }

  static toDarkerShade(color: string, saturationFactor = SATURATION_FACTOR, luminanceFactor = LUMINANCE_FACTOR) {
    const hsl = this.hexToHsl(color)
    return this.hslToHex(hsl[0], hsl[1] * saturationFactor, hsl[2] * luminanceFactor)
  }
}
