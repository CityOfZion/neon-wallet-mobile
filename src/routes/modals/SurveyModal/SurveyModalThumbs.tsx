import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { StyleHelper } from '@/helpers/StyleHelper'

import TbThumbDownFilled from '@/assets/images/tb-filled-thumb-down.svg'
import TbThumbUpFilled from '@/assets/images/tb-filled-thumb-up.svg'
import TbThumbDown from '@/assets/images/tb-thumb-down.svg'
import TbThumbUp from '@/assets/images/tb-thumb-up.svg'

type TProps = {
  onPressThumbsUp: () => void
  onPressThumbsDown: () => void
  rating: 'up' | 'down' | undefined
}

export const SurveyModalThumbs = ({ onPressThumbsUp, onPressThumbsDown, rating }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'survey' })

  return (
    <Fragment>
      <Text className="mb-8 text-center font-sans-regular text-base text-white">{t('requestReview')}</Text>

      <View className="mb-8 w-full flex-row justify-center">
        <TwButton
          aria-label={t('likeButtonLabel')}
          variant="text"
          leftElement={
            rating === 'up' ? (
              <TbThumbUpFilled className="size-12 text-neon" aria-hidden />
            ) : (
              <TbThumbUp
                className={StyleHelper.mergeStyles('size-12', {
                  'text-gray-400': rating === 'down',
                  'text-neon': rating !== 'down',
                })}
                aria-hidden
              />
            )
          }
          onPress={onPressThumbsUp}
        />

        <TwButton
          aria-label={t('dislikeButtonLabel')}
          variant="text"
          leftElement={
            rating === 'down' ? (
              <TbThumbDownFilled className="size-12 text-pink" aria-hidden />
            ) : (
              <TbThumbDown
                className={StyleHelper.mergeStyles('size-12', {
                  'text-gray-400': rating === 'up',
                  'text-neon': rating !== 'up',
                })}
                aria-hidden
              />
            )
          }
          onPress={onPressThumbsDown}
        />
      </View>
    </Fragment>
  )
}
