import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useEffect, useState} from 'react'
import {ImageLoadEventData, SafeAreaView, StyleSheet, View} from 'react-native'
import Swiper from 'react-native-swiper'
import {useDispatch, useSelector} from 'react-redux'

import ThemedButton from '~/src/components/themed/ThemedButton'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {RootStore} from '~src/store/RootStore'
import styled, {
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface OnboardingSlideProps {
  header: string
  image: ImageLoadEventData
  bottomContent: any
}

interface OnboardingPageProps {
  navigation: StackNavigationProp<RootStackParamList>
}

const OnboardingSlide = (props: OnboardingSlideProps) => {
  return (
    <LinearLayout orientation={'verti'} height={'100%'}>
      <RelativeLayout weight={3} mt={100}>
        <ImageView
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
          source={props.image}
        />
      </RelativeLayout>

      <LinearLayout justifyContent={'center'} weight={2} mb={50}>
        <LinearLayout width={'100%'} mb={20} alignItems={'center'}>
          {props.bottomContent}
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

const FeatureText = (props: {title: string; subtitle: string}) => {
  const headerHeight = useHeaderHeight()
  const unit = headerHeight * 0.015

  return (
    <LinearLayout orientation={'verti'} mx={'7%'}>
      <TextView
        color={'text.0'}
        fontFamily={'semibold'}
        fontSize={'20px'}
        textAlign={'center'}
      >
        {props.title}
      </TextView>

      <FeatureDescription
        mt={'2%'}
        color={'text.4'}
        style={{lineHeight: 18 * unit}}
      >
        {props.subtitle}
      </FeatureDescription>
    </LinearLayout>
  )
}

const FeatureDescription = styled(TextView)`
  font-size: 15px;
  text-align: center;
  letter-spacing: 1.28px;
  font-family: regular;
`

const OnboardingPage = (props: OnboardingPageProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const [isLastPage, setIsLastPage] = useState(false)

  const {wallets} = useSelector((state: RootState) => state.app)

  const dispatch = useDispatch<SyncDispatch>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const dispatchAsyncString = useDispatch<AsyncDispatch<string>>()

  const finish = async () => {
    await Storage.onboardingSeen.save(true)

    props.navigation.replace(Facade.route.Login.name)
  }

  const onIndexChanged = function (index: number) {
    if (index === 3) setIsLastPage(true)
    else setIsLastPage(false)
  }

  useEffect(() => {
    if (wallets.length === 0) {
      // NW-221 The app must create a wallet for the user when it first runs
      Facade.await.run('populateWallet', () => createFirstWallet())
    }
  }, [])

  const createFirstWallet = async () => {
    const words = Facade.asteroid.generateMnemonic() ?? []

    dispatch(RootStore.wallet.actions.clearState())

    dispatch(RootStore.wallet.actions.setName('My First Wallet'))
    dispatch(RootStore.wallet.actions.setType('standard'))
    dispatch(RootStore.wallet.actions.setSecurityPhrase(words.join(' ')))

    const id = await dispatchAsyncString(
      RootStore.wallet.actions.createAndSave()
    )
    await dispatchAsync(RootStore.app.actions.syncWallets())

    dispatch(RootStore.wallet.actions.clearState())

    await createFirstAccount(id)
  }

  const createFirstAccount = async (id: string) => {
    dispatch(RootStore.account.actions.clearState())

    dispatch(RootStore.account.actions.setIdWallet(id))
    dispatch(RootStore.account.actions.setName('My account 1'))

    await dispatchAsyncString(RootStore.account.actions.createAndSave())
    await dispatchAsync(RootStore.app.actions.syncAccounts())

    dispatch(RootStore.account.actions.clearState())
  }

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[1], theme.colors.background[2]]}
      start={[0.1, 0.1]}
      end={[1, 1]}
    >
      <SafeAreaView>
        <LinearLayout
          orientation={'verti'}
          alignItems={'center'}
          width={'100%'}
          height={'100%'}
        >
          <Swiper
            onIndexChanged={onIndexChanged}
            dotColor={theme.colors.text[3]}
            activeDotColor={theme.colors.primary}
            loop={false}
            showsButtons
            buttonWrapperStyle={styles.swiperButtonWrapperStyle}
            prevButton={<View />}
            nextButton={
              <NextButton mb={Facade.scale(22)} color={'primary'}>
                next
              </NextButton>
            }
          >
            <OnboardingSlide
              header={'Feature 1'}
              image={require('~src/assets/images/onboarding-1.png')}
              bottomContent={
                <FeatureText
                  title={Facade.t('onboarding.feature1.title')}
                  subtitle={Facade.t('onboarding.feature1.subtitle')}
                />
              }
            />
            <OnboardingSlide
              header={'Feature 2'}
              image={require('~src/assets/images/onboarding-2.png')}
              bottomContent={
                <FeatureText
                  title={Facade.t('onboarding.feature2.title')}
                  subtitle={Facade.t('onboarding.feature2.subtitle')}
                />
              }
            />
            <OnboardingSlide
              header={'Feature 3'}
              image={require('~src/assets/images/onboarding-3.png')}
              bottomContent={
                <FeatureText
                  title={Facade.t('onboarding.feature3.title')}
                  subtitle={Facade.t('onboarding.feature3.subtitle')}
                />
              }
            />
            <OnboardingSlide
              header={'Time to get started!'}
              image={require('~src/assets/images/onboarding-4.png')}
              bottomContent={
                <LinearLayout width={'100%'} alignItems={'center'}>
                  <LinearLayout mb={'8%'}>
                    <FeatureText
                      title={Facade.t('onboarding.feature4.title')}
                      subtitle={Facade.t('onboarding.feature4.subtitle')}
                    />
                  </LinearLayout>

                  <LinearLayout width={'100%'} px={'7%'}>
                    <ThemedButton
                      onPress={() => finish()}
                      label={Facade.t('onboarding.getStarted.buttonTitle')}
                      basic={true}
                      bgColor={'primary'}
                      textColor={'black'}
                    />
                  </LinearLayout>
                </LinearLayout>
              }
            />
          </Swiper>

          {!isLastPage && (
            <SkipButton
              position={'absolute'}
              left={0}
              bottom={0}
              color={'text.0'}
              opacity={0.5}
              mb={Facade.scale(30)}
              ml={Facade.scale(30)}
              onPress={() => finish()}
              style={{textTransform: 'lowercase'}}
            >
              {Facade.t('app.skip')}
            </SkipButton>
          )}
        </LinearLayout>
      </SafeAreaView>
    </LinearGradient>
  )
}

const NextButton = styled(TextView)`
  font-size: 16px;
  font-family: 'medium';
  letter-spacing: 1.71px;
`

const SkipButton = styled(TextView)`
  font-size: 16px;
  font-family: 'medium';
  letter-spacing: 1.71px;
`

const styles = StyleSheet.create({
  swiperButtonWrapperStyle: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: '2.5%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
})

export default OnboardingPage
