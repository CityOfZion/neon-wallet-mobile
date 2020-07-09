import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {
  ImageLoadEventData,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleProp,
} from 'react-native'

import {Facade} from '~src/app/Facade'
import ThemedCard from '~src/components/themed/ThemedCard'
import styled, {
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onPress?: (
    e: NativeSyntheticEvent<NativeTouchEvent>,
    active?: boolean
  ) => void
  label?: string
  textColor?: string
  bgColor?: string
  srcIcon?: ImageLoadEventData
  toggleable?: boolean
  active?: boolean
  disabled?: boolean
  rounded?: boolean
  flat?: boolean
  basic?: boolean
  iconSize?: [number, number]
  fontSize?: number | string
  contentStyle?: any
}

const ThemedButton: React.FC<Props> = (props) => {
  const [isActive, setActive] = useState<boolean>(props.active ?? false)
  const width = Facade.space(props.iconSize ? props.iconSize[0] : 20)
  const height = Facade.space(props.iconSize ? props.iconSize[1] : 20)
  const fontSize = Facade.space(props.fontSize ?? 22)

  useEffect(() => {
    setActive(props.active ?? false)
  }, [props.active])

  const getStyle = (): StyleProp<any> => {
    const style = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: Facade.space(20),
      paddingRight: Facade.space(20),
      height: Facade.space(50),
    }

    const styleActive = {
      borderColor: '#4cffb3',
      borderWidth: 1,
    }

    return Facade.lodash.merge(
      style,
      isActive ? styleActive : {},
      props.contentStyle ?? {}
    )
  }

  const _renderLabel = () => {
    return (
      <LinearLayout orientation={'horiz'} alignItems={'center'}>
        {props.srcIcon && (
          <ImageView
            width={width as number}
            height={height as number}
            mr={props.label ? 3 : undefined}
            resizeMode="contain"
            source={props.srcIcon}
          />
        )}

        {props.label && (
          <LabelView
            mt={'2px'}
            color={props.textColor}
            fontSize={fontSize}
            fontFamily={props.flat ? 'bold' : 'regular'}
            allowFontScaling={true}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
          >
            {props.label}
          </LabelView>
        )}
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
      style={{opacity: props.disabled ? 0.4 : undefined}}
      disabled={props.disabled}
    >
      <ThemedCard
        contentStyle={getStyle()}
        rounded={props.rounded}
        flat={props.flat}
        hasBright={!props.basic && !isActive}
        hasShadow={!props.basic && !isActive}
        baseBgColor={isActive ? 'transparent' : props.bgColor}
        alignY={'center'}
      >
        {_renderLabel()}
      </ThemedCard>
    </ButtonView>
  )
}

ThemedButton.propTypes = {
  onPress: PropTypes.func,
  label: PropTypes.string,
  textColor: PropTypes.string,
  bgColor: PropTypes.string,
  srcIcon: PropTypes.any,
  toggleable: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
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
  disabled: false,
  rounded: true,
  flat: false,
  basic: false,
}

const ButtonView = styled.TouchableOpacity``

const LabelView = styled(TextView)`
  text-align: center;
`

export default ThemedButton
