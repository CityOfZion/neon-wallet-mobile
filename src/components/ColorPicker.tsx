import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {GestureResponderEvent, LayoutChangeEvent} from 'react-native'

import {FilterHelper} from '~src/helpers/FilterHelper'
import styled, {LinearLayout} from '~src/styles/styled-components'

interface Props {
  onChange?: (hex: string) => void
  color?: string
}

const ColorPicker: React.FC<Props> = (props) => {
  const [viewHeight, setViewHeight] = useState<number>(0)

  const [hueAngle, setHueAngle] = useState<number>(0)
  const [luminosityAngle, setLuminosityAngle] = useState<number>(180)
  const [referenceAngle, setReferenceAngle] = useState<number>(0)

  const [hue, setHue] = useState<number>(0)
  const [saturation, setSaturation] = useState<number>(100)
  const [luminosity, setLuminosity] = useState<number>(50)

  useEffect(() => {
    if (props.color) {
      const [h, s, l] = FilterHelper.hexToHsl(props.color)

      setHue(h)
      setHueAngle(-h)

      setSaturation(100)

      setLuminosity(l)
      setLuminosityAngle(Math.abs(359 - (15 + (330 * l) / 100)))
    }
  }, [])

  const getHex = () => {
    return FilterHelper.hslToHex(hue, saturation, luminosity)
  }

  const getHueRadius = () => {
    const base = viewHeight * 0.035
    const variation = Math.abs(Math.sin((hueAngle * Math.PI) / 60)) * base

    return viewHeight * 0.345 - variation
  }

  const getHueSelectorRadius = () => {
    return viewHeight * 0.1
  }

  const getLuminosityRadius = () => {
    const base = viewHeight * 0.016
    const variation =
      Math.abs(Math.cos((luminosityAngle * Math.PI) / 60)) * base

    return viewHeight * 0.16 - variation
  }

  const getLuminositySelectorRadius = () => {
    return viewHeight * 0.05
  }

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)
  }

  const hueAreaTouchEvent = (event: GestureResponderEvent) => {
    setReferenceAngle((calculateHueAngle(event) - hueAngle) % 360)
    return false
  }

  const hueAreaMoveEvent = (event: GestureResponderEvent) => {
    setHueAngle(calculateHueAngle(event) - referenceAngle)

    let hue = Math.round(-hueAngle % 360)
    while (hue < 0) hue += 360

    setHue(hue)

    if (props.onChange) props.onChange(getHex())

    return false
  }

  const calculateHueAngle = (event: GestureResponderEvent) => {
    const x = Math.round(event.nativeEvent.locationX - viewHeight * 0.445)
    const y = Math.round(event.nativeEvent.locationY - viewHeight * 0.49)

    return Math.round((Math.atan2(-x, y) * 180) / Math.PI)
  }

  const luminosityAreaTouchEvent = (event: GestureResponderEvent) => {
    setReferenceAngle((calculateLuminosityAngle(event) - luminosityAngle) % 360)
    return false
  }

  const luminosityAreaMoveEvent = (event: GestureResponderEvent) => {
    let angle = calculateLuminosityAngle(event) - referenceAngle
    angle = angle % 360
    while (angle < 0) angle += 360

    setLuminosityAngle(Math.min(Math.max(angle, 15), 345))

    const luminosity = (100 * (luminosityAngle - 15)) / 330
    setLuminosity(Math.abs(100 - luminosity))

    if (props.onChange) props.onChange(getHex())

    return false
  }

  const calculateLuminosityAngle = (event: GestureResponderEvent) => {
    const x = Math.round(event.nativeEvent.locationX - viewHeight * 0.23)
    const y = Math.round(event.nativeEvent.locationY - viewHeight * 0.24)

    return Math.round((Math.atan2(-x, y) * 180) / Math.PI)
  }

  const HueView = styled(LinearLayout)`
    z-index: 10;
    top: ${viewHeight * 0.49 - getHueSelectorRadius() * 0.5}px;
    left: ${viewHeight * 0.445 - getHueSelectorRadius() * 0.5}px;
    transform: rotate(${hueAngle}deg);
  `

  const HueSelectorView = styled(LinearLayout)`
    border-radius: 9999px;
    box-shadow: 0 3px 2px rgba(0, 0, 0, 0.6);
    border: solid white ${getHueSelectorRadius() * 0.1}px;
    background: ${getHex()};
    top: ${-getHueRadius()}px;
    width: ${getHueSelectorRadius()}px;
    height: ${getHueSelectorRadius()}px;
  `

  const LuminosityView = styled(LinearLayout)`
    z-index: 20;
    top: ${viewHeight * 0.49 - getLuminositySelectorRadius() * 0.5}px;
    left: ${viewHeight * 0.445 - getLuminositySelectorRadius() * 0.5}px;
    transform: rotate(${luminosityAngle}deg);
  `

  const LuminositySelectorView = styled(LinearLayout)`
    border-radius: 9999px;
    box-shadow: 0 3px 2px rgba(0, 0, 0, 0.6);
    border: solid white ${getLuminositySelectorRadius() * 0.1}px;
    background: #333;
    right: ${-getLuminosityRadius()}px;
    width: ${getLuminositySelectorRadius()}px;
    height: ${getLuminositySelectorRadius()}px;
  `

  return (
    <ColorPickerView
      onLayout={layoutEvent}
      width={'100%'}
      style={{aspectRatio: 8 / 9}}
    >
      <HueView position={'absolute'}>
        <HueSelectorView position={'relative'} />
      </HueView>

      <LuminosityView position={'absolute'}>
        <LuminositySelectorView position={'relative'} />
      </LuminosityView>

      <HueAreaView
        position={'absolute'}
        onStartShouldSetResponder={hueAreaTouchEvent}
        onMoveShouldSetResponderCapture={hueAreaMoveEvent}
      />

      <LuminosityAreaView
        position={'absolute'}
        onStartShouldSetResponder={luminosityAreaTouchEvent}
        onMoveShouldSetResponderCapture={luminosityAreaMoveEvent}
      />

      <ColorPickerContainer
        source={require('~src/assets/images/colorpicker-container.png')}
        resizeMode="contain"
      />
    </ColorPickerView>
  )
}

ColorPicker.propTypes = {
  onChange: PropTypes.func,
  color: PropTypes.string,
}

const ColorPickerView = styled(LinearLayout)``

const LuminosityAreaView = styled(LinearLayout)`
  top: 24%;
  bottom: 25%;
  left: 22%;
  right: 22%;
  border-radius: 9999px;
  z-index: 120;
`

const HueAreaView = styled(LinearLayout)`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 9999px;
  z-index: 110;
`

const ColorPickerContainer = styled.ImageBackground`
  position: absolute;
  top: -15%;
  bottom: -15%;
  left: -10%;
  right: -12%;
  z-index: 0;
`

export default ColorPicker
