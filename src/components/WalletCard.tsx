import React, {useState} from 'react'
import {useNavigation} from '@react-navigation/native'

import {TokenValue} from '~src/models/TokenValue'
import {Wallet} from '~src/models/Wallet'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'
import {ROUTES} from '~/constants'
import {Account} from '~src/models/Account'
import {mockWalletAccounts} from '~src/mockWalletAccounts'

interface WalletCardProps {
  wallet: Wallet
}

const WalletCard = (props: WalletCardProps) => {
  const navigation = useNavigation()
  const [accounts, setAccounts] = useState<Account[]>(mockWalletAccounts)

  const _renderAccountCard = (asset: TokenValue, i: number) => {
    if (!asset || i > 2) return null
    const bottomOffset = 28 - 6 * i

    return (
      <AccountCard
        position={'absolute'}
        bottom={`${bottomOffset}px`}
        right={'6px'}
        height={'90%'}
        width={'90%'}
        bg={asset.color}
        key={i}
      />
    )
  }

  const _renderAssetsBarFills = () => {
    return props.wallet.currentAssets.assets.map((asset, i) => {
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

  return (
    <WalletCardRelativeContainer
      position="relative"
      height={350}
      m="12px"
      bg={colorLimedSpruce}
      onPress={() => navigation.navigate(ROUTES.GET_WALLET.name, {wallet: accounts})}
    >
      {props.wallet.currentAssets.assets.map((a, i) =>
        _renderAccountCard(a, i)
      )}
      <WalletFrontImage
        height={'100%'}
        width={'100%'}
        source={require('~src/assets/images/wallet-card-front.png')}
      />
      <RelativeLayout bottom={130} height={58} width={4 / 5}>
        <WalletNameContainer
          height={'100%'}
          width={'100%'}
          source={require('~src/assets/images/wallet-card-label.png')}
        />
        <LinearLayout bottom={30} orientation="horiz" my={'auto'}>
          <ImageView
            ml="12px"
            width={28}
            height={24}
            source={require('~src/assets/images/wallet-icon.png')}
          />
          <TextView ml="8px" fontSize="16px" fontFamily="bold" color="text.0">
            {props.wallet.title.toUpperCase()}
          </TextView>
        </LinearLayout>
      </RelativeLayout>
      <RelativeLayout bottom={110} height={12} width={4 / 5}>
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
    </WalletCardRelativeContainer>
  )
}

const colorLimedSpruce = '#364046'

const WalletFrontImage = styled(ImageView)`
  resize-mode: stretch;
`

const WalletNameContainer = styled(ImageView)`
  resize-mode: contain;
`

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

const AccountCard = styled(LinearLayout)`
  border-radius: 18px;
`

const AssetsBar = styled(LinearLayout)``

export default WalletCard
