import React from 'react'

import { Image } from 'expo-image'
import { Trans, useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwButton } from '@/components/TwButton'
import { TwCheckbox } from '@/components/TwCheckbox'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LinkHelper } from '@/helpers/LinkHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useActions } from '@/hooks/useActions'
import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCheckbox from '@/assets/images/tb-checkbox.svg'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionsData = {
  dontShowAgain: boolean
}

export const Neo3VoteSupportUsModal = ({
  navigation,
  route: {
    params: { neo3Account, cozCandidate },
  },
}: TRootStackScreenProps<'Neo3VoteSupportUsModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteSupportUs' })
  const dispatch = useAppDispatch()

  const {
    actionData: { dontShowAgain },
    actionDataRef,
    setData,
  } = useActions<TActionsData>({ dontShowAgain: false })

  const handleOpenCozLink = () => {
    LinkHelper.open(ConstantsHelper.cozWebsiteUrl)
  }

  const handleClose = () => {
    if (actionDataRef.current.dontShowAgain) dispatch(settingsReducerActions.dontShowNeo3VoteSupportUsModalAgain())

    navigation.goBack()
  }

  const handleToggleDontShowAgain = (isChecked: boolean) => {
    setData({ dontShowAgain: isChecked })
  }

  const handleGoToNeo3VoteConfirmationModalForCoz = async () => {
    handleClose()

    await UtilsHelper.sleep(500)

    navigation.navigate('Neo3VoteConfirmationModal', { neo3Account, candidate: cozCandidate })
  }

  return (
    <TwModalLayout
      title={t('title')}
      contentContainerClassName="gap-y-4 pt-2"
      rightElement={<TwModalLayoutCloseIconButton onPress={handleClose} />}
      onRequestClose={handleClose}
    >
      <Image
        className="mx-auto mb-2 h-12 w-full"
        contentFit="contain"
        source={require('@/assets/images/logo-coz.png')}
        alt={t('cozLogoAlt')}
      />

      <Text className="font-sans-regular text-lg text-white">{t('hiLabel')}</Text>

      <Text className="font-sans-bold text-lg text-white">{t('aboutNeonWalletDescription')}</Text>

      <Text className="font-sans-regular text-lg text-white">{t('importantThingsLabel')}</Text>

      <Text className="font-sans-regular text-lg text-white">{t('youCanSupportUsLabel')}</Text>

      <Text className="font-sans-regular text-lg text-white">
        <Trans t={t} i18nKey="scanOurWebsite">
          start
          <Text className="font-sans-regular text-lg text-neon" onPress={handleOpenCozLink}>
            end
          </Text>
        </Trans>
      </Text>

      <Text className="font-sans-regular text-lg text-white">{t('thankYouLabel')}</Text>

      <Text className="font-sans-regular text-lg text-white">{t('cozTeamLabel')}</Text>

      <View className="mb-4 mt-2 flex flex-grow flex-col justify-end gap-y-6">
        <TwButton
          variant="contained-light"
          label={t('voteForCozButtonLabel')}
          leftElement={<TbCheckbox aria-hidden />}
          onPress={handleGoToNeo3VoteConfirmationModalForCoz}
        />

        <TwButton
          label={t('skipButtonLabel')}
          variant="card"
          labelProps={{ className: 'text-gray-200' }}
          onPress={handleClose}
        />

        <TwCheckbox
          label={t('dontShowAgainLabel')}
          checked={dontShowAgain}
          className="mt-2 flex-row-reverse justify-center"
          labelClassName="text-lg"
          onCheckedChange={handleToggleDontShowAgain}
        />
      </View>
    </TwModalLayout>
  )
}
