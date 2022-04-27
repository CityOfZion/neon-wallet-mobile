import i18n from 'i18n-js'
import {useCallback} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'
export function useHandleOfflineFunctions() {
  const {isConnected} = useSelector((state: RootState) => state.network)
  const handleOnlyOnline = useCallback(
    (callback: () => void) => {
      if (isConnected) {
        callback()
      } else {
        showMessage({
          message: i18n.t('walletconnect.offline'),
          type: 'danger',
          duration: 3000,
        })
      }
    },
    [isConnected]
  )

  const handleAsyncOnlyOnline = useCallback(
    (callback: () => Promise<void>) => {
      if (isConnected) {
        callback()
      } else {
        showMessage({
          message: i18n.t('walletconnect.offline'),
          type: 'danger',
          duration: 3000,
        })
      }
    },
    [isConnected]
  )

  return {handleOnlyOnline, handleAsyncOnlyOnline}
}
