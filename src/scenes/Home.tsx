import {StackNavigationProp} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native'
import {useDispatch} from 'react-redux'
import tailwind from 'tailwind-rn'

import {expo} from '~/app.json'
import i18n from '~src/i18n'
import {setLocale} from '~src/store/actions/locale'
import {NeoNode} from '~src/models/NeoNode'

type HomeStackParametersList = {
  TouchIdTest: undefined
  QRCodeScanTest: undefined
  QrCodeGenerateTest: undefined
  NeonJSTest: undefined
  ChartTest: undefined
  Wallet: undefined
}

interface Props {
  navigation: StackNavigationProp<HomeStackParametersList>
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: '#68a0cf',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
  },
})

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
    <View style={tailwind('h-full bg-white items-center justify-center')}>
      <Text style={tailwind('text-lg mb-4')}>{i18n.t('home.welcome')}</Text>
      <TouchableHighlight
        style={[tailwind('mb-2'), styles.button]}
        onPress={() => props.navigation.navigate('TouchIdTest')}
      >
        <Text style={styles.buttonText}>Go to TouchIdTest</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[tailwind('mb-2'), styles.button]}
        onPress={() => props.navigation.navigate('QRCodeScanTest')}
      >
        <Text style={styles.buttonText}>QR Code Scan</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[tailwind('mb-2'), styles.button]}
        onPress={() => props.navigation.navigate('Wallet')}
      >
        <Text style={styles.buttonText}>Wallet</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[tailwind('mb-2'), styles.button]}
        onPress={() => props.navigation.navigate('NeonJSTest')}
      >
        <Text style={styles.buttonText}>Go to NeonJsTest</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[tailwind('mb-2'), styles.button]}
        onPress={() => props.navigation.navigate('QrCodeGenerateTest')}
      >
        <Text style={styles.buttonText}>Go to generate QR code</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={[tailwind('mb-2'), styles.button]}
        onPress={() => props.navigation.navigate('ChartTest')}
      >
        <Text style={styles.buttonText}>Go to Chart Test Page</Text>
      </TouchableHighlight>
      <View style={tailwind('mt-8 flex-row justify-around')}>
        <TouchableHighlight
          style={[tailwind('mx-2'), styles.button]}
          onPress={() => changeLocale('en')}
        >
          <Text style={styles.buttonText}>{i18n.t('languages.en')}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[tailwind('mx-2'), styles.button]}
          onPress={() => changeLocale('de')}
        >
          <Text style={styles.buttonText}>{i18n.t('languages.de')}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[tailwind('mx-2'), styles.button]}
          onPress={() => changeLocale('ptBR')}
        >
          <Text style={styles.buttonText}>{i18n.t('languages.ptBR')}</Text>
        </TouchableHighlight>
      </View>
      <View style={styles.footer}>
        <Text> First Node URL: {nodes[0] && nodes[0].url}</Text>
        <Text> First Node Height: {nodes[0] && nodes[0].height}</Text>
        <Text> Version: {expo.version}</Text>
      </View>
    </View>
  )
}

export default Home
