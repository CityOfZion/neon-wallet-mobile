import {useCallback} from 'react'
import {useDispatch} from 'react-redux'

import {RootStore} from '~src/store/RootStore'
export function useWalletHook() {
  const dispatch = useDispatch()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const createWallet = useCallback(
    async (
      name: string,
      mnemonic: string,
      type?: 'standard' | 'watch' | 'legacy'
    ) => {
      dispatch(RootStore.wallet.actions.setName(name))
      dispatch(RootStore.wallet.actions.setSecurityPhrase(mnemonic))
      dispatch(RootStore.wallet.actions.setType(type ?? 'standard'))

      const walletId = await dispatchAsyncString(
        RootStore.wallet.actions.createAndSave()
      )

      await dispatchAsync(
        RootStore.wallet.actions.setShowBackupAlert(walletId, false)
      )

      await dispatchAsync(RootStore.app.actions.syncWallets())

      dispatch(RootStore.wallet.actions.selectWallet(walletId))

      return walletId
    },
    []
  )

  return {createWallet}
}
