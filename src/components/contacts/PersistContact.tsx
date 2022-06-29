import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text, Image, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { getBlockchainByAddress, validateAddressAllBlockchains } from '~/src/blockchain'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { ContactAddresses, ContactAddressesList } from '~/src/types/reducers/contact'
import { AsyncDispatch, DispatchResult } from '~/src/types/reducers/root'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { Contact } from '~src/models/redux/Contact'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootState, RootStore } from '~src/store/RootStore'
import { LinearLayout, TextView, ImageView } from '~src/styles/styled-components'
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

const InputAddress: React.FC<IInputGroup> = ({ id, handleChangeAddress, handleDeleteInput, initialAddress }) => {
  const [address, setAddress] = useState<string>(initialAddress ?? '')

  useEffect(() => {
    handleChangeAddress(id, address)
  }, [address])

  return (
    <InputWithValidation
      placeholder={i18n.t('persistContact.addressPlaceholder')}
      onChangeText={text => setAddress(text)}
      color="primary"
      value={address}
      invalidColor="background.3"
      invalidSeparatorColor="background.3"
      validator={() => {
        return validateAddressAllBlockchains(address)
      }}
      separatorColor="background.3"
      invalidMessageColor="quinary"
      sideMargins={0}
      onScan={scannedContent => {
        const scannedAddress = scannedContent as string
        setAddress(scannedAddress)
      }}
      onClearPress={() => {
        setAddress('')
        handleDeleteInput(id)
      }}
      forceClearButton
    />
  )
}

