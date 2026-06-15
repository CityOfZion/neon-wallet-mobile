import React, { Fragment, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import AccountSubTitle from '@/components/AccountSubTitle'
import NeonQRCode from '@/components/NeonQRCode'
import { ScreenLoader } from '@/components/ScreenLoader'
import { TwButton } from '@/components/TwButton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SecureStoreHelper } from '@/helpers/SecureStoreHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useMount } from '@/hooks/useMount'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

export const ExportKeyModal = ({ navigation, route }: TRootStackScreenProps<'ExportKeyModal'>) => {
  const { account } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'exportKey' })
  const { t: tCommon } = useTranslation('common')

  const [key, setKey] = useState<string>()

  const handleCopy = () => {
    ClipboardHelper.write(key)
  }

  const { isMounting } = useMount(
    async () => {
      try {
        const accountKey = await SecureStoreHelper.getKey(account)

        if (!accountKey) {
          throw new AppError('Key not found')
        }

        setKey(accountKey)
      } catch (error) {
        LoggerHelper.error(error, { where: 'ExportKeyModal', operation: 'getKey' })
        ToastHelper.error({ message: AppError.wrap(error, t('unexpectedError')).message })
        navigation.goBack()
      }
    },
    [account],
    500
  )

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <AccountSubTitle account={account} />

        {isMounting || !key ? (
          <ScreenLoader />
        ) : (
          <Fragment>
            <View className="my-11 w-full px-9">
              <NeonQRCode value={key} />
            </View>

            <Text className="font-sans-semibold text-sm uppercase text-gray-300">{t('details')}</Text>
            <Text className="mt-2 font-sans-regular text-base text-white">{key}</Text>

            <TwButton
              leftElement={<TbCopy aria-hidden />}
              className="mt-auto"
              variant="contained-light"
              label={tCommon('general.copyToClipboard')}
              onPress={handleCopy}
            />
          </Fragment>
        )}
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
