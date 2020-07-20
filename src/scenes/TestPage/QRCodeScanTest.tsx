import React from 'react';

import {StyleSheet, Button, View, SafeAreaView, Text, Alert, Image} from 'react-native';
import {TextView} from '~src/styles/styled-components'
import ScreenLayout from "~src/components/layout/ScreenLayout";
import Constants from 'expo-constants';
import { BlurView } from 'expo-blur';
import {alignItems, alignSelf, bottom} from "styled-system";


const QrCodePage = () => (
    <ScreenLayout>
        <View>
            <Image
                style={styles.logo}
                source={require('~src/assets/images/qr-code-frame.png')}
            />
        </View>
        <View style = {styles.container}>
            <Button
                color="#CDCDCD"
                title="Cancel"
                onPress={() => Alert.alert('Cancel')}
            />
        </View>
    </ScreenLayout>
);

const styles = StyleSheet.create({
    container: {
        paddingTop: 187,
    },
    colour:{
        color:"green"
    },
    logo: {
        alignSelf:"center",
    },
});

export default QrCodePage;