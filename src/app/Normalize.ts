import {Dimensions, PixelRatio, Platform} from 'react-native'

export abstract class Normalize {
  static space<T extends string | number>(value?: string | number): T {
    let size

    if (typeof value === 'string') {
      const regex = /^(\d+)(?:px)?$/.exec(value)
      if (regex?.[1]) {
        size = Number(regex[1])
      }
    } else {
      size = Number(value)
    }

    const scale = Dimensions.get('screen').width / 414
    const newSize = Number(size) * scale

    if (isNaN(newSize)) {
      return value as T
    }

    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) as T
    } else {
      return (Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2) as T
    }
  }
}
