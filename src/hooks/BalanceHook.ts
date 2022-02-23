import {useState, useCallback, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'

import {FilterHelper} from '~src/helpers/FilterHelper'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStore} from '~src/store/RootStore'
export function useBalanceHook() {
  const dispatchWallet = useDispatch<SyncDispatch<Wallet>>()
  const selectedWallet = useSelector((state: RootState) => state.wallet)
  const {currency, language} = useSelector((state: RootState) => state.settings)
  const {exchange, accounts} = useSelector((state: RootState) => state.app)
  const [walletBalance, setWalletBalance] = useState<string>('')
  const [wallet, setWallet] = useState<Wallet>()

  const getWalletBalance = useCallback(() => {
    if (wallet) {
      const balance = wallet.calculateBalance(currency, exchange)
      const formatedBalance =
        balance !== 0
          ? FilterHelper.currency(
              wallet.calculateBalanceFormatted(currency, language, exchange),
              currency
            )
          : FilterHelper.currency(balance, currency, language, 0, 0)
      setWalletBalance(formatedBalance)
    }
  }, [wallet, wallet?.tokenAssets])

  useEffect(() => {
    setWallet(dispatchWallet(RootStore.wallet.actions.getFromSelection()))
  }, [selectedWallet, selectedWallet.tokenAssets])

  useEffect(() => {
    if (wallet) {
      getWalletBalance()
    }
  }, [wallet, accounts, wallet?.tokenAssets])

  return {walletBalance}
}
