import { useTranslation } from 'react-i18next'
import { FlatList, type ListRenderItem } from 'react-native'

import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { CurrencyHelper } from '@/helpers/CurrencyHelper'

import { useAppDispatch } from '@/hooks/useRedux'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

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
      rightElement={item.isSelected ? <TbCheck aria-hidden className="size-6 text-neon" /> : undefined}
      onPress={item.onPress}
    />
  )
}

export const CurrencySelectionModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'currencySelection' })
  const dispatch = useAppDispatch()
  const { currency } = useCurrencySelector()

  const data = CurrencyHelper.availableCurrencies.map<TItem>(item => ({
    title: item.label,
    onPress: () => {
      dispatch(settingsReducerActions.setCurrency(item))
    },
    isSelected: item.label === currency.label,
  }))

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{t('title')}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <FlatList data={data} scrollEnabled={false} ItemSeparatorComponent={TwSeparator} renderItem={renderItem} />
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
