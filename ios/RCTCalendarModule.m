//
//  RCTCalendarModule.m
//  Neon
//
//  Created by Kenedy Ribeiro on 15/02/21.
//

#import <Foundation/Foundation.h>
#import "RCTCalendarModule.h"
#import <React/RCTLog.h>
@implementation RCTCalendarModule

// To export a module named RCTCalendarModule

RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
 RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}

RCT_EXPORT_MODULE();

@end
