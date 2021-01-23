import React from 'react'
import { Text, ScrollView } from 'react-native'

interface IErrorBoundary {

}

class ErrorBoundary extends React.Component {
    constructor(props: IErrorBoundary) {
        super(props);
        this.state = { hasError: false, errorMsg: '', infoMsg: '' };
    }
    //@ts-ignore
    componentDidCatch(error, info) {
        this.setState({ hasError: true, errorMsg: JSON.stringify(error), infoMsg: JSON.stringify(info) });
    }
    render() {
        //@ts-ignore
        if (this.state.hasError) {
            //@ts-ignore
           
            return (
                <ScrollView style={{ alignSelf: 'center', marginTop: 100, marginHorizontal: 15 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#000' }}>Error occurred.</Text>
                    <Text style={{marginTop: 30}}>Error => {this.state.errorMsg}</Text>
                    <Text>Info => {this.state.infoMsg}</Text>
                </ScrollView>
            )
        }
        return this.props.children;
    }
}

export default ErrorBoundary