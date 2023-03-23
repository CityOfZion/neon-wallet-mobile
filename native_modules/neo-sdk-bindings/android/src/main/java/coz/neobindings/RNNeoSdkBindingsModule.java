
package coz.neobindings;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class RNNeoSdkBindingsModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNNeoSdkBindingsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
   return "RNNeoSdkBindings";
  }

  @ReactMethod
  public void decryptNep2(String key, String password, Promise promise) {
    try {
      String wif = io.neow3j.crypto.NEP2.decrypt(password, key).exportAsWIF();
      WritableMap map = Arguments.createMap();
      map.putString("wif", wif);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject(e);
    }
  }
  @ReactMethod
  public void decryptNep2Legacy(String key, String password, Promise promise){
    try {
      String wif = io.neow3jLegacy.crypto.NEP2.decrypt(password, key).exportAsWIF();
      WritableMap map = Arguments.createMap();
      map.putString("wif", wif);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject(e);
    }
  }
  @ReactMethod
  public void Base58Decode(String key, Promise promise){
    try {
      byte[] decodedKey = io.neow3j.crypto.Base58.decode(key);
      promise.resolve(decodedKey);
    } catch (Exception e){
      promise.reject(e)
    }
  }
}