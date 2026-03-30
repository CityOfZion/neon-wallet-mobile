import React from 'react'

import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList, Text, View } from 'react-native'

import { TwSeparator } from '@/components/TwSeparator'

import { DateHelper } from '@/helpers/DateHelper'

import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

type TNote = {
  version: string
  date: string
  changes: string[]
}

const renderItem: ListRenderItem<TNote> = ({ item }) => {
  return (
    <View className="flex w-full flex-row justify-center gap-1.5">
      <View className="w-1/3 items-end">
        <Text className="rounded-full bg-neon px-2 py-1 font-sans-regular text-lg text-asphalt">{item.version}</Text>
      </View>

      <View className="relative top-1 flex h-fit flex-row">
        <TwSeparator variant="vert" withoutContainer className="mx-2.5" />

        <View className="absolute size-5 rounded-full bg-neon" />
      </View>

      <View className="flex-1">
        <Text className="font-sans-bold text-lg text-white">{item.date}</Text>

        <View className="mt-2 gap-1">
          {item.changes.map((change, index) => (
            <Text key={`${index}-${change}`} className="font-sans-regular text-gray-400">
              - {change}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
}

export const ChangelogModal = () => {
  const { t, i18n } = useTranslation('modals', { keyPrefix: 'changelogModal' })
  const { language } = useLanguageSelector()

  const notes = i18n.t('changelog:notes', { returnObjects: true })

  const items = notes.map(note => ({
    ...note,
    date: DateHelper.formatLocalized(note.date, { language, format: 'PP' }),
  }))

  return (
    <TwModalLayout title={t('title')} rightElement={<TwModalLayoutCloseIconButton />} withoutScroll>
      <FlatList
        data={items}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-2.5"
        ListHeaderComponent={
          <View className="mb-3">
            <Text className="font-sans-regular text-sm text-white">{t('thankYouText')}</Text>
            <Text className="text-right font-sans-bold text-sm text-white">{t('cozTeam')}</Text>
          </View>
        }
        renderItem={renderItem}
        keyExtractor={item => item.version}
      />
    </TwModalLayout>
  )
}
