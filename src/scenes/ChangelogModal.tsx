import {RouteProp, CommonActions} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState} from 'react'

import * as data from '~src/Changelog.json'
import {Facade} from '~src/app/Facade'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import Changelog from '~src/components/changelog/Changelog'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {LinearLayout} from '~src/styles/styled-components'

type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface ChangelogModalParams {
  fromTabNavigation?: boolean
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'ChangelogModal'>
}

const ChangelogModal = (props: Props) => {
  const controller = useSwiperController(true)
  const [action, setAction] = useState<CommonActions.Action>()

  const closeTo = (...arg: NavParam<ParamList>) => {
    setAction(CommonActions.navigate(...arg))
    controller.close()
  }

  return (
    <SwiperPanel
      padding={20}
      fullSize={true}
      title={Facade.t('modals.changelog.title')}
      rightButton={<CloseButton mr="25px" />}
      imageSize={[22, 22]}
      onClose={() =>
        action ? props.navigation.dispatch(action) : props.navigation.goBack()
      }
      onRightPress={() =>
        closeTo(
          // TODO: figure out a way to remove the explicity of 'undefined'
          Facade.route.Tab.name,
          undefined
        )
      }
      controller={controller}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <LinearLayout orientation="verti" width="100%">
          <Changelog changelog={data.changelog} />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default ChangelogModal
