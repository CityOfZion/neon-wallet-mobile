import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { ClickupHelper } from '@/helpers/ClickupHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { FormHelper } from '@/helpers/FormHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from '@/hooks/useActions'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import type { TMoreStackScreenProps } from '@/types/stacks'

type TActionsData = {
  name: string
  email: string
  description: string
}

export const SupportTicketScreen = ({ navigation }: TMoreStackScreenProps<'SupportTicketScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'supportTicket' })

  const { actionData, handleAct, actionState, setError, setDataWrapper } = useActions<TActionsData>({
    email: '',
    name: '',
    description: '',
  })

  const isDisabled = !actionData.name || !actionData.email || !actionData.description || actionState.isActing

  const handleSubmit = async () => {
    try {
      const name = actionData.name.trim()
      const email = actionData.email.trim()
      const description = actionData.description.trim()

      if (!name) {
        setError('name', t('errors.nameRequired'))
        return
      }

      if (!description) {
        setError('description', t('errors.descriptionRequired'))
        return
      }

      if (!email) {
        setError('email', t('errors.emailRequired'))
        return
      }

      if (!FormHelper.isEmailValid(email)) {
        setError('email', t('errors.invalidEmail'))
        return
      }

      await ClickupHelper.createSupportTicket({
        name,
        email,
        description,
      })

      navigation.navigate('MoreScreen')
      ToastHelper.success({ message: t('successToast') })
    } catch (error) {
      LoggerHelper.error(error, { where: 'SupportTicketScreen', operation: 'handleSubmit' })
      ToastHelper.error({ message: AppError.wrap(error, t('errors.submitError')).message })
    }
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>

      <ScreenLayout.KeyboardAvoidingContent>
        <TwInput
          placeholder={t('namePlaceholder')}
          label={t('nameLabel')}
          value={actionData.name}
          onChangeText={setDataWrapper('name')}
          inputContainerProps={{
            className: 'bg-gray-900',
          }}
          containerProps={{
            className: 'mt-6',
          }}
          error={actionState.errors.name}
        />
        <TwInput
          placeholder={t('emailPlaceholder')}
          label={t('emailLabel')}
          value={actionData.email}
          onChangeText={setDataWrapper('email')}
          inputContainerProps={{
            className: 'bg-gray-900',
          }}
          containerProps={{
            className: 'mt-6',
          }}
          error={actionState.errors.email}
        />
        <TwInput
          placeholder={t('descriptionPlaceholder')}
          label={t('descriptionLabel')}
          value={actionData.description}
          onChangeText={setDataWrapper('description')}
          multiline
          containerProps={{
            className: 'mt-6 mb-8',
          }}
          inputContainerProps={{
            className: 'bg-gray-900 py-2',
          }}
          className="min-h-72 align-top"
        />

        <ScreenLayout.KeyboardAvoidingArea>
          <TwButton
            variant="contained-light"
            label={t('submitTicketButtonLabel')}
            onPress={handleAct(handleSubmit)}
            isLoading={actionState.isActing}
            disabled={isDisabled}
          />
        </ScreenLayout.KeyboardAvoidingArea>
      </ScreenLayout.KeyboardAvoidingContent>
    </ScreenLayout.Root>
  )
}
