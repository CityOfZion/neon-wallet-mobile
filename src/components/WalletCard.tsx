import PropTypes from 'prop-types'
import React, {Fragment, useEffect, useState} from 'react'
import {LayoutChangeEvent} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import {Currency} from '~src/enums/Currency'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'
import {Exchange} from '~src/types/exchange'

interface Props {
  wallet: Wallet
  width?: number
  onPress?: () => void
}

const WalletLabel = (props: {walletType: string; walletName: string}) => {
  return (
    <RelativeLayout height={58} width={'100%'} mb={15}>
      {props.walletType === 'standard' ? (
        <Fragment>
          <ImageView
            height={'100%'}
            width={'100%'}
            resizeMode={'contain'}
            source={require('~src/assets/images/wallet-card-label.png')}
          />
          <LinearLayout bottom={40} orientation="horiz" alignItems={'center'}>
            <ImageView
              ml="12px"
              width={28}
              height={24}
              resizeMode={'contain'}
              source={require('~src/assets/images/wallet-icon.png')}
            />
            <TextView
              ml="8px"
              width={'70%'}
              fontSize="16px"
              fontFamily="bold"
              color="text.0"
              allowFontScaling={true}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
            >
              {props.walletName?.toUpperCase()}
            </TextView>
          </LinearLayout>
        </Fragment>
      ) : (
        <Fragment>
          <ImageView
            position={'absolute'}
            left={0}
            source={require('~src/assets/images/wallet-icon-label.png')}
          />
          {props.walletType === 'watch' ? (
            <ImageView
              top={15}
              left={15}
              width={26}
              height={26}
              resizeMode={'contain'}
              source={require('~src/assets/images/icon-watch-green.png')}
            />
          ) : (
            <ImageView
              top={12}
              left={12}
              width={36}
              height={32}
              resizeMode={'contain'}
              source={require('~src/assets/images/icon-legacy-grey.png')}
            />
          )}
        </Fragment>
      )}
    </RelativeLayout>
  )
}

const AssetBarFillsComponent = (props: {
  walletAccounts: Account[]
  currency: Currency
  exchange: Exchange
  getTotalAmount: () => number
}) => {
  return (
    <Fragment>
      {props.walletAccounts.map((account, i) => {
        const amount = account.exchangeBalanceAmount(
          props.currency,
          props.exchange
        )
        const percentageOfTotal = (amount / props.getTotalAmount()) * 100

        return (
          <LinearLayout
            height={'100%'}
            weight={percentageOfTotal}
            minWidth={'2px'}
            mx={'1px'}
            borderRadius={9999}
            bg={account.backgroundColor}
            key={i}
          />
        )
      })}
    </Fragment>
  )
}

const WalletOverlay = (props: {walletType: string}) => {
  const overlayImage =
    props.walletType === 'standard'
      ? require('~src/assets/images/wallet-card-front.png')
      : require('~src/assets/images/wallet-semi-front.png')
  const height = props.walletType === 'standard' ? '100%' : '75%'

  return (
    <ImageView
      width={'100%'}
      height={height}
      position={'absolute'}
      bottom={'-2px'}
      resizeMode={'stretch'}
      source={overlayImage}
    />
  )
}

const AccountContainer = (props: {
  viewHeight: number
  account: Account
  index: number
}) => {
  const ratio = 38 / 25
  const cardWidth = props.viewHeight - 12
  const cardHeight = cardWidth / ratio

  return (
    <LinearLayout
      mt={`${props.index * 4}px`}
      position={'absolute'}
      style={{
        top: 3 + cardHeight * ratio * 0.5,
        left: 5 + cardHeight * 0.5,
      }}
    >
      <RelativeLayout
        width={cardWidth}
        style={{
          top: -cardHeight * 0.5,
          left: -(cardHeight * ratio) * 0.5,
          transform: [{rotate: '90deg'}],
        }}
      >
        <AccountCard
          hideQRCode={true}
          hideBalance={true}
          hasShadow={false}
          account={props.account}
        />
      </RelativeLayout>
    </LinearLayout>
  )
}

const WalletCard: React.FC<Props> = (props) => {
  const {wallets, accounts, exchange} = useSelector(
    (state: RootState) => state.app
  )
  const {currency} = useSelector((state: RootState) => state.settings)

  const [viewHeight, setViewHeight] = useState<number>(0)
  const [walletAccounts, setWalletAccounts] = useState<Account[]>([])

  useEffect(() => {
    setWalletAccounts(props.wallet.getAccounts(accounts))
  }, [wallets, accounts])

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)
  }

  const getTotalAmount = () => {
    return Facade.lodash.sumBy(walletAccounts, (it) =>
      it.exchangeBalanceAmount(currency, exchange)
    )
  }

  return (
    <WalletCardRelativeContainer
      position="relative"
      width={props.width}
      bg={colorLimedSpruce}
      activeOpacity={1}
      onPress={() => props.onPress && props.onPress()}
      onLayout={layoutEvent}
      style={{
        aspectRatio: 25 / 38,
      }}
    >
      {walletAccounts.slice(0, 10).map((it, i) => (
        <AccountContainer
          key={i}
          viewHeight={viewHeight}
          account={it}
          index={i}
        />
      ))}

      <WalletOverlay walletType={props.wallet.walletType ?? ''} />

      <LinearLayout position={'absolute'} bottom={40} width={'80%'}>
        <WalletLabel
          walletName={props.wallet.name ?? ''}
          walletType={props.wallet.walletType ?? ''}
        />
        <RelativeLayout height={12} width={'100%'}>
          <AssetsBarBackground
            height={'10px'}
            width={'100%'}
            source={require('~src/assets/images/wallet-card-label.png')}
          />
          <AssetsBar
            bottom={'7px'}
            height={'5px'}
            width={'99.5%'}
            px={'2px'}
            orientation={'horiz'}
          >
            <AssetBarFillsComponent
              walletAccounts={walletAccounts}
              currency={currency}
              exchange={exchange}
              getTotalAmount={getTotalAmount}
            />
          </AssetsBar>
        </RelativeLayout>
      </LinearLayout>
    </WalletCardRelativeContainer>
  )
}

WalletCard.propTypes = {
  wallet: PropTypes.instanceOf(Wallet).isRequired,
  width: PropTypes.number,
  onPress: PropTypes.func,
}

const colorLimedSpruce = '#364046'

const AssetsBarBackground = styled(ImageView)`
  resize-mode: cover;
  border-top-right-radius: 9999px;
  border-bottom-right-radius: 9999px;
`

const WalletCardRelativeContainer = styled(ButtonView)`
  border-radius: 18px;
  shadow-color: #fff;
  shadow-offset: { width: 0, height: 6 };
  shadow-opacity: 0.39;
  shadow-radius: 8.3px;
  elevation: 13;
  overflow: hidden;
`

const AssetsBar = styled(LinearLayout)``

export default WalletCard
