import React from 'react'

import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwMenuButton } from '@/components/TwMenuButton'

import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'

import TbCheckbox from '@/assets/images/tb-checkbox.svg'

import { notificationReducerActions } from '@/store/reducers/notification'
import type { TRootStackScreenProps } from '@/types/stacks'

export const NotificationContextModal = ({ navigation, route }: TRootStackScreenProps<'NotificationContextModal'>) => {
  const { notification } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'notificationContextModal' })
  const { t: commonT } = useTranslation('common')
  const dispatch = useAppDispatch()

  const handleToggleRead = () => {
    dispatch(
      notificationReducerActions.saveNotification({
        ...notification,
        read: !notification.read,
      })
    )
    navigation.goBack()
  }

  return (
    <TwModalLayout withoutHeader full={false}>
      <TwMenuButton
        label={!notification.read ? t('markAsReadButtonLabel') : t('markAsUnreadButtonLabel')}
        leftElement={<TbCheckbox aria-hidden className="text-neon" />}
        onPress={handleToggleRead}
      />

      <TwButton variant="text" label={commonT('general.cancel')} className="mt-7" onPress={navigation.goBack} />
    </TwModalLayout>
  )
}
