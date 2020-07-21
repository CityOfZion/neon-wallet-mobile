import {BarCodeScanner} from 'expo-barcode-scanner'
import React, {useState, useEffect} from 'react'
import {Text, View, StyleSheet, Button, Image} from 'react-native'
import {ImageView} from "~src/styles/styled-components";




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
                alignItems: 'center'
            }}
        >

            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}


            />
            <ImageView position='absolute'
                       source={require('~src/assets/images/qr-code-frame.png')}
            />


            {scanned && (
                <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
            )}

        </View>


    )
}