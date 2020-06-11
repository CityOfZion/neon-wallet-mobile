import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {expo} from '~/app.json'
import i18n from '~src/i18n'
import {setLocale} from '~src/store/actions/locale'
import {NeoNode} from '~src/models/NeoNode'

import {LinearLayout, TextView, ButtonView} from '~src/styles/styled-components'
import {DefaultTheme} from 'styled-components'

type HomeStackParametersList = {
  TouchIdTest: undefined
  QRCodeScanTest: undefined
  QrCodeGenerateTest: undefined
  NeonJSTest: undefined
  ChartTest: undefined
  ThemeTest: undefined
  Wallet: undefined
}

interface Props {
  navigation: StackNavigationProp<HomeStackParametersList>
  theme: DefaultTheme
}

const Home = (props: Props) => {
  const [currentLocale, setCurrentLocale] = useState<string>('en')
  const [nodes, setNodes] = useState<NeoNode[]>([])

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
    <LinearLayout bg='background' alignItems='center' height='100%'>
      <TextView my={6} fontSize={2} color='text.0'>{i18n.t('home.welcome')}</TextView>
      <ButtonView
        mb={3} p={3} bg='primary' borderRadius={4} minWidth={100}
        onPress={() => props.navigation.navigate('Wallet')}
      >
        <TextView color='text.1' textAlign='center'>Wallet</TextView>
      </ButtonView>
      <ButtonView
        mb={3} p={3} bg='primary' borderRadius={4} minWidth={100}
        onPress={() => props.navigation.navigate('NeonJSTest')}
      >
        <TextView color='text.1' textAlign='center'>Go to NeonJsTest</TextView>
      </ButtonView>
      <ButtonView
        mb={3} p={3} bg='primary' borderRadius={4} minWidth={100}
        onPress={() => props.navigation.navigate('QrCodeGenerateTest')}
      >
        <TextView color='text.1' textAlign='center'>Go to generate QR code</TextView>
      </ButtonView>
      <ButtonView
        mb={3} p={3} bg='primary' borderRadius={4} minWidth={100}
        onPress={() => props.navigation.navigate('ThemeTest')}
      >
        <TextView color='text.1' textAlign='center'>Go to Theme Test Page</TextView>
      </ButtonView>
      <LinearLayout orientation='horiz' mt={5}>
        <ButtonView
          mx={3} p={3} bg='primary' borderRadius={4} minWidth={100}
          onPress={() => changeLocale('en')}
        >
          <TextView color='text.1' textAlign='center'>{i18n.t('languages.en')}</TextView>
        </ButtonView>
        <ButtonView
          mx={3} p={3} bg='primary' borderRadius={4} minWidth={100}
          onPress={() => changeLocale('de')}
        >
          <TextView color='text.1' textAlign='center'>{i18n.t('languages.de')}</TextView>
        </ButtonView>
        <ButtonView
          mx={3} p={3} bg='primary' borderRadius={4} minWidth={100}
          onPress={() => changeLocale('ptBR')}
        >
          <TextView color='text.1' textAlign='center'>{i18n.t('languages.ptBR')}</TextView>
        </ButtonView>
      </LinearLayout>
      <LinearLayout
        mb={5} position='absolute' bottom='0' alignItems='center' justifyContent='center'
      >
        <TextView color='text.0'> First Node URL: {nodes[0] && nodes[0].url}</TextView>
        <TextView color='text.0'> First Node Height: {nodes[0] && nodes[0].height}</TextView>
        <TextView color='text.0'> Version: {expo.version}</TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

export default Home
