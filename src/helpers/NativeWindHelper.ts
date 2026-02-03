import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { cssInterop } from 'nativewind'
import { Svg } from 'react-native-svg'
import WebView from 'react-native-webview'

export class NativeWindHelper {
  static setup() {
    cssInterop(Svg, {
      className: {
        target: 'style',
        nativeStyleToProp: {
          width: true,
          height: true,
        },
      },
    })

    cssInterop(Image, {
      className: 'style',
    })

    cssInterop(LinearGradient, {
      className: 'style',
    })

    cssInterop(WebView, {
      containerClassName: 'containerStyle',
    })
  }
}
