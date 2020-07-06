import _ from 'lodash'

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
}
