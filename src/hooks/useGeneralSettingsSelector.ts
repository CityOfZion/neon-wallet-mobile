import { useAppSelector } from './useRedux'

export const useIsGeneralSettingsDisabledSelector = () => {
  const { value: isGeneralSettingsDisabled, ref: isGeneralSettingsDisabledRef } = useAppSelector(
    ({ account, wallet }) => {
      const allWalletsAreHardware =
        wallet.data.length > 0 && wallet.data.every(currentWallet => currentWallet.type === 'hardware')

      const allAccountsAreWatchOrHardware =
        account.data.length > 0 &&
        account.data.every(currentAccount => currentAccount.type === 'watch' || currentAccount.type === 'hardware')

      return allWalletsAreHardware || allAccountsAreWatchOrHardware
    }
  )

  return { isGeneralSettingsDisabled, isGeneralSettingsDisabledRef }
}
