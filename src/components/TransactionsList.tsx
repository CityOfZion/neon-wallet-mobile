import PropTypes from 'prop-types'
import React from 'react'
import {FlatList} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Contact} from '~src/models/redux/Contact'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  address: string
  transactionGroups: TransactionDateGroup[]
}

const TransactionComponent = (props: {
  item: SenderTransaction
  contacts: Contact[]
  address: string
}) => {
  const isReceived = (senderTx: SenderTransaction) => {
    return senderTx.isReceivedBy(props.address)
  }

  const hasContactName = (senderTx: SenderTransaction) => {
    const conditions = [
      Boolean(
        isReceived(senderTx) && senderTx.doSenderHasContactName(props.contacts)
      ),
      Boolean(
        !isReceived(senderTx) &&
          senderTx.doReceiverHasContactName(props.contacts)
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
      return senderTx.senderAddressOrContactName(props.contacts)
    }

    return senderTx.receiverAddressOrContactName(props.contacts)
  }

  return (
    <LinearLayout py={4} orientation={'horiz'}>
      <LinearLayout mr={4} alignSelf={'center'}>
        <ImageView
          width={Facade.scale(18)}
          resizeMode={'contain'}
          style={{
            transform: [
              {
                rotate: props.item.isReceivedBy(props.address)
                  ? '180deg'
                  : '0deg',
              },
            ],
          }}
          source={
            props.item.isPending
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
          {getStatusLabel(props.item)}
        </TextView>

        {props.item.isDatetimeValid() && (
          <TextView fontFamily={'semibold'} color={'text.0'}>
            {props.item.formattedTime}
          </TextView>
        )}
      </LinearLayout>

      <LinearLayout width={'30%'} mr={4}>
        <TextView fontSize={'sm'} color={'text.2'}>
          {getAddressLabel(props.item)}
        </TextView>

        {hasContactName(props.item) ? (
          <TextView
            fontSize={'md'}
            color={'text.0'}
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {getAddressOrContact(props.item)}
          </TextView>
        ) : (
          <TextView
            numberOfLines={1}
            ellipsizeMode={'middle'}
            fontSize={'md'}
            color={'primary'}
          >
            {getAddressOrContact(props.item)}
          </TextView>
        )}
      </LinearLayout>

      <LinearLayout mr={4}>
        <TextView fontSize={'sm'} color={'text.2'}>
          {Facade.t('components.transactionsList.value')}
        </TextView>

        {props.item.token && (
          <LinearLayout orientation={'horiz'} alignItems={'center'}>
            <ImageView
              mr={2}
              height={Facade.scale(18)}
              width={Facade.scale(18)}
              resizeMode={'contain'}
              source={props.item.token.srcIcon}
            />

            <TextView fontSize={'md'} color={'text.0'}>
              {props.item.token.symbol}
            </TextView>
          </LinearLayout>
        )}
      </LinearLayout>

      <LinearLayout weight={1} alignSelf={'flex-end'}>
        {props.item.token && (
          <TextView
            color={'text.2'}
            fontSize={'md'}
            textAlign={'right'}
            fontFamily={'semibold'}
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {props.item.token.amount}
          </TextView>
        )}
      </LinearLayout>
    </LinearLayout>
  )
}

const TransactionsList: React.FC<Props> = (props) => {
  const {contacts} = useSelector((state: RootState) => state.app)

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
              renderItem={(sender) => (
                <TransactionComponent
                  item={sender.item}
                  contacts={contacts}
                  address={props.address}
                />
              )}
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
