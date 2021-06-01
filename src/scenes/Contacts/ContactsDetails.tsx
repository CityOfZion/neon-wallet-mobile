import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  StyleSheetProperties,
  TouchableOpacity,
} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedShadowContainer from '~src/components/themed/ThemedShadowContainer'
import {Contact} from '~src/models/redux/Contact'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ContactsStackParamList} from '~src/navigation/ContactsStackNavigation'
import {RootState} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

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
const ItemAddress: React.FC<IItemAddress> = ({address}) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const styles = StyleSheet.create({
    text: {
      color: theme.colors.primary,
      fontFamily: 'medium',
      fontSize: 16,
    },
    container: {
      paddingVertical: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff55',
    },
  })
  return (
    <TouchableOpacity
      onPress={() => Facade.utils.copyToClipboard(address)}
      style={styles.container}
    >
      <Text style={styles.text}>{address}</Text>
      <ImageView
        resizeMode="center"
        source={require('~/src/assets/images/icon-copy-green.png')}
        alignSelf={'center'}
      />
    </TouchableOpacity>
  )
}

export const ContactDetails = (props: ContactDetailsProps) => {
  const contacts = useSelector((state: RootState) => state.app.contacts)

  const [contact, setContact] = useState(props.route.params.contact)

  useEffect(() => {
    const freshContact = contacts.find((it) => it.id === contact.id)

    if (freshContact) {
      setContact(freshContact)
    }
  }, [contacts])

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: Facade.t('app.edit'),
        actionButtonStyle: 'default',
        actionOnPress: () => {
          props.navigation.navigate(Facade.route.Modal.name, {
            screen: Facade.route.PersistContact.name,
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
      height: 127,
      shadowColor: '#3e464d',
      shadowOffset: {width: 4, height: 4},
      shadowRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
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
      paddingHorizontal: 10,
    },
  })
  return (
    <ScreenLayout>
      <LinearLayout
        alignItems={'center'}
        mt={Dimensions.get('screen').height * 0.07}
      >
        <ThemedShadowContainer
          android={{
            width: 126,
            height: 127,
            opacity: 0.5,
            x: 5,
            y: 5,
            radius: 60,
          }}
        >
          <View style={styles.containerLetter}>
            <Text style={styles.textLetter}>
              {contact.name?.charAt(0).toLocaleUpperCase()}
            </Text>
          </View>
        </ThemedShadowContainer>
        <TextView
          fontFamily={'semibold'}
          fontSize={'20px'}
          color={'text.0'}
          mb={Dimensions.get('screen').height * 0.05}
          mt={Dimensions.get('screen').height * 0.02}
        >
          {contact.name}
        </TextView>
        <TextView textAlign={'center'} color={'text.6'} fontSize={'14px'}>
          {Facade.t('screens.contactDetails.walletAddress')}
        </TextView>

        <View style={styles.containerAddresses}>
          {contact.addresses.map((address, index) => (
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
