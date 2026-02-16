import { hasEncryption } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { AccountHelper } from '@/helpers/AccountHelper'
import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'
import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useImportAccount } from '@/hooks/useAccountActions'
import { useAccountsSelector } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'
import { useCreateWallet } from '@/hooks/useWalletActions'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import type { TMoreStackScreenProps } from '@/types/stacks'

type TActionData = {
  password: string
}

export const ImportPassphraseScreen = ({ navigation, route }: TMoreStackScreenProps<'ImportPassphraseScreen'>) => {
  const { blockchain, encryptedKey } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'importPassphraseScreen' })
  const { t: commonT } = useTranslation('common')

  const { accounts } = useAccountsSelector()
  const { createWallet } = useCreateWallet()
  const { importAccount } = useImportAccount()

  const { actionData, actionState, setDataWrapper, handleAct, reset } = useActions<TActionData>({ password: '' })

  const handlePressNext = async () => {
    try {
      await UtilsHelper.sleep(500)

      const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

      if (!hasEncryption(service)) throw new AppError(commonT('errors.blockchainDoesNotSupportEncryption'))

      const { address, key } = await service.decrypt(encryptedKey, actionData.password)

      const addressAlreadyExist = accounts.some(AccountHelper.predicate({ address, blockchain }))

      if (addressAlreadyExist) {
        ToastHelper.error({ message: t('accountAlreadyExists'), duration: 4000 })
        return
      }

      const wallet = await createWallet({
        name: commonT('wallet.encryptedName'),
        backupStatus: 'successful',
        type: 'non-standard',
      })

      await importAccount({ address, blockchain, wallet, key, type: 'standard' })

      AnalyticsHelper.logEvent('wallet_imported')

      navigation.popToTop()
      navigation.jumpTo('WalletsStack', { screen: 'WalletsScreen', params: { wallet } })
    } catch (error) {
      LoggerHelper.error(error, { where: 'ImportPassphraseScreen', operation: 'handlePressNext' })
      ToastHelper.error({ message: AppError.wrap(error, t('decryptError')).message })
    } finally {
      reset()
    }
  }

  return (
    <TwScreenLayout title={t('title')}>
      <Text className="px-10 text-center font-sans-medium text-lg text-white"> {t('enterPassphrase')}</Text>

      <TwInput
        placeholder={t('inputPlaceholder')}
        containerProps={{ className: 'mt-6' }}
        inputContainerProps={{ className: 'bg-gray-900' }}
        value={actionData.password}
        onChangeText={setDataWrapper('password')}
        secureTextEntry
        autoComplete="off"
        pastable
      />

      <View className="mt-auto py-3">
        <TwButton
          variant="contained-light"
          label={commonT('general.next')}
          onPress={handleAct(handlePressNext)}
          isLoading={actionState.isActing}
        />
      </View>
    </TwScreenLayout>
  )
}
