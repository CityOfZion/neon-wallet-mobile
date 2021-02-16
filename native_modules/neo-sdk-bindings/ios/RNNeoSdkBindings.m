
#import "RNNeoSdkBindings.h"
@implementation RCTRNNeoSdkBindings

RCT_EXPORT_METHOD(decryptNep2:(NSString *)key location:(NSString *)password){
  NEP2.decryptKey(key, password)
}

RCT_EXPORT_MODULE();

@end
