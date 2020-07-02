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
  normalize,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void
  label: string
  srcIcon?: ImageLoadEventData
  rounded?: boolean
  flat?: boolean
  iconSize?: [number, number]
  fontSize?: number | string
}

const ThemedButton: React.FC<Props> = (props) => {
  const baseBgColor = '#2d3941'
  const width = normalize(props.iconSize ? props.iconSize[0] : 20)
  const height = normalize(props.iconSize ? props.iconSize[1] : 20)
  const fontSize = normalize(props.fontSize ?? 22)

  const getBorderRadius = () => {
    if (props.rounded) {
      return 26
    }

    return 5
  }

  return (
    <ButtonView
      onPress={(e: NativeSyntheticEvent<NativeTouchEvent>) =>
        props.onPress?.(e)
      }
    >
      <ButtonContentView
        alignItems="center"
        backgroundColor={props.flat ? 'transparent' : baseBgColor}
        style={{borderRadius: getBorderRadius(), height: normalize(50)}}
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

        <LinearLayout
          orientation={'horiz'}
          alignItems={'center'}
          height={'100%'}
          mt={1}
        >
          {props.srcIcon && (
            <ImageView
              width={width as number}
              height={height as number}
              mr={3}
              resizeMode="contain"
              source={props.srcIcon}
            />
          )}

          <LabelView
            color={'primary'}
            fontSize={fontSize}
            fontFamily={props.flat ? 'bold' : 'regular'}
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {props.label}
          </LabelView>
        </LinearLayout>
      </ButtonContentView>
    </ButtonView>
  )
}

ThemedButton.propTypes = {
  onPress: PropTypes.func,
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

const ButtonContentView = styled(LinearLayout)`
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.4);
  padding: 0 20px;
`

const LabelView = styled(TextView)`
  text-align: center;
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
