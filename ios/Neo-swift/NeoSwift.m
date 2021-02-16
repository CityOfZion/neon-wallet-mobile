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

typedef void (^NeoBlock)(NEP2 *);

RCT_EXPORT_METHOD(nepInstance:(NeoBlock)callback)
{
  callback([NEP2 new]);
}

RCT_EXPORT_MODULE();

@end
