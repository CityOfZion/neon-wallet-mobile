import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

import {Facade} from '~src/app/Facade'
import {
  Receiver,
  Transaction,
  TransactionModel,
  Asset,
} from '~src/models/TransactionModel'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  transactionModel?: TransactionModel
  isHistory?: boolean
  index?: number
  lastIndex?: number
}
const TransactionsList: React.FC<Props> = (props) => {
  const _renderTransaction = () => {
    if (props.transactionModel && props.transactionModel.transactions) {
      return props.transactionModel.transactions.map(
        (transaction: Transaction, index: number) => {
          return (
            <LinearLayout orientation="horiz" key={index}>
              <LinearLayout orientation="vert" mr="8px" mt="5px">
                {index === 0 && (
                  <ImageView
                    alignSelf="center"
                    source={
                      props.transactionModel &&
                      props.transactionModel.srcIcon &&
                      props.isHistory
                        ? props.transactionModel.srcIcon
                        : require('~src/assets/images/clock-white.png')
                    }
                  />
                )}
              </LinearLayout>
              <LinearLayout weight={1} orientation="vert">
                {index === 0 && (
                  <LinearLayout orientation="vert">
                    <TextView fontSize="14px" color="text.2" mb="-2px">
                      {props.isHistory && props.transactionModel
                        ? 'Sent'
                        : Facade.t('components.transactionsList.pending')}
                    </TextView>
                    <TextView fontSize="16px" color="text.0">
                      {props.isHistory &&
                      props.transactionModel &&
                      props.transactionModel.date
                        ? '22:09'
                        : '00:00'}
                    </TextView>
                  </LinearLayout>
                )}
              </LinearLayout>

              <LinearLayout weight={3} orientation="vert">
                {index === 0 && (
                  <LinearLayout orientation="horiz">
                    <TextView weight={1} fontSize="14px" color="text.2">
                      {Facade.t('components.transactionsList.sentTo')}
                    </TextView>
                    <TextView weight={1.1} fontSize="14px" color="text.2">
                      {Facade.t('components.transactionsList.value')}
                    </TextView>
                  </LinearLayout>
                )}

                {_renderReceivers(transaction, index)}
              </LinearLayout>
            </LinearLayout>
          )
        }
      )
    }
  }

  const _renderReceivers = (transaction: Transaction, indexTrans: number) => {
    if (transaction?.receiver) {
      return transaction.receiver.map((receiver: Receiver, index: number) => {
        return (
          <LinearLayout orientation="verti" key={index}>
            {transaction?.receiver &&
              (index > 0 || indexTrans > 0) &&
              transaction.receiver.length > 1 && (
                <LinearLayout
                  mt="10px"
                  mb="10px"
                  borderStyle="dotted"
                  borderColor="text.2"
                  borderWidth={0.4}
                />
              )}
            <LinearLayout orientation="horiz">
              {receiver.isAddress ? (
                <TextView
                  mr="10px"
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  weight={1}
                  fontSize="16px"
                  color="primary"
                >
                  {receiver.nameOrAdress}
                </TextView>
              ) : (
                <TextView weight={1} fontSize="16px" color="text.0">
                  {receiver.nameOrAdress}
                </TextView>
              )}
              <LinearLayout orientation="verti">
                {_renderAssets(receiver)}
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        )
      })
    }
  }

  const _renderAssets = (rec: Receiver) => {
    if (rec.assets) {
      return rec.assets.map((asset: Asset, index: number) => {
        return (
          <LinearLayout orientation="horiz" mb="5px" key={index}>
            <ImageView
              height="17px"
              width="17px"
              alignSelf="center"
              mr="4px"
              source={asset.srcIcon}
            />
            <TextView fontSize="16px" color="text.0" marginRight="30px">
              {asset.nameSymbol}
            </TextView>
            <TextView fontSize="14px" color="text.2">
              {asset.value}
            </TextView>
          </LinearLayout>
        )
      })
    }
  }

  return (
    <LinearLayout orientation="verti">
      {props.index === 0 && (
        <TextView
          color="text.2"
          fontSize="14px"
          fontFamily="medium"
          mb="12px"
          mt="26px"
        >
          {props.isHistory &&
          props.transactionModel &&
          props.transactionModel.date
            ? moment(props.transactionModel.date).format('MMMM Do, YYYY')
            : Facade.t('components.transactionsList.title')}
        </TextView>
      )}
      {_renderTransaction()}
      {props.index != props.lastIndex && (
        <LinearLayout
          mt="10px"
          mb="10px"
          borderStyle="solid"
          borderColor="text.2"
          borderWidth={0.4}
        />
      )}
    </LinearLayout>
  )
}

TransactionsList.propTypes = {
  transactionModel: PropTypes.instanceOf(TransactionModel),
  isHistory: PropTypes.bool,
  index: PropTypes.number,
  lastIndex: PropTypes.number,
}

TransactionsList.defaultProps = {
  index: 0,
  lastIndex: 0,
}

export default TransactionsList
