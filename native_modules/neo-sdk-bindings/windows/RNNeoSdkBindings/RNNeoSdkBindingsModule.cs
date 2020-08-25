using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Neo.Sdk.Bindings.RNNeoSdkBindings
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNNeoSdkBindingsModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNNeoSdkBindingsModule"/>.
        /// </summary>
        internal RNNeoSdkBindingsModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNNeoSdkBindings";
            }
        }
    }
}
