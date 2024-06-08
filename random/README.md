# @gnome/random

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

A module for generating random values.

- `randomUUID()` - creates a random universal unique identifier.
- `getRandomValues()` - creates random values for the given array.
- `randomBytes()` - creates a Uint8Array with random values (bytes) for the
  given length using a cryptographically secure random number generator (CSRNG).
- `randomFileName()` - creates a random file name with the given length
   using CSRNG.

## Basic Usage

```typescript
import { randomBytes, randomFileName } from "@gnome/assert";

// returns a Uint8Array filled with random bytes
console.log(randomBytes(32)) 

// return a file name that starts with tmp_ followed by
// 15 random characters.
console.log(randomFileName(15, 'tmp_')) 
```

[MIT License](./LICENSE.md)
