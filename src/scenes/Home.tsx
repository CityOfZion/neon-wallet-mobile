import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {expo} from '~/app.json'
import {ROUTES} from '~/constants'
import ThemedButton from '~src/components/ThemedButton'
import {NeoNode} from '~src/models/NeoNode'
import {RootState} from '~src/store/reducers/root'
import {LinearLayout, TextView} from '~src/styles/styled-components'

type HomeStackParametersList = {
  Welcome: undefined
  Onboarding: undefined
  CustomColor: undefined
  ReceiveQRCode: undefined
  Modal: {screen: string}
  Wallet: undefined
  Settings: undefined
  More: undefined
  GetWallet: undefined
}

interface Props {
  navigation: StackNavigationProp<HomeStackParametersList>
  theme: DefaultTheme
}

const Home = (props: Props) => {
  const [nodes, setNodes] = useState<NeoNode[]>([])
  const headerHeight = useHeaderHeight()
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  useEffect(() => {
    populate()
  }, [])

  const populate = async () => {
    setNodes(await NeoNode.getAllNodes())
  }

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[1], theme.colors.background[2]]}
      start={[0.1, 0.1]}
      end={[1, 1]}
    >
      <LinearLayout width={'100%'} height={'100%'}>
        <LinearLayout weight={1} mt={headerHeight}>
          <LinearLayout m={3}>
            <ThemedButton
              onPress={() => props.navigation.navigate('ReceiveQRCode')}
              label={'Go to ReceiveQRCode'}
            />
          </LinearLayout>

          <LinearLayout m={3}>
            <ThemedButton
              onPress={() => props.navigation.navigate('Onboarding')}
              label={'Go to Onboarding'}
            />
          </LinearLayout>

          <LinearLayout m={3}>
            <ThemedButton
              onPress={() => props.navigation.navigate('CustomColor')}
              label={'Go to Custom Color Page'}
            />
          </LinearLayout>

          <LinearLayout m={3}>
            <ThemedButton
              onPress={() =>
                props.navigation.navigate('Modal', {screen: 'SampleModal'})
              }
              label={'Go to Sample Modal Page'}
            />
          </LinearLayout>

          <LinearLayout m={3}>
            <ThemedButton
              onPress={() => props.navigation.navigate(ROUTES.GET_WALLET.name)}
              label={'Account'}
            />
          </LinearLayout>
        </LinearLayout>

        <LinearLayout my={4} alignItems="center" justifyContent="center">
          <TextView color="text.0">
            {' '}
            First Node URL: {nodes[0] && nodes[0].url}
          </TextView>
          <TextView color="text.0">
            {' '}
            First Node Height: {nodes[0] && nodes[0].height}
          </TextView>
          <TextView color="text.0"> Version: {expo.version}</TextView>
        </LinearLayout>
      </LinearLayout>
    </LinearGradient>
  )
}

export default Home
