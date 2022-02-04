import React, {useState, useEffect, useCallback} from 'react'
import {View, TouchableWithoutFeedback} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {TransfersDataScreen} from '.'

import {FilterHelper} from '~/src/helpers/FilterHelper'
import {Account} from '~/src/models/redux/Account'
import {RootStore} from '~/src/store/RootStore'
import {ImageView, TextView} from '~/src/styles/styled-components'

export const TransferItem = (props: TransfersDataScreen) => {
  const dispatch = useDispatch<SyncDispatch<Account>>()
  const account = dispatch(RootStore.account.actions.getFromSelection())
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const {exchange} = useSelector((state: RootState) => state.app)
  const {currency} = useSelector((state: RootState) => state.settings)

  const [fiatAmount, setFiatAmount] = useState<string>('')
  const [contactName, setContactname] = useState<string>('')
  const [addressEllipsizeWidth, setAddressEllipsizeWidth] = useState('40%')
  useEffect(() => {
    const {symbol, amount} = props
    if (symbol) {
      const ratio = exchange[account.blockchain][symbol].to[currency]
      const fiatCalculated = ratio * Number(amount)
      setFiatAmount(`$${FilterHelper.decimal(fiatCalculated, undefined, 8)}`)
    }
  }, [exchange, currency])

  useEffect(() => {
    const contact = contacts.find(
      (contact) =>
        contact.address === props.addressTo ||
        contact.addresses.find((it) => it.address === props.addressTo)
    )
    if (contact?.name) {
      setContactname(contact.name)
    } else {
      setContactname(props.addressTo)
    }
  }, [contacts])

  const handleChangeAddressSize = useCallback(() => {
    setAddressEllipsizeWidth(addressEllipsizeWidth === '40%' ? '100%' : '40%')
  }, [addressEllipsizeWidth])

  return (
    <View style={{marginVertical: 5, padding: 5}}>
      <TouchableWithoutFeedback onPress={handleChangeAddressSize}>
        <TextView
          ellipsizeMode={'middle'}
          numberOfLines={1}
          color="primary"
          fontSize="17px"
          fontFamily="medium"
          width={addressEllipsizeWidth}
        >
          {contactName}
        </TextView>
      </TouchableWithoutFeedback>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <View style={{flexDirection: 'row'}}>
          <ImageView
            width="21px"
            height="21px"
            source={
              account.tokenAssets.find((token) => token.symbol === props.symbol)
                ?.srcIcon
            }
            mr="5px"
          />
          <TextView color="#fff" fontFamily="bold" fontSize="16px">
            {props.symbol}
          </TextView>
        </View>
        <TextView color="#fff" fontSize="16px" fontFamily="medium">
          {props.amount}
        </TextView>
        <TextView color="#fff" fontSize="16px" fontFamily="medium">
          {fiatAmount}
        </TextView>
      </View>
    </View>
  )
}
