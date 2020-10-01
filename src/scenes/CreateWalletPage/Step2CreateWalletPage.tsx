import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native'
import {useDispatch} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCard from '~src/components/themed/ThemedCard'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const WordComponent = (props: {value: string}) => {
  return (
    <TextView
      my={3}
      mx={4}
      color={'text.0'}
      fontSize={'2xl'}
      fontFamily={'semibold'}
    >
      {props.value}
    </TextView>
  )
}

const Step2CreateWalletPage: React.FC<Props> = (props) => {
  const dispatch = useDispatch()
  const [words, setWords] = useState<string[]>([])

  useEffect(() => {
    Facade.await.run('populate', populate, 500)
  }, [])

  const populate = async () => {
    const words = Facade.asteroid.generateMnemonic() ?? []

    await setWords(words)

    dispatch(RootStore.wallet.actions.clearState())
    dispatch(RootStore.wallet.actions.setSecurityPhrase(words.join(' ')))
  }

  const infoDialog = () => {
    Alert.alert(
      Facade.t('step2CreateWallet.dialog_title'),
      Facade.t('step2CreateWallet.dialog_body'),
      [
        {
          text: Facade.t('step2CreateWallet.dialog_dismiss'),
          onPress: () =>
            props.navigation.navigate(Facade.route.Step3CreateWallet.name),
        },
      ]
    )
  }

  return (
    <ScreenLayout alignX={'center'}>
      <AwaitActivity name={'populate'} loadingView={<ScreenLoader />}>
        <LinearLayout mt={5} weight={1}>
          <LinearLayout mb={6} width={'100%'}>
            <LinearLayout width={'100%'} orientation={'horiz'}>
              <TextView
                weight={1}
                color={'text.0'}
                fontSize={'lg'}
                fontFamily={'bold'}
              >
                {Facade.t('step2CreateWallet.label_1')}
              </TextView>

              <TextView color={'text.0'} fontSize={'lg'} fontFamily={'bold'}>
                {Facade.t('step2CreateWallet.oneOfThree')}
              </TextView>
            </LinearLayout>

            <TextView fontFamily={'light'} color={'text.0'} fontSize={'lg'}>
              {Facade.t('step2CreateWallet.body_1')}
            </TextView>
          </LinearLayout>

          <LinearLayout mb={5}>
            <ThemedCard
              rounded={false}
              contentStyle={{
                paddingTop: Facade.scale(26),
                paddingBottom: Facade.scale(26),
                paddingLeft: Facade.scale(10),
                paddingRight: Facade.scale(10),
              }}
            >
              <LinearLayout
                orientation={'horiz'}
                flexWrap={'wrap'}
                alignItems={'center'}
                justifyContent={'center'}
                width={'100%'}
              >
                {words.map((it) => (
                  <WordComponent key={it} value={it} />
                ))}
              </LinearLayout>
            </ThemedCard>
          </LinearLayout>

          <LinearLayout
            mb={5}
            orientation={'horiz'}
            justifyContent={'flex-end'}
          >
            <ThemedButton
              onPress={() => Facade.utils.copyToClipboard(words.join(' '))}
              label={Facade.t('app.copy')}
              srcIcon={require('~/src/assets/images/icon-copy-green.png')}
              iconSize={[Facade.scale(25), Facade.scale(25)]}
              fontSize={18}
              flat={true}
            />

            <ThemedButton
              label={Facade.t('app.print')}
              srcIcon={require('~/src/assets/images/icon-print-green.png')}
              iconSize={[25, 25]}
              fontSize={18}
              flat={true}
            />
          </LinearLayout>

          <TextView
            fontFamily={'light'}
            mb={4}
            color={'text.0'}
            fontSize={'lg'}
          >
            {Facade.t('step2CreateWallet.body_2')}
          </TextView>

          <TextView
            fontFamily={'light'}
            mb={5}
            color={'text.0'}
            fontSize={'lg'}
          >
            {Facade.t('step2CreateWallet.body_3')}
          </TextView>
        </LinearLayout>

        <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
          <ThemedButton
            onPress={() => infoDialog()}
            label={Facade.t('app.continue')}
          />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

Step2CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step2CreateWalletPage
