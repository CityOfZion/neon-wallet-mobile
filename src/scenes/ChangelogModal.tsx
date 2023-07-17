import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { FlatList, useWindowDimensions } from 'react-native'

import changelogData from '~src/Changelog.json'
import { Storage } from '~src/app/Storage'
import SwiperPanel, { CloseButton, DEFAULT_PADDING, useSwiperController } from '~src/components/SwiperPanel'
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
  const { width } = useWindowDimensions()

  const sideWidth = width / 2 - DEFAULT_PADDING - 14
  return (
    <LinearLayout orientation="horiz" justifyContent="center">
      <LinearLayout width={`${sideWidth}px`} alignItems="flex-end">
        <LinearLayout borderRadius="12px" backgroundColor="primary">
          <TextView color="text.1" p="4px" fontSize="lg">
            {props.version}
          </TextView>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout orientation="horiz" paddingX="6px">
        <LinearLayout
          width="20px"
          height="20px"
          borderRadius="10px"
          backgroundColor="primary"
          position="relative"
          left="0px"
          zIndex={2}
        />

        <LinearLayout backgroundColor="background.3" width="2px" position="relative" left="-10px" />
      </LinearLayout>

      <LinearLayout width={`${sideWidth}px`} mb="12px">
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
      title={i18n.t('modals.changelog.title')}
      rightButton={<CloseButton onPress={handleRightPress} />}
      onClose={props.navigation.goBack}
      withoutScrollView
    >
      <FlatList
        data={changelog}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <LinearLayout orientation="verti" mb="12px" px="24px">
            <TextView color="text.0">{i18n.t('modals.changelog.thankYouText')}</TextView>
            <TextView color="text.0" textAlign="right" fontFamily="bold">
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
