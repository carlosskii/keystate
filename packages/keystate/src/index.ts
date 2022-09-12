import * as crypto from 'crypto';
import { readFileSync } from 'fs';

const pubkey_contents = readFileSync('public.pem', 'utf8');
const seckey_contents = readFileSync('secret.pem', 'utf8');

const publicKey = crypto.createPublicKey(pubkey_contents);
const secretKey = crypto.createPrivateKey(seckey_contents);

const message = 'Hello World!';
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(message));
const decrypted = crypto.privateDecrypt(secretKey, encrypted);

console.log(decrypted.toString());