import { join } from 'path';
import {
  existsSync, mkdirSync,
  rmSync } from 'fs';

class Key {
  key: string;
  created: Date;
  lastAccessed: Date;

  constructor() {
    let key = Array.from({ length: 2 }, () => 
      Math.random().toString(36).substring(2)).join('-');
    this.key = key;
    this.created = new Date();
    this.lastAccessed = new Date();
  }

  isExpired(timeout: number) {
    let now = new Date();
    let diff = now.getTime() - this.lastAccessed.getTime();
    this.lastAccessed = now;
    return diff > timeout;
  }
}

interface IKeys {
  [key: string]: Key;
}

class KeyManager {
  keys: IKeys;
  timeout: number;
  directory: string;
  root: string;

  constructor(timeout: number, directory: string) {
    this.keys = {};
    this.timeout = timeout;
    this.directory = join(directory, '__state__');
    this.root = directory;
    if (existsSync(this.directory)) {
      rmSync(this.directory, { recursive: true });
    }
    mkdirSync(this.directory);
    setInterval(() => this.removeExpired(), timeout);
  }

  addKey() {
    let key = new Key();
    this.keys[key.key] = key;
    return key.key;
  }

  isExpired(key: string) {
    let k = this.keys[key];
    if (k) {
      return k.isExpired(this.timeout);
    }
    return true;
  }

  removeExpired() {
    console.log("Removing expired keys...");
    let anyExpired = false;
    Object.keys(this.keys).forEach(key => {
      if (this.isExpired(key)) {
        this.removeKeyDir(key);
        delete this.keys[key];
        anyExpired = true;
      }
    })
    if (anyExpired) {
      console.log("Complete!");
    } else {
      console.log("No keys to remove.");
    }
  }

  private getKeyDir(key: string) {
    return join(this.directory, key);
  }

  getFilePath(key: string, file: string) {
    return join(this.getKeyDir(key), file);
  }

  createKeyDir(key: string) {
    let dir = this.getKeyDir(key);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  }

  private removeKeyDir(key: string) {
    let dir = this.getKeyDir(key);
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true });
    }
  }
}

export { Key, KeyManager };