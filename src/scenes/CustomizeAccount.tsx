import {RouteProp} from '@react-navigation/native'
import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {ImageSourcePropType} from '~/node_modules/@types/react-native'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ColorSelector from '~src/components/ColorSelector'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBar from '~src/components/layout/HeaderBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {Currency} from '~src/enums/Currency'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState, RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList & RootStackParamList>
  route: RouteProp<MoreStackParamList, 'CustomizeAccount'>
}

interface ContentParams {
  title: string
  icon: ImageSourcePropType
  subtitle: string
}

type ContentCollection = {
  [key in keyof Partial<MoreStackParamList>]: ContentParams
}

const CustomizeAccount = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const dispatch = useDispatch()

  const account = props.route.params.account ?? new Account()
  const [name, setName] = useState<string>('')
  const [color, setColor] = useState<string>(theme.colors.card[0])
  const [showInvalid, setShowInvalid] = useState<boolean>(false)

  account.name = name
  account.backgroundColor = color

  const contentMap: ContentCollection = {
    ImportKey: {
      title: Facade.route.ImportKey.translate(),
      icon: require('~src/assets/images/icon-import-white.png'),
      subtitle: Facade.t('screens.customizeAccount.subtitle.importKey'),
    },
    ImportReadAccount: {
      title: Facade.route.ImportReadAccount.translate(),
      icon: require('~src/assets/images/icon-import-white.png'),
      subtitle: Facade.t('screens.customizeAccount.subtitle.importReadAccount'),
    },
  }

  const submit = async () => {
    if (!isValid()) return

    dispatch(RootStore.account.actions.setName(name))
    // TODO: NW-215
    dispatch(RootStore.account.actions.setBalance(0))
    dispatch(RootStore.account.actions.setCurrency(Currency.USD))
    dispatch(RootStore.account.actions.setAddress(account.address!))
    if (color) dispatch(RootStore.account.actions.setBackgroundColor(color))

    await dispatch(RootStore.account.actions.createAndSave())
    await dispatch(RootStore.app.actions.syncAccounts())

    props.navigation.replace(Facade.route.Tab.name, undefined)
  }

  const isValid = () => {
    const conditions: boolean[] = [account.address !== null]

    return conditions.every((it) => it)
  }

  // TODO: NW-216
  props.navigation.setOptions({
    headerTitle: () =>
      HeaderBar({
        title: contentMap[props.route.params.source]?.title ?? '',
        image: contentMap[props.route.params.source]?.icon,
      }),
    headerRight: () =>
      HeaderActionButton({
        actionTitle: Facade.t('screens.customizeAccount.navigation.save'),
        actionButtonStyle: 'highlight',
        actionOnPress: submit,
      }),
  })

  return (
    <ScreenLayout padding={16}>
      <LinearLayout width="100%" height="100%" pt={24}>
        <TextView
          mb="32px"
          color={theme.colors.text[0]}
          fontSize={18}
          fontFamily="medium"
          textAlign="center"
        >
          {contentMap[props.route.params.source]?.subtitle ?? ''}
        </TextView>
        <InputLabel
          title={Facade.t('screens.customizeAccount.preview')}
          capitalize={true}
          marginBottom="24px"
        />

        <AccountCard account={account} isStackMode={false} />

        <InputLabel
          title={Facade.t('screens.customizeAccount.accountInput.title')}
          capitalize={true}
          marginTop="48px"
          marginBottom="10px"
        />
        <InputWithValidation
          value={name}
          validator={(text) => !(showInvalid && !text)}
          placeholder={Facade.t(
            'screens.customizeAccount.accountInput.placeholder'
          )}
          onChangeText={setName}
          onClearPress={() => setName('')}
          onFocus={() => setShowInvalid(false)}
          color={theme.colors.text[0]}
          invalidColor={theme.colors.background[3]}
          separatorColor={theme.colors.background[5]}
          hidePaste={true}
          hideScan={true}
          sideMargins={0}
        />

        <InputLabel
          title={Facade.t('screens.customizeAccount.selectColor')}
          capitalize={true}
          marginTop="12px"
          marginBottom="24px"
        />

        <ColorSelector onSelect={setColor} />
      </LinearLayout>
    </ScreenLayout>
  )
}

export default CustomizeAccount
