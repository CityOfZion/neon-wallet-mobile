import * as dateFns from 'date-fns'
import * as dateFnsLocales from 'date-fns/locale'

import type { TDateHelperFormatLocalizedOptions } from '@/types/helpers'

type TDate = Date | string | number

export class DateHelper {
  static readonly #dateFnsLocaleByLanguage: Record<string, dateFns.Locale> = {
    en: dateFnsLocales.enUS,
    de: dateFnsLocales.de,
    'pt-BR': dateFnsLocales.ptBR,
    zh: dateFnsLocales.zhCN,
    'zh-Hant': dateFnsLocales.zhTW,
  }

  static getNowUnix(): number {
    return Date.now() / 1000
  }

  static formatLocalized(date: TDate, options: TDateHelperFormatLocalizedOptions): string {
    if (typeof date === 'string') {
      date = new Date(date)
    } else if (typeof date === 'number') {
      date = date < 1e10 ? date * 1000 : date
    }

    return dateFns.format(date, options.format, {
      locale: this.#dateFnsLocaleByLanguage[options.language.value],
    })
  }

  static format(date: TDate, formatString: string): string {
    if (typeof date === 'string') {
      date = new Date(date)
    } else if (typeof date === 'number') {
      date *= 1000
    }

    return dateFns.format(date, formatString)
  }
}
