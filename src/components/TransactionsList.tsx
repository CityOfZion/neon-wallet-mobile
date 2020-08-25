import PropTypes from 'prop-types'
import React from 'react'
import {FlatList} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  address: string
  transactionGroups: TransactionDateGroup[]
}

const TransactionsList: React.FC<Props> = (props) => {
  const {contacts} = useSelector((state: RootState) => state.app)

  const isReceived = (senderTx: SenderTransaction) => {
    return senderTx.isReceivedBy(props.address)
  }

  const hasContactName = (senderTx: SenderTransaction) => {
    const conditions = [
      Boolean(
        isReceived(senderTx) && senderTx.doSenderHasContactName(contacts)
      ),
      Boolean(
        !isReceived(senderTx) && senderTx.doReceiverHasContactName(contacts)
      ),
    ]

    return conditions.some((it) => it)
  }

  const getStatusLabel = (senderTx: SenderTransaction) => {
    if (senderTx.isPending) {
      return Facade.t('components.transactionsList.pending')
    }

    if (isReceived(senderTx)) {
      return Facade.t('components.transactionsList.received')
    }

    return Facade.t('components.transactionsList.sent')
  }

  const getAddressLabel = (senderTx: SenderTransaction) => {
    if (isReceived(senderTx)) {
      return Facade.t('components.transactionsList.receivedFrom')
    }

    return Facade.t('components.transactionsList.sentTo')
  }

  const getAddressOrContact = (senderTx: SenderTransaction) => {
    if (isReceived(senderTx)) {
      return senderTx.senderAddressOrContactName(contacts)
    }

    return senderTx.receiverAddressOrContactName(contacts)
  }

  const _renderTransaction = (it: SenderTransaction) => {
    return (
      <LinearLayout py={4} orientation={'horiz'}>
        <LinearLayout mr={4} alignSelf={'center'}>
          <ImageView
            width={Facade.scale(18)}
            resizeMode={'contain'}
            style={{
              transform: [
                {rotate: it.isReceivedBy(props.address) ? '180deg' : '0deg'},
              ],
            }}
            source={
              it.isPending
                ? require('~src/assets/images/clock-white.png')
                : require('~src/assets/images/icon-sent-white.png')
            }
          />
        </LinearLayout>

        <LinearLayout width={'60px'} mr={4}>
          <TextView
            fontSize={'sm'}
            color={'text.2'}
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {getStatusLabel(it)}
          </TextView>

          {it.isDatetimeValid() && (
            <TextView fontFamily={'semibold'} color={'text.0'}>
              {it.formattedTime}
            </TextView>
          )}
        </LinearLayout>

        <LinearLayout width={'30%'} mr={4}>
          <TextView fontSize={'sm'} color={'text.2'}>
            {getAddressLabel(it)}
          </TextView>

          {hasContactName(it) ? (
            <TextView
              fontSize={'md'}
              color={'text.0'}
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
            >
              {getAddressOrContact(it)}
            </TextView>
          ) : (
            <TextView
              numberOfLines={1}
              ellipsizeMode={'middle'}
              fontSize={'md'}
              color={'primary'}
            >
              {getAddressOrContact(it)}
            </TextView>
          )}
        </LinearLayout>

        <LinearLayout mr={4}>
          <TextView fontSize={'sm'} color={'text.2'}>
            {Facade.t('components.transactionsList.value')}
          </TextView>

          {it.token && (
            <LinearLayout orientation={'horiz'} alignItems={'center'}>
              <ImageView
                mr={2}
                height={Facade.scale(18)}
                width={Facade.scale(18)}
                resizeMode={'contain'}
                source={it.token.srcIcon}
              />

              <TextView fontSize={'md'} color={'text.0'}>
                {it.token.symbol}
              </TextView>
            </LinearLayout>
          )}
        </LinearLayout>

        <LinearLayout weight={1} alignSelf={'flex-end'}>
          {it.token && (
            <TextView
              color={'text.2'}
              fontSize={'md'}
              textAlign={'right'}
              fontFamily={'semibold'}
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
            >
              {it.token.amount}
            </TextView>
          )}
        </LinearLayout>
      </LinearLayout>
    )
  }

  return (
    <FlatList<TransactionDateGroup>
      data={props.transactionGroups}
      keyExtractor={(item, i) => String(i)}
      ItemSeparatorComponent={() => <LinearLayout bg="text.2" height={1} />}
      renderItem={(group) => (
        <LinearLayout py={4}>
          <LinearLayout width={'100%'}>
            {group.item.isDatetimeValid() && (
              <TextView color={'text.0'} fontSize={'sm'} fontFamily={'bold'}>
                {group.item.formattedDate()}
              </TextView>
            )}

            <FlatList<SenderTransaction>
              data={group.item.transactions}
              keyExtractor={(item, i) => String(i)}
              ItemSeparatorComponent={() => (
                <LinearLayout bg="text.2" height={1} />
              )}
              renderItem={(sender) => _renderTransaction(sender.item)}
            />
          </LinearLayout>
        </LinearLayout>
      )}
    />
  )
}

TransactionsList.propTypes = {
  address: PropTypes.string.isRequired,
  transactionGroups: PropTypes.arrayOf(
    PropTypes.instanceOf(TransactionDateGroup).isRequired
  ).isRequired,
}

export default TransactionsList
