import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, {useEffect, useState, useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Await, AwaitActivity} from '~/node_modules/@simpli/react-native-await'
import {wrapper} from '~src/app/ApplicationWrapper'
import {BlockchainServiceKey, blockchainServices} from '~src/blockchain'
import AccountCard from '~src/components/AccountCard'
import ColorSelector from '~src/components/ColorSelector'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {LinearLayout, TextView} from '~src/styles/styled-components'
interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
}

export default function CreateAccountModal(props: Props) {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const controller = useSwiperController(true)
  const [showInvalid, setShowInvalid] = useState<boolean>(false)
  const dispatch = useDispatch()
  const [name, setName] = useState<string>('')
  const [blockchain, setBlockchain] = useState<BlockchainServiceKey>(
    'neoLegacy'
  )
  const getRandomColor = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  const [color, setColor] = useState<string>(
    theme.colors.card[getRandomColor(6)]
  )

  const submit = async () => {
    dispatch(RootStore.account.actions.setName(name))
    dispatch(RootStore.account.actions.setBlockchain(blockchain))
    dispatch(
      RootStore.account.actions.setSrcIcon(blockchainServices[blockchain].icon)
    )
    if (color) dispatch(RootStore.account.actions.setBackgroundColor(color))

    await dispatch(RootStore.account.actions.createAndSave())
    await dispatch(RootStore.app.actions.syncAccounts())
    await dispatch(RootStore.app.actions.syncWallets())
    controller.close()
  }

  const isValid = () => {
    const conditions: boolean[] = [!!name]

    return conditions.every((it) => it)
  }

  const save = () => {
    if (!isValid()) {
      setShowInvalid(true)
      return
    }

    Await.run('swiperRight', submit, 300)
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={36}
      paddingBottom={36}
      title={i18n.t('modals.createAccount.title')}
      leftButton={i18n.t('modals.createAccount.navigation.cancel')}
      rightButton={i18n.t('modals.createAccount.navigation.save')}
      disableRightButton={!name}
      onLeftPress={controller.close}
      onRightPress={save}
      onClose={props.navigation.goBack}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <AccountModalChildren
          color={color}
          setColor={setColor}
          name={name}
          setName={setName}
          showInvalid={showInvalid}
          setShowInvalid={setShowInvalid}
        />
      </AwaitActivity>
    </SwiperPanel>
  )
}

interface IAccountModalChildren {
  showInvalid: boolean
  setShowInvalid: (showInvalid: boolean) => void
  name: string
  setName: (name: string) => void
  color: string
  setColor: (color: string) => void
}

const AccountModalChildren: React.FC<IAccountModalChildren> = ({
  showInvalid,
  setShowInvalid,
  color,
  setColor,
  name,
  setName,
}) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const {idWallet} = useSelector((state: RootState) => state.account)
  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const [account, setAccount] = useState(new Account())

  const [address, setAddress] = useState<string>()

  const generateAccount = async (
    wallet: Wallet,
    index: number,
    blockchain: BlockchainServiceKey
  ) => {
    const mnemonic = await wallet.getMnemonic()
    if (!mnemonic) return null
    return blockchainServices[blockchain].generateAccount(mnemonic, index)
  }

  useEffect(() => {
    populateAddress()
  }, [])

  useEffect(() => {
    const account = new Account()
    account.name = name
    account.backgroundColor = color
    account.address = address ?? null
    setAccount(account)
  }, [name, color, address])

  const populateAddress = useCallback(async () => {
    account.idWallet = idWallet
    const indexes = account
      .getAccountsWithSameWallet(accountsPool)
      .map((it) => it.index ?? 0)

    const wallet = new Wallet()
    wallet.id = idWallet
    const index = indexes.length ? Math.max(...indexes) + 1 : 0
    const newAccount = await generateAccount(wallet, index, account.blockchain)
    const address = newAccount?.address

    setAddress(address)
  }, [address])

  return (
    <LinearLayout width="100%" height="100%">
      <TextView
        mb="32px"
        color={theme.colors.text[0]}
        fontSize={18}
        fontFamily="medium"
        textAlign="center"
      >
        {i18n.t('modals.createAccount.subtitle')}
      </TextView>
      <InputLabel
        title={i18n.t('modals.createAccount.preview')}
        capitalize={true}
        marginBottom="24px"
      />

      <AccountCard account={account} isStackMode={false} />

      <InputLabel
        title={i18n.t('modals.createAccount.accountInput.title')}
        capitalize={true}
        marginTop="48px"
        marginBottom="10px"
      />
      <InputWithValidation
        value={name}
        validator={(text) => !(showInvalid && !text)}
        placeholder={i18n.t('modals.createAccount.accountInput.title')}
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

      <InputLabel
        title={i18n.t('modals.createAccount.selectColor')}
        capitalize={true}
        marginTop="12px"
        marginBottom="24px"
      />
      <ColorSelector account={account} onSelect={setColor} />
    </LinearLayout>
  )
}

AccountModalChildren.propTypes = {
  showInvalid: PropTypes.bool.isRequired,
  setShowInvalid: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
}
