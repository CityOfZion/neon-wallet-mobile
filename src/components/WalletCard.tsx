import React, {Fragment} from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import {TokenValue} from '~src/models/TokenValue'
import {Wallet} from '~src/models/redux/Wallet'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface WalletCardProps {
  wallet: Wallet
  height?: number
  onPress?: () => void
}

const WalletCard = (props: WalletCardProps) => {
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const _renderAccountCard = (asset: TokenValue, i: number) => {
    if (!asset || i > 2) return null
    const bottomOffset = 28 - 6 * i

    return (
      <LinearLayout
        position={'absolute'}
        bottom={`${bottomOffset}px`}
        right={'6px'}
        height={'90%'}
        width={'90%'}
        borderRadius={18}
        bg={asset.color}
        key={i}
      />
    )
  }

  const _renderAssetsBarFills = () => {
    return props.wallet.currentAssets?.assets.map((asset, i) => {
      const holdingValue = asset.holding * asset.value
      const percentageOfTotal = (holdingValue / props.wallet.currentValue) * 100

      if (!holdingValue) return null

      return (
        <LinearLayout
          height={'100%'}
          weight={percentageOfTotal}
          minWidth={'2px'}
          mx={'1px'}
          borderRadius={9999}
          bg={asset.color}
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

  const AccountContainer = () => {
    const accounts = props.wallet.getAccounts(accountsPool)
    if (props.wallet.walletType === 'standard')
      return (
        <Fragment>
          <LinearLayout
            position={'absolute'}
            ml={Facade.utils.isAndroid ? '-46%' : '-57%'}
            p={'3px'}
            mt={Facade.utils.isAndroid ? '0px' : '-16px'}
            width={Facade.utils.isAndroid ? height : height - 28}
            height={'100%'}
            style={{transform: [{rotate: '90deg'}]}}
          >
            <AccountCard hideQRCode={true} account={accounts[0]} />
          </LinearLayout>
          {accounts.length > 1 && (
            <LinearLayout
              position={'absolute'}
              ml={Facade.utils.isAndroid ? '-47%' : '-58%'}
              p={'3px'}
              mt={Facade.utils.isAndroid ? '1px' : '-12px'}
              width={Facade.utils.isAndroid ? height : height - 28}
              height={'102%'}
              style={{transform: [{rotate: '90deg'}]}}
            >
              <AccountCard hideQRCode={true} account={accounts[1]} />
            </LinearLayout>
          )}
          {accounts.length > 2 && (
            <LinearLayout
              position={'absolute'}
              ml={Facade.utils.isAndroid ? '-46%' : '-59%'}
              p={'3px'}
              mt={Facade.utils.isAndroid ? '2px' : '-8px'}
              width={Facade.utils.isAndroid ? height - 8 : height - 28}
              height={'104%'}
              style={{transform: [{rotate: '90deg'}]}}
            >
              <AccountCard hideQRCode={true} account={accounts[2]} />
            </LinearLayout>
          )}
        </Fragment>
      )
    else {
      return (
        <LinearLayout
          ml={Facade.utils.isAndroid ? '-47%' : '-57%'}
          p={'3px'}
          mt={Facade.utils.isAndroid ? '0px' : '-12px'}
          width={Facade.utils.isAndroid ? height : height - 28}
          height={'100%'}
          style={{transform: [{rotate: '90deg'}]}}
        >
          <AccountCard hideQRCode={true} account={accounts[0]} />
        </LinearLayout>
      )
    }
  }

  const height = props.height ?? 350
  return (
    <WalletCardRelativeContainer
      flex={1}
      position="relative"
      m={'24px'}
      height={props.height ?? 350}
      bg={colorLimedSpruce}
      onPress={() => props.onPress && props.onPress()}
      activeOpacity={1}
    >
      {props.wallet.currentAssets?.assets.map((a, i) =>
        _renderAccountCard(a, i)
      )}
      <AccountContainer />
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
