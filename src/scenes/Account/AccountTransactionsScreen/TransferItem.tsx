import React, {useState, useEffect, useCallback} from 'react'
import {View, TouchableWithoutFeedback} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {TransfersDataScreen} from '.'
import {TSentOrReceived} from './TransactionItemDate'

import {FilterHelper} from '~/src/helpers/FilterHelper'
import {Account} from '~/src/models/redux/Account'
import {RootStore} from '~/src/store/RootStore'
import {ImageView, TextView} from '~/src/styles/styled-components'

type Props = TransfersDataScreen & {sentOrReceived: TSentOrReceived}

export const TransferItem = (props: Props) => {
  const dispatch = useDispatch<SyncDispatch<Account>>()
  const account = dispatch(RootStore.account.actions.getFromSelection())
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const {exchange, tokens} = useSelector((state: RootState) => state.app)
  const {currency} = useSelector((state: RootState) => state.settings)

  const [fiatAmount, setFiatAmount] = useState<string>('')
  const [contactNameOrAddress, setContactnameOrAddress] = useState<string>('')
  const [addressEllipsizeWidth, setAddressEllipsizeWidth] = useState('40%')

  useEffect(() => {
    const {symbol, amount} = props
    if (symbol && exchange[account.blockchain][symbol]) {
      const ratio = exchange[account.blockchain][symbol].to[currency]
      const fiatCalculated = ratio * Number(amount)
      setFiatAmount(`$${FilterHelper.decimal(fiatCalculated, undefined, 2)}`)
    }
  }, [exchange, currency])

  useEffect(() => {
    const address =
      props.sentOrReceived === 'received' ? props.addressFrom : props.addressTo

    const contact = contacts.find(
      (contact) =>
        contact.address === address ||
        contact.addresses.find((it) => it.address === address)
    )
    if (contact?.name) {
      setContactnameOrAddress(contact.name)
    } else {
      setContactnameOrAddress(address)
    }
  }, [contacts])

  const handleChangeAddressSize = useCallback(() => {
    setAddressEllipsizeWidth((prevState) =>
      prevState === '40%' ? '100%' : '40%'
    )
  }, [])

  return (
    <View style={{marginBottom: 15}}>
      <TouchableWithoutFeedback onPress={handleChangeAddressSize}>
        <TextView
          ellipsizeMode={'middle'}
          numberOfLines={1}
          color="primary"
          fontSize="17px"
          fontFamily="medium"
          width={addressEllipsizeWidth}
          pb={3}
        >
          {contactNameOrAddress}
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
              tokens.find(
                (token) =>
                  token.symbol === props.symbol &&
                  token.blockchain === account.blockchain
              )?.srcIcon
            }
            mr="5px"
          />
          <TextView color="#fff" fontFamily="bold" fontSize="16px">
            {props.symbol}
          </TextView>
        </View>
        <TextView color="#fff" fontSize="16px" fontFamily="medium">
          {FilterHelper.decimal(props.amount, undefined, props.decimals)}
        </TextView>
        <TextView color="#fff" fontSize="16px" fontFamily="medium">
          {fiatAmount}
        </TextView>
      </View>
    </View>
  )
}
