import type { TStringHelperRemoveSpecialCharacterOptions } from '@/types/helpers'

export class StringHelper {
  static normalizeText(text: string) {
    return text.trim().toLowerCase()
  }

  static capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  static removeLineBreaks(text: string) {
    return text.replace(/(\r\n|\n|\r)/gm, '')
  }

  static removeSpecialCharacters(text: string, options?: TStringHelperRemoveSpecialCharacterOptions) {
    options = { allowSpaces: true, allowDots: false, removeDoubleSpaces: false, trimText: false, ...options }

    let regex = 'a-zA-Z0-9'

    if (options.allowDots) regex += '.'
    if (options.allowSpaces) regex += ' '

    text = text.replace(new RegExp(`[^${regex}]`, 'g'), '')

    if (options.removeDoubleSpaces) text = text.replace(/\s+/g, ' ')
    if (options.trimText) text = text.trim()

    return text
  }
}
