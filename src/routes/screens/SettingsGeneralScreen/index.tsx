import React from 'react'

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TwCheckbox } from '@/components/TwCheckbox'
import { TwMenuButton } from '@/components/TwMenuButton'

import { useIsGeneralSettingsDisabledSelector } from '@/hooks/useGeneralSettingsSelector'
import { useAppDispatch } from '@/hooks/useRedux'
import { useShouldConfirmActionSelector } from '@/hooks/useSettingsSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TMoreStackScreenProps } from '@/types/stacks'

export const SettingsGeneralScreen = ({ navigation }: TMoreStackScreenProps<'SettingsGeneralScreen'>) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation('screens', { keyPrefix: 'settingsGeneral' })
  const { shouldConfirmAction } = useShouldConfirmActionSelector()
  const { isGeneralSettingsDisabled } = useIsGeneralSettingsDisabledSelector()

  const handleShouldConfirmActionChange = (isChecked: boolean) => {
    dispatch(settingsReducerActions.setShouldConfirmAction(isChecked))
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton onPress={navigation.goBack} />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        <TwMenuButton
          disabled={isGeneralSettingsDisabled}
          label={t('shouldConfirmActionPasswordCheckboxLabel')}
          subtitle={
            <View pointerEvents={isGeneralSettingsDisabled ? 'none' : 'auto'}>
              <TwCheckbox
                checked={shouldConfirmAction}
                onCheckedChange={checked => handleShouldConfirmActionChange(checked)}
                label=""
              />
            </View>
          }
          onPress={() => handleShouldConfirmActionChange(!shouldConfirmAction)}
          rightElement={undefined}
        />
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}
