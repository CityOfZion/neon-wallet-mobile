//
//  NeoSwift.m
//  Neon
//
//  Created by Ricardo Akio Kobayashi on 16/02/21.
//

#import "NeoSwift.h"
#import "Neon-Swift.h"

@class NEP2;

@implementation NeoSwift

typedef void (^NeoBlock)(NSString *);

RCT_EXPORT_METHOD(getWifWithKeyAndPasspharase:(NSString*)key passpharase:(NSString*)passharase callback:(NeoBlock)callback)
{
  NSString * wif = [NEP2 getWifWithEncryptedPrivateKey:key passphrase:passharase];
  callback(wif);
}

RCT_EXPORT_MODULE();

@end
