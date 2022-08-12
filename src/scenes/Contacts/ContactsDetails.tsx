import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { getBlockchainByAddress, getBlockchainLogo } from '~/src/blockchain'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { selectContacts } from '~/src/store/contact/SelectorContact'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { Contact } from '~src/models/redux/Contact'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ContactsStackParamList } from '~src/navigation/ContactsStackNavigation'
import { RootState } from '~src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface ContactDetailsParams {
  contact: Contact
}

interface ContactDetailsProps {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<ContactsStackParamList, 'ContactDetails'>
}

interface IItemAddress {
  address: string
}
const ItemAddress: React.FC<IItemAddress> = ({ address }) => {
  const blockchainName = getBlockchainByAddress(address)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const styles = StyleSheet.create({
    text: {
      color: theme.colors.primary,
      fontFamily: 'medium',
      fontSize: 15,
    },
    nameBlockchain: {
      color: theme.colors.text[2],
      fontFamily: 'regular',
      fontSize: 14,
    },
    container: {
      paddingVertical: 17,
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff55',
    },
  })
  return (
    <TouchableOpacity onPress={() => UtilsHelper.copyToClipboard(address)} style={styles.container}>
      <LinearLayout orientation="horiz">
        {blockchainName && (
          <ImageView width={17} height={18} source={getBlockchainLogo(blockchainName)} mr={3} alignSelf="center" />
        )}
        <LinearLayout orientation="verti" width="85%">
          {blockchainName && (
            <Text style={styles.nameBlockchain}>{i18n.t(`blockchainServices.${blockchainName}.id`)}</Text>
          )}
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="middle">
            {address}
          </Text>
        </LinearLayout>
        <ImageView source={require('~/src/assets/images/icon-copy-green.png')} alignSelf="center" />
      </LinearLayout>
    </TouchableOpacity>
  )
}

export const ContactDetails = (props: ContactDetailsProps) => {
  const contacts = useSelector(selectContacts)

  const [contact, setContact] = useState(props.route.params.contact)

  useEffect(() => {
    const freshContact = contacts.find(it => it.id === contact.id)

    if (freshContact) {
      setContact(freshContact)
    }
  }, [contacts])

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: i18n.t('app.edit'),
        actionButtonStyle: 'default',
        actionOnPress: () => {
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.PersistContact.name,
            params: {
              contact,
            },
          })
        },
      }),
  })
  const styles = StyleSheet.create({
    containerLetter: {
      borderRadius: 100,
      backgroundColor: '#252d34',
      width: 126,
      height: 126,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textLetter: {
      color: '#899fa8',
      fontSize: 36,
      fontWeight: '600',
    },
    container: {
      alignItems: 'center',
      marginRight: 10,
      marginLeft: 10,
      flexDirection: 'row',
    },
    containerAddresses: {
      width: '100%',
      paddingRight: 12,
    },
  })
  return (
    <ScreenLayout>
      <LinearLayout alignItems="center" mt={Dimensions.get('screen').height * 0.07}>
        <Shadow distance={20} offset={[5, 5]} containerViewStyle={{ marginBottom: 30 }}>
          <View style={styles.containerLetter}>
            <Text style={styles.textLetter}>{contact.name?.charAt(0).toLocaleUpperCase()}</Text>
          </View>
        </Shadow>
        <TextView
          fontFamily="semibold"
          fontSize="20px"
          color="text.0"
          mb={Dimensions.get('screen').height * 0.05}
          mt={Dimensions.get('screen').height * 0.02}
        >
          {contact.name}
        </TextView>
        <TextView textAlign="center" color="text.6" fontSize="14px">
          {i18n.t('screens.contactDetails.walletAddress')}
        </TextView>

        <View style={styles.containerAddresses}>
          {contact.addresses.map(({ address }, index) => (
            <ItemAddress key={index} address={address} />
          ))}
        </View>
      </LinearLayout>
    </ScreenLayout>
  )
}

ItemAddress.propTypes = {
  address: PropTypes.any,
}
