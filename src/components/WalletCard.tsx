import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  wallet: Wallet
  height?: number
  onPress?: () => void
}

const WalletCard: React.FC<Props> = (props) => {
  const {accounts, exchange} = useSelector((state: RootState) => state.app)
  const {currency} = useSelector((state: RootState) => state.settings)

  const getWalletAccounts = () => {
    return props.wallet.getAccounts(accounts)
  }

  const getTotalAmount = () => {
    return Facade.lodash.sumBy(getWalletAccounts(), (it) =>
      it.exchangeBalanceAmount(currency, exchange)
    )
  }

  const _renderAccountCard = (account: Account, i: number) => {
    if (!account) return null
    const bottomOffset = 28 - 6 * i

    return (
      <LinearLayout
        position={'absolute'}
        bottom={`${bottomOffset}px`}
        right={'6px'}
        height={'90%'}
        width={'90%'}
        borderRadius={18}
        bg={account.backgroundColor}
        key={account.address ?? ''}
      />
    )
  }

  const _renderAssetsBarFills = () => {
    return getWalletAccounts().map((account, i) => {
      const amount = account.exchangeBalanceAmount(currency, exchange)
      const percentageOfTotal = (amount / getTotalAmount()) * 100

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
    })
  }

  const WalletOverlay = () => {
    return props.wallet.walletType === 'standard' ? (
      <ImageView
        width={'100%'}
        height={'100%'}
        resizeMode={'stretch'}
        source={require('~src/assets/images/wallet-card-front.png')}
      />
    ) : (
      <ImageView
        width={'100%'}
        position={'absolute'}
        bottom={0}
        resizeMode={'stretch'}
        source={require('~src/assets/images/wallet-semi-front.png')}
      />
    )
  }

  const WalletLabel = () => {
    return (
      <RelativeLayout height={58} width={'100%'} mb={15}>
        {props.wallet.walletType === 'standard' ? (
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
                {props.wallet.name?.toUpperCase()}
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
            {props.wallet.walletType === 'watch' ? (
              <ImageView
                top={15}
                left={15}
                width={26}
                height={26}
                resizeMode={'contain'}
                source={require('~src/assets/images/icon-watch-grey.png')}
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

  return (
    <WalletCardRelativeContainer
      position="relative"
      height={props.height ?? 350}
      m="12px"
      bg={colorLimedSpruce}
      onPress={() => props.onPress && props.onPress()}
      activeOpacity={1}
    >
      {getWalletAccounts().map((a, i) => _renderAccountCard(a, i))}

      <WalletOverlay />
      <LinearLayout position={'absolute'} bottom={40} width={'80%'}>
        <WalletLabel />
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
            {_renderAssetsBarFills()}
          </AssetsBar>
        </RelativeLayout>
      </LinearLayout>
    </WalletCardRelativeContainer>
  )
}

WalletCard.propTypes = {
  wallet: PropTypes.instanceOf(Wallet).isRequired,
  height: PropTypes.number,
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
`

const AssetsBar = styled(LinearLayout)``

export default WalletCard
