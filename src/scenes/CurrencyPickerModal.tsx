import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SelectorList, {SelectorItem} from '~src/components/SelectorList'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {Currency} from '~src/enums/Currency'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

const CurrencyPickerModal = (props: Props) => {
  const dispatch = useDispatch()
  const controller = useSwiperController(true)
  const {currency} = useSelector((state: RootState) => state.settings)

  const changeCurrency = async (val: Currency) => {
    dispatch(RootStore.settings.actions.setCurrency(val))
    dispatch(RootStore.settings.actions.save())
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
      title={Facade.t('modals.currency.title')}
      fullSize={true}
      padding={16}
      paddingTop={24}
      onClose={props.navigation.goBack}
      onLeftPress={controller.close}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      disableDefaultScrollView={true}
    >
      <SelectorList items={currencies} />
    </SwiperPanel>
  )
}

export default CurrencyPickerModal
