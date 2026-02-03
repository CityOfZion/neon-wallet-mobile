import { forwardRef } from 'react'

import type { RefreshControlProps } from 'react-native'
import { RefreshControl as RNRefreshControl } from 'react-native'

export const RefreshControl = forwardRef<RNRefreshControl, RefreshControlProps>((props, ref) => {
  return <RNRefreshControl ref={ref} {...props} enabled tintColor="#FFFFFF" />
})
