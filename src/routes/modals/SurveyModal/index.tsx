import { useState } from 'react'

import * as Linking from 'expo-linking'
import { storeUrl } from 'expo-store-review'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { CrispHelper } from '@/helpers/CrispHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useAppDispatch } from '@/hooks/useRedux'

import { ModalLayout } from '@/layouts/ModalLayout'

import PiSealCheck from '@/assets/images/pi-seal-check.svg'

import { SurveyModalThumbs } from './SurveyModalThumbs'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

type TRating = 'up' | 'down'

export const SurveyModal = ({ navigation }: TRootStackScreenProps<'SurveyModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'survey' })
  const dispatch = useAppDispatch()

  const [rating, setRating] = useState<TRating>()

  const handlePressThumbsUp = async () => {
    const expoStoreUrl = storeUrl()

    const canOpen = expoStoreUrl ? await Linking.canOpenURL(expoStoreUrl) : false

    if (!canOpen) {
      ToastHelper.error({ message: t('error.storeReviewNotAvailable') })
      return
    }

    dispatch(settingsReducerActions.setSurveyInfo('submitted-positive'))

    await Linking.openURL(expoStoreUrl!)

    setRating('up')
  }

  const handlePressThumbsDown = () => {
    dispatch(settingsReducerActions.setSurveyInfo('submitted-negative'))

    setRating('down')

    CrispHelper.startNegativeFeedbackChat(t('liveChatGreeting'))
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title className="text-xl">
          {rating === 'down' ? t('titleFeedbackSubmitted') : t('title')}
        </ModalLayout.Title>

        <ModalLayout.CloseButton />
      </ModalLayout.Header>

      {rating ? (
        <ModalLayout.ScrollContent contentContainerClassName="items-center mb-4">
          <PiSealCheck className="mb-6 size-32 text-blue" aria-hidden />

          <Text className="text-center font-sans-regular text-1xl text-white">{t('descriptionFeedbackSubmitted')}</Text>
        </ModalLayout.ScrollContent>
      ) : (
        <ModalLayout.ScrollContent>
          <SurveyModalThumbs
            rating={rating}
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
      )}
    </ModalLayout.Root>
  )
}
