import i18n from 'i18n-js'
import allSetlled from 'promise.allsettled'
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { SecurityHelper } from '../helpers/SecurityHelper'
import { UtilsHelper } from '../helpers/UtilsHelper'
import { Account } from '../models/redux/Account'
import { Wallet } from '../models/redux/Wallet'
import { selectAccounts } from '../store/account/SelectorAccount'
import { selectWallets } from '../store/wallet/SelectorWallet'
import { WalletType } from '../types/reducers/wallet'

import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { walletReducerActions } from '~/src/store/wallet/WalletReducer'
import { wrapper } from '~src/app/ApplicationWrapper'
import { BlockchainServiceKey, blockchainServices } from '~src/blockchain'
import { RootState } from '~src/store/RootStore'

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

export function useBlockchainActions() {
  const { saveWallet } = walletReducerActions
  const { saveAccount } = accountReducerActions
  const dispatch = useDispatch()
  const wallets = useSelector(selectWallets)
  const accounts = useSelector(selectAccounts)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const generateAccount = async (walletId: string, index: number, blockchain: BlockchainServiceKey) => {
    const mnemonic = await SecurityHelper.loadMnemonic(walletId)
    if (!mnemonic) {
      return null
    }
    return blockchainServices[blockchain].generateAccount(mnemonic, index)
  }

  const createLegacyWallet = useCallback(async (name: string) => {
    const walletId = UtilsHelper.uuid()
    const newLegacyWallet = new Wallet()
    newLegacyWallet.id = walletId
    newLegacyWallet.name = name
    newLegacyWallet.walletType = 'legacy'
    newLegacyWallet.showBackupAlert = false

    dispatch(saveWallet(newLegacyWallet))

    return walletId
  }, [])

  const createWallet = useCallback(
    async (name: string, securityPhrase: string, type: WalletType, isImport?: boolean) => {
      const walletId = UtilsHelper.uuid()
      const newWallet = new Wallet()
      newWallet.id = walletId
      newWallet.name = name
      newWallet.securityPhrase = securityPhrase
      newWallet.walletType = type
      newWallet.showBackupAlert = !isImport

      dispatch(saveWallet(newWallet))

      await SecurityHelper.saveMnemonic(walletId, securityPhrase)

      return walletId
    },
    []
  )

  const createAccount = useCallback(
    async (
      walletId: string,
      name: string,
      blockchain: BlockchainServiceKey,
      index?: number,
      colorDefault?: boolean
    ) => {
      const newAccount = new Account()
      newAccount.idWallet = walletId
      newAccount.name = name
      newAccount.blockchain = blockchain
      newAccount.index = index ?? newAccount.getIndex(accounts)
      newAccount.backgroundColor = colorDefault
        ? theme.colors.card[0]
        : theme.colors.card[UtilsHelper.getRandomNumber(6)]

      const addresAndWif = await generateAccount(walletId, newAccount.index, newAccount.blockchain)
      if (addresAndWif) {
        newAccount.address = addresAndWif.address
        dispatch(saveAccount({ account: newAccount, wif: addresAndWif.wif }))
        return newAccount.address
      }

      throw new Error('Problem to create account')
    },
    [theme, wallets, accounts]
  )

  const importAccount = useCallback(
    (walletId: string, name: string, wif: string, address: string, blockchain: BlockchainServiceKey) => {
      return UtilsHelper.putTimeout(async () => {
        const newAccount = new Account()
        newAccount.idWallet = walletId
        newAccount.name = name
        newAccount.blockchain = blockchain
        newAccount.backgroundColor = theme.colors.card[UtilsHelper.getRandomNumber(6)]
        newAccount.srcIcon = blockchainServices[blockchain].icon
        newAccount.address = address
        dispatch(saveAccount({ account: newAccount, wif }))
      })
    },
    [theme]
  )

  const importWatchAccount = useCallback(
    (walletId: string, name: string, address: string, blockchain: BlockchainServiceKey) => {
      return UtilsHelper.putTimeout(async () => {
        const newAccount = new Account()
        newAccount.idWallet = walletId
        newAccount.name = name
        newAccount.blockchain = blockchain
        newAccount.backgroundColor = theme.colors.card[UtilsHelper.getRandomNumber(6)]
        newAccount.srcIcon = blockchainServices[blockchain].icon
        newAccount.address = address
        dispatch(saveAccount({ account: newAccount }))
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
