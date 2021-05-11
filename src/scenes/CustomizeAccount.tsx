import {RouteProp} from '@react-navigation/native'
import React, {useState, useEffect} from 'react'
import {View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {AwaitActivity} from '~/node_modules/@simpli/react-native-await'
import {ImageSourcePropType} from '~/node_modules/@types/react-native'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ColorSelector from '~src/components/ColorSelector'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import HeaderBar from '~src/components/layout/HeaderBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {Currency} from '~src/enums/Currency'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState, RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface CustomizeAccountParams {
  address: string
  source: keyof MoreStackParamList
  legacy?: boolean
  wif?: string
}

interface Props {
  navigation: StackNavigationProp<MoreStackParamList & RootStackParamList>
  route: RouteProp<MoreStackParamList, 'CustomizeAccount'>
}

interface ContentParams {
  title: string
  icon?: ImageSourcePropType
  subtitle: string
}

type ContentCollection = {
  [key in keyof Partial<MoreStackParamList>]: ContentParams
}

export const getRandomColor = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const CustomizeAccount = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()
  const dispatchAsyncAccount = useDispatch<AsyncDispatch<Account>>()

  const [name, setName] = useState<string>('')
  const [color, setColor] = useState<string>(
    theme.colors.card[getRandomColor(6)]
  )
  const {isConnected} = useSelector((state: RootState) => state.network)
  const [showInvalid, setShowInvalid] = useState<boolean>(false)
  const [saving, setSaving] = useState(false)

  const [account, setAccount] = useState(new Account())

  useEffect(() => {
    account.address = props.route.params.address
    account.accountType = props.route.params.legacy ? 'legacy' : 'watch'
    account.name = name
    account.backgroundColor = color
  }, [account])

  useEffect(() => {
    Facade.await.run('customizeAccount', populateTokenAssets)
  }, [isConnected])

  const populateTokenAssets = async () => {
    if (!isConnected) {
      setSaving(false)
      setAccount(account)
    } else {
      await account.populateTokenAssets()
      setAccount(account)
    }
  }

  const handleColor = (hex: string) => {
    account.backgroundColor = hex
    setAccount(account)
    setColor(hex)
  }

  const contentMap: ContentCollection = {
    ImportKey: {
      title: Facade.route.ImportKey.translate(),
      subtitle: Facade.t('screens.customizeAccount.subtitle.importKey'),
    },
    ImportReadAccount: {
      title: Facade.route.ImportReadAccount.translate(),
      subtitle: Facade.t('screens.customizeAccount.subtitle.importReadAccount'),
    },
  }

  const submit = async () => {
    if (!isValid()) return

    // Creates a wallet
    const walletId = await createWallet()

    // Adds the account to the wallet
    const importedAccount = await createAccount(walletId)

    dispatch(RootStore.wallet.actions.selectWallet(walletId))
    dispatch(RootStore.account.actions.selectAccount(importedAccount.address))
    props.navigation.replace(Facade.route.Tab.name, {
      welcomeHidden: true,
      changelogHidden: true,
      screen: Facade.route.ListWallets.name,
      params: {
        screen: Facade.route.GetAccount.name,
        initial: false,
        params: {
          account: importedAccount,
        },
      },
    })
  }

  const createWallet = async () => {
    dispatch(RootStore.wallet.actions.clearState())
    dispatch(RootStore.wallet.actions.setName(name))

    // Creates a legacy or watch wallet, depending if address
    // was obtained from a private key (WIF)
    dispatch(
      RootStore.wallet.actions.setType(
        props.route.params.legacy ? 'legacy' : 'watch'
      )
    )

    const walletId = await dispatchAsyncString(
      RootStore.wallet.actions.createAndSave()
    )
    await dispatchAsync(RootStore.app.actions.syncWallets())

    dispatch(RootStore.wallet.actions.clearState())

    return walletId
  }

  const createAccount = async (walletId: string) => {
    const wif = props.route.params.wif
    const address = account.address

    if (!address) throw new Error('Address not defined')

    dispatch(RootStore.account.actions.clearState())

    dispatch(RootStore.account.actions.setIdWallet(walletId))
    dispatch(RootStore.account.actions.setName(name))
    dispatch(RootStore.account.actions.setBackgroundColor(color))
    const importedAccount = await dispatchAsyncAccount(
      RootStore.account.actions.importAndSave(address, wif)
    )
    await dispatchAsync(RootStore.app.actions.syncAccounts())
    isConnected &&
      (await dispatchAsync(
        RootStore.app.actions.syncTokenAssetsByAddress(address)
      ))

    dispatch(RootStore.account.actions.clearState())

    return importedAccount
  }

  const isValid = () => {
    const conditions: boolean[] = [!!account.address, !!name]

    return conditions.every((it) => it)
  }

  const save = () => {
    if (!isValid()) {
      setShowInvalid(true)
      return
    }

    Facade.await.run('customizeAccount', submit, 300)
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
        actionOnPress: () => !saving && save(),
      }),
  })

  return (
    <ScreenLayout padding={16}>
      <AwaitActivity
        name={'customizeAccount'}
        loadingView={<ScreenLoader transparent={true} />}
        onLoadingStart={() => setSaving(true)}
        onLoadingEnd={() => setSaving(false)}
      >
        <LinearLayout width="100%" height="100%" pt={24}>
          <TextView
            mb="32px"
            color={theme.colors.text[0]}
            fontSize={18}
            textAlign="center"
          >
            {contentMap[props.route.params.source]?.subtitle ?? ''}
          </TextView>
          <InputLabel
            title={Facade.t('screens.customizeAccount.preview')}
            capitalize={true}
            marginBottom="24px"
          />

          <AccountCard
            account={account}
            isStackMode={false}
            hideQRCode={true}
          />

          <InputLabel
            title={Facade.t('screens.customizeAccount.accountInput.title')}
            capitalize={true}
            marginTop="48px"
            marginBottom="10px"
          />
          <View>
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
              invalidSeparatorColor={theme.colors.quinary}
              invalidMessageColor={theme.colors.quinary}
              hidePaste={true}
              hideScan={true}
              sideMargins={0}
            />
          </View>

          <InputLabel
            title={Facade.t('screens.customizeAccount.selectColor')}
            capitalize={true}
            marginTop="12px"
            marginBottom="24px"
          />

          <ColorSelector account={account} onSelect={handleColor} />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default CustomizeAccount
