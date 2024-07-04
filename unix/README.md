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

Each function that maps to a libc FFI call will open and close the library.
If you want to open the library, make multiple calls and then close it,
then use the `openLibc` function.

## Basic Usage

```typescript
import { openLibc, getUserName, getUserId, getHostName } from "@gnome/unix";

// expect will return a value or throw with the provided message.
const uid = getUserId().expect("Failed to get user id");
const username = getUserName(uid).expect("Failed to get username");
console.log(username);

let hn = "";
cosnt r0 = getHostName();
r0.inspect(o => console.log(o));

using lib = openLibc();
lib.getProcessId().inspect(o => console.log(o));

// gets the user's  entries from the /etc/passwd file.
lib.getPasswordEntry(uid).inspect(o => console.log(o));

```

[MIT License](./LICENSE.md)
