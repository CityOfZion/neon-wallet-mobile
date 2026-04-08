import * as dateFns from 'date-fns'
import * as dateFnsLocales from 'date-fns/locale'

import type {
  TDateHelperCalculateDateFromSelectionMaxOneYearResponse,
  TDateHelperCalculateDateSelectionMaxOneYearParams,
  TDateHelperCalculateDateToSelectionMaxOneYearResponse,
  TDateHelperFormatLocalizedOptions,
} from '@/types/helpers'

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

  static calculateDateFromSelectionMaxOneYear = ({
    dateFrom,
    dateTo,
  }: TDateHelperCalculateDateSelectionMaxOneYearParams) => {
    const newDateFrom = dateFns.startOfDay(dateFrom)
    const dateSelection: TDateHelperCalculateDateFromSelectionMaxOneYearResponse = {
      dateFrom: newDateFrom,
    }

    if (dateFns.isAfter(newDateFrom, dateTo)) {
      const dateNow = new Date()
      const newDateTo = dateFns.endOfDay(dateFns.min([dateNow, dateFns.add(newDateFrom, { weeks: 1 })]))

      dateSelection.dateTo = dateFns.isSameDay(dateNow, newDateTo) ? dateNow : newDateTo

      return dateSelection
    }

    if (dateFns.differenceInYears(dateTo, newDateFrom) > 0) {
      const dateNow = new Date()
      const newDateTo = dateFns.endOfDay(dateFns.add(newDateFrom, { years: 1, days: -1 }))

      dateSelection.dateTo = dateFns.isSameDay(dateNow, newDateTo) ? dateNow : newDateTo
    }

    return dateSelection
  }

  static calculateDateToSelectionMaxOneYear = ({
    dateFrom,
    dateTo,
  }: TDateHelperCalculateDateSelectionMaxOneYearParams) => {
    const dateNow = new Date()
    const newDateTo = dateFns.isSameDay(dateNow, dateTo) ? dateNow : dateFns.endOfDay(dateTo)
    const dateSelection: TDateHelperCalculateDateToSelectionMaxOneYearResponse = { dateTo: newDateTo }

    if (dateFns.isBefore(newDateTo, dateFrom)) {
      dateSelection.dateFrom = dateFns.startOfDay(dateFns.sub(newDateTo, { weeks: 1 }))

      return dateSelection
    }

    if (dateFns.differenceInYears(newDateTo, dateFrom) > 0) {
      dateSelection.dateFrom = dateFns.startOfDay(dateFns.sub(newDateTo, { years: 1, days: -1 }))
    }

    return dateSelection
  }
}
