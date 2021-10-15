import {RouteProp, CommonActions} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState} from 'react'

import {wrapper} from '../app/ApplicationWrapper'

import * as data from '~src/Changelog.json'
import {Storage} from '~src/app/Storage'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import Changelog from '~src/components/changelog/Changelog'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'
type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface ChangelogModalParams {
  fromTabNavigation?: boolean
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'ChangelogModal'>
}

const ChangelogModal = (props: Props) => {
  const currentNumberOfVersions = Object.keys(data.changelog).length
  const controller = useSwiperController(true)
  const [action, setAction] = useState<CommonActions.Action>()

  const closeTo = (...arg: NavParam<ParamList>) => {
    Storage.numberOfVersions.save(currentNumberOfVersions)
    setAction(CommonActions.navigate(...arg))
    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      padding={20}
      fullSize={true}
      title={i18n.t('modals.changelog.title')}
      rightButton={<CloseButton mr={'20px'} />}
      onRightPress={() =>
        closeTo(
          // TODO: figure out a way to remove the explicity of 'undefined'
          wrapper.route.Tab.name,
          undefined
        )
      }
      onClose={() => {
        Storage.numberOfVersions.save(currentNumberOfVersions)
        props.navigation.navigate(wrapper.route.Tab.name, undefined)
      }}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <LinearLayout orientation="verti" mr={5} pl={42} mt={5} mb={5}>
          <TextView color="white">
            {i18n.t('modals.changelog.thankYouText')}
          </TextView>
          <TextView color="white" textAlign="right" fontFamily={'bold'}>
            {i18n.t('modals.changelog.cozTeam')}
          </TextView>
        </LinearLayout>
        <LinearLayout orientation="verti" width="100%">
          <Changelog changelog={data.changelog} />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default ChangelogModal
