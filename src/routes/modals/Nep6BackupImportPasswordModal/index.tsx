import { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { ImportPasswordRow } from '@/components/ImportPasswordRow'
import { ImportSharedPassword } from '@/components/ImportSharedPassword'
import { TwButton } from '@/components/TwButton'
import { TwCheckbox } from '@/components/TwCheckbox'
import { TwSeparator } from '@/components/TwSeparator'

import { AnalyticsHelper } from '@/helpers/AnalyticsHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from '@/hooks/useActions'
import { useNep6BackupFile } from '@/hooks/useNep6BackupFile'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbFileImport from '@/assets/images/tb-file-import.svg'

import type { TUseImportNep6Account, TUseImportNep6DecryptedAccount } from '@/types/hooks'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionsData = {
  decryptedAccounts: TUseImportNep6DecryptedAccount[]
}

export const Nep6BackupImportPasswordModal = ({
  navigation,
  route,
}: TRootStackScreenProps<'Nep6BackupImportPasswordModal'>) => {
  const { accounts, onSuccess } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'nep6BackupImportPassword' })

  const { handleTryDecryptAccount, handleGenerateData, handleImportBackupData } = useNep6BackupFile()

  const { actionData, actionState, setData, handleAct } = useActions<TActionsData>({ decryptedAccounts: [] })

  const hasMultipleAccounts = accounts.length > 1
  const [samePassword, setSamePassword] = useState(hasMultipleAccounts)

  const isDisabled = accounts.length !== actionData.decryptedAccounts.length

  const handlePasswordSubmit = async (account: TUseImportNep6Account, password: string) => {
    const decryptedAccount = await handleTryDecryptAccount(account, password)
    if (!decryptedAccount) throw new AppError(t('passwordError'))

    setData(previousData => ({
      decryptedAccounts: [
        ...previousData.decryptedAccounts.filter(({ address }) => address !== account.address),
        decryptedAccount,
      ],
    }))
  }

  const handleSamePasswordSubmit = async (password: string) => {
    const decryptedAccounts: TUseImportNep6DecryptedAccount[] = []

    for (const account of accounts) {
      const decryptedAccount = await handleTryDecryptAccount(account, password)
      if (!decryptedAccount) throw new AppError(t('passwordError'))

      decryptedAccounts.push(decryptedAccount)
    }

    setData({ decryptedAccounts })
  }

  const handleToggleSamePassword = (checked: boolean) => {
    setSamePassword(checked)
    setData({ decryptedAccounts: [] })
  }

  const handleImport = async (data: TActionsData) => {
    try {
      const generatedData = handleGenerateData(data.decryptedAccounts)
      await handleImportBackupData(generatedData)

      if (onSuccess) {
        onSuccess()
        return
      }

      AnalyticsHelper.logEvent('wallet_imported')

      navigation.navigate('SuccessModal', {
        title: t('title'),
        content: t('success.description'),
        buttonLabel: t('success.buttonLabel'),
        onClose: () => {
          navigation.navigate('TabStack', { screen: 'WalletsStack', params: { screen: 'WalletsScreen' } })
        },
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'Nep6BackupImportPasswordModal', operation: 'handleImport' })
      ToastHelper.error({ message: AppError.wrap(error, t('importError')).message })
    }
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.KeyboardAvoidingContent>
        <View>
          <Text className="font-sans-regular text-lg text-white">{t('description', { count: accounts.length })}</Text>

          {hasMultipleAccounts && (
            <TwCheckbox
              className="mt-6 self-start"
              checked={samePassword}
              onCheckedChange={handleToggleSamePassword}
              label={t('samePasswordLabel')}
            />
          )}

          <View className="mt-4">
            {samePassword ? (
              <ImportSharedPassword
                inputLabel={t('inputLabel')}
                inputPlaceholder={t('inputPlaceholder')}
                error={t('passwordError')}
                onSubmit={handleSamePasswordSubmit}
              />
            ) : (
              accounts.map((account, index) => (
                <Fragment key={account.address}>
                  <ImportPasswordRow
                    account={account}
                    inputLabel={t('inputLabel')}
                    inputPlaceholder={t('inputPlaceholder')}
                    error={t('passwordError')}
                    onSubmit={handlePasswordSubmit}
                  />

                  {index < accounts.length - 1 && <TwSeparator className="my-4" />}
                </Fragment>
              ))
            )}
          </View>
        </View>

        <ModalLayout.KeyboardAvoidingArea className="pt-8">
          <TwButton
            variant="contained-light"
            label={t('buttonLabel')}
            leftElement={<TbFileImport aria-hidden />}
            isLoading={actionState.isActing}
            disabled={isDisabled}
            onPress={handleAct(handleImport)}
          />
        </ModalLayout.KeyboardAvoidingArea>
      </ModalLayout.KeyboardAvoidingContent>
    </ModalLayout.Root>
  )
}
