import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {
  ImageLoadEventData,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleProp,
} from 'react-native'

import ThemedCard from '~src/components/ThemedCard'
import styled, {
  ImageView,
  LinearLayout,
  normalize,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onPress?: (
    e: NativeSyntheticEvent<NativeTouchEvent>,
    active?: boolean
  ) => void
  label: string
  textColor?: string
  bgColor?: string
  srcIcon?: ImageLoadEventData
  toggleable?: boolean
  active?: boolean
  rounded?: boolean
  flat?: boolean
  basic?: boolean
  iconSize?: [number, number]
  fontSize?: number | string
  contentStyle?: any
}

const ThemedButton: React.FC<Props> = (props) => {
  const [isActive, setActive] = useState<boolean>(props.active ?? false)
  const width = normalize(props.iconSize ? props.iconSize[0] : 20)
  const height = normalize(props.iconSize ? props.iconSize[1] : 20)
  const fontSize = normalize(props.fontSize ?? 22)

  const getStyle = (): StyleProp<any> => {
    const style = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: normalize(20),
      paddingRight: normalize(20),
      height: normalize(50),
    }

    const styleActive = {
      borderColor: '#4cffb3',
      borderWidth: 1,
    }

    return Object.assign(
      props.contentStyle ?? {},
      style,
      isActive ? styleActive : {}
    )
  }

  const _renderLabel = () => {
    return (
      <LinearLayout orientation={'horiz'} alignItems={'center'} height={'100%'}>
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
          mt={2}
          color={props.textColor}
          fontSize={fontSize}
          fontFamily={props.flat ? 'bold' : 'regular'}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
        >
          {props.label}
        </LabelView>
      </LinearLayout>
    )
  }

  return (
    <ButtonView
      onPress={(e: NativeSyntheticEvent<NativeTouchEvent>) => {
        if (props.toggleable) {
          setActive(!isActive)
        }

        if (props.onPress) {
          props.onPress(e, props.toggleable ? !isActive : undefined)
        }
      }}
    >
      <ThemedCard
        contentStyle={getStyle()}
        rounded={props.rounded}
        flat={props.flat}
        hasBright={!props.basic && !isActive}
        hasShadow={!props.basic && !isActive}
        baseBgColor={isActive ? 'transparent' : props.bgColor}
      >
        {_renderLabel()}
      </ThemedCard>
    </ButtonView>
  )
}

ThemedButton.propTypes = {
  onPress: PropTypes.func,
  label: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  bgColor: PropTypes.string,
  srcIcon: PropTypes.any,
  toggleable: PropTypes.bool,
  active: PropTypes.bool,
  rounded: PropTypes.bool,
  flat: PropTypes.bool,
  basic: PropTypes.bool,
  iconSize: PropTypes.any,
  fontSize: PropTypes.any,
  contentStyle: PropTypes.any,
}

ThemedButton.defaultProps = {
  textColor: 'primary',
  toggleable: false,
  active: false,
  rounded: true,
  flat: false,
  basic: false,
}

const ButtonView = styled.TouchableOpacity``

const LabelView = styled(TextView)`
  text-align: center;
`

export default ThemedButton
