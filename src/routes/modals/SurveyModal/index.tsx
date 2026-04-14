import { Fragment } from 'react'

import * as Linking from 'expo-linking'
import { storeUrl } from 'expo-store-review'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { ClickupHelper } from '@/helpers/ClickupHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from '@/hooks/useActions'
import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import PiSealCheck from '@/assets/images/pi-seal-check.svg'
import TbCheckbox from '@/assets/images/tb-checkbox.svg'
import TbThumbDownFilled from '@/assets/images/tb-filled-thumb-down.svg'
import TbThumbUpFilled from '@/assets/images/tb-filled-thumb-up.svg'
import TbThumbDown from '@/assets/images/tb-thumb-down.svg'
import TbThumbUp from '@/assets/images/tb-thumb-up.svg'

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
    setData({ rating: 'up' })

    const expoStoreUrl = storeUrl()

    const canOpen = expoStoreUrl ? await Linking.canOpenURL(expoStoreUrl) : false

    if (!canOpen) {
      ToastHelper.error({ message: t('error.storeReviewNotAvailable') })
      return
    }

    await Linking.openURL(expoStoreUrl!)

    dispatch(settingsReducerActions.setSurveyInfo('submitted-positive'))

    navigation.goBack()
  }

  const handleSubmitFeedback = async () => {
    if (actionData.rating === 'down' && actionData.description) {
      await ClickupHelper.createFeedbackTicket(actionData.description)

      dispatch(settingsReducerActions.setSurveyInfo('submitted-negative'))

      setData({ negativeFeedbackSubmitted: true })
    }
  }

  return (
    <TwModalLayout
      title={actionData.negativeFeedbackSubmitted ? t('titleFeedbackSubmitted') : t('title')}
      titleClassName="text-xl"
      contentContainerClassName="items-center pt-2"
      full={actionData.rating === 'down' && !actionData.negativeFeedbackSubmitted}
      rightElement={<TwModalLayoutCloseIconButton />}
    >
      {actionData.negativeFeedbackSubmitted ? (
        <View className="mb-8 flex-col items-center gap-6">
          <PiSealCheck className="size-32 text-blue" aria-hidden />

          <Text className="text-center font-sans-regular text-1xl text-white">{t('descriptionFeedbackSubmitted')}</Text>
        </View>
      ) : (
        <Fragment>
          <Text className="mb-8 font-sans-regular text-base text-white">{t('requestReview')}</Text>

          <View className="mb-8 w-full flex-row justify-center">
            <TwButton
              aria-label={t('likeButtonLabel')}
              variant="text"
              leftElement={
                actionData.rating === 'up' ? (
                  <TbThumbUpFilled className="size-12 text-neon" aria-hidden />
                ) : (
                  <TbThumbUp
                    className={StyleHelper.mergeStyles('size-12', {
                      'text-gray-400': actionData.rating === 'down',
                      'text-neon': actionData.rating !== 'down',
                    })}
                    aria-hidden
                  />
                )
              }
              onPress={handlePressThumbsUp}
            />
            <TwButton
              aria-label={t('dislikeButtonLabel')}
              variant="text"
              leftElement={
                actionData.rating === 'down' ? (
                  <TbThumbDownFilled className="size-12 text-pink" aria-hidden />
                ) : (
                  <TbThumbDown
                    className={StyleHelper.mergeStyles('size-12', {
                      'text-gray-400': actionData.rating === 'up',
                      'text-neon': actionData.rating !== 'up',
                    })}
                    aria-hidden
                  />
                )
              }
              onPress={() => setData({ rating: 'down' })}
            />
          </View>

          {actionData.rating === 'down' ? (
            <Fragment>
              <TwInput
                label={t('detailsInputLabel')}
                placeholder={t('detailsInputPlaceholder')}
                multiline
                textAlignVertical="top"
                value={actionData.description}
                onChangeText={setDataWrapper('description')}
                inputContainerProps={{
                  className: 'bg-gray-900 py-2 w-full',
                }}
                className="min-h-72 align-top"
              />

              <TwButton
                leftElement={<TbCheckbox aria-hidden />}
                label={t('submitButtonLabel')}
                className="mb-4 mt-auto"
                variant="contained-light"
                onPress={handleAct(handleSubmitFeedback)}
                disabled={isSubmitFeedbackDisabled}
                isLoading={actionState.isActing}
              />
            </Fragment>
          ) : (
            <TwButton
              label={t('notNowButtonLabel')}
              variant="text"
              className="mb-6"
              colorSchema="gray"
              onPress={() => navigation.goBack()}
            />
          )}
        </Fragment>
      )}
    </TwModalLayout>
  )
}
