import { Key, KeyManager } from './key';
import { resolve } from 'path';

let keyManager = new KeyManager(60000, resolve(__dirname, 'keys'));

let key = keyManager.addKey();
const success = keyManager.keyfsExec('python3 yes.py', key);
console.log(success);