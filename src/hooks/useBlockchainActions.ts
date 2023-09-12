import i18n from 'i18n-js'
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { SecurityHelper } from '../helpers/SecurityHelper'
import { UtilsHelper } from '../helpers/UtilsHelper'
import { Account } from '../store/account/Account'
import { selectAccounts } from '../store/account/SelectorAccount'
import { Wallet } from '../store/wallet/Wallet'
import { TBlockchainServiceKey } from '../types/blockchain'
import { WalletType } from '../types/store'

import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { walletReducerActions } from '~/src/store/wallet/WalletReducer'
import { wrapper } from '~src/app/ApplicationWrapper'
import { RootState } from '~src/store/RootStore'

export type AccountToImport = {
  address: string
  blockchain: TBlockchainServiceKey
  wallet: Wallet
  type: WalletType
  key?: string
  name?: string
}

export function useBlockchainActions() {
  const { saveWallet } = walletReducerActions
  const { saveAccount } = accountReducerActions
  const dispatch = useDispatch()
  const accounts = useSelector(selectAccounts)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const bsAggregator = useSelector((state: RootState) => state.blockchain.bsAggregator)

  const createWallet = useCallback(
    async (name: string, walletType: WalletType, securityPhrase?: string, hasBackup?: boolean) => {
      const id = UtilsHelper.uuid()

      const newWallet = new Wallet({
        name,
        walletType,
        id,
        backupStatus: hasBackup ? 'successful' : 'unsuccessful',
      })

      if (walletType === 'standard') {
        if (!securityPhrase) throw new Error('Standard Wallet needs to have a security phrase')
        await SecurityHelper.saveMnemonic(id, securityPhrase)
      }

      dispatch(saveWallet(newWallet))

      return newWallet
    },
    []
  )

  const createAccount = useCallback(
    async (wallet: Wallet, name: string, blockchain: TBlockchainServiceKey, index?: number, colorDefault?: boolean) => {
      const mnemonic = await SecurityHelper.loadMnemonic(wallet.id)
      if (!mnemonic) throw new Error('Problem to create account')

      const accountIndex =
        index ?? accounts.filter(account => account.idWallet === wallet.id && account.blockchain === blockchain).length

      const service = bsAggregator.getBlockchainByName(blockchain)
      const generatedAccount = service.generateAccountFromMnemonic(mnemonic, accountIndex)

      const newAccount = new Account({
        idWallet: wallet.id,
        name,
        blockchain,
        backgroundColor: colorDefault ? theme.colors.card[0] : theme.colors.card[UtilsHelper.getRandomNumber(6)],
        address: generatedAccount.address,
        accountType: wallet.walletType,
      })

      await SecurityHelper.saveKey(generatedAccount.address, generatedAccount.key)
      dispatch(saveAccount(newAccount))

      return newAccount
    },
    [theme, accounts]
  )

  const importAccount = useCallback(
    async ({ address, blockchain, type, wallet, key, name }: AccountToImport) => {
      if (type === 'standard' || type === 'legacy') {
        if (!key) throw new Error('Key not defined')

        await SecurityHelper.saveKey(address, key)
      }

      const newAccount = new Account({
        idWallet: wallet.id,
        name: name ?? `${i18n.t(`blockchainServices.${blockchain}.accountName`)} 1`,
        blockchain,
        backgroundColor: theme.colors.card[UtilsHelper.getRandomNumber(6)],
        address,
        accountType: type,
      })

      dispatch(saveAccount(newAccount))
      return newAccount
    },
    [theme]
  )

  const importAccounts = useCallback(
    async (accounts: AccountToImport[]) => {
      const promises = accounts.map(account => importAccount(account))

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
