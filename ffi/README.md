# @gnome/ffi

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

@gnome/ffi provides some shared utils for working with foreign function
interfaces in Deno and Bun and a shim for bun.

Given the current limitations in deno around specifiers like `bun:test` and `bun:ffi`
the @gnome/ffi/bun module provides the imports with type declarations for
`bun:ffi` and performs a dynamic import to work around the current limitations.

## Basic Usage

```typescript
import * as ffi from "@gnome/ffi";

const buf = new Uint8Array([0x0])

const ptr = ffi.createPointer(buf);
console.log(ptr);
```

[MIT License](./LICENSE.md)