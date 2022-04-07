import i18n from 'i18n-js'
import React, {useState, useEffect, useCallback} from 'react'
import {View, TouchableWithoutFeedback} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {TransfersDataScreen} from '.'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {FilterHelper} from '~/src/helpers/FilterHelper'
import {Account} from '~/src/models/redux/Account'
import {RootStore} from '~/src/store/RootStore'
import {ImageView, TextView} from '~/src/styles/styled-components'

type Props = TransfersDataScreen

export const TransferItem = (props: Props) => {
  const dispatch = useDispatch<SyncDispatch<Account>>()
  const account = dispatch(RootStore.account.actions.getFromSelection())
  const contacts = useSelector((state: RootState) => state.app.contacts)
  const {exchange, tokens} = useSelector((state: RootState) => state.app)
  const {currency} = useSelector((state: RootState) => state.settings)
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const [fiatAmount, setFiatAmount] = useState<string>('')
  const [addressEllipsizeWidth, setAddressEllipsizeWidth] = useState('40%')

  const handleSentOrReceived = () => {
    const [address, status] =
      props.addressTo === account.address
        ? [props.addressFrom, 'received']
        : [props.addressTo, 'sent']

    const contact = contacts.find(
      (contact) =>
        contact.address === address ||
        contact.addresses.find((it) => it.address === address)
    )

    const identification = contact?.name ? contact.name : address
    const statusLabel =
      status === 'sent'
        ? i18n.t('screens.accountTransaction.sentToLabel')
        : i18n.t('screens.accountTransaction.receivedFromLabel')

    return {
      statusLabel,
      identification,
    }
  }

  const getTokenIcon = () => {
    return tokens.find(
      (token) =>
        token.symbol === props.symbol && token.blockchain === account.blockchain
    )?.srcIcon
  }

  const handleChangeAddressSize = useCallback(() => {
    setAddressEllipsizeWidth((prevState) =>
      prevState === '40%' ? '100%' : '40%'
    )
  }, [])

  const {identification, statusLabel} = handleSentOrReceived()

  useEffect(() => {
    const {symbol, amount} = props
    if (symbol && exchange[account.blockchain][symbol]) {
      const ratio = exchange[account.blockchain][symbol].to[currency]
      const fiatCalculated = ratio * Number(amount)
      setFiatAmount(`$${FilterHelper.decimal(fiatCalculated, undefined, 2)}`)
    }
  }, [exchange, currency])

  return (
    <View
      style={{
        paddingBottom: 8,
        marginBottom: 16,
        borderBottomColor: theme.colors.text[3],
        borderBottomWidth: 1,
      }}
    >
      <TextView color="#899fa8" fontSize="14px" fontFamily="medium">
        {statusLabel}
      </TextView>
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
          {identification}
        </TextView>
      </TouchableWithoutFeedback>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <View style={{flexDirection: 'row'}}>
          {!!getTokenIcon() && (
            <ImageView
              width="21px"
              height="21px"
              resizeMode="contain"
              alignSelf="center"
              source={getTokenIcon()}
              mr="5px"
            />
          )}
          <TextView color="#fff" fontFamily="bold" fontSize="16px">
            {props.symbol}
          </TextView>
        </View>
        <TextView
          color="#fff"
          fontSize="16px"
          fontFamily="medium"
          flex={1}
          textAlign="right"
        >
          {props.amount}
        </TextView>
        <TextView
          color="#fff"
          fontSize="16px"
          fontFamily="medium"
          width={125}
          textAlign="right"
        >
          {fiatAmount}
        </TextView>
      </View>
    </View>
  )
}
