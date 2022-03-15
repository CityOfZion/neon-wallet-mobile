import i18n from 'i18n-js'
import {useCallback, useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {
  BlockchainServiceKey,
  blockchainList,
  blockchainServices,
} from '~src/blockchain'
import {AsteroidHelper} from '~src/helpers/AsteroidHelper'
import {getRandomColor} from '~src/scenes/CustomizeAccount'
import {RootStore} from '~src/store/RootStore'

export function useBlockchainActionsHook() {
  const [walletIdState, setWalletIdState] = useState<string>()
  const [accountAddress, setAccountAddress] = useState<string>()
  const [isInitialWallet, setIsIninitialWallet] = useState<boolean>(false)

  const dispatch = useDispatch()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const timerStatus = useSelector((state: RootState) => state.timer.status)

  const init = useCallback(() => {
    dispatch(RootStore.timer.actions.setTimerOff())
  }, [])

  const finish = useCallback(() => {
    dispatch(RootStore.timer.actions.setTimerOn())
  }, [])

  const createInitialWallet = useCallback(async () => {
    if (!timerStatus) {
      throw new Error('The hook need be initialized')
    }
    const words = AsteroidHelper.generateMnemonic() ?? []
    await createWallet(
      i18n.t('onboarding.firstWalletName'),
      words.join(' '),
      'standard'
    )
    setIsIninitialWallet(true)
  }, [timerStatus])

  const createWallet = useCallback(
    async (
      name: string,
      securityPhrase: string,
      type: WalletType,
      isImport?: boolean
    ) => {
      if (!timerStatus) {
        throw new Error('The hook need be initialized')
      }
      dispatch(RootStore.wallet.actions.setName(name))
      dispatch(RootStore.wallet.actions.setSecurityPhrase(securityPhrase))
      dispatch(RootStore.wallet.actions.setType(type))

      const walletId = await dispatchAsyncString(
        RootStore.wallet.actions.createAndSave()
      )

      await dispatchAsync(
        RootStore.wallet.actions.setShowBackupAlert(walletId, !isImport)
      )

      await dispatchAsync(RootStore.app.actions.syncWallets())

      dispatch(RootStore.wallet.actions.selectWallet(walletId))

      setWalletIdState(walletId)
    },
    [timerStatus]
  )

  const createAccount = useCallback(
    async (
      walletId: string,
      name: string,
      blockchain: BlockchainServiceKey,
      index?: number
    ) => {
      if (!timerStatus) {
        throw new Error('The hook need be initialized')
      }
      dispatch(RootStore.account.actions.setIdWallet(walletId))
      dispatch(RootStore.account.actions.setName(name))
      dispatch(RootStore.account.actions.setBlockchain(blockchain))
      dispatch(
        RootStore.account.actions.setBackgroundColor(
          theme.colors.card[getRandomColor(6)]
        )
      )
      dispatch(
        RootStore.account.actions.setSrcIcon(
          blockchainServices[blockchain].icon
        )
      )
      const address = await dispatchAsyncString(
        RootStore.account.actions.createAndSave(index)
      )
      await dispatchAsync(RootStore.app.actions.syncAccounts())
      await dispatchAsync(RootStore.app.actions.syncWallets())
      setAccountAddress(address)
    },
    [timerStatus]
  )

  const importAccount = useCallback(
    async (
      walletId: string,
      name: string,
      wif: string,
      address: string,
      blockchain: BlockchainServiceKey
    ) => {
      dispatch(RootStore.account.actions.setIdWallet(walletId))
      dispatch(RootStore.account.actions.setName(name))
      dispatch(RootStore.account.actions.setBlockchain(blockchain))
      dispatch(
        RootStore.account.actions.setBackgroundColor(
          theme.colors.card[getRandomColor(6)]
        )
      )
      dispatch(
        RootStore.account.actions.setSrcIcon(
          blockchainServices[blockchain].icon
        )
      )
      await dispatchAsync(RootStore.account.actions.importAndSave(address, wif))
      await dispatchAsync(RootStore.app.actions.syncAccounts())
      await dispatchAsync(RootStore.app.actions.fetchBalanceAccounts())
      await dispatchAsync(RootStore.app.actions.syncAccounts())
      await dispatchAsync(RootStore.app.actions.syncWallets())
      setAccountAddress(address)
    },
    []
  )

  const importWatchAccount = useCallback(
    async (
      walletId: string,
      name: string,
      address: string,
      blockchain: BlockchainServiceKey
    ) => {
      dispatch(RootStore.account.actions.setIdWallet(walletId))
      dispatch(RootStore.account.actions.setName(name))
      dispatch(RootStore.account.actions.setBlockchain(blockchain))
      dispatch(
        RootStore.account.actions.setBackgroundColor(
          theme.colors.card[getRandomColor(6)]
        )
      )
      dispatch(
        RootStore.account.actions.setSrcIcon(
          blockchainServices[blockchain].icon
        )
      )
      await dispatchAsync(RootStore.account.actions.importAndSave(address))
      await dispatchAsync(RootStore.app.actions.syncAccounts())
      await dispatchAsync(RootStore.app.actions.syncWallets())
      setAccountAddress(address)
    },
    []
  )

  const createAccountsInitialWallet = useCallback(async () => {
    if (walletIdState) {
      for (const blockchainKey of blockchainList) {
        dispatch(RootStore.account.actions.setIdWallet(walletIdState))
        dispatch(
          RootStore.account.actions.setName(
            i18n.t('modals.blockchainList.countAccount', {
              count: 1,
            })
          )
        )
        dispatch(RootStore.account.actions.setBlockchain(blockchainKey))
        dispatch(
          RootStore.account.actions.setBackgroundColor(
            theme.colors.card[getRandomColor(6)]
          )
        )
        dispatch(
          RootStore.account.actions.setSrcIcon(
            blockchainServices[blockchainKey].icon
          )
        )
        await dispatchAsyncString(RootStore.account.actions.createAndSave())
        await dispatchAsync(RootStore.app.actions.syncAccounts())
        await dispatchAsync(RootStore.app.actions.syncWallets())
      }
      finish()
    }
  }, [isInitialWallet, walletIdState])

  useEffect(() => {
    if (isInitialWallet && walletIdState) {
      createAccountsInitialWallet()
    }
  }, [isInitialWallet, walletIdState])

  return {
    init,
    finish,
    createInitialWallet,
    createWallet,
    createAccount,
    importAccount,
    importWatchAccount,
    walletIdState,
    accountAddress,
  }
}
