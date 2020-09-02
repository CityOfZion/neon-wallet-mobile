
package coz.neobindings;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import io.neow3j.crypto.NEP2;

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
      String wif = NEP2.decrypt(password, key).exportAsWIF();
      WritableMap map = Arguments.createMap();
      map.putString("wif", wif);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject(e);
    }
  }
}