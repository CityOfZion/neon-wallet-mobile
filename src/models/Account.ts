import {ImageLoadEventData} from 'react-native'

export class Account {
  srcIcon?: ImageLoadEventData
  name?: string
  balance?: number
  currency?: string
  address?: string
  backgroundColor = '#00aaff'
  isCompacted = false
  isWatched = false
}
