//
//  NeoSwift.m
//  Neon
//
//  Created by Ricardo Akio Kobayashi on 16/02/21.
//

#import "NeoSwift.h"
#import "Neon-Swift.h"

@class NEP2;

@implementation RNNeoSdkBindings

typedef void (^NeoBlock)(NSString *);

RCT_EXPORT_METHOD(decryptNep2:(NSString*)key
                  passpharase:(NSString*)passharase
                  callback: (RCTResponseSenderBlock)callback)
{
  @try {
    NSString * wif = [NEP2 getWifNeo2WithEncryptedPrivateKey:key passphrase:passharase];
    
    callback(@[wif]);
  } @catch (NSException *exception) {
    callback(nil);
  }

}

RCT_EXPORT_MODULE();

@end
