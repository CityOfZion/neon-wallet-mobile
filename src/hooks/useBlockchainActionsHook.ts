import i18n from 'i18n-js'
import allSetlled from 'promise.allsettled'
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { UtilsHelper } from '../helpers/UtilsHelper'
import { AsyncDispatch } from '../types/reducers/root'
import { WalletType } from '../types/reducers/wallet'

import { wrapper } from '~src/app/ApplicationWrapper'
import { BlockchainServiceKey, blockchainServices } from '~src/blockchain'
import { RootState, RootStore } from '~src/store/RootStore'

export type AccountToImport = {
  address: string
  blockchain: BlockchainServiceKey
  walletId: string
  wif: string
  type: 'account'
}

export type WatchAccountToImport = {
  address: string
  blockchain: BlockchainServiceKey
  walletId: string
  type: 'watch'
}

export function useBlockchainActionsHook() {
  const dispatch = useDispatch()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const createLegacyWallet = useCallback(async (name: string) => {
    dispatch(RootStore.wallet.actions.setName(name))
    dispatch(RootStore.wallet.actions.setType('legacy'))
    const walletId = await dispatchAsyncString(RootStore.wallet.actions.createAndSave())
    await dispatchAsync(RootStore.wallet.actions.setShowBackupAlert(walletId, false))
    await dispatchAsync(RootStore.app.actions.syncWallets())

    dispatch(RootStore.wallet.actions.selectWallet(walletId))

    return walletId
  }, [])

  const createWallet = useCallback(
    async (name: string, securityPhrase: string, type: WalletType, isImport?: boolean) => {
      dispatch(RootStore.wallet.actions.setName(name))
      dispatch(RootStore.wallet.actions.setSecurityPhrase(securityPhrase))
      dispatch(RootStore.wallet.actions.setType(type))

      const walletId = await dispatchAsyncString(RootStore.wallet.actions.createAndSave())

      await dispatchAsync(RootStore.wallet.actions.setShowBackupAlert(walletId, !isImport))

      await dispatchAsync(RootStore.app.actions.syncWallets())

      dispatch(RootStore.wallet.actions.selectWallet(walletId))

      return walletId
    },
    []
  )

  const createAccount = useCallback(
    async (walletId: string, name: string, blockchain: BlockchainServiceKey, index?: number) => {
      dispatch(RootStore.account.actions.setIdWallet(walletId))
      dispatch(RootStore.account.actions.setName(name))
      dispatch(RootStore.account.actions.setBlockchain(blockchain))
      dispatch(RootStore.account.actions.setBackgroundColor(theme.colors.card[UtilsHelper.getRandomNumber(6)]))
      dispatch(RootStore.account.actions.setSrcIcon(blockchainServices[blockchain].icon))
      const address = await dispatchAsyncString(RootStore.account.actions.createAndSave(index))
      await dispatchAsync(RootStore.app.actions.syncAccounts())
      await dispatchAsync(RootStore.app.actions.syncWallets())

      return address
    },
    [theme]
  )

  const importAccount = useCallback(
    (walletId: string, name: string, wif: string, address: string, blockchain: BlockchainServiceKey) => {
      return UtilsHelper.putTimeout(async () => {
        dispatch(RootStore.account.actions.setIdWallet(walletId))
        dispatch(RootStore.account.actions.setName(name))
        dispatch(RootStore.account.actions.setBlockchain(blockchain))
        dispatch(RootStore.account.actions.setBackgroundColor(theme.colors.card[UtilsHelper.getRandomNumber(6)]))
        dispatch(RootStore.account.actions.setSrcIcon(blockchainServices[blockchain].icon))
        await dispatchAsync(RootStore.account.actions.importAndSave(address, wif))
        await dispatchAsync(RootStore.app.actions.syncAccounts())
        await dispatchAsync(RootStore.app.actions.syncWallets())
      })
    },
    [theme]
  )

  const importWatchAccount = useCallback(
    (walletId: string, name: string, address: string, blockchain: BlockchainServiceKey) => {
      return UtilsHelper.putTimeout(async () => {
        dispatch(RootStore.account.actions.setIdWallet(walletId))
        dispatch(RootStore.account.actions.setName(name))
        dispatch(RootStore.account.actions.setBlockchain(blockchain))
        dispatch(RootStore.account.actions.setBackgroundColor(theme.colors.card[UtilsHelper.getRandomNumber(6)]))
        dispatch(RootStore.account.actions.setSrcIcon(blockchainServices[blockchain].icon))
        await dispatchAsync(RootStore.account.actions.importAndSave(address))
        await dispatchAsync(RootStore.app.actions.syncAccounts())
        await dispatchAsync(RootStore.app.actions.syncWallets())
      })
    },
    [theme]
  )

  const importAccounts = useCallback(
    async (accounts: (AccountToImport | WatchAccountToImport)[]) => {
      const promises = accounts.map(account => {
        if (account.type === 'account') {
          return importAccount(
            account.walletId,
            `${i18n.t(`blockchainServices.${account.blockchain}.accountName`)} 1`,
            account.wif,
            account.address,
            account.blockchain
          )
        }

        return importWatchAccount(
          account.walletId,
          `${i18n.t(`blockchainServices.${account.blockchain}.label`)} ${i18n.t('modals.blockchainList.typeAccount', {
            type: 'Watch',
          })}`,
          account.address,
          account.blockchain
        )
      })

      allSetlled.shim()

      return await Promise.allSettled(promises)
    },
    [importAccount, importWatchAccount]
  )

  return {
    createWallet,
    createAccount,
    importAccount,
    importAccounts,
    importWatchAccount,
    createLegacyWallet,
  }
}
