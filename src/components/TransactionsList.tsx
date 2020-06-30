import React from 'react'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import i18n from '~src/i18n'

const mockNames = ['Tyler', 'Jack W']

const Transaction = () => {
  return (
    <LinearLayout orientation="horiz" py="12px" borderColor="text.5" borderBottomWidth="1px">
      <LinearLayout orientation="horiz" height="40px">
        <ImageView alignSelf="center" mr="8px" source={require('~src/assets/images/clock-white.png')} />
        <LinearLayout orientation="verti" mr="24px">
          <TextView fontSize="14px" color="text.2" mb="-2px">
            {i18n.t('components.transactionsList.pending')}
          </TextView>
          <TextView fontSize="16px" color="text.0" >16:43</TextView>
        </LinearLayout>
      </LinearLayout>
      <LinearLayout orientation="verti" weight={1}>
        <LinearLayout orientation="horiz" weight={1} mb="-2px">
          <TextView weight={2} fontSize="14px" color="text.2">
            {i18n.t('components.transactionsList.sentTo')}
          </TextView>
          <TextView weight={3} fontSize="14px" color="text.2">
            {i18n.t('components.transactionsList.value')}
          </TextView>
        </LinearLayout>
        <LinearLayout orientation="horiz" weight={1}>
          <TextView weight={2} fontSize="16px" color="text.0" >{mockNames[0]}</TextView>
          <LinearLayout orientation="verti" weight={3}>
            <LinearLayout orientation="horiz" weight={1}>
              <ImageView alignSelf="center" mr="4px" source={require('~src/assets/logos/logo-neo.png')} />
              <TextView fontSize="16px" color="text.0" >NEO</TextView>
              <TextView fontSize="14px" color="text.2" ml="auto">0.812345</TextView>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
        <LinearLayout orientation="horiz" mt="4px" pt="4px" weight={1} borderColor="text.5" borderTopWidth="1px">
          <TextView weight={2} fontSize="16px" color="text.0" >{mockNames[1]}</TextView>
          <LinearLayout orientation="verti" weight={3}>
            <LinearLayout orientation="horiz" weight={1}>
              <ImageView alignSelf="center" mr="4px" source={require('~src/assets/logos/logo-neo.png')} />
              <TextView fontSize="16px" color="text.0" >NEO</TextView>
              <TextView fontSize="14px" color="text.2" ml="auto">20.812345</TextView>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

const TransactionsList = () => {
  return (
    <LinearLayout orientation="verti" my="28px">
      <TextView color="text.2" fontSize="14px" fontFamily="medium" mb="12px">
        {i18n.t('components.transactionsList.title')}
      </TextView>
      <Transaction/>
      <Transaction/>
    </LinearLayout>
  )
}

export default TransactionsList
