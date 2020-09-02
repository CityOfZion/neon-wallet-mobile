
# react-native-neo-sdk-bindings

## Getting started

`$ npm install react-native-neo-sdk-bindings --save`

### Mostly automatic installation

`$ react-native link react-native-neo-sdk-bindings`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-neo-sdk-bindings` and add `RNNeoSdkBindings.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNNeoSdkBindings.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNNeoSdkBindingsPackage;` to the imports at the top of the file
  - Add `new RNNeoSdkBindingsPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-neo-sdk-bindings'
  	project(':react-native-neo-sdk-bindings').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-neo-sdk-bindings/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-neo-sdk-bindings')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNNeoSdkBindings.sln` in `node_modules/react-native-neo-sdk-bindings/windows/RNNeoSdkBindings.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Neo.Sdk.Bindings.RNNeoSdkBindings;` to the usings at the top of the file
  - Add `new RNNeoSdkBindingsPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNNeoSdkBindings from 'react-native-neo-sdk-bindings';

// TODO: What to do with the module?
RNNeoSdkBindings;
```
  