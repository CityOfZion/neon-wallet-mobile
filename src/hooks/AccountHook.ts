import {useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {BlockchainServiceKey} from '~src/blockchain'
import {Account} from '~src/models/redux/Account'
import {getRandomColor} from '~src/scenes/CustomizeAccount'
import {RootStore} from '~src/store/RootStore'
export function useAccountHook() {
  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const {isConnected} = useSelector((state: RootState) => state.network)
  const {tokens} = useSelector((state: RootState) => state.app)
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const createAccount = useCallback(
    async (
      walletId: string,
      name: string,
      wif: string,
      address: string,
      blockchain: BlockchainServiceKey
    ) => {
      dispatch(RootStore.account.actions.setIdWallet(walletId))
      dispatch(RootStore.account.actions.setName(name))
      dispatch(
        RootStore.account.actions.setBackgroundColor(
          theme.colors.card[getRandomColor(6)]
        )
      )
      dispatch(RootStore.account.actions.setBlockchain(blockchain))
      const importedAccount = (await dispatchAsync(
        RootStore.account.actions.importAndSave(address, wif)
      )) as Account

      if (isConnected) {
        await importedAccount.populateTokenAssets()
        await importedAccount.populateTransactions(tokens)
        await dispatchAsync(
          RootStore.app.actions.syncTokenAssetsByAddress(address)
        )
      }
      dispatch(
        RootStore.account.actions.setTokenAssets(importedAccount.tokenAssets)
      )

      if (importedAccount.address) {
        await dispatchAsync(
          RootStore.account.actions.updateAndSave(importedAccount.address)
        )
      }
      await dispatchAsync(RootStore.app.actions.syncAccounts())
      return importedAccount
    },
    []
  )

  const createWatchAccount = useCallback(
    async (
      walletId: string,
      name: string,
      address: string,
      blockchain: BlockchainServiceKey
    ) => {
      dispatch(RootStore.account.actions.setIdWallet(walletId))
      dispatch(RootStore.account.actions.setName(name))
      dispatch(
        RootStore.account.actions.setBackgroundColor(
          theme.colors.card[getRandomColor(6)]
        )
      )
      dispatch(RootStore.account.actions.setBlockchain(blockchain))
      const importedAccount = (await dispatchAsync(
        RootStore.account.actions.importAndSave(address)
      )) as Account
      await dispatchAsync(RootStore.app.actions.syncAccounts())
      isConnected &&
        (await dispatchAsync(
          RootStore.app.actions.syncTokenAssetsByAddress(address)
        ))
      await importedAccount.populateTokenAssets()
      await importedAccount.populateTransactions(tokens)
      return importedAccount
    },
    []
  )

  return {createAccount, createWatchAccount}
}
