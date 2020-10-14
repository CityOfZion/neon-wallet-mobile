import {useNavigation} from '@react-navigation/native'
import PropTypes from 'prop-types'
import React from 'react'
import {FlatList} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {TokenAsset} from '~src/models/TokenAsset'
import {TransactionDateGroup} from '~src/models/TransactionDateGroup'
import {Contact} from '~src/models/redux/Contact'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  title?: string
  address: string
  transactionGroups: TransactionDateGroup[]
}

const TransactionComponent = (props: {
  item: SenderTransaction
  address: string
  contacts: Contact[]
  currency: Currency
  language: Lang
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

  const navigation = useNavigation()

  return (
    <ButtonView
      onPress={() => {
        navigation.navigate(Facade.route.Modal.name, {
          screen: Facade.route.TransactionDetails.name,
          params: {
            transaction: props.item,
          },
        })
      }}
    >
      <LinearLayout py={4}>
        <LinearLayout>
          <LinearLayout
            mb={2}
            orientation={'horiz'}
            justifyContent={'space-between'}
          >
            <LinearLayout>
              {props.item.isDatetimeValid() && (
                <TextView color={'text.0'} fontSize={'md'}>
                  {props.item.formattedTime}
                </TextView>
              )}
            </LinearLayout>

            <LinearLayout>
              {props.item.isDatetimeValid() && (
                <TextView color={'text.0'} fontSize={'md'}>
                  {props.item.formattedDate}
                </TextView>
              )}
            </LinearLayout>
          </LinearLayout>

          <LinearLayout
            mb={2}
            orientation={'horiz'}
            justifyContent={'space-between'}
          >
            <LinearLayout width={'40%'} mr={4}>
              <TextView fontSize={'sm'} color={'text.2'}>
                {getAddressLabel(props.item)}
              </TextView>
            </LinearLayout>
          </LinearLayout>

          <LinearLayout
            mb={2}
            orientation={'horiz'}
            justifyContent={'space-between'}
          >
            <LinearLayout>
              <FlatList<TokenAsset>
                data={props.item.tokens}
                keyExtractor={(item, i) => String(i)}
                renderItem={(token) => (
                  <LinearLayout width={'47%'} mr={4} orientation={'horiz'}>
                    {token.index === 0 && (
                      <>
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
                      </>
                    )}
                  </LinearLayout>
                )}
              />
            </LinearLayout>

            <LinearLayout orientation={'horiz'}>
              <LinearLayout mr={2} alignSelf={'center'}>
                <ImageView
                  width={Facade.scale(20)}
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

              <TextView
                fontSize={'md'}
                color={'text.0'}
                allowFontScaling={true}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
              >
                {getStatusLabel(props.item).toUpperCase()}
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>

        <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
          <LinearLayout width={'27%'} mr={4}>
            <TextView fontSize={'sm'} color={'text.2'}>
              {Facade.t('components.transactionsList.token')}
            </TextView>
          </LinearLayout>

          <LinearLayout mr={4}>
            <TextView fontSize={'sm'} color={'text.2'}>
              {Facade.t('components.transactionsList.quantity')}
            </TextView>
          </LinearLayout>

          <LinearLayout weight={1} alignSelf={'flex-end'}>
            <TextView fontSize={'sm'} textAlign={'right'} color={'text.2'}>
              {Facade.t('components.transactionsList.value')}
            </TextView>
          </LinearLayout>
        </LinearLayout>

        <LinearLayout>
          <FlatList<TokenAsset>
            data={props.item.tokens}
            keyExtractor={(item, i) => String(i)}
            listKey={props.item.transactionHash ?? ''}
            renderItem={(token) => (
              <LinearLayout orientation={'horiz'}>
                <LinearLayout mr={4} width={'27%'}>
                  <LinearLayout orientation={'horiz'} alignItems={'center'}>
                    <ImageView
                      mr={2}
                      height={Facade.scale(18)}
                      width={Facade.scale(18)}
                      resizeMode={'contain'}
                      source={token.item.srcIcon}
                    />

                    <TextView fontSize={'md'} color={'text.0'}>
                      {token.item.symbol}
                    </TextView>
                  </LinearLayout>
                </LinearLayout>

                <LinearLayout alignContent={'flex-start'}>
                  <TextView
                    color={'text.0'}
                    fontSize={'md'}
                    textAlign={'right'}
                    fontFamily={'semibold'}
                    allowFontScaling={true}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                  >
                    {props.item.token?.amount.toFixed(8) ?? ''}
                  </TextView>
                </LinearLayout>

                <LinearLayout weight={2} alignSelf={'flex-end'}>
                  <TextView
                    color={'primary'}
                    fontSize={'md'}
                    textAlign={'right'}
                    fontFamily={'semibold'}
                    allowFontScaling={true}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                  >
                    {Facade.filter.currency(
                      token.item.exchangeToken(props.currency),
                      props.currency,
                      props.language,
                      2,
                      10
                    )}
                  </TextView>
                </LinearLayout>
              </LinearLayout>
            )}
          />
        </LinearLayout>
      </LinearLayout>
    </ButtonView>
  )
}

const TransactionsList: React.FC<Props> = (props) => {
  const {contacts} = useSelector((state: RootState) => state.app)
  const {currency, language} = useSelector((state: RootState) => state.settings)

  return (
    <LinearLayout>
      {props.title && Boolean(props.transactionGroups.length) && (
        <TextView
          color={'text.2'}
          fontSize={'md'}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          {props.title}
        </TextView>
      )}

      <FlatList<TransactionDateGroup>
        data={props.transactionGroups}
        keyExtractor={(item, i) => String(i)}
        ItemSeparatorComponent={() => (
          <LinearLayout
            opacity={0.5}
            borderColor={'text.2'}
            borderWidth={'0.5px'}
            height={'1px'}
          />
        )}
        renderItem={(group) => (
          <LinearLayout>
            <LinearLayout width={'100%'}>
              <FlatList<SenderTransaction>
                data={group.item.groupedTransactions}
                keyExtractor={(item, i) => String(i)}
                ItemSeparatorComponent={() => (
                  <LinearLayout
                    opacity={0.5}
                    borderColor={'text.2'}
                    borderWidth={'0.5px'}
                    borderStyle={'dashed'}
                    height={'1px'}
                  />
                )}
                renderItem={(sender) => (
                  <TransactionComponent
                    item={sender.item}
                    address={props.address}
                    contacts={contacts}
                    currency={currency}
                    language={language}
                  />
                )}
              />
            </LinearLayout>
          </LinearLayout>
        )}
      />
    </LinearLayout>
  )
}

TransactionsList.propTypes = {
  title: PropTypes.string,
  address: PropTypes.string.isRequired,
  transactionGroups: PropTypes.arrayOf(
    PropTypes.instanceOf(TransactionDateGroup).isRequired
  ).isRequired,
}

export default TransactionsList
