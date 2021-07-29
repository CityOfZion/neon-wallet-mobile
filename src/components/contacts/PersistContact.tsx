import {wallet} from '@cityofzion/neon-core'
import {RouteProp, useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {
  Alert,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  FlatList,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useDispatch, useSelector} from 'react-redux'

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
  startingAddress: string
  addingContact?: boolean
}

interface PersistContactProps {
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
  route: RouteProp<ModalStackParamList, 'PersistContact'>
}

interface IInputGroup {
  id: number
  handleChangeAddress: (id: number, text: string) => void
  handleDeleteInput: (id: number) => void
  initialAddress?: string
}

const InputAddress: React.FC<IInputGroup> = ({
  id,
  handleChangeAddress,
  handleDeleteInput,
  initialAddress,
}) => {
  const [address, setAddress] = useState<string>(initialAddress ?? '')

  useEffect(() => {
    handleChangeAddress(id, address)
  }, [address])

  return (
    <InputWithValidation
      placeholder={Facade.t('persistContact.addressPlaceholder')}
      onChangeText={(text) => setAddress(text)}
      color={'primary'}
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
      onClearPress={() => {
        setAddress('')
        handleDeleteInput(id)
      }}
      forceClearButton={true}
    />
  )
}

export const PersistContact = (props: PersistContactProps) => {
  interface IAddresses {
    id: number
    text: string
  }

  useEffect(() => {
    if (
      props.route.params &&
      props.route.params.addingContact &&
      props.route.params.startingAddress
    ) {
      handleChangeAddress(0, props.route.params.startingAddress)
    }
  }, [])

  const handleChangeAddress = (id: number, text: string) => {
    const foundInput = addresses.find((input) => input.id === id)
    if (foundInput) {
      const indexFoundInput = addresses.indexOf(foundInput)
      setAddresses((prevState) => {
        const data = prevState
        data[indexFoundInput] = {id, text}
        return data
      })
    } else {
      setAddresses((prevState) => {
        const data = prevState
        data.push({id, text})
        return [...data]
      })
    }
  }

  const handleDeleteInput = (id: number) => {
    if (id > 0) {
      setAddresses((prevState) => {
        const data = prevState
        data.splice(id, 1)
        return [...data]
      })
    }
  }

  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const contact = props.route.params?.contact
  const startingAddress = props.route.params?.startingAddress
  var isDeleted: boolean = false

  const [name, setName] = useState(contact?.name ?? '')
  const [addresses, setAddresses] = useState<IAddresses[]>(
    contact?.addresses.map<IAddresses>((address, index) => {
      return {id: index, text: address}
    }) ?? [{id: 0, text: startingAddress}]
  )
  const controller = useSwiperController(true)

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const submit = async () => {
    if (name.length === 0 || name.length > 20) {
      Alert.alert(Facade.t('persistContact.invalidName'))
      return
    }

    const validAddress = addresses.reduce((acc, {text}) => {
      if (!wallet.isAddress(text)) {
        return false
      }
      return acc
    }, true)

    if (!validAddress) {
      Alert.alert(Facade.t('persistContact.invalidAddress'))
      return
    }

    dispatch(RootStore.contact.actions.clearState())

    dispatch(RootStore.contact.actions.setName(name))
    dispatch(
      RootStore.contact.actions.setAddress(
        addresses
          .map((address) => address.text)
          .filter(
            (address, index, addresses) => addresses.indexOf(address) === index
          )
      )
    ) //remove duplicated data

    if (contact?.id) {
      await dispatchAsync(RootStore.contact.actions.update(contact.id))
    } else {
      await dispatchAsync(RootStore.contact.actions.createAndSave())
    }

    dispatch(RootStore.contact.actions.clearState())
    dispatch(RootStore.app.actions.syncContacts())
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
      rightButton={Facade.t('persistContact.save')}
      leftButton={Facade.t('persistContact.cancel')}
      imageSize={[22, 22]}
      onClose={handleNavigation}
      onLeftPress={controller.close}
      onRightPress={save}
      controller={controller}
      solidColorBG={true}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader solidColorBG={true} />}
      >
        <ScrollView>
          <LinearLayout
            height="97.5%"
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
                color={'white'}
                value={name}
                validator={(val) => true}
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

              {addresses.map((data, index) => (
                <InputAddress
                  key={index}
                  id={index}
                  handleChangeAddress={handleChangeAddress}
                  handleDeleteInput={handleDeleteInput}
                  initialAddress={data.text}
                />
              ))}
              <TouchableOpacity
                style={styles.btnAnotherAddress}
                onPress={() => handleChangeAddress(addresses.length, '')}
              >
                <Image
                  source={require('~src/assets/images/add-contact-white.png')}
                />
                <Text style={styles.textAnother}>Add another text</Text>
              </TouchableOpacity>
            </LinearLayout>
            {contact && (
              <LinearLayout>
                <LinearLayout height="1px" bg={theme.colors.background[6]} />
                <InputLabel
                  title={Facade.t('persistContact.deleteContact')}
                  marginBottom={'8px'}
                  marginTop={'25px'}
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
        </ScrollView>
      </AwaitActivity>
    </SwiperPanel>
  )
}

const styles = StyleSheet.create({
  btnAnotherAddress: {
    borderWidth: 1,
    paddingVertical: 15,
    borderColor: '#ffffff33',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    marginTop: 30,
    flexDirection: 'row',
  },
  textAnother: {
    color: '#fff',
    fontFamily: 'medium',
    fontSize: 18,
    marginLeft: 10,
  },
})

InputAddress.propTypes = {
  handleChangeAddress: PropTypes.any,
  handleDeleteInput: PropTypes.any,
  id: PropTypes.any,
  initialAddress: PropTypes.any,
}

export default PersistContact
