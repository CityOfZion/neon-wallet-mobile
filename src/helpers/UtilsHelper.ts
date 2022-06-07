import {classToClass, ClassTransformOptions} from 'class-transformer'
import {t} from 'i18n-js'
import {chunk} from 'lodash'
import {Clipboard, Platform} from 'react-native'
import {showMessage} from 'react-native-flash-message'
export abstract class UtilsHelper {
  static get isIos() {
    return Platform.OS === 'ios'
  }

  static get isAndroid() {
    return Platform.OS === 'android'
  }

  static uuid() {
    let dt = new Date().getTime()
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (dt + Math.random() * 16) % 16 | 0
      dt = Math.floor(dt / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
  }

  static chunkPadded<T>(array: (T | null)[], n: number, padWith?: T | null) {
    const arrayGroup = chunk(array, n)

    // If 'padWith' is not undefined, pads the last array group until it has 'n' items
    if (padWith !== undefined) {
      while (arrayGroup[arrayGroup.length - 1].length < n) {
        arrayGroup[arrayGroup.length - 1].push(padWith)
      }
    }

    return arrayGroup
  }

  static copyToClipboard(content?: string) {
    if (content) {
      Clipboard.setString(content)
      showMessage({
        message: t('toast.copiedToClipboard'), // TODO: fix ciclic import of facade on the need to translate text of Utils method #1081
        type: 'success',
      })
    }
  }

  static async copyFromClipboard(): Promise<string> {
    return await Clipboard.getString()
  }

  static clone<T>(fromEntity: T, options?: ClassTransformOptions): T {
    return classToClass(fromEntity, options)
  }

  static sleep(ms: number) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  static clearText(text: string) {
    const cleanText = text.replace(/\r?\n|\r/, '') //remove enter
    return cleanText
  }

  static removeAccents(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  static convertToArbitraryDecimals(num: number, decimals: number = 8) {
    // eslint-disable-next-line
    const multiplier = 1 / Math.pow(10, decimals)
    return (num * multiplier).toFixed(decimals)
  }

  static putTimeout<T extends any>(
    callback: () => Promise<T> | T,
    timeoutMs: number = 5000
  ): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(t('app.timeout')))
      }, timeoutMs)

      try {
        const result = await callback()

        clearTimeout(timeout)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  static getRandomNumber(max: number) {
    return Math.floor(Math.random() * Math.floor(max))
  }
}
