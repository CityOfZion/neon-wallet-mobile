import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import React, {useState} from 'react'
import {Modal} from 'react-native'
import {useDispatch} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {setLocale, setCurrency} from '~src/store/actions/app'
import {LinearLayout} from '~src/styles/styled-components'

interface SettingsProps {
  navigation: StackNavigationProp<{Home: undefined}>
  theme: DefaultTheme
  navigationOptions: object
}

const SettingsPage = (props: SettingsProps) => {
  const dispatch = useDispatch()
  const [isShowingIdiom, setIsShowingIdiom] = useState(false)
  const [isShowingCurrency, setIsShowingCurrency] = useState(false)
  const [selectedIdiom, setSelectedIdiom] = useState(Lang.EN_US)
  const [selectedCurrency, setSelectedCurrency] = useState(Currency.USD)
  const idioms = [
    {
      title: 'languages.enUS',
      isSelected: selectedIdiom === Lang.EN_US,
      onItemSelected: () => {
        changeLocale(Lang.EN_US)
        setSelectedIdiom(Lang.EN_US)
      },
    },
    {
      title: 'languages.ptBR',
      isSelected: selectedIdiom === Lang.PT_BR,
      onItemSelected: () => {
        changeLocale(Lang.PT_BR)
        setSelectedIdiom(Lang.PT_BR)
      },
    },
    {
      title: 'languages.de',
      isSelected: selectedIdiom === Lang.DE,
      onItemSelected: () => {
        changeLocale(Lang.DE)
        setSelectedIdiom(Lang.DE)
      },
    },
  ]

  const currencies = [
    {
      title: 'currency.USD',
      isSelected: selectedCurrency === Currency.USD,
      onItemSelected: () => {
        changeCurrency(Currency.USD)
        setSelectedCurrency(Currency.USD)
      },
    },
    {
      title: 'currency.BRL',
      isSelected: selectedCurrency === Currency.BRL,
      onItemSelected: () => {
        changeCurrency(Currency.BRL)
        setSelectedCurrency(Currency.BRL)
      },
    },
    {
      title: 'currency.EUR',
      isSelected: selectedCurrency === Currency.EUR,
      onItemSelected: () => {
        changeCurrency(Currency.EUR)
        setSelectedCurrency(Currency.EUR)
      },
    },
  ]

  const changeLocale = (locale: string) => {
    dispatch(setLocale(locale))
  }

  const changeCurrency = (currency: string) => {
    dispatch(setCurrency(currency))
  }

  const _modalIdiom = () => (
    <Modal animationType="slide" transparent={true} visible={isShowingIdiom}>
      <ScreenLayout useHeaderPadding={false}>
        <LinearLayout alignItems={'flex-end'}>
          <ThemedCloseButton onPress={() => setIsShowingIdiom(false)} />
        </LinearLayout>

        {idioms.map((idiom) => (
          <MenuItem
            title={Facade.t(idiom.title)}
            key={idiom.title}
            arrowDirection={
              idiom.isSelected ? RightIconType.CHECK : RightIconType.NONE
            }
            onPress={idiom.onItemSelected}
          />
        ))}
      </ScreenLayout>
    </Modal>
  )

  const _modalCurrency = () => (
    <Modal animationType="slide" transparent={true} visible={isShowingCurrency}>
      <ScreenLayout useHeaderPadding={false}>
        <LinearLayout alignItems={'flex-end'}>
          <ThemedCloseButton onPress={() => setIsShowingCurrency(false)} />
        </LinearLayout>

        {currencies.map((currency) => {
          return (
            <MenuItem
              title={Facade.t(currency.title)}
              key={currency.title}
              arrowDirection={
                currency.isSelected ? RightIconType.CHECK : RightIconType.NONE
              }
              onPress={currency.onItemSelected}
            />
          )
        })}
      </ScreenLayout>
    </Modal>
  )

  return (
    <ScreenLayout padding={20}>
      {_modalIdiom()}
      {_modalCurrency()}

      <MenuItem
        title={Facade.t('settings.myWallets')}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={12}
        iconHeight={28}
        arrowDirection={RightIconType.ARROW_RIGHT}
      />

      <MenuItem
        title={Facade.t('settings.security')}
        icon={require('~/src/assets/images/security-icon-green.png')}
        iconWidth={20}
        iconMarginLeft={2}
        iconMarginRight={18}
        arrowDirection={RightIconType.ARROW_RIGHT}
      />

      <MenuItem
        title={Facade.t('settings.currency')}
        icon={require('~/src/assets/images/currency-icon-green.png')}
        iconWidth={26}
        iconMarginRight={16}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={'USD'}
        onPress={() => setIsShowingCurrency(true)}
      />

      <MenuItem
        title={Facade.t('settings.language')}
        icon={require('~/src/assets/images/language-icon-green.png')}
        iconWidth={16}
        iconMarginLeft={2}
        iconMarginRight={22}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={Facade.t('languages.enUS')}
        onPress={() => setIsShowingIdiom(true)}
      />
    </ScreenLayout>
  )
}

export default SettingsPage
