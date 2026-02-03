import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList } from 'react-native'

import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { LanguageHelper } from '@/helpers/LanguageHelper'

import { useAppDispatch } from '@/hooks/useRedux'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbCheck from '@/assets/images/tb-check.svg'

import { settingsReducerActions } from '@/store/reducers/settings'

type TItem = {
  isSelected: boolean
  title: string
  onPress(): void
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return (
    <TwMenuButton
      label={item.title}
      labelProps={{ className: 'capitalize' }}
      rightElement={item.isSelected ? <TbCheck aria-hidden className="size-6 text-neon" /> : undefined}
      onPress={item.onPress}
    />
  )
}

export const LanguageSelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'languageSelectionModal' })
  const dispatch = useAppDispatch()
  const { language } = useLanguageSelector()

  const data = LanguageHelper.availableLanguages.map<TItem>(item => ({
    title: item.label,
    onPress: () => {
      dispatch(settingsReducerActions.setLanguage(item))
    },
    isSelected: item.label === language.label,
  }))

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />}>
      <FlatList data={data} scrollEnabled={false} ItemSeparatorComponent={TwSeparator} renderItem={renderItem} />
    </TwModalLayout>
  )
}
