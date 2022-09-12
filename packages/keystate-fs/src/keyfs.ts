import { KeyManager } from "@carlosski/keystate";
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { execSync, ExecSyncOptionsWithBufferEncoding } from 'child_process';

function KeyFS(manager: KeyManager, key: string) {
  if (manager.isExpired(key)) {
    return null;
  }

  function exists(path: string) {
    const file = manager.getFilePath(key, path);
    return existsSync(file);
  }

  function read(path: string) {
    if (!exists(path)) {
      return null;
    }
    const file = manager.getFilePath(key, path);
    return readFileSync(file, 'utf8');
  }

  function readBinary(path: string) {
    if (!exists(path)) {
      return null;
    }
    const file = manager.getFilePath(key, path);
    return readFileSync(file, 'binary');
  }

  function write(path: string, data: string) {
    if (manager.isExpired(key)) return false;
    manager.createKeyDir(key);
    const file = manager.getFilePath(key, path);
    writeFileSync(file, data);
    return true;
  }

  function writeBinary(path: string, data: string) {
    if (manager.isExpired(key)) return false;
    manager.createKeyDir(key);
    const file = manager.getFilePath(key, path);
    writeFileSync(file, data);
    return true;
  }

  function env(ref: string, value?: string) {
    if (manager.isExpired(key)) return false;
    if (!exists('env.json')) {
      write('env.json', '{}');
    }
    const env = JSON.parse(read('env.json')!);
    if (value) {
      env[ref] = value;
      write('env.json', JSON.stringify(env));
      return true;
    } else {
      return env[ref];
    }
  }

  function exec(command: string, settings: ExecSyncOptionsWithBufferEncoding = {}) {
    if (manager.isExpired(key)) return false;
    const dir = manager.getKeyDir(key);
    execSync(`${command} ${dir}`, { ...settings, stdio: 'inherit' });
    return true;
  }

  return {
    exists,
    read,
    readBinary,
    write,
    writeBinary,
    env,
    exec
  };
}

export { KeyFS };