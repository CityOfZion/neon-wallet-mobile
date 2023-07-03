import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { ImageLoadEventData, NativeSyntheticEvent, NativeTouchEvent, StyleProp } from 'react-native'

import { Normalize } from '~/src/app/Normalize'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import ThemedCard from '~src/components/themed/ThemedCard'
import styled, { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  alignX?: string
  onPress?: (e: NativeSyntheticEvent<NativeTouchEvent>, active?: boolean) => void
  label?: string
  subLabel?: string
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
  subFontSize?: number | string
  fontFamily?: 'bold' | 'medium' | 'regular' | 'italic' | 'semibold' | 'light'
  contentStyle?: any
  borderThickness?: number | string
  borderColor?: string
  textAlign?: string
  textAlignX?: string
  radius?: number
  suffix?: JSX.Element
  width?: string | number
  height?: number
  px?: string | number
  my?: string | number
  iconAlignX?: string
  labelWidth?: string
  labelPx?: string | number
  adjustsFontSizeToFit?: boolean
  isDark?: boolean
  testID?: string
}

const LabelComponent = (props: Props) => {
  const width = Normalize.scale(props.iconSize ? props.iconSize[0] : 20)
  const height = Normalize.scale(props.iconSize ? props.iconSize[1] : 20)
  const fontSize = Normalize.scale(props.fontSize ?? 22)
  const subFontSize = Normalize.scale(props.subFontSize ?? 18)

  return (
    <LinearLayout width={props.labelWidth} orientation="horiz" alignItems="center">
      {props.srcIcon && (
        <ImageView
          width={width as number}
          height={height as number}
          resizeMode="contain"
          source={props.srcIcon}
          ml={props.labelWidth ? -4 : undefined}
        />
      )}

      {Boolean(props.label) && (
        <LinearLayout
          width={props.labelWidth ?? props.width}
          mt="2px"
          orientation="horiz"
          alignItems="center"
          justifyContent={props.textAlignX}
          flex={!props.width && !props.flat ? 1 : undefined}
        >
          <LabelView
            color={props.textColor}
            px={props.labelPx ?? (props.srcIcon ? '15px' : '')}
            fontSize={fontSize}
            fontFamily={props.fontFamily ?? (props.flat ? 'bold' : 'regular')}
            allowFontScaling
            adjustsFontSizeToFit={props.adjustsFontSizeToFit}
            numberOfLines={1}
          >
            {props.label}
          </LabelView>
          {Boolean(props.subLabel) && (
            <LabelView
              ml={3}
              color={props.textColor}
              fontSize={subFontSize}
              fontFamily={props.fontFamily ?? (props.flat ? 'bold' : 'regular')}
              allowFontScaling
              adjustsFontSizeToFit={props.adjustsFontSizeToFit}
              numberOfLines={1}
            >
              {props.subLabel}
            </LabelView>
          )}
        </LinearLayout>
      )}

      {!!props.suffix && <LinearLayout>{props.suffix}</LinearLayout>}
    </LinearLayout>
  )
}

const ThemedButton: React.FC<Props> = props => {
  const [isActive, setActive] = useState<boolean>(props.active ?? false)
  const [isSelected, setSelected] = useState(false)

  useEffect(() => {
    setActive(props.active ?? false)
  }, [props.active])

  const getStyle = useCallback((): StyleProp<any> => {
    const style = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: Normalize.scale(props.px!),
      paddingRight: Normalize.scale(props.px!),
      height: Normalize.scale(props.height!),
    }

    const styleActive = {
      borderColor: '#4cffb3',
      borderWidth: 1,
    }

    return _.merge(style, isActive ? styleActive : {}, props.contentStyle ?? {})
  }, [isActive, props.contentStyle])

  const MemoLabelComponent = useMemo(() => <LabelComponent {...props} />, [props])

  return (
    <ButtonView
      testID={props.testID}
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
      style={{
        opacity: props.disabled ? 0.3 : undefined,
        width: props.width,
        height: props.height,
        marginVertical: props.my,
        justifyContent: 'center',
      }}
      disabled={props.disabled}
      underlayColor="transparent"
    >
      <ThemedCard
        contentStyle={getStyle()}
        rounded={props.rounded}
        flat={props.flat}
        hasBright={!props.basic && !isActive}
        hasShadow={props.disabled ? false : !props.basic && !isActive}
        baseBgColor={isActive ? 'transparent' : props.bgColor}
        alignY={props.textAlign ?? 'center'}
        borderThickness={props.borderThickness}
        borderColor={props.borderColor}
        isPressed={isSelected}
        radius={props.radius}
        alignX={props.alignX}
        isDark={props.isDark}
      >
        {MemoLabelComponent}
      </ThemedCard>
    </ButtonView>
  )
}

ThemedButton.propTypes = {
  onPress: PropTypes.func,
  label: PropTypes.string,
  textColor: PropTypes.string,
  bgColor: PropTypes.string,
  alignX: PropTypes.string,
  srcIcon: PropTypes.any,
  toggleable: PropTypes.bool,
  active: PropTypes.bool,
  adjustsFontSizeToFit: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  flat: PropTypes.bool,
  basic: PropTypes.bool,
  iconSize: PropTypes.any,
  suffix: PropTypes.element,
  fontSize: PropTypes.any,
  fontFamily: PropTypes.any,
  contentStyle: PropTypes.any,
  borderThickness: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  px: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  my: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  borderColor: PropTypes.string,
  textAlign: PropTypes.string,
  textAlignX: PropTypes.string,
  radius: PropTypes.number,
  iconAlignX: PropTypes.any,
  labelWidth: PropTypes.string,
  subFontSize: PropTypes.string,
  subLabel: PropTypes.string,
  labelPx: PropTypes.string,
  width: PropTypes.any,
  height: PropTypes.number,
  isDark: PropTypes.bool,
}

ThemedButton.defaultProps = {
  textColor: 'primary',
  alignX: 'center',
  textAlignX: 'center',
  toggleable: false,
  active: false,
  adjustsFontSizeToFit: true,
  disabled: false,
  rounded: true,
  flat: false,
  basic: false,
  radius: 0,
  px: 20,
  my: 0,
  height: 50,
}

const ButtonView = styled.TouchableHighlight``

const LabelView = styled(TextView)`
  text-align: center;
  include-font-padding: false;
  margin-top: ${UtilsHelper.isAndroid ? '-2px' : '0'};
`

export default ThemedButton
