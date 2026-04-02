import * as dateFns from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Calendar } from '@/components/Calendar'
import { SelectAccordion } from '@/components/SelectAccordion'
import { TwButton } from '@/components/TwButton'

import { DateHelper } from '@/helpers/DateHelper'
import { ExportTransactionsHelper } from '@/helpers/ExportTransactionsHelper'

import { useActions } from '@/hooks/useActions'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutCloseIconButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import MdCircleMedium from '@/assets/images/md-circle-medium.svg'
import TbX from '@/assets/images/tb-x.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  dateFrom: Date
  dateTo: Date
  dateFromSelectAccordionIsOpen: boolean
  dateToSelectAccordionIsOpen: boolean
}

export const DateSelectionModal = ({ route, navigation }: TRootStackScreenProps<'DateSelectionModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dateSelectionModal' })
  const { t: commonT } = useTranslation('common')
  const { language } = useLanguageSelector()

  const today = new Date()
  const maxMonths = route.params.maxMonths || 12

  const { actionDataRef, actionData, setData, setDataWrapper, reset } = useActions<TActionData>({
    dateFrom: route.params.dateFrom || dateFns.sub(today, { weeks: 1 }),
    dateTo: route.params.dateTo || today,
    dateFromSelectAccordionIsOpen: true,
    dateToSelectAccordionIsOpen: false,
  })

  const handleDateFromChange = (dateFrom: Date) => {
    setData({
      ...ExportTransactionsHelper.calculateDateFromSelectionMaxOneYear({
        dateFrom,
        dateTo: actionDataRef.current.dateTo,
      }),
      dateFromSelectAccordionIsOpen: false,
      dateToSelectAccordionIsOpen: true,
    })
  }

  const handleDateToChange = (dateTo: Date) => {
    setData({
      ...ExportTransactionsHelper.calculateDateToSelectionMaxOneYear({
        dateFrom: actionDataRef.current.dateFrom,
        dateTo,
      }),
      dateToSelectAccordionIsOpen: false,
    })
  }

  const handleSave = () => {
    route.params.onSelect?.(actionData.dateFrom, actionData.dateTo)
    navigation.goBack()
  }

  return (
    <TwModalLayout title={route.params.title || t('title')} rightElement={<TwModalLayoutCloseIconButton />}>
      <Text className="text-center font-sans-regular text-lg text-white">
        {route.params.description || t('description')}
      </Text>

      <Text className="text-center font-sans-italic text-lg text-gray-100">
        {t('maxMonthLabel', { months: maxMonths })}
      </Text>

      <SelectAccordion.Root
        className="mt-6"
        value={DateHelper.formatLocalized(actionData.dateFrom, { format: 'PPP', language })}
        open={actionData.dateFromSelectAccordionIsOpen}
        onOpenChange={setDataWrapper('dateFromSelectAccordionIsOpen')}
      >
        <SelectAccordion.Trigger
          label={t('startDateAccordionLabel')}
          leftElement={<MdCircleMedium aria-hidden className="size-6 text-blue" />}
        />
        <SelectAccordion.Content>
          <Calendar
            mode="single"
            date={actionData.dateFrom}
            onChange={handleDateFromChange}
            disabledDates={date => dateFns.isAfter(date as Date, today)}
          />
        </SelectAccordion.Content>
      </SelectAccordion.Root>

      <SelectAccordion.Root
        className="mt-8"
        value={DateHelper.formatLocalized(actionData.dateTo, { format: 'PPP', language })}
        open={actionData.dateToSelectAccordionIsOpen}
        onOpenChange={setDataWrapper('dateToSelectAccordionIsOpen')}
      >
        <SelectAccordion.Trigger
          label={t('endDateAccordionLabel')}
          leftElement={<MdCircleMedium aria-hidden className="size-6 text-blue" />}
        />

        <SelectAccordion.Content>
          <Calendar
            mode="single"
            date={actionData.dateTo}
            onChange={handleDateToChange}
            disabledDates={date => dateFns.isAfter(date as Date, today)}
          />
        </SelectAccordion.Content>
      </SelectAccordion.Root>

      <View className="mt-auto flex-row gap-5 pt-8">
        <TwButton
          variant="outline"
          colorSchema="pink"
          label={commonT('general.clear')}
          leftElement={<TbX aria-hidden />}
          onPress={reset}
        />

        <TwButton
          className="flex-1"
          variant="contained-light"
          label={commonT('general.saveAndContinue')}
          onPress={handleSave}
        />
      </View>
    </TwModalLayout>
  )
}
