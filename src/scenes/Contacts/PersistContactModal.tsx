import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useRef, useState } from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Button } from '~/src/components/Button'
import { Separator } from '~/src/components/Separator'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { Contact } from '~/src/models/redux/Contact'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { contactReducerActions } from '~/src/store/contact/ContactReducer'
import { ContactAddresses } from '~/src/types/reducers/contact'
import { DispatchResult } from '~/src/types/reducers/root'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, { LabelButton, useSwiperController } from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout, TextView, ImageView, ButtonView } from '~src/styles/styled-components'

export interface PersistContactModalParams {
  contact?: Contact
  startingAddress?: ContactAddresses
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList & TabStackParamList>
  route: RouteProp<ModalStackParamList, 'PersistContactModal'>
}

export const PersistContactModal = (props: Props) => {
  const { contact, startingAddress } = props.route.params

  const controller = useSwiperController(true)
  const dispatch = useDispatch<DispatchResult>()

  const [name, setName] = useState(contact?.name ?? '')
  const [nameIsValid, setNameIsValid] = useState(!!contact?.name)
  const [addresses, setAddresses] = useState<ContactAddresses[]>(
    contact?.addresses ? contact?.addresses : startingAddress ? [startingAddress] : []
  )

  const saving = useRef(false)

  const handleAddAddress = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.AddContactAddressModal.name,
      params: {
        onAdd: (address: ContactAddresses) => {
          setAddresses(prevState => [...prevState, address])
        },
      },
    })
  }

  const handleEditAddress = (index: number, address: ContactAddresses) => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.AddContactAddressModal.name,
      params: {
        onAdd: (newAddress: ContactAddresses) => {
          setAddresses(prevState =>
            prevState.map((prevAddress, prevIndex) => (prevIndex === index ? newAddress : prevAddress))
          )
        },
        address,
      },
    })
  }

  const handleDeleteAddress = (index: number) => {
    setAddresses(prevState => prevState.filter((_, stateIndex) => stateIndex !== index))
  }

  const handleChangeName = (input: string) => {
    setName(input)

    const isValid = input.length > 0 && input.length <= 20
    setNameIsValid(isValid)
  }

  const save = async () => {
    try {
      if (saving.current) return
      saving.current = true

      await Await.run('submit', async () => {
        const contactToSave = contact ?? new Contact()
        contactToSave.name = name
        contactToSave.addresses = addresses
        dispatch(contactReducerActions.saveContact(contactToSave.deserialize()))
        controller.close()
      })
    } catch {
      saving.current = false
    }
  }

  const handleDelete = () => {
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
          onPress: () => {
            if (!contact?.id) return
            dispatch(contactReducerActions.deleteContact(contact.id))
            controller.close()
            props.navigation.replace(wrapper.route.Contacts.name, {
              screen: wrapper.route.Contacts.name,
              initial: true,
            })
          },
        },
      ],
      { cancelable: true }
    )
  }

  return (
    <SwiperPanel
      title={contact ? i18n.t('persistContact.title.edit') : i18n.t('persistContact.title.create')}
      rightButton={
        <LabelButton
          label={i18n.t('persistContact.save')}
          onPress={save}
          disabled={!nameIsValid || addresses.length <= 0}
        />
      }
      leftButton={<LabelButton label={i18n.t('persistContact.cancel')} onPress={controller.close} />}
      onClose={props.navigation.goBack}
      controller={controller}
    >
      <AwaitActivity name="submit" loadingView={<ScreenLoader transparent />}>
        <LinearLayout justifyContent="space-between" flex={1}>
          <LinearLayout>
            <InputLabel title={i18n.t('persistContact.name')} marginBottom="8px" />
            <InputWithValidation
              placeholder={i18n.t('persistContact.namePlaceholder')}
              onChangeText={handleChangeName}
              color="white"
              value={name}
              isValid={nameIsValid}
              separatorColor="background.3"
              invalidColor="background.3"
              invalidMessageColor="quinary"
              sideMargins={0}
              hideScan
              hidePaste
            />

            <InputLabel title={i18n.t('persistContact.address')} marginTop="12px" />
            {addresses.map((address, index) => (
              <ButtonView
                orientation="horiz"
                alignItems="center"
                borderColor="background.10"
                borderBottomWidth="2px"
                py="6px"
                mb={index < addresses.length - 1 ? '36px' : '0px'}
                key={index}
                onPress={() => handleEditAddress(index, address)}
              >
                <ImageView
                  source={BlockchainHelper.getIcon(address.blockchain)}
                  resizeMode="contain"
                  width={16}
                  height={16}
                />

                <TextView
                  color="primary"
                  fontSize="16px"
                  flexGrow={1}
                  flexShrink={1}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  mx="12px"
                >
                  {address.address}
                </TextView>

                <ButtonView onPress={() => handleDeleteAddress(index)}>
                  <ImageView
                    source={require('~src/assets/images/button_close_white.png')}
                    width={12}
                    height={12}
                    resizeMode="contain"
                  />
                </ButtonView>
              </ButtonView>
            ))}

            <ButtonView
              orientation="horiz"
              justifyContent="center"
              width="100%"
              borderWidth="1px"
              borderColor="background.10"
              borderStyle="dashed"
              borderRadius="8px"
              paddingY="16px"
              mt="36px"
              onPress={() => handleAddAddress()}
            >
              <ImageView
                resizeMode="contain"
                source={require('~src/assets/images/add-contact-white.png')}
                width={20}
                height={20}
              />
              <TextView color="text.0" fontWeight={500} fontSize="18px" marginLeft="10px">
                {i18n.t(addresses.length > 0 ? 'persistContact.addAnotherAddress' : 'persistContact.addAddress')}
              </TextView>
            </ButtonView>
          </LinearLayout>

          {contact && (
            <LinearLayout>
              <Separator mb="32px" />
              <InputLabel title={i18n.t('persistContact.deleteContact')} />
              <TextView color="text.0" mb="32px" mt="4px">
                {i18n.t('persistContact.deleteContactSubtitle')}
              </TextView>

              <Button
                label={i18n.t('persistContact.deleteButtom')}
                variant="outline"
                icon={require('~/src/assets/images/icon-trash-can-primary.png')}
                iconStyle={{ width: 20, height: 20 }}
                labelStyle={{ fontSize: 20 }}
                onPress={handleDelete}
              />
            </LinearLayout>
          )}
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}
