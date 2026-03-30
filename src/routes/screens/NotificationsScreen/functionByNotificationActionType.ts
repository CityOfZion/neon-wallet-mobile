import { match } from 'ts-pattern'

import { AccountHelper } from '@/helpers/AccountHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { ReduxHelper } from '@/helpers/ReduxHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { selectAccounts } from '@/hooks/useAccountSelector'
import { selectWalletById } from '@/hooks/useWalletSelector'

import type { TAccountHelperPredicateParams } from '@/types/helpers'
import type { TMoreStackScreenProps } from '@/types/stacks'
import type { TNotificationAction } from '@/types/store'

type TFunctionParams<T> = {
  navigation: TMoreStackScreenProps<'NotificationsScreen'>['navigation']
  notificationAction: T
}

type TFunctionByNotificationActionType = {
  [K in TNotificationAction['type']]: (params: TFunctionParams<TNotificationAction & { type: K }>) => Promise<void>
}

const { t } = I18nextHelper.get()

const getAccountAndWallet = (params: TAccountHelperPredicateParams) => {
  const state = ReduxHelper.store.getState()
  const accounts = selectAccounts(state)
  const account = accounts.find(AccountHelper.predicate(params))

  if (!account) {
    throw new AppError(t('screens:notificationsScreen.actions.error.accountNotFound'))
  }

  const wallet = selectWalletById(account.idWallet)(state)
  if (!wallet) {
    throw new AppError(t('screens:notificationsScreen.actions.error.walletNotFound'))
  }

  return { account, wallet }
}

export const functionByNotificationActionType: TFunctionByNotificationActionType = {
  navigate: async ({ navigation, notificationAction }) => {
    match(notificationAction.payload)
      .with({ to: 'account-transaction' }, async payload => {
        const { account } = getAccountAndWallet(payload)

        navigation.goBack()

        await UtilsHelper.sleep(500)

        navigation.navigate('TabStack', {
          screen: 'WalletsStack',
          params: {
            screen: 'AccountTransactionsScreen',
            params: {
              account,
            },
          },
        })
      })
      .with({ to: 'account-tokens' }, payload => {
        const { account, wallet } = getAccountAndWallet(payload)

        navigation.navigate('TabStack', {
          screen: 'WalletsStack',
          params: {
            screen: 'AccountAssetsScreen',
            params: { account, wallet },
          },
        })
      })
      .with({ to: 'hide-fraudulent-token' }, ({ address, blockchain, tokenHash }) => {
        const { account, wallet } = getAccountAndWallet({ address, blockchain })

        if (tokenHash) {
          navigation.navigate('HideFraudulentTokenModal', { account, hash: tokenHash })

          return
        }

        navigation.navigate('TabStack', {
          screen: 'WalletsStack',
          params: {
            screen: 'AccountAssetsScreen',
            params: { wallet, account },
          },
        })
      })
      .with({ to: 'vote-neo3' }, async payload => {
        const { account } = getAccountAndWallet(payload)

        navigation.goBack()

        await UtilsHelper.sleep(500)

        navigation.navigate('TabStack', {
          screen: 'WalletsStack',
          params: {
            screen: 'VoteNeo3Screen',
            params: {
              defaultNeo3Account: account,
            },
          },
        })
      })
      .with({ to: 'backup-wallet' }, async () => {
        navigation.replace('TabStack', {
          screen: 'MoreStack',
          params: {
            initial: false,
            screen: 'SettingsScreen',
            params: { tab: 'security' },
          },
        })

        await UtilsHelper.sleep(500)

        navigation.navigate('CreateBackupModal')
      })
      .exhaustive()
  },
}
