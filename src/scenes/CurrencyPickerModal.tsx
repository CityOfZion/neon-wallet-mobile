import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { settingsReducerActions } from '../store/settings/SettingsReducer'

import SelectorList, { SelectorItem } from '~src/components/SelectorList'
import SwiperPanel, { useSwiperController, CloseButton } from '~src/components/SwiperPanel'
import { Currency } from '~src/enums/Currency'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootState } from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const CurrencyPickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const { currency } = useSelector((state: RootState) => state.settings)

  const changeCurrency = async (val: Currency) => {
    dispatch(settingsReducerActions.setCurrency(val))
  }

  const isSelected = (c: Currency) => c === currency

  const currencies: SelectorItem<Currency>[] = [
    {
      data: Currency.USD,
      onClick: changeCurrency,
      isSelected,
    },
    {
      data: Currency.BRL,
      onClick: changeCurrency,
      isSelected,
    },
    {
      data: Currency.EUR,
      onClick: changeCurrency,
      isSelected,
    },
  ]

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.currency.title')}
      onClose={props.navigation.goBack}
      rightButton={<CloseButton onPress={controller.close} />}
      withoutScrollView
    >
      <SelectorList items={currencies} />
    </SwiperPanel>
  )
}

export default CurrencyPickerModal
