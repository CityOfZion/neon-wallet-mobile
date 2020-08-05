import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {FlatList} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  PANEL_OFFSET,
  useSwiperController,
} from '~src/components/SwiperPanel'
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
  selectedToken: TokenAsset | null
  setToken: React.Dispatch<React.SetStateAction<TokenAsset | null>>
  account?: Account
  filterBy?: 'send' | 'receive'
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ListTokenModal'>
}

const ListTokenModal: React.FC<Props> = (props: Props) => {
  const controller = useSwiperController(true)
  const {tokens} = useSelector((state: RootState) => state.app)

  const [tokenList, setTokenList] = useState<TokenAsset[]>([])
  const filterBy = props.route.params.filterBy ?? 'receive'

  useEffect(() => {
    populate()
  }, [filterBy])

  const populate = async () => {
    const tokensFromAccount = await props.route.params.account?.generateTokenAssets()

    if (filterBy === 'send') {
      setTokenList(tokensFromAccount ?? tokens)
    } else {

      if (tokensFromAccount) {
        const newTokenList: TokenAsset[] = []
        tokens.forEach((token) => {
          const tokenFromAccount = tokensFromAccount.find(
            (it) => it.hash === token.hash
          )
          if (tokenFromAccount) {
            newTokenList.push(tokenFromAccount)
          } else {
            newTokenList.push(token)
          }
        })
        setTokenList(newTokenList)
      } else {
        setTokenList(tokens)
      }
    }
  }

  const Item = (item: TokenAsset) => {
    return (
      <ButtonView
        py="12px"
        orientation="horiz"
        alignItems="center"
        onPress={() => {
          props.route.params.setToken(item)
          controller.close()
        }}
      >
        <ImageView
          height="29px"
          width="29px"
          alignSelf="center"
          mr="12px"
          source={item.srcIcon}
        />
        <TextView fontFamily="bold" fontSize="18px" color="text.0" weight={1}>
          {item.symbol}
        </TextView>

        <LinearLayout orientation="vert" mr="15px">
          <TextView
            alignItems="flex-end"
            fontFamily="medium"
            fontSize="14px"
            color="text.2"
          >
            {Facade.t('modals.listTokenModal.holding')}
          </TextView>

          <TextView fontFamily="bold" fontSize="18px" color="text.0">
            {item.holding}
          </TextView>
        </LinearLayout>

        <ImageView source={require('~src/assets/images/green_plus.png')} />
      </ButtonView>
    )
  }

  return (
    <SwiperPanel
      controller={controller}
      title={Facade.t('modals.listTokenModal.tokens')}
      rightButton={CloseButton()}
      onRightPress={() => controller.close()}
      paddingTop={60}
      paddingRight={16}
      paddingLeft={16}
      fullSize={true}
      image={require('~/src/assets/images/token_icon.png')}
      onClose={props.navigation.goBack}
      disableDefaultScrollView={true}
    >
      <LinearLayout weight={1} width="100%" pb={PANEL_OFFSET}>
        <TextView
          textAlign="center"
          fontFamily="medium"
          fontSize={18}
          mb="8px"
          color="text.0"
        >
          {Facade.t('modals.listTokenModal.selectToken')}
        </TextView>
        <FlatList
          contentContainerStyle={{
            paddingTop: 18,
          }}
          data={tokenList}
          keyExtractor={(item) => item.symbol}
          ItemSeparatorComponent={() => <LinearLayout bg="text.3" height={1} />}
          renderItem={({item}) => Item(item)}
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
