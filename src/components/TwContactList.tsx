import { Fragment, useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { ListRenderItem, SectionListData, SectionListProps, ViewProps } from 'react-native'
import { Pressable, SectionList, Text, View } from 'react-native'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useContactsSelector } from '@/hooks/useContactSelector'

import { TwBlockchainIcon } from './TwBlockchainIcon'
import type { TTwInputProps } from './TwInput'
import { TwInput } from './TwInput'
import { TwSeparator } from './TwSeparator'

import type { TBlockchainServiceKey } from '@/types/blockchain'
import type { IContactState, TContactAddress } from '@/types/store'

type TAddressItem = TContactAddress & { isSelected: boolean; onPress: () => void }

type TItem = Omit<IContactState, 'addresses'> & {
  addresses: TAddressItem[]
}

type TProps = {
  selectedContact?: IContactState
  selectedContactAddress?: TContactAddress
  onPress?: (contact?: IContactState, address?: TContactAddress) => void
  containerProps?: ViewProps
  inputProps?: TTwInputProps
  blockchains?: TBlockchainServiceKey[]
} & Omit<SectionListProps<TItem>, 'sections' | 'renderItem' | 'renderSectionHeader'>

const renderItem: ListRenderItem<TItem> = ({ item }) => {
  return (
    <Fragment>
      {item.addresses.map((contactAddress, index) => (
        <Fragment key={contactAddress.address}>
          <Pressable
            onPress={contactAddress.onPress}
            className={StyleHelper.mergeStyles(
              'h-[52px] flex-row items-center justify-between gap-6 border-l-4 border-transparent pl-3.5 pr-4.5',
              {
                'border-neon bg-gray-900/50': contactAddress.isSelected,
              }
            )}
          >
            <View className="flex-shrink flex-grow flex-row items-center gap-5">
              <TwBlockchainIcon blockchain={contactAddress.blockchain} type="gray" className="mt-0.5 h-3.5 w-3.5" />

              <Text className="flex-shrink font-sans-medium text-lg text-white" numberOfLines={1}>
                {item.name}
              </Text>
            </View>

            <Text
              className="w-[30%] flex-shrink text-right font-sans-regular text-sm uppercase text-gray-300"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {contactAddress.address}
            </Text>
          </Pressable>

          {index + 1 !== item.addresses.length && <TwSeparator className="bg-gray-300/15" />}
        </Fragment>
      ))}
    </Fragment>
  )
}

const renderSectionHeader = ({ section }: { section: SectionListData<TItem> }) => {
  return <Text className="px-4.5 py-4 font-sans-bold text-lg text-blue">{section.key}</Text>
}

const renderSeparator = (props: any) => {
  if (props.leadingItem) return null

  return <TwSeparator className="bg-gray-100/50" />
}

export const TwContactList = ({
  selectedContact,
  selectedContactAddress,
  onPress,
  className,
  contentContainerClassName,
  containerProps,
  inputProps,
  blockchains,
  ...props
}: TProps) => {
  const { contacts } = useContactsSelector()
  const { t } = useTranslation('components', { keyPrefix: 'twContactList' })

  const [filter, setFilter] = useState('')

  const sections = useMemo(() => {
    const contactsByFirstLetter = new Map<string, TItem[]>()

    contacts.forEach(contact => {
      if (!contact.name) return

      const key = contact.name[0].toUpperCase()

      const addresses: TAddressItem[] = []

      contact.addresses.forEach(address => {
        if (blockchains && !blockchains.includes(address.blockchain)) return

        const isSelected =
          selectedContact?.id === contact.id &&
          selectedContactAddress?.address === address.address &&
          selectedContactAddress?.blockchain === address.blockchain

        addresses.push({
          ...address,
          isSelected,
          onPress: () => {
            if (isSelected) {
              onPress?.(undefined, undefined)
              return
            }

            onPress?.(contact, address)
          },
        })
      })

      if (addresses.length === 0) return

      const lastContacts = contactsByFirstLetter.get(key) ?? []
      contactsByFirstLetter.set(key, [
        ...lastContacts,
        {
          ...contact,
          addresses,
        },
      ])
    })

    return Array.from(contactsByFirstLetter.entries()).map(
      ([key, items]): SectionListData<TItem> => ({ data: items, key })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, selectedContact?.id, selectedContactAddress?.address, selectedContactAddress?.blockchain, blockchains])

  const filteredSections = useMemo(() => {
    if (!filter) return sections

    const filtered: SectionListData<TItem>[] = []

    sections.forEach(section => {
      const items = section.data.filter(item => {
        return (
          item.name?.toLowerCase().includes(filter.toLowerCase()) ||
          item.addresses.find(({ address }) => address.toLowerCase().includes(filter.toLowerCase()))
        )
      })

      if (items.length > 0) {
        filtered.push({ ...section, data: items })
      }
    })

    return filtered
  }, [sections, filter])

  const handleFilterChange = (value: string) => {
    setFilter(value)
    onPress?.(undefined, undefined)
  }

  return (
    <View {...containerProps} className={StyleHelper.mergeStyles('flex-shrink', containerProps?.className)}>
      <TwInput
        {...inputProps}
        className={StyleHelper.mergeStyles('placeholder:text-neon', inputProps?.className)}
        placeholder={t('searchInputPlaceholder')}
        value={filter}
        clearable
        onChangeText={handleFilterChange}
        disabled={contacts.length === 0}
      />

      <SectionList
        className={StyleHelper.mergeStyles('mt-3', className)}
        contentContainerClassName={StyleHelper.mergeStyles('pb-3', contentContainerClassName)}
        sections={filteredSections}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        SectionSeparatorComponent={renderSeparator}
        ListEmptyComponent={
          <Text className="mt-5 text-center font-sans-medium text-lg text-gray-300">{t('emptyList')}</Text>
        }
        {...props}
      />
    </View>
  )
}
