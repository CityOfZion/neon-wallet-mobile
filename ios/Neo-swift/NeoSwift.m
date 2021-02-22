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
  NSString * wif = [NEP2 getWifWithEncryptedPrivateKey:key passphrase:passharase];
  
  callback(@[wif]);
}

RCT_EXPORT_MODULE();

@end
