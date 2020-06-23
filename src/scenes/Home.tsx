import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {expo} from '~/app.json'
import ThemedButton from '~src/components/ThemedButton'
import i18n from '~src/i18n'
import {NeoNode} from '~src/models/NeoNode'
import {setLocale} from '~src/store/actions/app'
import {LinearLayout, TextView} from '~src/styles/styled-components'

type HomeStackParametersList = {
  TouchIdTest: undefined
  QRCodeScanTest: undefined
  QrCodeGenerateTest: undefined
  NeonJSTest: undefined
  ChartTest: undefined
  ThemeTest: undefined
  CustomColor: undefined
  Wallet: undefined
  Settings: undefined
  More: undefined
  ReceiveQRCode: undefined
}

interface Props {
  navigation: StackNavigationProp<HomeStackParametersList>
  theme: DefaultTheme
}

const Home = (props: Props) => {
  const [currentLocale, setCurrentLocale] = useState<string>('en')
  const [nodes, setNodes] = useState<NeoNode[]>([])
  const headerHeight = useHeaderHeight()
  const dispatch = useDispatch()

  useEffect(() => {
    populate()
  }, [])

  const populate = async () => {
    setNodes(await NeoNode.getAllNodes())
  }

  const changeLocale = (locale: string) => {
    dispatch(setLocale(locale))
    setCurrentLocale(locale)
  }

  return (
    <LinearLayout bg="background.0" alignItems="center" height="100%">
      <LinearLayout height={headerHeight} />
      <TextView my={6} fontSize="xl" color="text.0">
        {i18n.t('home.welcome')}
      </TextView>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('Wallet')}
          label={'Wallet'}
        />
      </LinearLayout>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('NeonJSTest')}
          label={'Go to NeonJsTest'}
        />
      </LinearLayout>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('ReceiveQRCode')}
          label={'Go to ReceiveQRCode'}
        />
      </LinearLayout>
      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('Settings')}
          label={'Go to Settings'}
        />
      </LinearLayout>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('More')}
          label={'Go to More'}
        />
      </LinearLayout>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('QrCodeGenerateTest')}
          label={'Go to generate QR code'}
        />
      </LinearLayout>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('ThemeTest')}
          label={'Go to Theme Test Page'}
        />
      </LinearLayout>

      <LinearLayout m={3}>
        <ThemedButton
          onClick={() => props.navigation.navigate('CustomColor')}
          label={'Go to Custom Color Page'}
        />
      </LinearLayout>

      <LinearLayout orientation="horiz" mt={5}>
        <LinearLayout m={3}>
          <ThemedButton
            onClick={() => changeLocale('en')}
            label={i18n.t('languages.en')}
            rounded={false}
          />
        </LinearLayout>

        <LinearLayout m={3}>
          <ThemedButton
            onClick={() => changeLocale('de')}
            label={i18n.t('languages.de')}
            rounded={false}
          />
        </LinearLayout>

        <LinearLayout m={3}>
          <ThemedButton
            onClick={() => changeLocale('ptBR')}
            label={i18n.t('languages.ptBR')}
            rounded={false}
          />
        </LinearLayout>
      </LinearLayout>

      <LinearLayout
        mb={5}
        position="absolute"
        bottom="0"
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
