import { useRef } from 'react'

import { StackActions, useNavigation, useNavigationState, useRoute } from '@react-navigation/native'

export const useModalErase = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const routeIndexRef = useRef(0)

  useNavigationState(navigationState => {
    const index = navigationState.routes.findIndex(r => r.key === route.key)
    routeIndexRef.current = index + 1
  })

  const handleErase = () => {
    navigation.dispatch(StackActions.pop(routeIndexRef.current))
  }

  return {
    handleErase,
  }
}
