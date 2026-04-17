import * as Linking from 'expo-linking'
import { storeUrl } from 'expo-store-review'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { match } from 'ts-pattern'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { ClickupHelper } from '@/helpers/ClickupHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from '@/hooks/useActions'
import { useAppDispatch } from '@/hooks/useRedux'

import { ModalLayout } from '@/layouts/ModalLayout'

import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import TbCheckbox from '@/assets/images/tb-checkbox.svg'

import { SurveyModalThumbs } from './SurveyModalThumbs'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionsData = {
  rating?: 'up' | 'down'
  description?: string
  negativeFeedbackSubmitted?: boolean
}

export const SurveyModal = ({ navigation }: TRootStackScreenProps<'SurveyModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'survey' })
  const dispatch = useAppDispatch()

  const { actionData, handleAct, actionState, setData, setDataWrapper } = useActions<TActionsData>({
    rating: undefined,
    description: '',
    negativeFeedbackSubmitted: false,
  })

  const isSubmitFeedbackDisabled = actionState.isActing || !actionData.description?.trim()

  const handlePressThumbsUp = async () => {
    const expoStoreUrl = storeUrl()

    const canOpen = expoStoreUrl ? await Linking.canOpenURL(expoStoreUrl) : false

    if (!canOpen) {
      ToastHelper.error({ message: t('error.storeReviewNotAvailable') })
      return
    }

    dispatch(settingsReducerActions.setSurveyInfo('submitted-positive'))

    await Linking.openURL(expoStoreUrl!)

    setData({ rating: 'up' })
  }

  const handlePressThumbsDown = () => {
    setData({ rating: 'down' })
  }

  const handleSubmitFeedback = async () => {
    if (actionData.rating === 'down' && actionData.description) {
      await ClickupHelper.createFeedbackTicket(actionData.description)

      dispatch(settingsReducerActions.setSurveyInfo('submitted-negative'))

      setData({ negativeFeedbackSubmitted: true })
    }
  }

  return (
    <ModalLayout.Root full={actionData.rating === 'down' && !actionData.negativeFeedbackSubmitted}>
      <ModalLayout.Header>
        <ModalLayout.Title className="text-xl">
          {actionData.negativeFeedbackSubmitted ? t('titleFeedbackSubmitted') : t('title')}
        </ModalLayout.Title>

        <ModalLayout.CloseButton />
      </ModalLayout.Header>

      {match(actionData)
        .with({ rating: undefined, negativeFeedbackSubmitted: false }, () => (
          <ModalLayout.ScrollContent>
            <SurveyModalThumbs
              rating={actionData.rating}
              onPressThumbsDown={handlePressThumbsDown}
              onPressThumbsUp={handlePressThumbsUp}
            />

            <TwButton
              label={t('notNowButtonLabel')}
              variant="text"
              className="mb-6"
              colorSchema="gray"
              onPress={() => navigation.goBack()}
            />
          </ModalLayout.ScrollContent>
        ))
        .with({ rating: 'down', negativeFeedbackSubmitted: false }, () => (
          <ModalLayout.KeyboardAvoidingContent>
            <SurveyModalThumbs
              rating={actionData.rating}
              onPressThumbsDown={handlePressThumbsDown}
              onPressThumbsUp={handlePressThumbsUp}
            />

            <TwInput
              label={t('detailsInputLabel')}
              placeholder={t('detailsInputPlaceholder')}
              multiline
              textAlignVertical="top"
              value={actionData.description}
              onChangeText={setDataWrapper('description')}
              className="h-96 align-top"
            />

            <ModalLayout.KeyboardAvoidingArea>
              <TwButton
                leftElement={<TbCheckbox aria-hidden />}
                label={t('submitButtonLabel')}
                variant="contained-light"
                onPress={handleAct(handleSubmitFeedback)}
                disabled={isSubmitFeedbackDisabled}
                isLoading={actionState.isActing}
              />
            </ModalLayout.KeyboardAvoidingArea>
          </ModalLayout.KeyboardAvoidingContent>
        ))
        .otherwise(() => (
          <ModalLayout.ScrollContent contentContainerClassName="items-center mb-4">
            <PiSealCheck className="mb-6 size-32 text-blue" aria-hidden />

            <Text className="text-center font-sans-regular text-1xl text-white">
              {t('descriptionFeedbackSubmitted')}
            </Text>
          </ModalLayout.ScrollContent>
        ))}
    </ModalLayout.Root>
  )
}
