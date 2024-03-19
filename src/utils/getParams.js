import blake from 'blakejs'
import { Buffer } from 'buffer'

export class UnknownProtocolIndicator extends Error {
  constructor (...args) {
    super(...args)
    this.message = 'Unknown protocol indicator byte.'
  }
}
export class InvalidPayloadLength extends Error {
  constructor (...args) {
    super(...args)
    this.message = 'Invalid payload length.'
  }
}
export class InvalidNamespace extends Error {
  constructor (...args) {
    super(...args)
    this.message = 'Invalid namespace.'
  }
}
export class InvalidSubAddress extends Error {
  constructor (...args) {
    super(...args)
    this.message = 'Invalid subAddress.'
  }
}
export class ProtocolNotSupported extends Error {
  constructor (protocolName, ...args) {
    super(...args)
    this.message = `${protocolName} protocol not supported.`
  }
}
export class InvalidChecksumAddress extends Error {
  constructor (...args) {
    super(...args)
    this.message = `Invalid address (checksum not matching the payload).`
  }
}
export class InvalidPrivateKeyFormat extends Error {
  constructor (...args) {
    super(...args)
    this.message =
      'Private key need to be an instance of Buffer or a base64 string.'
  }
}
export function getChecksum (payload) {
  const blakeCtx = blake.blake2bInit(4)
  blake.blake2bUpdate(blakeCtx, payload)
  return Buffer.from(blake.blake2bFinal(blakeCtx))
}

var RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
var RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV'
var CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function readChar (alphabet, char) {
  var idx = alphabet.indexOf(char)

  if (idx === -1) {
    throw new Error('Invalid character found: ' + char)
  }

  return idx
}

export function base32Decode (input, variant) {
  var alphabet

  switch (variant) {
    case 'RFC3548':
    case 'RFC4648':
      alphabet = RFC4648
      input = input.replace(/=+$/, '')
      break
    case 'RFC4648-HEX':
      alphabet = RFC4648_HEX
      input = input.replace(/=+$/, '')
      break
    case 'Crockford':
      alphabet = CROCKFORD
      input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')
      break
    default:
      throw new Error('Unknown base32 variant: ' + variant)
  }

  var length = input.length

  var bits = 0
  var value = 0

  var index = 0
  var output = new Uint8Array(((length * 5) / 8) | 0)

  for (var i = 0; i < length; i++) {
    value = (value << 5) | readChar(alphabet, input[i])
    bits += 5

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255
      bits -= 8
    }
  }

  return output.buffer
}

export const ProtocolIndicator = {
  ID: 0,
  SECP256K1: 1,
  ACTOR: 2,
  BLS: 3,
  DELEGATED: 4
}
export const MaxSubaddressBytes = 54
