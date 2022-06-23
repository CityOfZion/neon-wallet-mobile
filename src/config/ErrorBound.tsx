import React from 'react'
import { Text, ScrollView } from 'react-native'

interface IErrorBoundary {
  errorMsg: string
  infoMsg: string
  hasError: boolean
}

class ErrorBoundary extends React.Component<object, IErrorBoundary> {
  constructor(props: IErrorBoundary) {
    super(props)
    this.state = { hasError: false, errorMsg: '', infoMsg: '' }
  }

  componentDidCatch(error: any, info: any) {
    this.setState({
      hasError: true,
      errorMsg: JSON.stringify(error),
      infoMsg: JSON.stringify(info),
    })
  }
  render() {
    if (this.state.hasError) {
      return (
        <ScrollView style={{ alignSelf: 'center', marginTop: 100, marginHorizontal: 15 }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#000' }}>Error occurred.</Text>
          <Text style={{ marginTop: 30 }}>Error --- {this.state.errorMsg}</Text>
          <Text>Info --- {this.state.infoMsg}</Text>
        </ScrollView>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
