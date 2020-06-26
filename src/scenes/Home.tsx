import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {DefaultTheme} from 'styled-components'

import {expo} from '~/app.json'
import ThemedButton from '~src/components/ThemedButton'
import {NeoNode} from '~src/models/NeoNode'
import {LinearLayout, TextView} from '~src/styles/styled-components'
import {ROUTES} from '~/constants'

type HomeStackParametersList = {
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

  useEffect(() => {
    populate()
  }, [])

  const populate = async () => {
    setNodes(await NeoNode.getAllNodes())
  }

  return (
    <LinearLayout bg="background.0" alignItems="center" height="100%">
      <LinearLayout height={headerHeight} />
      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('ReceiveQRCode')}
          label={'Go to ReceiveQRCode'}
        />
      </LinearLayout>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('CustomColor')}
          label={'Go to Custom Color Page'}
        />
      </LinearLayout>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() =>
            props.navigation.navigate('Modal', {screen: 'SampleModal'})
          }
          label={'Go to Sample Modal Page'}
        />
      </LinearLayout>
      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate(ROUTES.GET_WALLET.name)}
          label={'Account'}
        />
      </LinearLayout>
      <LinearLayout
        mb={5}
        mt={5}
        position="absolute"
        bottom={0}
        alignItems="center"
        justifyContent="center"
      >
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
  )
}

export default Home
