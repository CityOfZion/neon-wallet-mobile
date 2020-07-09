import {Dimensions, PixelRatio} from 'react-native'

export abstract class Normalize {
  static scale<T extends string | number>(value?: string | number): T {
    let size: number

    if (typeof value === 'string') {
      const regex = /^(\d+)(?:px)?$/.exec(value)
      if (regex?.[1]) {
        size = Number(regex[1])
      } else {
        return value as T
      }
    } else {
      size = Number(value)
    }

    const scale = Dimensions.get('screen').width / 414
    const newSize = size * scale

    if (isNaN(newSize)) {
      return value as T
    }

    return Math.round(PixelRatio.roundToNearestPixel(newSize)) as T
  }
}