export const PersistContact = (props: PersistContactProps) => {
  interface IAddresses {
    address: string
    id: number
  }

  useEffect(() => {
    if (props.route.params.addingContact && props.route.params.startingAddress) {
      handleChangeAddress(0, props.route.params.startingAddress)
    }
  }, [])

  const handleChangeAddress = (id: number, address: string) => {
    const foundInput = addresses.find(input => input.id === id)
    if (foundInput) {
      const indexFoundInput = addresses.indexOf(foundInput)
      setAddresses(prevState => {
        const data = prevState
        data[indexFoundInput] = { id, address }
        return data
      })
    } else {
      setAddresses(prevState => {
        const data = prevState
        data.push({ id, address })
        return [...data]
      })
    }
  }

  const handleDeleteInput = (id: number) => {
    if (id > 0) {
      setAddresses(prevState => {
        const data = prevState
        data.splice(id, 1)
        return [...data]
      })
    }
  }

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const contact = props.route.params?.contact
  const startingAddress = props.route.params?.startingAddress
  let isDeleted: boolean = false

  const [name, setName] = useState(contact?.name ?? '')
  const [addresses, setAddresses] = useState<IAddresses[]>(
    contact?.addresses.map<IAddresses>(({ address }, index) => {
      return { id: index, address }
    }) ?? [{ id: 0, address: startingAddress }]
  )
  const controller = useSwiperController(true)

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const submit = async () => {
    if (name.length === 0 || name.length > 20) {
      Alert.alert(
        i18n.t('persistContact.invalidName'),
        i18n.t('persistContact.invalidNameSubtitle', {
          nameLenght: name ? name.length : 0,
        })
      )
      return
    }

    const validAddress = addresses.reduce((acc, { address }) => {
      if (!validateAddressAllBlockchains(address)) {
        return false
      }
      return acc
    }, true)

    if (!validAddress) {
      Alert.alert(i18n.t('persistContact.invalidAddress'))
      return
    }

    dispatch(RootStore.contact.actions.setName(name))

    const addressesToSave = addresses
      .map((info): ContactAddresses | null => {
        const blockchainName = getBlockchainByAddress(info.address)
        if (blockchainName) {
          return { address: info.address, blockchain: blockchainName }
        } else {
          return null
        }
      })
      .filter(info => info !== null) as ContactAddressesList

    dispatch(RootStore.contact.actions.setAddress(addressesToSave))

    if (contact?.id) {
      await dispatchAsync(RootStore.contact.actions.update(contact.id))
    } else {
      await dispatchAsync(RootStore.contact.actions.createAndSave())
    }

    dispatch(RootStore.app.actions.syncContacts())
    controller.close()
  }

  const deleteAction = async () => {
    if (contact?.id) {
      await dispatchAsync(RootStore.contact.actions.delete(contact.id))
    }

    await dispatchAsync(RootStore.app.actions.syncContacts())

    isDeleted = true
    handleNavigation()
  }

  const save = () => {
    Await.run('swiperRight', submit, 300)
  }

  const _headerTitle = () => {
    if (contact) {
      return i18n.t('modals.editAccount.title')
    } else {
      return i18n.t('persistContact.title.create')
    }
  }

  const handleNavigation = () => {
    if (isDeleted) {
      props.navigation.navigate(wrapper.route.Contacts.name, {
        screen: wrapper.route.Contacts.name,
        initial: true,
      })
    } else {
      props.navigation.goBack()
    }
  }

  const alertDelete = () => {
    Alert.alert(
      '',
      i18n.t('persistContact.deleteContactAlert'),
      [
        {
          text: i18n.t('persistContact.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('persistContact.delete'),
          onPress: deleteAction,
        },
      ],
      { cancelable: true }
    )
  }

  return (
    <SwiperPanel
      padding={20}
      fullSize
      title={_headerTitle()}
      rightButton={i18n.t('persistContact.save')}
      leftButton={i18n.t('persistContact.cancel')}
      imageSize={[22, 22]}
      onClose={handleNavigation}
      onLeftPress={controller.close}
      onRightPress={save}
      controller={controller}
      solidColorBG
    >
      <AwaitActivity name="swiperRight" loadingView={<ScreenLoader solidColorBG />}>
        <ScrollView>
          <LinearLayout height="97.5%" orientation="verti" justifyContent="space-between">
            <LinearLayout>
              <InputLabel title={i18n.t('persistContact.name')} marginBottom="8px" />

              <InputWithValidation
                placeholder={i18n.t('persistContact.namePlaceholder')}
                onChangeText={val => setName(val)}
                color="white"
                value={name}
                validator={val => true}
                separatorColor="background.3"
                invalidColor="background.3"
                invalidMessageColor="quinary"
                sideMargins={0}
                hideScan
                hidePaste
              />

              <InputLabel title={i18n.t('persistContact.address')} marginBottom="8px" marginTop="12px" />

              {addresses.map(({ address }, index) => (
                <InputAddress
                  key={index}
                  id={index}
                  handleChangeAddress={handleChangeAddress}
                  handleDeleteInput={handleDeleteInput}
                  initialAddress={address}
                />
              ))}
              <TouchableOpacity
                style={styles.btnAnotherAddress}
                onPress={() => handleChangeAddress(addresses.length, '')}
              >
                <Image source={require('~src/assets/images/add-contact-white.png')} />
                <Text style={styles.textAnother}>{i18n.t('persistContact.addAnotherAddress')}</Text>
              </TouchableOpacity>
            </LinearLayout>
            {contact && (
              <LinearLayout>
                <LinearLayout height="1px" bg={theme.colors.background[6]} />
                <InputLabel title={i18n.t('persistContact.deleteContact')} marginBottom="8px" marginTop="25px" />
                <TextView color={theme.colors.text[0]} marginBottom="30px">
                  {i18n.t('persistContact.deleteContactSubtitle')}
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
                      width={Normalize.scale(20)}
                      height={Normalize.scale(20)}
                      source={require('~/src/assets/images/icon-trash-can-primary.png')}
                    />

                    <TextView style={{ includeFontPadding: false }} ml={3} color="primary" fontSize={20}>
                      {i18n.t('persistContact.deleteButtom')}
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
