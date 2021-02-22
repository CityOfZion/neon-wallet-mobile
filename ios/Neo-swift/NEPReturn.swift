//
//  NEPReturn.swift
//  neotest
//
//  Created by Ricardo Akio Kobayashi on 16/02/21.
//

import Foundation

@objc public class NEPReturn: NSObject {
    @objc public var decryptedKey: [UInt8]?
    @objc public var addressHash: [UInt8]?
}
