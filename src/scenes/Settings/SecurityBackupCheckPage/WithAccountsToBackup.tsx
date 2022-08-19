import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'

import { Item } from './Item'

import { Separator } from '~/src/components/Separator'
import { Wallet } from '~/src/models/redux/Wallet'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  wallets: Wallet[]
}

const Header = () => {
  return (
    <LinearLayout alignItems="center">
      <ImageView
        resizeMode="contain"
        source={require('~src/assets/images/icon-warning-green.png')}
        style={{ width: 48, height: 48 }}
      />

      <TextView color="text.0" fontSize="lg" fontFamily="bold" textAlign="center" mt="24px">
        {i18n.t('screens.securityBackupCheckPage.withAccountsToBackup.description_1')}
      </TextView>

      <TextView color="text.0" fontSize="lg" fontFamily="regular" textAlign="center" mt="24px">
        {i18n.t('screens.securityBackupCheckPage.withAccountsToBackup.description_2')}
      </TextView>

      <TextView color="primary" fontSize="lg" fontFamily="bold" mt="54px">
        {i18n.t('screens.securityBackupCheckPage.withAccountsToBackup.description_3')}
      </TextView>

      <TextView color="text.14" fontSize="md" fontFamily="regular" mt="8px" textAlign="center">
        {i18n.t('screens.securityBackupCheckPage.withAccountsToBackup.description_4')}
      </TextView>

      <Separator mt="12px" />
    </LinearLayout>
  )
}

export const WithAccountsToBackup = ({ wallets }: Props) => {
  return (
    <FlatList
      data={wallets}
      style={{ width: '100%' }}
      ListHeaderComponent={<Header />}
      ListFooterComponent={<Separator />}
      ItemSeparatorComponent={Separator}
      renderItem={({ item }) => <Item wallet={item} />}
    />
  )
}
