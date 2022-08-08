import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList } from 'react-native'

import changelogData from '~src/Changelog.json'
import { Storage } from '~src/app/Storage'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'
type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface ChangelogModalParams {
  fromTabNavigation?: boolean
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'ChangelogModal'>
}

interface ItemProps {
  version: string
  date: string
  changes: string[]
  biggestVersionLength: number
}

const Item = (props: ItemProps) => {
  return (
    <LinearLayout orientation="horiz" justifyContent="center">
      <LinearLayout width={`${8 * props.biggestVersionLength}px`} alignItems="flex-end">
        <LinearLayout borderRadius="12px" backgroundColor="primary">
          <TextView color="text.1" p="4px" fontSize="lg">
            {props.version}
          </TextView>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout
        width="20px"
        height="20px"
        borderRadius="10px"
        backgroundColor="primary"
        position="relative"
        left="10px"
        zIndex={2}
      />

      <LinearLayout backgroundColor="background.3" width="2px" />

      <LinearLayout ml="20px" width="120px" mb="12px">
        <TextView fontSize="lg" color="text.0" fontWeight="bold" mb="12px">
          {props.date}
        </TextView>

        <LinearLayout>
          {props.changes.map(change => (
            <TextView fontSize="md" color="text.4" mb="4px">
              {change}
            </TextView>
          ))}
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

const ChangelogModal = (props: Props) => {
  const { changelog } = changelogData

  const controller = useSwiperController(true)

  const handleRightPress = () => {
    const currentNumberOfVersions = Object.keys(changelog).length

    Storage.numberOfVersions.save(currentNumberOfVersions)
    controller.close()
  }

  const biggestVersionLength = changelog.map(({ version }) => version.length).reduce((a, b) => Math.max(a, b))

  return (
    <SwiperPanel
      controller={controller}
      padding={20}
      fullSize
      title={i18n.t('modals.changelog.title')}
      rightButton={<CloseButton mr="20px" />}
      onRightPress={handleRightPress}
      onClose={props.navigation.goBack}
      solidColorBG
    >
      <FlatList
        data={changelog}
        scrollEnabled
        ListHeaderComponent={
          <LinearLayout orientation="verti" mr={5} pl={42} mt={5} mb={5}>
            <TextView color="white">{i18n.t('modals.changelog.thankYouText')}</TextView>
            <TextView color="white" textAlign="right" fontFamily="bold">
              {i18n.t('modals.changelog.cozTeam')}
            </TextView>
          </LinearLayout>
        }
        renderItem={({ item }) => (
          <Item
            changes={item.changes}
            date={item.date}
            version={item.version}
            biggestVersionLength={biggestVersionLength}
          />
        )}
        keyExtractor={item => item.date}
      />
    </SwiperPanel>
  )
}

export default ChangelogModal
