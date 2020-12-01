import React from 'react'
import { TouchableWithoutFeedback, StyleSheet, Image, GestureResponderEvent, View } from 'react-native'
interface Props {
    onPress: (evt: GestureResponderEvent) => void
}

const ThemedReceiveButton: React.FC<Props> = (props) => {
    const styles = StyleSheet.create({
        dropShadow: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 71,
            height: 45,
            borderRadius: 7,
            backgroundColor: '#364046dd',
            shadowColor: '#464d53',
            shadowOffset: {
                width: 12,
                height: 12
            },
            shadowRadius: 7,
            elevation: 30,
            borderWidth: 1,
            borderColor: '#ffffff22'
        },
    })
    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={styles.dropShadow}>
                <Image width={13} height={16} source={require('~src/assets/images/arrow-down-green.png')} />
            </View>

        </TouchableWithoutFeedback>
    )
}

export { ThemedReceiveButton }