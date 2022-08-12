import { createSelector } from '@reduxjs/toolkit'
import { plainToClass } from 'class-transformer'

import { RootState } from '../RootStore'

import { blockchainList, blockchainServices } from '~/src/blockchain'
import { Account } from '~/src/models/redux/Account'

const rootState = (state: RootState) => state

export const selectAccounts = createSelector(rootState, state => {
  const accounts = plainToClass(Account, state.account.data)
  blockchainList.forEach(blockchain => {
    blockchainServices[blockchain].setAccountsPool(accounts.filter(acc => acc.blockchain === blockchain))
  })
  return accounts
})
