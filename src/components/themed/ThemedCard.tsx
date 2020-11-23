import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React from 'react'
import {StyleProp} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import styled, {LinearLayout} from '~src/styles/styled-components'

interface Props {
  children?: any
  rounded?: boolean
  flat?: boolean
  alignX?: string
  alignY?: string
  padding?: number | string
  baseBgColor?: string
  contentStyle?: any
  hasShadow?: boolean
  hasBright?: boolean
  borderThickness?: number | string
  borderColor?: string
  isPressed?: boolean
  radius?: number
}

const ThemedCard: React.FC<Props> = (props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const getBorderRadius = () => {
    if (props.rounded) {
      return props.radius ? props.radius : 8
    }

    return 5
  }

  const getStyle = (): StyleProp<any> => {
    const styleShadow = {
      shadowColor: '#ffffff',
      shadowOffset: {
        width: 0,
        height: -6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      marginBottom: 8,
    }

    return props.hasShadow ? styleShadow : {}
  }

  const getContentStyle = (): StyleProp<any> => {
    const style = {
      padding: Facade.scale(props.padding!),
    }

    const styleShadow = {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: props.flat ? 0 : 4,
    }

    return Facade.lodash.merge(
      style,
      props.hasShadow ? styleShadow : {},
      props.contentStyle ?? {}
    )
  }

  return (
    <DarkCardView style={getStyle()}>
      <DarkCardContentView
        style={getContentStyle()}
        backgroundColor={
          props.flat
            ? 'transparent'
            : props.baseBgColor ?? theme.colors.background[8]
        }
        border={props.flat ? props.borderThickness : undefined}
        borderColor={props.flat ? props.borderColor : undefined}
        borderRadius={getBorderRadius()}
        alignItems={props.alignX}
        justifyContent={props.alignY}
      >
        {props.hasBright && !props.flat && (
          <DarkCardBright
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0)']}
            locations={[0, 1]}
            start={[1, 0]}
            end={[1, 1]}
            style={{borderRadius: getBorderRadius()}}
          />
        )}

        {props.hasBright && !props.flat && (
          <DarkCardShadow
            colors={
              props.isPressed
                ? ['rgba(86,106,118, 0.55)', 'rgba(0, 0, 0, 0.1)']
                : ['rgba(52,67,75, 0.55)', 'rgba(0, 0, 0, 0.1)']
            }
            locations={[0, 1]}
            start={[1, 0]}
            end={[1, 1]}
            style={{borderRadius: getBorderRadius() - (props.rounded ? 2 : 0)}}
          />
        )}

        {props.children}
      </DarkCardContentView>
    </DarkCardView>
  )
}

ThemedCard.propTypes = {
  children: PropTypes.any,
  rounded: PropTypes.bool,
  flat: PropTypes.bool,
  alignX: PropTypes.string,
  alignY: PropTypes.string,
  padding: PropTypes.any,
  baseBgColor: PropTypes.any,
  contentStyle: PropTypes.any,
  hasShadow: PropTypes.bool,
  hasBright: PropTypes.bool,
  borderThickness: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  borderColor: PropTypes.string,
  isPressed: PropTypes.bool,
  radius: PropTypes.number,
}

ThemedCard.defaultProps = {
  rounded: true,
  flat: false,
  alignX: 'center',
  padding: 30,
  hasShadow: true,
  hasBright: true,
  radius: 0,
}

const DarkCardView = styled(LinearLayout)``

const DarkCardContentView = styled(LinearLayout)``

const DarkCardBright = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const DarkCardShadow = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 1px;
  bottom: 0;
`

export default ThemedCard
