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
  fontFamily?: 'bold' | 'medium' | 'regular' | 'italic' | 'semibold'
  contentStyle?: any
  borderThickness?: number | string
  borderColor?: string
  textAlign?: string
}

const LabelComponent = (props: Props) => {
  const width = Facade.scale(props.iconSize ? props.iconSize[0] : 20)
  const height = Facade.scale(props.iconSize ? props.iconSize[1] : 20)
  const fontSize = Facade.scale(props.fontSize ?? 22)

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

      {Boolean(props.label) && (
        <LabelView
          mt={'2px'}
          color={props.textColor}
          fontSize={fontSize}
          fontFamily={props.fontFamily ?? (props.flat ? 'bold' : 'regular')}
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

const ThemedButton: React.FC<Props> = (props) => {
  const [isActive, setActive] = useState<boolean>(props.active ?? false)
  const [isSelected, setSelected] = useState(false)

  useEffect(() => {
    setActive(props.active ?? false)
  }, [props.active])

  const getStyle = (): StyleProp<any> => {
    const style = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: Facade.scale(20),
      paddingRight: Facade.scale(20),
      height: Facade.scale(50),
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

  return (
    <ButtonView
      onHideUnderlay={() => {
        setSelected(false)
      }}
      onShowUnderlay={() => {
        setSelected(true)
      }}
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
      underlayColor="transparent"
    >
      <ThemedCard
        contentStyle={getStyle()}
        rounded={props.rounded}
        flat={props.flat}
        hasBright={!props.basic && !isActive}
        hasShadow={!props.basic && !isActive}
        baseBgColor={isActive ? 'transparent' : props.bgColor}
        alignY={props.textAlign ?? 'flex-end'}
        borderThickness={props.borderThickness}
        borderColor={props.borderColor}
        isPressed={isSelected}
      >
        <LabelComponent {...props} />
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
  fontFamily: PropTypes.any,
  contentStyle: PropTypes.any,
  borderThickness: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  borderColor: PropTypes.string,
  textAlign: PropTypes.string,
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

const ButtonView = styled.TouchableHighlight``

const LabelView = styled(TextView)`
  text-align: center;
  include-font-padding: false;
  margin-top: ${Facade.utils.isAndroid ? '-2px' : '0'};
`

export default ThemedButton
