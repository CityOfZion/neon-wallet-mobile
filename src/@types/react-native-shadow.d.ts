declare type RNComponent<
  P = object,
  S = object,
  SS = any
> = import('react').Component<P, S, SS>
declare type RNConstructor<T> = import('react-native').Constructor<T>
declare type RNViewProps = import('react-native').ViewProps
declare type RNViewStyle = import('react-native').ViewStyle

declare module 'react-native-shadow' {
  interface BoxShadowType {
    width: number
    height: number
    color: string
    border: number
    radius: number
    opacity: number
    x: number
    y: number
    style?: RNViewStyle
  }

  interface BorderShadowType {
    width: number
    color: string
    border: number
    opacity: number
    style?: RNViewStyle
    side: 'top' | 'bottom' | 'left' | 'right'
    inset: boolean
  }
  export const BoxShadow: RNConstructor<RNComponent<
    RNViewProps & {setting: BoxShadowType}
  >>
  export const BorderShadow: RNConstructor<RNComponent<
    RNViewProps & {setting?: BorderShadowType}
  >>
}
