# @gnome/unix

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The unix module provides some of the methods from libc in Deno and Bun
using Foreign Function Interfaces.

The methods return a result object from [@gnome/optional](https://jsr.io/@gnome/optional/doc/~/Result)
to help deal with exceptions loading the library or invoking
the Foreign Function Interfaces.

The following libc methods are implemented:

- getpwuid_r
- getpid
- getppid
- getuid
- geteuid
- getgid
- getegid
- gethostname
- getgroups
- getgrgid_r

Each function is implemented as a normal function that throws exceptions
or as a result function that returns a tupple of the result or error.

## Basic Usage

```typescript
import { 
    usernameResult,
    passwdEntry,
    uidResult,
    hostnameResult,
    hostname 
} 
from "@gnome/unix";

// expect will return a value or throw with the provided message.
const uid = uidResult().expect("Failed to get user id");
const username = usernameResult(uid).expect("Failed to get username");
console.log(username);

// using the result function.
cosnt r0 = hostnameResult();
r0.inspect(o => console.log(o));

// without the result function.
console.log(hostname());
console.log(passwdEntry(uid)); // shows the passwd data the user from /etc/passwd
```

[MIT License](./LICENSE.md)
