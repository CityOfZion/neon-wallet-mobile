import React, { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwSeparator } from '@/components/TwSeparator'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'

import { useContactByIdSelector } from '@/hooks/useContactSelector'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'
import { TwScreenLayoutButton } from '@/layouts/TwScreenLayout/TwScreenLayoutButtons'

import TbCopy from '@/assets/images/tb-copy.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'
import type { TContactAddress } from '@/types/store'

type TItem = TContactAddress & {
  blockchainLabel: string
}

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return (
    <TouchableOpacity className="flex-row items-center gap-3" onPress={() => ClipboardHelper.write(item.address)}>
      <TwBlockchainIcon blockchain={item.blockchain} className="size-5" />

      <View className="flex-1">
        <Text className="font-sans-regular text-sm text-gray-300">{item.blockchainLabel}</Text>
        <Text className="font-sans-regular text-base text-neon" numberOfLines={1} ellipsizeMode="middle">
          {item.address}
        </Text>
      </View>

      <TbCopy aria-hidden className="size-6 text-neon" />
    </TouchableOpacity>
  )
}

const Separator = () => <TwSeparator containerClassName="my-2" />

export const ContactScreen = ({ navigation, route }: TMoreStackScreenProps<'ContactScreen'>) => {
  const { contact } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'contactScreen' })
  const { t: commonT } = useTranslation('common')

  const { contactById } = useContactByIdSelector(contact.id)

  const handlePressEdit = () => {
    navigation.navigate('PersistContactModal', {
      contact: contactById,
    })
  }

  const addresses = contactById?.addresses.map<TItem>(item => ({
    ...item,
    blockchainLabel: commonT(`blockchainServices.${item.blockchain}.label`),
  }))

  return (
    <TwScreenLayout
      title={t('title')}
      rightElement={<TwScreenLayoutButton label={commonT('general.edit')} onPress={handlePressEdit} />}
      withoutScroll
    >
      {contactById && (
        <FlatList
          style={{ width: '100%' }}
          data={addresses}
          ListHeaderComponentStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Fragment>
              <View className="mt-12 size-32 items-center justify-center rounded-full bg-asphalt shadow-xl shadow-black">
                <Text className="font-sans-semibold text-4xl uppercase text-gray-300">
                  {contactById.name.charAt(0)}
                </Text>
              </View>

              <Text className="mb-6 mt-12 font-sans-regular text-xl text-white">{contactById.name}</Text>

              <Text className="mb-4 w-full text-center font-sans-regular text-sm uppercase text-gray-300">
                {t('walletAddressLabel')}
              </Text>
            </Fragment>
          }
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          keyExtractor={item => `${item.address}-${item.blockchain}`}
        />
      )}
    </TwScreenLayout>
  )
}
