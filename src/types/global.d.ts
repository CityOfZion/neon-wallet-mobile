import {GestureResponderEvent, PanResponderGestureState} from 'react-native'
import {RouteName} from '~src/types/wrappers/route'

export interface DataByNumber<T> {
  [key: number]: T
}

export interface RowProps<T = any, K = number> {
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
export interface DefaultNavigationParam<T = undefined> {
  screen: RouteName
  initial?: boolean
  params?: T
}

// Navigation param type
export type NavParam<ParamList> = ParamList[keyof ParamList] extends undefined
  ? [keyof ParamList] | [keyof ParamList, ParamList[keyof ParamList]]
  : [keyof ParamList, ParamList[keyof ParamList]]
