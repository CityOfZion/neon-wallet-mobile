import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {expo} from '~/app.json'
import i18n from '~src/i18n'
import {setLocale} from '~src/store/actions/locale'
import {NeoNode} from '~src/models/NeoNode'

import styled from '~src/styles/styled-components'
import {
  color,
  space,
  typography,
  border,
  position,
  flexbox,
  layout,
  TypographyProps,
  SpaceProps,
  ColorProps,
  PositionProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
} from 'styled-system'
import {DefaultTheme} from 'styled-components'
import {orientation, OrientationProps} from '~src/styles/styled-system.config'

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
    <HomeView bg='background' alignItems='center' height='100%'>
      <Text my={6} fontSize={2} color='text.0'>{i18n.t('home.welcome')}</Text>
      <HomeButton
        mb={3} p={3} bg='primary' borderRadius={4} minWidth={100}
        onPress={() => props.navigation.navigate('Wallet')}
      >
        <Text color='text.1' textAlign='center'>Wallet</Text>
      </HomeButton>
      <HomeButton
        mb={3} p={3} bg='primary' borderRadius={4} minWidth={100}
        onPress={() => props.navigation.navigate('NeonJSTest')}
      >
        <Text color='text.1' textAlign='center'>Go to NeonJsTest</Text>
      </HomeButton>
      <HomeButton
        mb={3} p={3} bg='primary' borderRadius={4} minWidth={100}
        onPress={() => props.navigation.navigate('QrCodeGenerateTest')}
      >
        <Text color='text.1' textAlign='center'>Go to generate QR code</Text>
      </HomeButton>
      <HomeButton
        mb={3} p={3} bg='primary' borderRadius={4} minWidth={100}
        onPress={() => props.navigation.navigate('ThemeTest')}
      >
        <Text color='text.1' textAlign='center'>Go to Theme Test Page</Text>
      </HomeButton>
      <LanguagesContainer orientation='horiz' mt={5}>
        <HomeButton
          mx={3} p={3} bg='primary' borderRadius={4} minWidth={100}
          onPress={() => changeLocale('en')}
        >
          <Text color='text.1' textAlign='center'>{i18n.t('languages.en')}</Text>
        </HomeButton>
        <HomeButton
          mx={3} p={3} bg='primary' borderRadius={4} minWidth={100}
          onPress={() => changeLocale('de')}
        >
          <Text color='text.1' textAlign='center'>{i18n.t('languages.de')}</Text>
        </HomeButton>
        <HomeButton
          mx={3} p={3} bg='primary' borderRadius={4} minWidth={100}
          onPress={() => changeLocale('ptBR')}
        >
          <Text color='text.1' textAlign='center'>{i18n.t('languages.ptBR')}</Text>
        </HomeButton>
      </LanguagesContainer>
      <Footer
        mb={5} position='absolute' bottom='0' alignItems='center' justifyContent='center'
      >
        <Text color='text.0'> First Node URL: {nodes[0] && nodes[0].url}</Text>
        <Text color='text.0'> First Node Height: {nodes[0] && nodes[0].height}</Text>
        <Text color='text.0'> Version: {expo.version}</Text>
      </Footer>
    </HomeView>
  )
}
const Text = styled.Text<ColorProps & SpaceProps & TypographyProps>`
  ${color}
  ${space}
  ${typography}
`

const LanguagesContainer = styled.View<SpaceProps & OrientationProps>`
  ${orientation}
  ${space}
`

const Footer = styled.View<SpaceProps & PositionProps & FlexboxProps>`
  ${flexbox}
  ${space}
  ${position}
`

const HomeButton = styled.TouchableHighlight<ColorProps & SpaceProps & BorderProps & LayoutProps>`
  ${layout}
  ${color}
  ${space}
  ${border}
`

const HomeView = styled.View<ColorProps & FlexboxProps & LayoutProps>`
  ${layout}
  ${flexbox}
  ${color}
`

export default Home
