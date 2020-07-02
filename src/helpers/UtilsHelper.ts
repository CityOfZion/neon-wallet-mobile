import {classToClass, ClassTransformOptions} from 'class-transformer'
import _ from 'lodash'
import {Clipboard} from 'react-native'

export abstract class UtilsHelper {
  static chunkPadded<T>(array: (T | null)[], n: number, padWith?: T | null) {
    const arrayGroup = _.chunk(array, n)

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

  static clone<T>(fromEntity: T, options?: ClassTransformOptions): T {
    return classToClass(fromEntity, options)
  }
}
