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
}
