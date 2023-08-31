import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'

import { Item } from './Item'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Button } from '~/src/components/Button'
import { Separator } from '~/src/components/Separator'
import { Wallet } from '~/src/store/wallet/Wallet'
import { LinearLayout, ImageView, TextView } from '~/src/styles/styled-components'

type Props = {
  wallets: Wallet[]
}

const Header = () => {
  return (
    <LinearLayout alignItems="center">
      <ImageView source={require('~src/assets/images/backup-info-feature.png')} />

      <TextView fontFamily="bold" fontSize="lg" color="primary" textAlign="center">
        {i18n.t('screens.securityBackupCheckPage.withoutAccountsToBackup.description')}
      </TextView>

      <Separator mt="64px" />
    </LinearLayout>
  )
}

const Footer = () => {
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate(wrapper.route.SecurityPage.name)
  }

  return (
    <LinearLayout>
      <Separator />

      <Button
        onPress={handlePress}
        label={i18n.t('screens.securityBackupCheckPage.withoutAccountsToBackup.button_label')}
        variant="contained"
        my="42px"
        mx="18px"
        py="12px"
        labelStyle={{ fontSize: '2xl' }}
      />
    </LinearLayout>
  )
}

export const WithoutAccountsToBackup = ({ wallets }: Props) => {
  return (
    <FlatList
      data={wallets}
      style={{ width: '100%', height: '100%' }}
      ListHeaderComponent={<Header />}
      ListFooterComponent={<Footer />}
      ItemSeparatorComponent={Separator}
      renderItem={({ item }) => <Item wallet={item} success />}
    />
  )
}
