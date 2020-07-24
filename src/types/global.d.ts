import {WrapperConfig} from '~src/config/WrapperConfig'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'

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
  interface DefaultNavigationParam {
    screen: RouteName
    initial?: boolean
  }

  // Navigation param type
  type NavParam<ParamList> = ParamList[keyof ParamList] extends undefined
    ? [keyof ParamList] | [keyof ParamList, ParamList[keyof ParamList]]
    : [keyof ParamList, ParamList[keyof ParamList]]
}
