import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {FlatList, Keyboard} from 'react-native'
import {useSelector} from 'react-redux'

import {Normalize} from '../app/Normalize'

import SwiperPanel, {
  PANEL_OFFSET,
  SwiperController,
  useSwiperController,
} from '~src/components/SwiperPanel'
import {SearchBar} from '~src/components/input/SearchBar'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface ListTokenModalParams {
  selectedToken: TokenAsset | null | undefined
  setToken: React.Dispatch<React.SetStateAction<TokenAsset | null | undefined>>
  account?: Account
  filterBy?: 'send' | 'receive'
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ListTokenModal'>
}

const Item = (props: {
  controller: SwiperController
  item: TokenAsset
  setToken: React.Dispatch<React.SetStateAction<TokenAsset | null | undefined>>
}) => {
  return (
    <ButtonView
      py="12px"
      orientation="horiz"
      alignItems="center"
      onPress={() => {
        props.setToken(props.item)
        props.controller.close()
      }}
    >
      <ImageView
        height="29px"
        width="29px"
        alignSelf="center"
        mr="12px"
        resizeMode="contain"
        source={props.item.srcIcon}
      />
      <TextView fontFamily="bold" fontSize="18px" color="text.0" weight={1}>
        {props.item.symbol}
      </TextView>

      <LinearLayout orientation="vert" mr="15px">
        <TextView
          textAlign="right"
          fontFamily="medium"
          fontSize="14px"
          color="text.2"
        >
          {i18n.t('modals.listTokenModal.holding')}
        </TextView>

        <TextView
          textAlign="right"
          fontFamily="bold"
          fontSize="18px"
          color="text.0"
        >
          {props.item.amount.toString(10)}
        </TextView>
      </LinearLayout>

      <ImageView
        mt={4}
        width={Normalize.scale(26)}
        height={Normalize.scale(26)}
        resizeMode={'contain'}
        source={require('~src/assets/images/green_plus.png')}
      />
    </ButtonView>
  )
}

const ListTokenModal: React.FC<Props> = (props: Props) => {
  const controller = useSwiperController(true)
  const {tokens} = useSelector((state: RootState) => state.app)

  const [tokenList, setTokenList] = useState<TokenAsset[]>([])

  const {account} = props.route.params
  const filterBy = props.route.params.filterBy ?? 'receive'

  const [searchTokens, setSearchTokens] = useState<TokenAsset[]>([])

  const forceCloseKeyboard = () => {
    Keyboard.dismiss()
  }

  useEffect(() => {
    forceCloseKeyboard()
  }, [])

  useEffect(() => {
    populate()
  }, [filterBy])

  useEffect(() => {
    setSearchTokens(tokenList)
  }, [tokenList])

  const populate = async () => {
    if (filterBy === 'send') {
      setTokenList(account?.tokenAssets ?? tokens)
    } else if (account?.tokenAssets) {
      const newTokenList: TokenAsset[] = []

      tokens.forEach((token) => {
        if (token.name !== '\u0000') {
          const tokenFromAccount = account.tokenAssets.find(
            (it) => it.hash === token.hash
          )
          if (tokenFromAccount) {
            newTokenList.push(tokenFromAccount)
          } else {
            newTokenList.push(token)
          }
        }
      })
      setTokenList(newTokenList)
    } else {
      setTokenList(tokens)
    }
  }

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.listTokenModal.tokens')}
      rightButton={<ThemedCloseButton onPress={controller.close} />}
      onRightPress={controller.close}
      paddingTop={4}
      paddingRight={16}
      paddingLeft={16}
      smallerSize={true}
      onClose={props.navigation.goBack}
      disableDefaultScrollView={true}
      solidColorBG={true}
    >
      <LinearLayout weight={1} width="100%" pb={PANEL_OFFSET}>
        <TextView
          textAlign="center"
          fontFamily="medium"
          fontSize={18}
          color="text.0"
        >
          {i18n.t('modals.listTokenModal.selectToken')}
        </TextView>
        <SearchBar
          lighterColor={true}
          marginH={-5}
          prevData={tokenList}
          dispatchData={setSearchTokens}
          callbackFilter={(searchText) => {
            const filterToken = tokenList.filter((sToken) => {
              return (
                sToken.name.includes(searchText) ||
                sToken.symbol.includes(searchText)
              )
            })
            setSearchTokens(filterToken)
          }}
        />
        <FlatList
          data={searchTokens}
          keyExtractor={(item) => item.symbol}
          ItemSeparatorComponent={() => (
            <LinearLayout bg="background.10" height={1} />
          )}
          renderItem={({item}) => (
            <Item
              controller={controller}
              item={item}
              setToken={props.route.params.setToken}
            />
          )}
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
