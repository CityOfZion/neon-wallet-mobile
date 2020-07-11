import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {ActivityIndicator, ActivityIndicatorProps, View} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {AwaitState} from '~src/app/wrapper/AwaitWrapper'

interface Props extends ActivityIndicatorProps {
  name: string
  onLoadingStart?: () => void
  onLoadingEnd?: () => void
  onError?: () => void
  children?: React.ReactNode | React.ReactNodeArray
  defaultView?: React.ReactElement
  loadingView?: React.ReactElement
  errorView?: React.ReactElement
}

const AwaitActivity: React.FC<Props> = (props) => {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const [view, setView] = useState<AwaitState>(AwaitState.DEFAULT)

  useEffect(() => {
    if (inAction()) {
      setView(AwaitState.LOADING)
    }

    Facade.await.event.on('toggle', toggleEvent)

    return () => {
      // Remove current listener when this component unmount
      Facade.await.event.off('toggle', toggleEvent)
    }
  }, [])

  const toggleEvent = (
    name?: string,
    view: AwaitState = AwaitState.DEFAULT
  ) => {
    if (name === props.name) {
      setView(view)

      switch (view) {
        case AwaitState.DEFAULT:
          if (props.onLoadingEnd) props.onLoadingEnd()
          break
        case AwaitState.LOADING:
          if (props.onLoadingStart) props.onLoadingStart()
          break
        case AwaitState.ERROR:
          if (props.onError) props.onError()
          break
      }
    }
  }

  const inAction = () => {
    return Boolean(props.name && Facade.await.inAction(props.name))
  }

  if (view === AwaitState.LOADING) {
    const activityProps: Props = {...props}
    delete activityProps.name
    delete activityProps.onLoadingStart
    delete activityProps.onLoadingEnd
    delete activityProps.onError
    delete activityProps.children
    delete activityProps.defaultView
    delete activityProps.loadingView
    delete activityProps.errorView

    return (
      props.loadingView ?? (
        <ActivityIndicator
          {...activityProps}
          color={props.color ?? theme.colors.text[0]}
        />
      )
    )
  }

  if (view === AwaitState.ERROR) {
    return (
      props.errorView ??
      props.defaultView ??
      (props.children as React.ReactElement) ?? <View />
    )
  }

  return props.defaultView ?? (props.children as React.ReactElement) ?? <View />
}

AwaitActivity.propTypes = {
  name: PropTypes.string.isRequired,
  onLoadingStart: PropTypes.func,
  onLoadingEnd: PropTypes.func,
  onError: PropTypes.func,
  children: PropTypes.any,
  defaultView: PropTypes.any,
  loadingView: PropTypes.any,
  errorView: PropTypes.any,
  color: PropTypes.string,
}

export default AwaitActivity
