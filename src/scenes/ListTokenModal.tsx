import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, Keyboard } from 'react-native'

import { useTokens } from '../hooks/useTokens'

import { Normalize } from '~src/app/Normalize'
import { SearchBar } from '~src/components/SearchBar'
import SwiperPanel, { PANEL_OFFSET, SwiperController, useSwiperController } from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import { TokenAsset } from '~src/models/TokenAsset'
import { Account } from '~src/models/redux/Account'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ButtonView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface ListTokenModalParams {
  onChangeToken(token: TokenAsset): void
  account: Account
  filterBy?: 'send' | 'receive'
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ListTokenModal'>
}

const Item = (props: { controller: SwiperController; item: TokenAsset; onChangeToken(token: TokenAsset): void }) => {
  return (
    <ButtonView
      py="12px"
      orientation="horiz"
      alignItems="center"
      onPress={() => {
        props.onChangeToken(props.item)
        props.controller.close()
      }}
    >
      <ImageView
        height={Normalize.scale(29)}
        width={Normalize.scale(29)}
        alignSelf="center"
        mr="12px"
        resizeMode="contain"
        source={props.item.srcIcon}
      />
      <TextView fontFamily="bold" fontSize="18px" color="text.0" weight={1}>
        {props.item.symbol}
      </TextView>

      <LinearLayout mr="15px">
        <TextView textAlign="right" fontFamily="medium" fontSize="14px" color="text.2">
          {i18n.t('modals.listTokenModal.holding')}
        </TextView>

        <TextView textAlign="right" fontFamily="bold" fontSize="18px" color="text.0">
          {props.item.amount.toString(10)}
        </TextView>
      </LinearLayout>

      <ImageView
        mt={4}
        width={Normalize.scale(26)}
        height={Normalize.scale(26)}
        resizeMode="contain"
        source={require('~src/assets/images/green_plus.png')}
      />
    </ButtonView>
  )
}

const ListTokenModal: React.FC<Props> = (props: Props) => {
  const { account, filterBy = 'receive' } = props.route.params

  const controller = useSwiperController(true)
  const tokens = useTokens({ blockchain: account.blockchain })

  const [filter, setFilter] = useState('')

  const tokenList = useMemo(() => {
    if (filterBy === 'receive') {
      return tokens.map(token => {
        const accountToken = account.tokenAssets.find(it => it.hash === token.hash)

        return accountToken ?? token
      })
    }

    return account.tokenAssets
  }, [filterBy, account, tokens])

  const filteredTokens = useMemo(() => {
    if (!filter) return tokenList

    return tokenList.filter(token => token.name.includes(filter) || token.symbol.includes(filter))
  }, [filter, tokenList])

  useEffect(() => {
    Keyboard.dismiss()
  }, [])

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.listTokenModal.tokens')}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onRightPress={controller.close}
      paddingTop={4}
      paddingRight={16}
      paddingLeft={16}
      smallerSize
      onClose={props.navigation.goBack}
      disableDefaultScrollView
      solidColorBG
    >
      <LinearLayout weight={1} width="100%" pb={PANEL_OFFSET}>
        <TextView textAlign="center" fontFamily="medium" fontSize={18} color="text.0">
          {filterBy === 'send'
            ? i18n.t('modals.listTokenModal.selectTokenSend')
            : i18n.t('modals.listTokenModal.selectTokenReceive')}
        </TextView>
        <SearchBar lighterColor marginX={-5} onFilter={setFilter} />

        <FlatList
          data={filteredTokens}
          keyExtractor={item => item.symbol}
          ItemSeparatorComponent={() => <LinearLayout bg="background.10" height={1} />}
          renderItem={({ item }) => (
            <Item controller={controller} item={item} onChangeToken={props.route.params.onChangeToken} />
          )}
          ListEmptyComponent={
            <TextView fontWeight="500" color="text.0" fontSize={18} pt={5} textAlign="center">
              {i18n.t('persistContact.noResultsFound')}
            </TextView>
          }
        />
      </LinearLayout>
    </SwiperPanel>
  )
}

ListTokenModal.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default ListTokenModal
