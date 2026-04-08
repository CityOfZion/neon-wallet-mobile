import type { ComponentProps } from 'react'
import DateTimePicker from 'react-native-ui-datepicker'

import { StyleHelper } from '@/helpers/StyleHelper'

import { useLanguageSelector } from '@/hooks/useSettingsSelector'

import TbChevronLeft from '@/assets/images/tb-chevron-left.svg'
import TbChevronRight from '@/assets/images/tb-chevron-right.svg'

type TProps = Omit<ComponentProps<typeof DateTimePicker>, 'onChange' | 'classNames' | 'components'> & {
  onChange?: (date: Date) => void
}

export const Calendar = ({ className, onChange, ...props }: TProps) => {
  const { language } = useLanguageSelector()

  const handleChange = ({ date }: any) => {
    onChange?.(date as Date)
  }

  return (
    <DateTimePicker
      locale={language.value}
      showOutsideDays
      containerHeight={320}
      weekdaysHeight={44}
      {...props}
      className={StyleHelper.mergeStyles('w-full border-none bg-transparent', className)}
      classNames={{
        day_cell: 'my-1',
        weekdays: 'mt-2',
        button_next: 'rounded border border-gray-300/15',
        button_prev: 'rounded border border-gray-300/15',
        month_selector_label: 'font-sans-bold text-white text-lg',
        year_selector_label: 'font-sans-bold text-white text-lg',
        weekday_label: 'font-sans-regular text-gray-300 text-lg',
        outside_label: 'opacity-50',
        day: 'rounded-md',
        day_label: 'font-sans-regular text-white text-lg',
        selected: 'bg-neon',
        selected_label: 'text-asphalt font-sans-bold',
        today: 'bg-gray-300/25',
        disabled: 'opacity-30',
        disabled_label: 'text-gray-300',
        hidden: 'invisible flex-1',
        range_start_label: 'text-asphalt font-sans-bold',
        range_end_label: 'text-asphalt font-sans-bold',
        range_middle: 'bg-gray-100/10 rounded-none',
        month: 'rounded-md',
        month_label: 'text-white font-sans-regular text-lg',
        selected_month: 'bg-neon',
        selected_month_label: 'text-asphalt font-sans-bold',
        year: 'rounded-md',
        year_label: 'text-white font-sans-regular text-lg',
        selected_year: 'bg-neon',
        selected_year_label: 'text-asphalt font-sans-bold',
      }}
      components={{
        IconNext: <TbChevronRight aria-hidden className="text-gray-100" />,
        IconPrev: <TbChevronLeft aria-hidden className="text-gray-100" />,
      }}
      onChange={handleChange}
    />
  )
}
