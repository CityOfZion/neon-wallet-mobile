import type { DimensionValue } from 'react-native'

export type TAlertShowButtonOption = {
  onPress?: () => void
  label: string
}

export type TAlertShowOptions = {
  title?: string
  subtitle?: string
  buttons?: TAlertShowButtonOption[]
  hideable?: boolean
  onHide?: () => void
}

export type TAlertThis = {
  isShowing: boolean
  show: (options: TAlertShowOptions) => void
  hide: () => void
}

export type TMotiSkeletonProps = {
  height?: number | DimensionValue
  width?: number | DimensionValue
  radius?: number | 'square' | 'round'
  colors?: string[]
}
