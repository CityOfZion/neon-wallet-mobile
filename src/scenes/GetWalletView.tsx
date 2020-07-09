import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'

import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {mockWalletAccounts} from '~src/mocks/mockWalletAccounts'
import {Account} from '~src/models/Account'
import {NeoNode} from '~src/models/NeoNode'
import {QuickToolsStackParamList} from '~src/navigation/QuickToolsStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface GetWalletProps {
  navigation: StackNavigationProp<QuickToolsStackParamList>
}

const GetWalletView = (props: GetWalletProps) => {
  const [accounts, setAccounts] = useState<Account[]>(mockWalletAccounts)
  const [nodes, setNodes] = useState<NeoNode[]>([])

  useEffect(() => {
    populate()
  }, [])

  const populate = async () => {
    setNodes(await NeoNode.getAllNodes())
  }

  const _renderTitle: React.FC = () => {
    return (
      <LinearLayout alignItems="center" justifyContent="center">
        <TextView color={'text.3'} textAlign={'center'} fontSize={10}>
          {Facade.t('app.neoBlockHeight')}
        </TextView>

        <TextView color={'text.0'} textAlign={'center'}>
          {nodes[0] &&
            Facade.filter.currency(nodes[0].height, '', false, false)}
        </TextView>
      </LinearLayout>
    )
  }

  const _renderAccountCards = () => {
    return accounts.map((account: Account, i: number) => {
      const marginTop = i !== 0 ? Facade.scale(-130) : undefined

      return (
        <LinearLayout key={i} marginTop={marginTop}>
          <AccountCard
            account={account}
            isCompacted={true}
            isStackMode={i !== accounts.length - 1}
            onPress={() =>
              props.navigation.navigate(Facade.path.GetAccount.name, {
                account,
                headerTitle: _renderTitle,
                actionTitle: Facade.t('app.edit'),
                // TODO: Edit event
                actionOnPress: () => {},
              })
            }
          />
        </LinearLayout>
      )
    })
  }

  return (
    <ScreenLayout>
      <LinearLayout mt={4}>{_renderAccountCards()}</LinearLayout>

      <LinearLayout
        my={6}
        orientation="horiz"
        width="100%"
        alignItems="center"
        justifyContent="center"
        borderStyle="dashed"
        borderColor="text.0"
        borderRadius={17}
        borderWidth={1}
        style={{
          aspectRatio: 38 / 25,
        }}
      >
        <ImageView source={require('~src/assets/images/icon-plus-white.png')} />

        <TextView color="white" fontSize={18} mt={2} ml={3} fontFamily="medium">
          {Facade.t('screens.getWallet.addNewAccount')}
        </TextView>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default GetWalletView
