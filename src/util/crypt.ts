//  GLOBAL COMMON / UTIL functions   //
// --------------------------------- //
//  DON'T ADD Common or UTIL HERE!   //
// --------------------------------- //
// ADD Common / util folder - module //
// Scoped for the functions folders  //
// --------------------------------- //
import crypto from 'crypto';

import { appConfig } from '../config/env';

const ivLength: number = 16; // For AES, this is always 16
const encryptionKey: string = appConfig.encryptionKey; // Must be 256 bytes (32 characters)

// shared package?

export function encrypt(text: string): string {
  const iv: Buffer = crypto.randomBytes(ivLength);
  const cipher: crypto.Cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let encrypted: Buffer = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// shared package?
export function decrypt(text: string): string {
  if (!text) {
    return '';
  }
  const textParts: string[] = text.split(':');
  const iv: Buffer = Buffer.from(textParts.shift(), 'hex');
  const encryptedText: Buffer = Buffer.from(textParts.join(':'), 'hex');
  const decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let decrypted: Buffer = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

// shared package?
export function md5(data: string): string {
  return crypto.createHash('md5').update(data).digest('hex');
}

export function getRandomString(length = 10): string {
  return crypto.randomBytes(length).toString('hex');
}

export function encode64(data: string): string {
  return Buffer.from(data).toString('base64');
}

export function decode64(data: string): string {
  return Buffer.from(data, 'base64').toString('ascii');
}
