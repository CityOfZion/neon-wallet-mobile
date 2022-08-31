import i18n from 'i18n-js'
import allSetlled from 'promise.allsettled'
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { SecurityHelper } from '../helpers/SecurityHelper'
import { UtilsHelper } from '../helpers/UtilsHelper'
import { Account } from '../models/redux/Account'
import { Wallet } from '../models/redux/Wallet'
import { selectAccounts } from '../store/account/SelectorAccount'
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
  type: WalletType
  wif?: string
}

export function useBlockchainActions() {
  const { saveWallet, selectedWallet } = walletReducerActions
  const { saveAccount } = accountReducerActions
  const dispatch = useDispatch()
  const accounts = useSelector(selectAccounts)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const createWallet = useCallback(
    async (name: string, type: WalletType, securityPhrase?: string, hasBackup?: boolean) => {
      const walletId = UtilsHelper.uuid()

      const newWallet = new Wallet()

      newWallet.id = walletId
      newWallet.name = name
      newWallet.walletType = type
      newWallet.backupStatus = hasBackup ? 'successful' : 'unsuccessful'

      if (type === 'standard') {
        if (!securityPhrase) throw new Error('Standard Wallet needs to have a security phrase')

        await SecurityHelper.saveMnemonic(walletId, securityPhrase)
      }

      dispatch(saveWallet(newWallet))
      dispatch(selectedWallet(newWallet))

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
      newAccount.backgroundColor = colorDefault
        ? theme.colors.card[0]
        : theme.colors.card[UtilsHelper.getRandomNumber(6)]

      const mnemonic = await SecurityHelper.loadMnemonic(walletId)

      if (!mnemonic) throw new Error('Problem to create account')

      const accountIndex =
        index ?? accounts.filter(account => account.idWallet === walletId && account.blockchain === blockchain).length

      const generatedAccount = blockchainServices[blockchain].generateAccount(mnemonic, accountIndex)

      newAccount.address = generatedAccount.address

      await SecurityHelper.saveWif(generatedAccount.address, generatedAccount.wif)

      dispatch(saveAccount(newAccount))

      return newAccount.address
    },
    [theme, accounts]
  )

  const importAccount = useCallback(
    async (
      walletId: string,
      name: string,
      address: string,
      blockchain: BlockchainServiceKey,
      type: WalletType,
      wif?: string
    ) => {
      const newAccount = new Account()
      newAccount.idWallet = walletId
      newAccount.name = name
      newAccount.blockchain = blockchain
      newAccount.backgroundColor = theme.colors.card[UtilsHelper.getRandomNumber(6)]
      newAccount.address = address
      newAccount.accountType = type

      if (type === 'standard' || type === 'legacy') {
        if (!wif) throw new Error('Wif not defined')

        await SecurityHelper.saveWif(address, wif)
      }

      dispatch(saveAccount(newAccount))
    },
    [theme]
  )

  const importAccounts = useCallback(
    async (accounts: AccountToImport[]) => {
      const promises = accounts.map(account =>
        importAccount(
          account.walletId,
          `${i18n.t(`blockchainServices.${account.blockchain}.accountName`)} 1`,
          account.address,
          account.blockchain,
          account.type,
          account.wif
        )
      )

      allSetlled.shim()

      return await Promise.allSettled(promises)
    },
    [importAccount]
  )

  return {
    createWallet,
    createAccount,
    importAccount,
    importAccounts,
  }
}
