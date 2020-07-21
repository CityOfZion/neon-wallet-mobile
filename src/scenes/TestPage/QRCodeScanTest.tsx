import {BarCodeScanner} from 'expo-barcode-scanner'
import React, {useState, useEffect} from 'react'
import {Text, View, StyleSheet, Button} from 'react-native'
import {ImageView, LinearLayout} from "~src/styles/styled-components";
import ThemedButton from "~src/components/themed/ThemedButton";
import {Facade} from "~src/app/Facade";
import ScreenLayout from "~src/components/layout/ScreenLayout";


export default function QRCodeScanTest() {

    const [hasPermission, setHasPermission] = useState(true)
    const [scanned, setScanned] = useState(false)

    useEffect(() => {
        ;(async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    // @ts-ignore
    const handleBarCodeScanned = ({type, data}) => {
        if (!scanned) {
            setScanned(true)
            // eslint-disable-next-line no-undef
            alert(`Bar code with type ${type} and data ${data} has been scanned!`)
        }
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>
    } else if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems:'center'
            }}
        >
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <ImageView rigth='110'
                       source={require('~src/assets/images/qr-code-frame.png')}
            />

            {scanned && (
                <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
            )}
            <LinearLayout paddingTop={100}  width={'100%'}>
                <ThemedButton
                    label={Facade.t('passcode.cancel')}
                />
            </LinearLayout>
    </View>
)
}


