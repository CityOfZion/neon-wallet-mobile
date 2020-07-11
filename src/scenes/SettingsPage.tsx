import {StackNavigationProp} from '@react-navigation/stack'
import React, {useState} from 'react'
import {Modal} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Theme} from '~src/enums/Theme'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout} from '~src/styles/styled-components'

interface SettingsProps {
  navigation: StackNavigationProp<{Home: undefined}>
  theme: DefaultTheme
  navigationOptions: object
}

const SettingsPage = (props: SettingsProps) => {
  const {language, currency, theme} = useSelector(
    (state: RootState) => state.app
  )
  const dispatch = useDispatch()

  const [isShowingLanguage, setShowingLanguage] = useState(false)
  const [isShowingCurrency, setShowingCurrency] = useState(false)
  const [isShowingTheme, setShowingTheme] = useState(false)

  const languages = [
    {
      title: 'languages.en-US',
      isSelected: language === Lang.EN_US,
      onItemSelected: () => changeLanguage(Lang.EN_US),
    },
    {
      title: 'languages.pt-BR',
      isSelected: language === Lang.PT_BR,
      onItemSelected: () => changeLanguage(Lang.PT_BR),
    },
    {
      title: 'languages.de',
      isSelected: language === Lang.DE,
      onItemSelected: () => changeLanguage(Lang.DE),
    },
  ]

  const currencies = [
    {
      title: Currency.USD,
      isSelected: currency === Currency.USD,
      onItemSelected: () => changeCurrency(Currency.USD),
    },
    {
      title: Currency.BRL,
      isSelected: currency === Currency.BRL,
      onItemSelected: () => changeCurrency(Currency.BRL),
    },
    {
      title: Currency.EUR,
      isSelected: currency === Currency.EUR,
      onItemSelected: () => changeCurrency(Currency.EUR),
    },
  ]

  const themes = [
    {
      title: 'themes.DARK',
      isSelected: theme === Theme.DARK,
      onItemSelected: () => changeTheme(Theme.DARK),
    },
    {
      title: 'themes.LIGHT',
      isSelected: theme === Theme.LIGHT,
      onItemSelected: () => changeTheme(Theme.LIGHT),
    },
  ]

  const changeLanguage = async (val: Lang) => {
    dispatch(RootStore.app.actions.setLanguage(val))
    await Facade.await.run(
      'application',
      () => Storage.language.save(val),
      1000
    )
  }

  const changeCurrency = async (val: Currency) => {
    dispatch(RootStore.app.actions.setCurrency(val))
    await Storage.currency.save(val)
  }

  const changeTheme = async (val: Theme) => {
    dispatch(RootStore.app.actions.setTheme(val))
    await Storage.theme.save(val)
  }

  const _modalLanguage = () => (
    <Modal animationType="slide" transparent={true} visible={isShowingLanguage}>
      <ScreenLayout useHeaderPadding={false}>
        <LinearLayout alignItems={'flex-end'}>
          <ThemedCloseButton onPress={() => setShowingLanguage(false)} />
        </LinearLayout>

        {languages.map((idiom) => (
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
          <ThemedCloseButton onPress={() => setShowingCurrency(false)} />
        </LinearLayout>

        {currencies.map((currency) => {
          return (
            <MenuItem
              title={currency.title}
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

  const _modalTheme = () => (
    <Modal animationType="slide" transparent={true} visible={isShowingTheme}>
      <ScreenLayout useHeaderPadding={false}>
        <LinearLayout alignItems={'flex-end'}>
          <ThemedCloseButton onPress={() => setShowingTheme(false)} />
        </LinearLayout>

        {themes.map((theme) => {
          return (
            <MenuItem
              title={Facade.t(theme.title)}
              key={theme.title}
              arrowDirection={
                theme.isSelected ? RightIconType.CHECK : RightIconType.NONE
              }
              onPress={theme.onItemSelected}
            />
          )
        })}
      </ScreenLayout>
    </Modal>
  )

  return (
    <ScreenLayout padding={20}>
      {_modalLanguage()}
      {_modalCurrency()}
      {_modalTheme()}

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
        subtitle={currency}
        onPress={() => setShowingCurrency(true)}
      />

      <MenuItem
        title={Facade.t('settings.language')}
        icon={require('~/src/assets/images/language-icon-green.png')}
        iconWidth={16}
        iconMarginLeft={2}
        iconMarginRight={22}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={Facade.t(`languages.${language}`)}
        onPress={() => setShowingLanguage(true)}
      />

      <MenuItem
        title={Facade.t('settings.theme')}
        arrowDirection={RightIconType.ARROW_DOWN}
        subtitle={Facade.t(`themes.${theme}`)}
        onPress={() => setShowingTheme(true)}
      />
    </ScreenLayout>
  )
}

export default SettingsPage
