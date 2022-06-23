import { ImageLoadEventData } from 'react-native'

export class AccountMock {
  srcIcon?: ImageLoadEventData
  name?: string
  balance?: number
  currency?: string
  address?: string
  backgroundColor = '#00aaff'
}
