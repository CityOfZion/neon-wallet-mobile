import {classToClass, ClassTransformOptions} from 'class-transformer'
import {chunk} from 'lodash'
import {Clipboard, Platform} from 'react-native'

import {Facade} from '~src/app/Facade'

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
}
