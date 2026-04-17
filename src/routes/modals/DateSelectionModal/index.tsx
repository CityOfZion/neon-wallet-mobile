import * as dateFns from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Calendar } from '@/components/Calendar'
import { SelectAccordion } from '@/components/SelectAccordion'
import { TwButton } from '@/components/TwButton'

import { DateHelper } from '@/helpers/DateHelper'

import { useActions } from '@/hooks/useActions'
import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import { ModalLayout } from '@/layouts/ModalLayout'

import MdCircleMedium from '@/assets/images/md-circle-medium.svg'
import TbX from '@/assets/images/tb-x.svg'

import type { TRootStackScreenProps } from '@/types/stacks'

type TActionsData = {
  dateFrom: Date
  dateTo: Date
  dateFromSelectAccordionIsOpen: boolean
  dateToSelectAccordionIsOpen: boolean
}

export const DateSelectionModal = ({ route, navigation }: TRootStackScreenProps<'DateSelectionModal'>) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dateSelection' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { language } = useLanguageSelector()

  const { actionDataRef, actionData, setData, setDataWrapper, reset } = useActions<TActionsData>({
    dateFrom: route.params.dateFrom,
    dateTo: route.params.dateTo,
    dateFromSelectAccordionIsOpen: true,
    dateToSelectAccordionIsOpen: false,
  })

  const dateNow = new Date()

  const handleDateFromChange = (dateFrom: Date) => {
    setData({
      ...DateHelper.calculateDateFromSelectionMaxOneYear({
        dateFrom,
        dateTo: actionDataRef.current.dateTo,
      }),
      dateFromSelectAccordionIsOpen: false,
      dateToSelectAccordionIsOpen: true,
    })
  }

  const handleDateToChange = (dateTo: Date) => {
    setData({
      ...DateHelper.calculateDateToSelectionMaxOneYear({
        dateFrom: actionDataRef.current.dateFrom,
        dateTo,
      }),
      dateToSelectAccordionIsOpen: false,
    })
  }

  const handleSave = () => {
    route.params.onSelect(actionData.dateFrom, actionData.dateTo)

    navigation.goBack()
  }

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>{route.params.title}</ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>
      <ModalLayout.ScrollContent>
        <Text className="text-center font-sans-regular text-lg text-white">{route.params.description}</Text>

        <Text className="mt-0.5 text-center font-sans-italic text-base text-gray-100">{t('maxMonthLabel')}</Text>

        <SelectAccordion.Root
          className="mt-8"
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
              className="mt-2"
              mode="single"
              date={actionData.dateFrom}
              disabledDates={date => dateFns.isAfter(date as Date, dateNow)}
              onChange={handleDateFromChange}
            />
          </SelectAccordion.Content>
        </SelectAccordion.Root>

        <SelectAccordion.Root
          className="mt-4"
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
              className="mt-2"
              mode="single"
              date={actionData.dateTo}
              disabledDates={date => dateFns.isAfter(date as Date, dateNow)}
              onChange={handleDateToChange}
            />
          </SelectAccordion.Content>
        </SelectAccordion.Root>

        <View className="mt-auto flex-row gap-3 pt-12">
          <TwButton
            label={tCommon('reset')}
            variant="outline"
            colorSchema="pink"
            leftElement={<TbX aria-hidden />}
            onPress={reset}
          />

          <TwButton label={tCommon('continue')} variant="contained-light" className="flex-1" onPress={handleSave} />
        </View>
      </ModalLayout.ScrollContent>
    </ModalLayout.Root>
  )
}
