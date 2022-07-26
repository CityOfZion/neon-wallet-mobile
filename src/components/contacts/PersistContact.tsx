import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { getBlockchainByAddress, validateAddressAllBlockchains } from '~/src/blockchain'
import { Contact } from '~/src/models/redux/Contact'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { ContactAddresses } from '~/src/types/reducers/contact'
import { AsyncDispatch, DispatchResult } from '~/src/types/reducers/root'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { RootStore } from '~src/store/RootStore'
import { LinearLayout, TextView, ImageView, ButtonView, ButtonWithoutFeedbackView } from '~src/styles/styled-components'

export interface PersistContactParams {
  contact?: Contact
  startingAddress?: string
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
  route: RouteProp<ModalStackParamList, 'PersistContact'>
}

export const PersistContact = (props: Props) => {
  const { startingAddress, contact } = props.route.params

  const controller = useSwiperController(true)
  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const [name, setName] = useState(contact?.name ?? '')
  const [addresses, setAddresses] = useState<string[]>(() => {
    if (contact) return contact.addresses.map(({ address }) => address)

    if (startingAddress) return [startingAddress]

    return ['']
  })

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

    const validAddress = addresses.every(address => validateAddressAllBlockchains(address))

    if (!validAddress) {
      Alert.alert(i18n.t('persistContact.invalidAddress'))
      return
    }

    dispatch(RootStore.contact.actions.setName(name))

    const addressesToSave = addresses
      .map((address): ContactAddresses | undefined => {
        const blockchain = getBlockchainByAddress(address)

        if (!blockchain) return

        return { address, blockchain }
      })
      .filter((contactAddress): contactAddress is ContactAddresses => !!contactAddress)

    dispatch(RootStore.contact.actions.setAddress(addressesToSave))

    if (contact?.id) {
      await dispatchAsync(RootStore.contact.actions.update(contact.id))
    } else {
      await dispatchAsync(RootStore.contact.actions.createAndSave())
    }

    dispatch(RootStore.app.actions.syncContacts())
    controller.close()
  }

  const handleChangeAddress = (index: number, address: string) => {
    setAddresses(prevState =>
      prevState.map((prevAddress, prevIndex) => {
        if (prevIndex === index) return address

        return prevAddress
      })
    )
  }

  const handleAddAddress = () => {
    setAddresses(prevState => [...prevState, ''])
  }

  const handleDeleteAddress = (index: number) => {
    if (addresses.length > 1) {
      setAddresses(prevState => prevState.filter((_address, addressIndex) => addressIndex !== index))
    }
  }

  const save = () => {
    Await.run('submit', submit)
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

  const deleteAction = async () => {
    if (contact?.id) {
      await dispatchAsync(RootStore.contact.actions.delete(contact.id))
    }

    await dispatchAsync(RootStore.app.actions.syncContacts())

    props.navigation.navigate(wrapper.route.Contacts.name, {
      screen: wrapper.route.Contacts.name,
      initial: true,
    })
  }

  return (
    <SwiperPanel
      padding={20}
      fullSize
      title={contact ? i18n.t('modals.editAccount.title') : i18n.t('persistContact.title.create')}
      rightButton={i18n.t('persistContact.save')}
      leftButton={i18n.t('persistContact.cancel')}
      imageSize={[22, 22]}
      onClose={props.navigation.goBack}
      onLeftPress={controller.close}
      onRightPress={save}
      controller={controller}
      solidColorBG
    >
      <AwaitActivity name="submit" loadingView={<ScreenLoader solidColorBG />}>
        <LinearLayout orientation="verti" justifyContent="space-between">
          <LinearLayout>
            <InputLabel title={i18n.t('persistContact.name')} marginBottom="8px" />
            <InputWithValidation
              placeholder={i18n.t('persistContact.namePlaceholder')}
              onChangeText={setName}
              color="white"
              value={name}
              validator={() => true}
              separatorColor="background.3"
              invalidColor="background.3"
              invalidMessageColor="quinary"
              sideMargins={0}
              hideScan
              hidePaste
            />

            <InputLabel title={i18n.t('persistContact.address')} marginTop="12px" />
            {addresses.map((address, index) => (
              <LinearLayout>
                <InputWithValidation
                  placeholder={i18n.t('persistContact.addressPlaceholder')}
                  onChangeText={text => handleChangeAddress(index, text)}
                  color="primary"
                  value={address}
                  invalidColor="background.3"
                  invalidSeparatorColor="background.3"
                  validator={validateAddressAllBlockchains}
                  separatorColor="background.3"
                  invalidMessageColor="quinary"
                  sideMargins={0}
                  onScan={scannedAddress => handleChangeAddress(index, scannedAddress as string)}
                  onClearPress={() => {
                    handleDeleteAddress(index)
                  }}
                  forceClearButton={addresses.length > 1}
                />
              </LinearLayout>
            ))}

            <ButtonView
              borderWidth="1px"
              paddingY="15px"
              borderColor="background.4"
              justifyContent="center"
              alignItems="center"
              borderStyle="dashed"
              marginTop="30px"
              flexDirection="row"
              onPress={handleAddAddress}
            >
              <ImageView
                resizeMode="contain"
                source={require('~src/assets/images/add-contact-white.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
              <TextView color="text.0" fontWeight={500} fontSize="18px" marginLeft="10px">
                {i18n.t('persistContact.addAnotherAddress')}
              </TextView>
            </ButtonView>
          </LinearLayout>

          {contact && (
            <LinearLayout>
              <LinearLayout height="1px" bg="background.6" />
              <InputLabel title={i18n.t('persistContact.deleteContact')} marginBottom="8px" marginTop="25px" />
              <TextView color="text.0" marginBottom="30px">
                {i18n.t('persistContact.deleteContactSubtitle')}
              </TextView>
              <ButtonWithoutFeedbackView onPress={alertDelete}>
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
                    source={require('~/src/assets/images/icon-trash-can-primary.png')}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />

                  <TextView ml="3px" color="primary" fontSize="20px">
                    {i18n.t('persistContact.deleteButtom')}
                  </TextView>
                </LinearLayout>
              </ButtonWithoutFeedbackView>
            </LinearLayout>
          )}
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default PersistContact
