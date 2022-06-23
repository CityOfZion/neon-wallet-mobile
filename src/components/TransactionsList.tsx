import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { FlatList, Image } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Normalize } from '~src/app/Normalize'
import { Currency } from '~src/enums/Currency'
import { Lang } from '~src/enums/Lang'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { TokenAsset } from '~src/models/TokenAsset'
import { TransactionDateGroup } from '~src/models/TransactionDateGroup'
import { Contact } from '~src/models/redux/Contact'
import { SenderTransaction } from '~src/models/redux/SenderTransaction'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

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
      Boolean(isReceived(senderTx) && senderTx.doSenderHasContactName(props.contacts)),
      Boolean(!isReceived(senderTx) && senderTx.doReceiverHasContactName(props.contacts)),
    ]

    return conditions.some(it => it)
  }

  const getStatusLabel = (senderTx: SenderTransaction) => {
    if (senderTx.isPending) {
      return i18n.t('components.transactionsList.pending')
    }

    if (isReceived(senderTx)) {
      return i18n.t('components.transactionsList.received')
    }

    return i18n.t('components.transactionsList.sent')
  }

  const getAddressLabel = (senderTx: SenderTransaction) => {
    if (isReceived(senderTx)) {
      return i18n.t('components.transactionsList.receivedFrom')
    }

    return i18n.t('components.transactionsList.sentTo')
  }

  const getAddressOrContact = (senderTx: SenderTransaction) => {
    if (isReceived(senderTx)) {
      const contactStr = senderTx.senderAddressOrContactName(props.contacts)
      if (isClaim(contactStr)) {
        return isClaim(contactStr)
      }
      return senderTx.senderAddressOrContactName(props.contacts)
    }

    return senderTx.receiverAddressOrContactName(props.contacts)
  }

  const isClaim = (contactName: string | null) => {
    if (contactName) {
      return contactName.startsWith('claim')
        ? `Gas ${contactName.charAt(0).toUpperCase()}${contactName.substring(1, contactName.length)}`
        : false
    } else {
      return false
    }
  }

  const navigation = useNavigation<StackNavigationProp<ModalStackParamList>>()

  const todayDate = moment()
  const yesterdayDate = moment().add(-1, 'days')

  const today = moment(todayDate).format(i18n.t('dateFormat.datePretty'))
  const yesterday = moment(yesterdayDate).format(i18n.t('dateFormat.datePretty'))
  return (
    <ButtonView
      onPress={() => {
        navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.TransactionDetails.name,
          params: {
            transaction: props.item,
          },
        })
      }}
    >
      <LinearLayout py={4}>
        <LinearLayout>
          <LinearLayout mb={2} orientation="horiz" justifyContent="space-between">
            <LinearLayout>
              {props.item.isDatetimeValid() && (
                <TextView color="text.0" fontSize="md">
                  {props.item.formattedTime}
                </TextView>
              )}
            </LinearLayout>

            <LinearLayout>
              {props.item.isDatetimeValid() && (
                <TextView color="text.0" fontSize="md">
                  {props.item.formattedDate === today
                    ? i18n.t('components.transactionsList.today')
                    : props.item.formattedDate === yesterday
                    ? i18n.t('components.transactionsList.yesterday')
                    : props.item.formattedDate}
                </TextView>
              )}
            </LinearLayout>
          </LinearLayout>

          <LinearLayout mb={2} orientation="horiz" justifyContent="space-between">
            <LinearLayout width="40%" mr={4}>
              <TextView fontSize="sm" color="text.2">
                {getAddressLabel(props.item)}
              </TextView>
            </LinearLayout>
          </LinearLayout>

          <LinearLayout mb={2} orientation="horiz" justifyContent="space-between">
            <LinearLayout>
              <FlatList<TokenAsset>
                data={props.item.tokens}
                keyExtractor={(item, i) => String(i)}
                renderItem={token => (
                  <LinearLayout width="47%" mr={4} orientation="horiz">
                    {token.index === 0 && (
                      <>
                        {hasContactName(props.item) ? (
                          <TextView
                            fontSize="md"
                            color="text.0"
                            allowFontScaling
                            adjustsFontSizeToFit
                            numberOfLines={1}
                          >
                            {getAddressOrContact(props.item)}
                          </TextView>
                        ) : (
                          <TextView
                            numberOfLines={1}
                            ellipsizeMode="middle"
                            fontSize="md"
                            color="primary"
                            width="200px"
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

            <LinearLayout orientation="horiz">
              <LinearLayout mr={2} alignSelf="center">
                <ImageView
                  width={Normalize.scale(20)}
                  resizeMode="contain"
                  style={{
                    transform: [
                      {
                        rotate: props.item.isReceivedBy(props.address) ? '180deg' : '0deg',
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

              <TextView fontSize="md" color="text.0" allowFontScaling adjustsFontSizeToFit numberOfLines={1}>
                {getStatusLabel(props.item).toUpperCase()}
              </TextView>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>

        <LinearLayout orientation="horiz" justifyContent="space-between">
          <LinearLayout width="27%" mr={4}>
            <TextView fontSize="sm" color="text.2">
              {i18n.t('components.transactionsList.token')}
            </TextView>
          </LinearLayout>

          <LinearLayout mr={4}>
            <TextView fontSize="sm" color="text.2">
              {i18n.t('components.transactionsList.quantity')}
            </TextView>
          </LinearLayout>

          <LinearLayout weight={1} alignSelf="flex-end">
            <TextView fontSize="sm" textAlign="right" color="text.2">
              {i18n.t('components.transactionsList.value')}
            </TextView>
          </LinearLayout>
        </LinearLayout>

        <LinearLayout>
          <FlatList<TokenAsset>
            data={props.item.tokens}
            keyExtractor={(item, i) => String(i)}
            listKey={props.item.transactionHash ?? ''}
            renderItem={token => (
              <LinearLayout orientation="horiz">
                <LinearLayout mr={4} width="27%">
                  <LinearLayout orientation="horiz" alignItems="center">
                    <Image
                      width={18}
                      height={18}
                      resizeMode="contain"
                      resizeMethod="resize"
                      style={{
                        resizeMode: 'contain',
                        marginRight: 6,
                        width: 18,
                        height: 18,
                      }}
                      source={token.item.srcIcon}
                    />
                    <TextView fontSize="md" color="text.0">
                      {token.item.symbol}
                    </TextView>
                  </LinearLayout>
                </LinearLayout>

                <LinearLayout alignContent="flex-start">
                  <TextView
                    color="text.0"
                    fontSize="md"
                    textAlign="right"
                    fontFamily="semibold"
                    allowFontScaling
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {token.item.amount.toFixed(8) ?? ''}
                  </TextView>
                </LinearLayout>

                <LinearLayout weight={2} alignSelf="flex-end">
                  <TextView
                    color="primary"
                    fontSize="md"
                    textAlign="right"
                    fontFamily="semibold"
                    allowFontScaling
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {FilterHelper.currency(
                      token.item.exchangeToken(props.currency),
                      props.currency,
                      props.language,
                      2,
                      8
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

const TransactionsList: React.FC<Props> = props => {
  const { contacts } = useSelector((state: RootState) => state.app)
  const { currency, language } = useSelector((state: RootState) => state.settings)
  return (
    <LinearLayout>
      {props.title && Boolean(props.transactionGroups.length) && (
        <TextView color="text.2" fontSize="md" allowFontScaling adjustsFontSizeToFit numberOfLines={1}>
          {props.title}
        </TextView>
      )}

      <FlatList<TransactionDateGroup>
        data={props.transactionGroups}
        keyExtractor={(item, i) => String(i)}
        ItemSeparatorComponent={() => (
          <LinearLayout opacity={0.5} borderColor="text.2" borderWidth="0.5px" height="1px" />
        )}
        renderItem={group => (
          <LinearLayout>
            <LinearLayout width="100%">
              <FlatList<SenderTransaction>
                data={group.item.groupedTransactions}
                keyExtractor={(item, i) => String(i)}
                ItemSeparatorComponent={() => (
                  <LinearLayout
                    opacity={0.5}
                    borderColor="text.2"
                    borderWidth="0.5px"
                    borderStyle="dashed"
                    height="1px"
                  />
                )}
                renderItem={sender => (
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
  transactionGroups: PropTypes.arrayOf(PropTypes.instanceOf(TransactionDateGroup).isRequired).isRequired,
}

export default TransactionsList
