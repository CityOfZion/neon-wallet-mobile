import {wallet} from '@cityofzion/neon-core'
import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState} from 'react'
import {
  Alert,
  View,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import ThemedButton from '../themed/ThemedButton'

import {TabStackParamList} from '~/src/navigation/TabNavigation'
import {Facade} from '~src/app/Facade'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {Contact} from '~src/models/redux/Contact'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {
  LinearLayout,
  TextView,
  ButtonView,
  ImageView,
} from '~src/styles/styled-components'

export interface PersistContactParams {
  contact?: Contact
}

interface PersistContactProps {
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
  route: RouteProp<ModalStackParamList, 'PersistContact'>
}

export const PersistContact = (props: PersistContactProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const contact = props.route.params?.contact
  var isDeleted: boolean = false

  const [name, setName] = useState(contact?.name ?? '')
  const [address, setAddress] = useState(contact?.address ?? '')
  const controller = useSwiperController(true)

  const dispatch = useDispatch<SyncDispatch>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const submit = async () => {
    if (name.length === 0 || name.length > 20) {
      Alert.alert(Facade.t('persistContact.invalidName'))
      return
    }

    if (!wallet.isAddress(address)) {
      Alert.alert(Facade.t('persistContact.invalidAddress'))
      return
    }

    dispatch(RootStore.contact.actions.clearState())

    dispatch(RootStore.contact.actions.setName(name))
    dispatch(RootStore.contact.actions.setAddress(address))

    if (contact?.id) {
      await dispatchAsync(RootStore.contact.actions.update(contact.id))
    } else {
      await dispatchAsync(RootStore.contact.actions.createAndSave())
    }

    dispatch(RootStore.contact.actions.clearState())

    await dispatchAsync(RootStore.app.actions.syncContacts())
    controller.close()
  }

  const deleteAction = async () => {
    dispatch(RootStore.contact.actions.clearState())

    if (contact?.id) {
      await dispatchAsync(RootStore.contact.actions.delete(contact.id))
    }
    dispatch(RootStore.contact.actions.clearState())

    await dispatchAsync(RootStore.app.actions.syncContacts())

    isDeleted = true
    handleNavigation()
  }

  const save = () => {
    Facade.await.run('swiperRight', submit, 300)
  }

  const _headerTitle = () => {
    if (contact) {
      return Facade.t('modals.editAccount.title')
    } else {
      return Facade.t('persistContact.title.create')
    }
  }

  const _headerIcon = () => {
    if (contact) {
      return require('~/src/assets/images/icon-pencil-white.png')
    } else {
      return require('~src/assets/images/icon-add-circle-outline-white.png')
    }
  }

  const handleNavigation = () => {
    if (isDeleted) {
      props.navigation.navigate(Facade.route.Contacts.name, {
        screen: Facade.route.Contacts.name,
        initial: true,
      })
    } else {
      props.navigation.goBack()
    }
  }

  const alertDelete = () => {
    Alert.alert(
      '',
      Facade.t('persistContact.deleteContactAlert'),
      [
        {
          text: Facade.t('persistContact.cancel'),
          style: 'cancel',
        },
        {
          text: Facade.t('persistContact.delete'),
          onPress: deleteAction,
        },
      ],
      {cancelable: true}
    )
  }

  return (
    <SwiperPanel
      padding={20}
      fullSize={true}
      title={_headerTitle()}
      image={_headerIcon()}
      rightButton={Facade.t('persistContact.save')}
      leftButton={Facade.t('persistContact.cancel')}
      imageSize={[22, 22]}
      onClose={handleNavigation}
      onLeftPress={controller.close}
      onRightPress={save}
      controller={controller}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <LinearLayout
          height="100%"
          orientation="verti"
          justifyContent="space-between"
        >
          <LinearLayout>
            <InputLabel
              title={Facade.t('persistContact.name')}
              marginBottom={'8px'}
            />

            <InputWithValidation
              placeholder={Facade.t('persistContact.namePlaceholder')}
              onChangeText={(val) => setName(val)}
              color={'background.4'}
              value={name}
              validator={(val) =>
                (val.length >= 2 && val.length <= 20) || val?.length === 0
              }
              separatorColor={'background.3'}
              invalidColor={'background.3'}
              invalidMessageColor={'quinary'}
              sideMargins={0}
              hideScan={true}
              hidePaste={true}
            />

            <InputLabel
              title={Facade.t('persistContact.address')}
              marginBottom={'8px'}
              marginTop={'12px'}
            />

            <InputWithValidation
              placeholder={Facade.t('persistContact.addressPlaceholder')}
              onChangeText={(val) => setAddress(val)}
              color={'background.4'}
              value={address}
              invalidColor={'background.3'}
              invalidSeparatorColor={'background.3'}
              validator={() => {
                return wallet.isAddress(address) || address?.length === 0
              }}
              separatorColor={'background.3'}
              invalidMessageColor={'quinary'}
              sideMargins={0}
              onScan={(scannedContent) => {
                const scannedAddress = scannedContent as string
                setAddress(scannedAddress)
              }}
            />
          </LinearLayout>
          {contact && (
            <LinearLayout>
              <LinearLayout height="1px" bg={theme.colors.background[10]} />
              <InputLabel
                title={Facade.t('persistContact.deleteContact')}
                marginBottom={'8px'}
                marginTop={'30px'}
              />
              <TextView color={theme.colors.text[0]} marginBottom={'30px'}>
                {Facade.t('persistContact.deleteContactSubtitle')}
              </TextView>
              <TouchableWithoutFeedback onPress={alertDelete}>
                <LinearLayout
                  width="100%"
                  borderRadius="4px"
                  borderWidth="1px"
                  borderColor="primary"
                  justifyContent="center"
                  alignItems="center"
                  orientation="horiz"
                  p="10px"
                >
                  <ImageView
                    resizeMode="center"
                    imageSize={[20, 20]}
                    source={require('~/src/assets/images/icon-trash-can-primary.png')}
                  />

                  <TextView
                    style={{includeFontPadding: false}}
                    ml={3}
                    color={'primary'}
                    fontSize={20}
                  >
                    {Facade.t('persistContact.deleteButtom')}
                  </TextView>
                </LinearLayout>
              </TouchableWithoutFeedback>
            </LinearLayout>
          )}
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

// Style for "Rectangle"
const styles = StyleSheet.create({
  rectangle: {
    width: 350,
    height: 53,
    borderRadius: 4,
    borderColor: '#4cffb3',
    borderStyle: 'solid',
    borderWidth: 1,
  },
})

export default PersistContact
