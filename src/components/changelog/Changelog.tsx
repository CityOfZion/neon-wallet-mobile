import PropTypes from 'prop-types'
import React from 'react'
import Timeline from 'react-native-timeline-flatlist'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {LinearLayout} from '~src/styles/styled-components'

interface IChanges {
  version: string
  date: string
  changes: string[]
}

interface IChangelog {
  changelog: IChanges[]
}

const Changelog: React.FC<IChangelog> = ({changelog}) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const convert = (x: {version: string; date: string; changes: string[]}) => {
    const description = x.changes.join('\n')
    return {time: x.version, title: x.date, description}
  }

  const formatChangelog = () => changelog.map((x: any) => convert(x))

  return (
    <LinearLayout
      padding={22}
      justifyContent={'center'}
      alignItems={'center'}
      borderRadius={4}
      borderColor={'rgba(0, 0, 0, 0.1)'}
      height={'100%'}
    >
      <LinearLayout flex={1} padding={20} width={'100%'} borderRadius={13}>
        <Timeline
          data={changelog ? formatChangelog() : []}
          circleSize={20}
          circleColor={theme.colors.primary}
          lineColor={theme.colors.background[3]}
          timeContainerStyle={{minWidth: 52, marginTop: 0}}
          titleStyle={{marginTop: -10, color: theme.colors.text[0]}}
          timeStyle={{
            textAlign: 'center',
            backgroundColor: theme.colors.primary,
            color: theme.colors.text[1],
            padding: 5,
            borderRadius: 13,
          }}
          descriptionStyle={{color: theme.colors.text[4]}}
          options={{
            style: {paddingTop: 5},
            showsVerticalScrollIndicator: false,
          }}
        />
      </LinearLayout>
    </LinearLayout>
  )
}

Changelog.propTypes = {
  changelog: PropTypes.any.isRequired,
}

export default Changelog
