import React, {useState} from 'react'
import darkTheme from '~src/styles/themes/dark'
import lightTheme from '~src/styles/themes/light'
import {border, BorderProps, color, ColorProps, space, SpaceProps} from 'styled-system'
import {useDispatch, useSelector} from 'react-redux'
import {setTheme} from '~src/store/actions/theme'
import {RootState} from '~src/store/reducers/root'
import styled from '~src/styles/styled-components'
import DefaultTheme from '~src/styles/styled'

const ThemeTestPage: React.FC<object> = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const [currentTheme, setCurrentTheme] = useState<object>(darkTheme)

  const changeTheme = (theme: DefaultTheme) => {
    dispatch(setTheme(theme))
    setCurrentTheme(theme)
  }

  return (
    <ThemeView bg='background'>
      <Text color='text.0' mb={4}>Current theme: {theme.title}</Text>
      {theme.title === 'light'
        ? (
          <ThemeButton
            p={4} bg='primary' borderRadius={3}
            onPress={() => changeTheme(darkTheme)}
          >
            <Text color='text.1'>Switch to Dark Theme</Text>
          </ThemeButton>
        )
        : (
          <ThemeButton
            p={4} bg='primary' borderRadius={3}
            onPress={() => changeTheme(lightTheme)}
          >
            <Text color='text.1'>Switch to Light Theme</Text>
          </ThemeButton>
        )}
    </ThemeView>
  )
}

const Text = styled.Text<ColorProps & SpaceProps>`
  ${color}
  ${space}
`

const ThemeView = styled.View<ColorProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  ${color}
`

const ThemeButton = styled.TouchableHighlight<BorderProps & ColorProps & SpaceProps>`
  ${border}
  ${color}
  ${space}
`

export default ThemeTestPage
