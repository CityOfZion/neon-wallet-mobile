import {GestureResponderEvent, PanResponderGestureState} from 'react-native'

export declare global {
  // react-native-sortable-list
  interface DataByNumber<T> {
    [key: number]: T
  }

  interface DataByString<T> {
    [key: string]: T
  }

  interface RowProps<T = any, K = number> {
    active: boolean
    data: T
    key?: K
    index?: number
    disabled?: boolean
    toggleRowActive?: (
      event: GestureResponderEvent,
      gestureState?: PanResponderGestureState
    ) => void
  }

  // Navigation param list
  interface DefaultNavigationParam<T = undefined> {
    screen: RouteName
    initial?: boolean
    params?: T
  }

  // Navigation param type
  type NavParam<ParamList> = ParamList[keyof ParamList] extends undefined
    ? [keyof ParamList] | [keyof ParamList, ParamList[keyof ParamList]]
    : [keyof ParamList, ParamList[keyof ParamList]]
}
