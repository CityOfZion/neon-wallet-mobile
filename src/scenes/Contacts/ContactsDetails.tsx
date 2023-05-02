import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'
import { Shadow } from 'react-native-shadow-2'
import { useSelector } from 'react-redux'

import ListSeparator from '../walletConnect/components/ListSeparator'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { BlockchainServiceKey } from '~/src/blockchain'
import ThemedButton from '~/src/components/themed/ThemedButton'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { selectContactById } from '~/src/store/contact/SelectorContact'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { Contact } from '~src/models/redux/Contact'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ContactsStackParamList } from '~src/navigation/ContactsStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface ContactDetailsParams {
  contact: Contact
}

interface ContactDetailsProps {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<ContactsStackParamList, 'ContactDetails'>
}

interface ItemProps {
  addressOrDomain: string
  blockchain: BlockchainServiceKey
}

const Item = React.memo(({ addressOrDomain, blockchain }: ItemProps) => {
  return (
    <ButtonView
      onPress={() => UtilsHelper.copyToClipboard(addressOrDomain)}
      paddingY="18px"
      orientation="horiz"
      alignItems="center"
    >
      <ImageView source={BlockchainHelper.getIcon(blockchain)} resizeMode="contain" width={20} height={20} />

      <LinearLayout flexGrow={1} flexShrink={1} mx="14px">
        <TextView color="text.10" fontSize="14px">
          {i18n.t(`blockchainServices.${blockchain}.id`)}
        </TextView>

        <TextView color="primary" fontSize="16px" numberOfLines={1} ellipsizeMode="middle">
          {addressOrDomain}
        </TextView>
      </LinearLayout>

      <ImageView
        source={require('~/src/assets/images/icon-copy-green.png')}
        width={20}
        height={20}
        resizeMode="contain"
      />
    </ButtonView>
  )
})

export const ContactDetails = (props: ContactDetailsProps) => {
  const contact = useSelector(selectContactById(props.route.params.contact.id))

  const handleEditPress = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.PersistContactModal.name,
      params: {
        contact,
      },
    })
  }

  if (!contact) {
    return null
  }

  return (
    <ScreenLayout
      rightButton={
        <ThemedButton onPress={handleEditPress} label={i18n.t('app.edit')} flat textColor="text.0" fontSize="lg" />
      }
    >
      <LinearLayout alignItems="center" mt="64px">
        <Shadow distance={20} offset={[5, 5]} viewStyle={{ borderRadius: Normalize.scale(64) }}>
          <LinearLayout
            borderRadius={Normalize.scale(64)}
            backgroundColor="background.14"
            width={Normalize.scale(126)}
            height={Normalize.scale(126)}
            alignItems="center"
            justifyContent="center"
          >
            <TextView color="text.6" fontSize="36px">
              {contact.name?.charAt(0).toLocaleUpperCase()}
            </TextView>
          </LinearLayout>
        </Shadow>

        <TextView fontSize="20px" color="text.0" mb="24px" mt="54px">
          {contact.name}
        </TextView>

        <TextView textAlign="center" color="text.6" fontSize="14px">
          {i18n.t('screens.contactDetails.walletAddress')}
        </TextView>

        <FlatList
          style={{ width: '100%' }}
          data={contact.addresses}
          renderItem={({ item }) => <Item addressOrDomain={item.addressOrDomain} blockchain={item.blockchain} />}
          ItemSeparatorComponent={() => <ListSeparator />}
          keyExtractor={(item, index) => `${item.addressOrDomain}-${index}`}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}
