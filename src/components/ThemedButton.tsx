import {LinearGradient} from 'expo-linear-gradient'
import PropTypes from 'prop-types'
import React from 'react'
import {
  ImageLoadEventData,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from 'react-native'

import styled, {
  ImageView,
  LinearLayout,
  RelativeLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onClick?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
  label: string
  srcIcon?: ImageLoadEventData
  rounded?: boolean
  flat?: boolean
  iconSize?: [number, number]
  fontSize?: number | string
}

const ThemedButton: React.FC<Props> = (props) => {
  const labelColor = '#4cffb3'
  const baseBgColor = '#2d3941'
  const width = props.iconSize ? props.iconSize[0] : 20
  const height = props.iconSize ? props.iconSize[1] : 20
  const fontSize = props.fontSize ?? 22

  const getBorderRadius = () => {
    if (props.rounded) {
      return 22
    }

    return 5
  }

  return (
    <ButtonView
      onPress={(e: NativeSyntheticEvent<NativeTouchEvent>) =>
        props.onClick?.(e)
      }
    >
      <ButtonContentView
        alignItems="center"
        backgroundColor={props.flat ? 'transparent' : baseBgColor}
        style={{borderRadius: getBorderRadius()}}
      >
        {!props.flat && (
          <BrightButton
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0)']}
            locations={[0, 1]}
            start={[1, 0]}
            end={[1, 1]}
            style={{borderRadius: getBorderRadius()}}
          />
        )}

        {!props.flat && (
          <ShadowButton
            colors={['rgba(52, 67, 75, 0.55)', 'rgba(0, 0, 0, 0.1)']}
            locations={[0, 1]}
            start={[1, 0]}
            end={[1, 1]}
            style={{borderRadius: getBorderRadius()}}
          />
        )}

        <LinearLayout orientation={'horiz'} alignItems={'center'}>
          {props.srcIcon && (
            <ImageView
              width={width}
              height={height}
              mr={3}
              source={props.srcIcon}
            />
          )}

          <LabelView color={labelColor} fontSize={fontSize}>
            {props.label}
          </LabelView>
        </LinearLayout>
      </ButtonContentView>
    </ButtonView>
  )
}

ThemedButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string.isRequired,
  srcIcon: PropTypes.any,
  rounded: PropTypes.bool,
  flat: PropTypes.bool,
  iconSize: PropTypes.any,
  fontSize: PropTypes.any,
}

ThemedButton.defaultProps = {
  rounded: true,
  flat: false,
}

const ButtonView = styled.TouchableOpacity`
  box-shadow: 0 -6px 6px rgba(255, 255, 255, 0.1);
`

const ButtonContentView = styled(RelativeLayout)`
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.4);
  height: 42px;
  padding: 0 20px;
`

const LabelView = styled(TextView)`
  text-align: center;
  line-height: 38px;
`

const BrightButton = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const ShadowButton = styled(LinearGradient)`
  position: absolute;
  left: 0;
  right: 0;
  top: 1px;
  bottom: 0;
`

export default ThemedButton
