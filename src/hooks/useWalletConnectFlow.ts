import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { RootState } from '../store/RootStore'

export const useWalletConnectFlow = (shouldRedirect = true) => {
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const navigation = useNavigation()

  useEffect(() => {
    if (!isConnected && shouldRedirect) {
      navigation.reset({
        index: 0,
        routes: [{ name: wrapper.route.Tab.name }],
      })

      navigation.navigate(wrapper.route.WalletConnectPage.name)
    }
  }, [isConnected, shouldRedirect])
}
