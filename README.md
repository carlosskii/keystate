# KeyState

KeyState is a server-side library for associating user keys with files. The frontend requests a user key, which is used to access private, temporary files. Once a key expires, the files are deleted automatically.

## Why?

KeyState was developed to assist private communication between a Node server and shell scripts. Scripts generating data often need said data isolated from other users. KeyState's isolation allows scripts to take a folder as the first argument, and use it as an output directory.

## Documentation

Coming soon